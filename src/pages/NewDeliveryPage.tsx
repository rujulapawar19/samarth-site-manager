import { useState, useEffect, useRef } from "react";
import { Camera, Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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
}

interface DeliveryRow {
  key: string;
  materialId: string;
  quantity: string;
}

function computeStatus(qty: number, unit: string): string {
  if (unit === "brass" || unit === "tonnes") return qty <= 3 ? "Critical" : qty <= 8 ? "Low" : "Sufficient";
  if (unit === "sheets" || (unit === "pieces" && qty < 100)) return qty <= 10 ? "Critical" : qty <= 30 ? "Low" : "Sufficient";
  if (unit === "bags") return qty <= 50 ? "Critical" : qty <= 100 ? "Low" : "Sufficient";
  if (unit === "kg") return qty <= 500 ? "Critical" : qty <= 1000 ? "Low" : "Sufficient";
  if (unit === "meters") return qty <= 100 ? "Critical" : qty <= 300 ? "Low" : "Sufficient";
  return qty <= 20 ? "Critical" : qty <= 50 ? "Low" : "Sufficient";
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
  const [site, setSite] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [rows, setRows] = useState<DeliveryRow[]>([
    { key: crypto.randomUUID(), materialId: "", quantity: "" },
  ]);

  useEffect(() => {
    supabase.from("materials").select("id, name, unit, quantity").order("name").then(({ data }) => {
      setMaterials(data || []);
      setLoading(false);
    });
  }, []);

  // Clear scan message after 5 seconds
  useEffect(() => {
    if (scanMessage) {
      const t = setTimeout(() => setScanMessage(null), 5000);
      return () => clearTimeout(t);
    }
  }, [scanMessage]);

  const handleChallanClick = () => {
    // Trigger file input synchronously from click handler
    fileInputRef.current?.click();
  };

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

      if (error || !data?.ok) {
        throw new Error(data?.error || "API error");
      }

      const d = data.data;

      // Auto-fill supplier
      if (d.supplier_name) setSupplier(d.supplier_name);

      // Auto-fill date
      if (d.date) setDate(d.date);

      // Try to match material by name (case-insensitive)
      if (d.material_name) {
        const match = materials.find(
          (m) => m.name.toLowerCase().includes(d.material_name.toLowerCase()) ||
                 d.material_name.toLowerCase().includes(m.name.toLowerCase())
        );
        if (match) {
          setRows([{
            key: crypto.randomUUID(),
            materialId: match.id,
            quantity: d.quantity ? String(d.quantity) : "",
          }]);
        } else {
          // No match - just fill quantity on first row
          if (d.quantity) {
            setRows(prev => {
              const updated = [...prev];
              updated[0] = { ...updated[0], quantity: String(d.quantity) };
              return updated;
            });
          }
        }
      }

      setScanMessage({ type: "success", text: "Challan scanned! Please review and confirm." });
    } catch (err) {
      console.error("Challan scan error:", err);
      setScanMessage({ type: "error", text: "Could not read challan. Please fill manually." });
    } finally {
      setScanning(false);
      // Reset input so same file can be re-uploaded
      e.target.value = "";
    }
  };

  const addRow = () => setRows(prev => [...prev, { key: crypto.randomUUID(), materialId: "", quantity: "" }]);
  const removeRow = (key: string) => setRows(prev => prev.length > 1 ? prev.filter(r => r.key !== key) : prev);
  const updateRow = (key: string, field: keyof DeliveryRow, value: string) =>
    setRows(prev => prev.map(r => r.key === key ? { ...r, [field]: value } : r));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validRows = rows.filter(r => r.materialId && Number(r.quantity) > 0);
    if (validRows.length === 0) {
      toast.error("Add at least one material with quantity");
      return;
    }

    setSaving(true);

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

    const items = validRows.map(r => ({
      delivery_id: delivery.id,
      material_id: r.materialId,
      quantity: Number(r.quantity),
    }));

    const { error: itemErr } = await supabase.from("delivery_items").insert(items);
    if (itemErr) {
      toast.error("Failed to save delivery items");
      setSaving(false);
      return;
    }

    for (const row of validRows) {
      const mat = materials.find(m => m.id === row.materialId);
      if (!mat) continue;
      const newQty = mat.quantity + Number(row.quantity);
      const newStatus = computeStatus(newQty, mat.unit);
      await supabase.from("materials").update({ quantity: newQty, status: newStatus }).eq("id", mat.id);
    }

    const summary = validRows.map(r => {
      const mat = materials.find(m => m.id === r.materialId);
      return `${r.quantity} ${mat?.unit || ""} ${mat?.name || ""}`;
    }).join(", ");

    addActivity({ text: `Delivery: ${summary}${supplier ? ` from ${supplier}` : ""}`, icon: "delivery" });
    toast.success("Delivery saved — inventory updated");
    setSaving(false);
    navigate("/materials");
  };

  const getMaterialUnit = (id: string) => materials.find(m => m.id === id)?.unit || "";

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="page-header">New Delivery</h2>
        <p className="text-sm text-muted-foreground">Record a material delivery challan</p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload challan card */}
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
            <p className="font-semibold text-foreground">📷 Photograph Challan</p>
            <p className="text-sm text-muted-foreground mt-1">AI will read the challan automatically</p>
          </>
        )}
      </Card>

      {/* Scan result message */}
      {scanMessage && (
        <div className={`flex items-center gap-2 p-3 rounded-md text-sm ${
          scanMessage.type === "success"
            ? "bg-green-500/10 text-green-600 dark:text-green-400"
            : "bg-destructive/10 text-destructive"
        }`}>
          {scanMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {scanMessage.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card className="p-5 space-y-4">
          <p className="text-xs text-muted-foreground">Fill manually if photo upload unavailable</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Supplier</Label>
              <Input placeholder="e.g., Nashik Cement Agency" value={supplier} onChange={e => setSupplier(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Site</Label>
              <Select value={site} onValueChange={setSite}>
                <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                <SelectContent>
                  {sites.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label className="text-base font-semibold">Materials</Label>
            <div className="border rounded-md overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 400 }}>
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left p-2 font-medium text-muted-foreground">Material *</th>
                    <th className="text-left p-2 font-medium text-muted-foreground w-28">Qty *</th>
                    <th className="text-left p-2 font-medium text-muted-foreground w-16">Unit</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-b last:border-0">
                      <td className="p-2">
                        <Select value={row.materialId} onValueChange={v => updateRow(row.key, "materialId", v)}>
                          <SelectTrigger className="h-9"><SelectValue placeholder="Select material" /></SelectTrigger>
                          <SelectContent>
                            {materials.map(m => (
                              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Input type="number" min="1" placeholder="0" className="h-9" value={row.quantity} onChange={e => updateRow(row.key, "quantity", e.target.value)} />
                      </td>
                      <td className="p-2 text-muted-foreground">{getMaterialUnit(row.materialId) || "—"}</td>
                      <td className="p-2">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeRow(row.key)} disabled={rows.length <= 1}>
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
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Delivery"}
          </Button>
        </Card>
      </form>
    </div>
  );
}
