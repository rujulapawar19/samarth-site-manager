import { useState, useEffect } from "react";
import { Plus, Minus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/data/sampleData";
import { Link } from "react-router-dom";
import SiteFilter from "@/components/SiteFilter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DbMaterial {
  id: string;
  name: string;
  supplier: string | null;
  quantity: number;
  unit: string;
  rate: number;
  status: string;
  site_id: string | null;
}

function computeStatus(qty: number, unit: string): string {
  if (unit === "brass" || unit === "tonnes") return qty <= 3 ? "Critical" : qty <= 8 ? "Low" : "Sufficient";
  if (unit === "sheets" || (unit === "pieces" && qty < 100)) return qty <= 10 ? "Critical" : qty <= 30 ? "Low" : "Sufficient";
  if (unit === "bags") return qty <= 50 ? "Critical" : qty <= 100 ? "Low" : "Sufficient";
  if (unit === "kg") return qty <= 500 ? "Critical" : qty <= 1000 ? "Low" : "Sufficient";
  if (unit === "meters") return qty <= 100 ? "Critical" : qty <= 300 ? "Low" : "Sufficient";
  return qty <= 20 ? "Critical" : qty <= 50 ? "Low" : "Sufficient";
}

export default function MaterialsPage() {
  const [siteFilter, setSiteFilter] = useState("all");
  const [materials, setMaterials] = useState<DbMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchMaterials = async () => {
    const { data, error } = await supabase.from("materials").select("id, name, supplier, quantity, unit, rate, status, site_id").order("name");
    if (error) {
      toast.error("Failed to load materials");
      console.error(error);
    } else {
      setMaterials((data || []).map(m => ({ ...m, rate: Number(m.rate) })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchMaterials(); }, []);

  const adjustQuantity = async (material: DbMaterial, delta: number) => {
    const newQty = Math.max(0, material.quantity + delta);
    const newStatus = computeStatus(newQty, material.unit);
    setUpdating(material.id);

    const { error } = await supabase
      .from("materials")
      .update({ quantity: newQty, status: newStatus })
      .eq("id", material.id);

    if (error) {
      toast.error("Failed to update quantity");
    } else {
      setMaterials(prev => prev.map(m => m.id === material.id ? { ...m, quantity: newQty, status: newStatus } : m));
    }
    setUpdating(null);
  };

  const filtered = siteFilter === "all" ? materials : materials.filter(m => m.site_id === siteFilter);

  const statusClass = (status: string) => {
    switch (status) {
      case "Sufficient": return "status-sufficient";
      case "Low": return "status-low";
      case "Critical": return "status-critical";
      default: return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="page-header">Material Inventory</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} materials tracked</p>
        </div>
        <div className="flex gap-2">
          <SiteFilter value={siteFilter} onChange={setSiteFilter} />
          <Link to="/new-delivery">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> New Delivery
            </Button>
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Material</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Supplier</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Qty</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Unit</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Rate</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3 font-medium text-foreground">{m.name}</td>
                  <td className="p-3 text-muted-foreground">{m.supplier || "—"}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" disabled={updating === m.id || m.quantity <= 0} onClick={() => adjustQuantity(m, -1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="min-w-[3rem] text-center font-semibold tabular-nums">{m.quantity.toLocaleString("en-IN")}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" disabled={updating === m.id} onClick={() => adjustQuantity(m, 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{m.unit}</td>
                  <td className="p-3 text-right">{formatINR(m.rate)}/{m.unit.slice(0, -1) || m.unit}</td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className={statusClass(m.status)}>{m.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
