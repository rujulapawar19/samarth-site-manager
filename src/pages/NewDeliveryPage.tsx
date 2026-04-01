import { useState } from "react";
import { Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sites } from "@/data/sampleData";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function NewDeliveryPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    supplier: "",
    material: "",
    quantity: "",
    unit: "",
    rate: "",
    total: "",
    site: "",
    date: "2026-03-31",
  });

  const update = (field: string, value: string) => {
    const next = { ...form, [field]: value };
    // Auto-calculate total
    if (field === "quantity" || field === "rate") {
      const qty = field === "quantity" ? Number(value) : Number(next.quantity);
      const rate = field === "rate" ? Number(value) : Number(next.rate);
      if (qty && rate) next.total = String(qty * rate);
    }
    setForm(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.material || !form.quantity || !form.unit) {
      toast.error("Please fill Material, Quantity, and Unit");
      return;
    }
    // Save delivery to sessionStorage so MaterialsPage can pick it up
    const deliveries = JSON.parse(sessionStorage.getItem("sitesync_deliveries") || "[]");
    deliveries.push({
      id: `del-${Date.now()}`,
      supplier: form.supplier,
      material: form.material,
      quantity: Number(form.quantity),
      unit: form.unit,
      rate: Number(form.rate),
      total: Number(form.total),
      site: form.site,
      date: form.date,
    });
    sessionStorage.setItem("sitesync_deliveries", JSON.stringify(deliveries));
    toast.success("Delivery saved — inventory updated");
    navigate("/materials");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="page-header">New Delivery</h2>
        <p className="text-sm text-muted-foreground">Record a material delivery challan</p>
      </div>

      <Card className="p-8 border-dashed border-2 border-primary/30 bg-primary/5 text-center cursor-pointer hover:bg-primary/10 transition-colors">
        <Camera className="w-12 h-12 text-primary mx-auto mb-3" />
        <p className="font-semibold text-foreground">📷 Photograph Challan</p>
        <p className="text-sm text-muted-foreground mt-1">AI will read the challan automatically</p>
      </Card>

      <form onSubmit={handleSave}>
        <Card className="p-5 space-y-4">
          <p className="text-xs text-muted-foreground">Fill manually if photo upload unavailable</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Supplier Name</Label>
              <Input placeholder="e.g., Nashik Cement Agency" value={form.supplier} onChange={(e) => update("supplier", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Material *</Label>
              <Input placeholder="e.g., OPC Cement 53 Grade" value={form.material} onChange={(e) => update("material", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Quantity *</Label>
              <Input type="number" placeholder="e.g., 200" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Unit *</Label>
              <Select value={form.unit} onValueChange={(v) => update("unit", v)}>
                <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bags">Bags</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="brass">Brass</SelectItem>
                  <SelectItem value="tonnes">Tonnes</SelectItem>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="sheets">Sheets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Rate per Unit</Label>
              <Input type="number" placeholder="₹" value={form.rate} onChange={(e) => update("rate", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Total Amount</Label>
              <Input type="number" placeholder="₹" value={form.total} onChange={(e) => update("total", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Site</Label>
              <Select value={form.site} onValueChange={(v) => update("site", v)}>
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
              <Input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">Save Delivery</Button>
        </Card>
      </form>
    </div>
  );
}
