import { useState, useEffect } from "react";
import { Plus, Star, Phone, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatINR } from "@/data/sampleData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DbSupplier {
  id: string;
  name: string;
  material: string;
  contact: string;
  location: string | null;
  rating: number;
  total_business: number;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<DbSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", material: "", contact: "", location: "" });

  const fetchSuppliers = async () => {
    const { data, error } = await supabase.from("suppliers").select("*").order("name");
    if (error) { toast.error("Failed to load suppliers"); console.error(error); }
    else setSuppliers((data || []).map(s => ({ ...s, rating: Number(s.rating), total_business: Number(s.total_business) })));
    setLoading(false);
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.material || !form.contact) {
      toast.error("Please fill all required fields");
      return;
    }
    const { error } = await supabase.from("suppliers").insert({
      name: form.name,
      material: form.material,
      contact: form.contact,
      location: form.location || "Nashik",
    });
    if (error) { toast.error("Failed to add supplier"); return; }
    await fetchSuppliers();
    setForm({ name: "", material: "", contact: "", location: "" });
    setOpen(false);
    toast.success(`${form.name} added successfully`);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-header">Suppliers</h2>
          <p className="text-sm text-muted-foreground">{suppliers.length} active suppliers</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suppliers.map((sup) => (
          <Card key={sup.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">{sup.name}</p>
                <p className="text-xs text-muted-foreground">{sup.material}</p>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-medium">{sup.rating}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="w-3 h-3" />
                {sup.contact}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{formatINR(sup.total_business)}</p>
                <p className="text-[10px] text-muted-foreground">total business</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>Enter supplier details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Supplier Name *</Label>
              <Input placeholder="e.g., Nashik Cement Agency" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Material Supplied *</Label>
              <Input placeholder="e.g., Cement" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Contact Number *</Label>
              <Input placeholder="e.g., 9823456789" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input placeholder="e.g., Nashik" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <Button className="w-full" onClick={handleSave}>Save Supplier</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
