import { useState, useEffect, useRef } from "react";
import { Camera, Plus, Trash2, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useActivity } from "@/context/ActivityContext";
import { useSites } from "@/context/SiteContext";
import { useSelectedSite } from "@/context/SelectedSiteContext";
import { supabase } from "@/integrations/supabase/client";

interface DbMaterial {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  rate?: number;
}

interface DeliveryRow {
  key: string;
  materialId: string;
  quantity: string;
  rate: string;
  unit: string;
  isNew?: boolean;
  newName?: string;
}

function computeStatus(qty: number, unit: string): string {
  if (unit === "brass" || unit === "tonnes") return qty <= 3 ? "Critical" : qty <= 8 ? "Low" : "Sufficient";
  if (unit === "sheets" || (unit === "pieces" && qty < 100)) return qty <= 10 ? "Critical" : qty <= 30 ? "Low" : "Sufficient";
  if (unit === "bags") return qty <= 50 ? "Critical" : qty <= 100 ? "Low" : "Sufficient";
  if (unit === "kg") return qty <= 500 ? "Critical" : qty <= 1000 ? "Low" : "Sufficient";
  if (unit === "meters") return qty <= 100 ? "Critical" : qty <= 300 ? "Low" : "Sufficient";
  return qty <= 20 ? "Critical" : qty <= 50 ? "Low" : "Sufficient";
}

const STOPWORDS = new Set([
  "opc", "ppc", "tmt", "ms", "rcc", "pcc", "cpvc", "pvc", "grade", "mm", "inch", "set", "kg",
  "the", "of", "and", "for", "bag", "bags", "piece", "pieces", "rod", "rods", "bar", "bars",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t) && isNaN(Number(t)));
}

/** Score similarity between extracted name and a DB material name. */
function scoreMatch(extracted: string, candidate: string): number {
  const a = tokenize(extracted);
  const b = tokenize(candidate);
  if (!a.length || !b.length) return 0;
  let score = 0;
  for (const ta of a) {
    for (const tb of b) {
      if (ta === tb) score += 3;
      else if (tb.includes(ta) || ta.includes(tb)) score += 2;
      else if (ta.length > 3 && tb.length > 3 && (ta.startsWith(tb.slice(0, 4)) || tb.startsWith(ta.slice(0, 4)))) score += 1;
    }
  }
  // bonus if either is a substring of the other (full name)
  const al = extracted.toLowerCase();
  const bl = candidate.toLowerCase();
  if (bl.includes(al) || al.includes(bl)) score += 2;
  return score;
}

function findBestMatch(name: string, materials: DbMaterial[]): DbMaterial | null {
  let best: DbMaterial | null = null;
  let bestScore = 0;
  for (const m of materials) {
    const s = scoreMatch(name, m.name);
    if (s > bestScore) {
      bestScore = s;
      best = m;
    }
  }
  return bestScore >= 3 ? best : null;
}

export default function NewDeliveryPage() {
  const navigate = useNavigate();
  const { addActivity } = useActivity();
  const { sites } = useSites();
  const { selectedSiteId } = useSelectedSite();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [materials, setMaterials] = useState<DbMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [supplier, setSupplier] = useState("");
  const [site, setSite] = useState(selectedSiteId && selectedSiteId !== "all" ? selectedSiteId : "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [rows, setRows] = useState<DeliveryRow[]>([
    { key: crypto.randomUUID(), materialId: "", quantity: "", rate: "", unit: "" },
  ]);

  const loadMaterials = async () => {
    const { data } = await supabase.from("materials").select("id, name, unit, quantity, rate").order("name");
    setMaterials(data || []);
    return data || [];
  };

  useEffect(() => {
    loadMaterials().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (scanMessage) {
      const t = setTimeout(() => setScanMessage(null), 5000);
      return () => clearTimeout(t);
    }
  }, [scanMessage]);

  const handleChallanClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    setScanMessage(null);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("process-challan-image", {
        body: { image_base64: base64, mime_type: file.type || "image/jpeg" },
      });

      if (error || !data?.ok) throw new Error(data?.error || "API error");

      const d = data.data;
      if (d.supplierName) setSupplier(d.supplierName);
      if (d.date) setDate(d.date);

      if (Array.isArray(d.materials) && d.materials.length > 0) {
        const newRows: DeliveryRow[] = [];
        for (const item of d.materials) {
          const itemName = String(item?.materialName || "").trim();
          if (!itemName) continue;
          const match = findBestMatch(itemName, materials);
          newRows.push({
            key: crypto.randomUUID(),
            materialId: match?.id || "",
            quantity: item?.quantity ? String(item.quantity) : "",
            rate: item?.rate ? String(item.rate) : (match?.rate ? String(match.rate) : ""),
            unit: match?.unit || String(item?.unit || "pieces"),
            isNew: !match,
            newName: match ? undefined : itemName,
          });
        }
        if (newRows.length > 0) setRows(newRows);
      }

      setScanMessage({ type: "success", text: "Challan scanned! Review the rows below — new materials will be created on save." });
    } catch (err) {
      console.error("Challan scan error:", err);
      setScanMessage({ type: "error", text: "Could not read challan. Please fill manually." });
    } finally {
      setScanning(false);
      e.target.value = "";
    }
  };

  const addRow = () =>
    setRows((prev) => [...prev, { key: crypto.randomUUID(), materialId: "", quantity: "", rate: "", unit: "" }]);
  const removeRow = (key: string) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : prev));
  const updateRow = (key: string, patch: Partial<DeliveryRow>) =>
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const onMaterialChange = (key: string, materialId: string) => {
    const m = materials.find((mm) => mm.id === materialId);
    updateRow(key, {
      materialId,
      isNew: false,
      newName: undefined,
      unit: m?.unit || "",
      rate: (rows.find((r) => r.key === key)?.rate) || (m?.rate ? String(m.rate) : ""),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validRows = rows.filter(
      (r) => Number(r.quantity) > 0 && (r.materialId || (r.isNew && r.newName?.trim()))
    );
    if (validRows.length === 0) {
      toast.error("Add at least one material with quantity");
      return;
    }
    setSaving(true);

    // Step 1: create any new materials
    const resolvedRows: { materialId: string; quantity: number; rate: number }[] = [];
    let workingMaterials = [...materials];

    for (const r of validRows) {
      let materialId = r.materialId;
      if (!materialId && r.isNew && r.newName?.trim()) {
        const unit = r.unit || "pieces";
        const qty = Number(r.quantity);
        const rate = Number(r.rate) || 0;
        const { data: created, error: createErr } = await supabase
          .from("materials")
          .insert({
            name: r.newName.trim(),
            unit,
            quantity: 0,
            rate,
            status: computeStatus(0, unit),
            site_id: site || null,
          })
          .select("id, name, unit, quantity, rate")
          .single();
        if (createErr || !created) {
          toast.error(`Failed to create material "${r.newName}"`);
          setSaving(false);
          return;
        }
        materialId = created.id;
        workingMaterials.push(created as DbMaterial);
      }
      resolvedRows.push({ materialId, quantity: Number(r.quantity), rate: Number(r.rate) || 0 });
    }

    // Step 2: create delivery
    const { data: delivery, error: delErr } = await supabase
      .from("deliveries")
      .insert({ supplier: supplier || null, site: null, site_id: site || null, date })
      .select("id")
      .single();
    if (delErr || !delivery) {
      toast.error("Failed to save delivery");
      setSaving(false);
      return;
    }

    // Step 3: delivery items
    const items = resolvedRows.map((r) => ({
      delivery_id: delivery.id,
      material_id: r.materialId,
      quantity: r.quantity,
    }));
    const { error: itemErr } = await supabase.from("delivery_items").insert(items);
    if (itemErr) {
      toast.error("Failed to save delivery items");
      setSaving(false);
      return;
    }

    // Step 4: update inventory quantity + status (and rate if provided)
    for (const r of resolvedRows) {
      const mat = workingMaterials.find((m) => m.id === r.materialId);
      if (!mat) continue;
      const newQty = (mat.quantity || 0) + r.quantity;
      const newStatus = computeStatus(newQty, mat.unit);
      const update: { quantity: number; status: string; rate?: number; supplier?: string } = {
        quantity: newQty,
        status: newStatus,
      };
      if (r.rate > 0) update.rate = r.rate;
      if (supplier) update.supplier = supplier;
      await supabase.from("materials").update(update).eq("id", mat.id);
    }

    const summary = resolvedRows
      .map((r) => {
        const mat = workingMaterials.find((m) => m.id === r.materialId);
        return `${r.quantity} ${mat?.unit || ""} ${mat?.name || ""}`;
      })
      .join(", ");

    addActivity({ text: `Delivery: ${summary}${supplier ? ` from ${supplier}` : ""}`, icon: "delivery" });
    toast.success("Delivery saved — inventory updated");
    setSaving(false);
    navigate("/materials");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h2 className="page-header">New Delivery</h2>
        <p className="text-sm text-muted-foreground">Record a material delivery challan</p>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <Card
        className="p-8 border-dashed border-2 border-primary/30 bg-primary/5 text-center cursor-pointer hover:bg-primary/10 transition-colors"
        onClick={scanning ? undefined : handleChallanClick}
      >
        {scanning ? (
          <>
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-3 animate-spin" />
            <p className="font-semibold text-foreground">Reading challan...</p>
            <p className="text-sm text-muted-foreground mt-1">AI is extracting delivery details</p>
          </>
        ) : (
          <>
            <Camera className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="font-semibold text-foreground">📷 Upload Challan</p>
            <p className="text-sm text-muted-foreground mt-1">Choose from camera or gallery — AI will read it automatically</p>
          </>
        )}
      </Card>

      {scanMessage && (
        <div
          className={`flex items-center gap-2 p-3 rounded-md text-sm ${
            scanMessage.type === "success"
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {scanMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {scanMessage.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card className="p-5 space-y-4">
          <p className="text-xs text-muted-foreground">Review extracted data or fill manually. New materials will be added to inventory.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Supplier</Label>
              <Input placeholder="e.g., Nashik Cement Agency" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Site</Label>
              <Select value={site} onValueChange={setSite}>
                <SelectTrigger>
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label className="text-base font-semibold">Materials</Label>
            <div className="border rounded-md overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 640 }}>
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left p-2 font-medium text-muted-foreground">Material *</th>
                    <th className="text-left p-2 font-medium text-muted-foreground w-24">Qty *</th>
                    <th className="text-left p-2 font-medium text-muted-foreground w-20">Unit</th>
                    <th className="text-left p-2 font-medium text-muted-foreground w-28">Rate (₹)</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-b last:border-0 align-top">
                      <td className="p-2">
                        {row.isNew ? (
                          <div className="space-y-1">
                            <Input
                              className="h-9"
                              placeholder="New material name"
                              value={row.newName || ""}
                              onChange={(e) => updateRow(row.key, { newName: e.target.value })}
                            />
                            <div className="flex items-center gap-1 text-xs text-primary">
                              <Sparkles className="w-3 h-3" />
                              <span>New — will be added</span>
                              <button
                                type="button"
                                className="ml-auto text-muted-foreground hover:text-foreground underline"
                                onClick={() => updateRow(row.key, { isNew: false, newName: undefined, materialId: "" })}
                              >
                                pick existing
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Select value={row.materialId} onValueChange={(v) => onMaterialChange(row.key, v)}>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select material" />
                              </SelectTrigger>
                              <SelectContent>
                                {materials.map((m) => (
                                  <SelectItem key={m.id} value={m.id}>
                                    {m.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <button
                              type="button"
                              className="text-xs text-muted-foreground hover:text-foreground underline"
                              onClick={() => updateRow(row.key, { isNew: true, materialId: "", newName: "" })}
                            >
                              + create new
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="1"
                          placeholder="0"
                          className="h-9"
                          value={row.quantity}
                          onChange={(e) => updateRow(row.key, { quantity: e.target.value })}
                        />
                      </td>
                      <td className="p-2">
                        {row.isNew ? (
                          <Input
                            className="h-9"
                            placeholder="unit"
                            value={row.unit}
                            onChange={(e) => updateRow(row.key, { unit: e.target.value })}
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">{row.unit || "—"}</span>
                        )}
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="h-9"
                          value={row.rate}
                          onChange={(e) => updateRow(row.key, { rate: e.target.value })}
                        />
                      </td>
                      <td className="p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeRow(row.key)}
                          disabled={rows.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addRow} className="mt-1">
              <Plus className="w-4 h-4 mr-1" /> Add Another Material
            </Button>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Confirm & Save Delivery"
            )}
          </Button>
        </Card>
      </form>
    </div>
  );
}
