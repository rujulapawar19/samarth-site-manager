import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { materials as initialMaterials, formatINR, Material } from "@/data/sampleData";
import { Link } from "react-router-dom";
import SiteFilter from "@/components/SiteFilter";

function getStatusForQuantity(qty: number, unit: string): Material["status"] {
  if (unit === "brass" || unit === "tonnes") return qty <= 3 ? "Critical" : qty <= 8 ? "Low" : "Sufficient";
  if (unit === "sheets" || unit === "pieces" && qty < 100) return qty <= 10 ? "Critical" : qty <= 30 ? "Low" : "Sufficient";
  if (unit === "bags") return qty <= 50 ? "Critical" : qty <= 100 ? "Low" : "Sufficient";
  if (unit === "kg") return qty <= 500 ? "Critical" : qty <= 1000 ? "Low" : "Sufficient";
  if (unit === "meters") return qty <= 100 ? "Critical" : qty <= 300 ? "Low" : "Sufficient";
  return qty <= 20 ? "Critical" : qty <= 50 ? "Low" : "Sufficient";
}

export default function MaterialsPage() {
  const [siteFilter, setSiteFilter] = useState("all");
  const [inventory, setInventory] = useState<Material[]>(initialMaterials);

  useEffect(() => {
    const raw = sessionStorage.getItem("sitesync_deliveries");
    if (!raw) return;
    const deliveries = JSON.parse(raw) as { material: string; quantity: number; unit: string; rate: number; supplier: string; site: string }[];
    if (deliveries.length === 0) return;

    setInventory((prev) => {
      let updated = [...prev];
      for (const d of deliveries) {
        const idx = updated.findIndex((m) => m.name.toLowerCase() === d.material.toLowerCase());
        if (idx > -1) {
          const newQty = updated[idx].quantity + d.quantity;
          updated[idx] = { ...updated[idx], quantity: newQty, status: getStatusForQuantity(newQty, updated[idx].unit) };
        } else {
          const newQty = d.quantity;
          const unit = d.unit || "pieces";
          updated.push({
            id: `m-${Date.now()}-${Math.random()}`,
            name: d.material,
            supplier: d.supplier || "—",
            quantity: newQty,
            unit,
            rate: d.rate || 0,
            status: getStatusForQuantity(newQty, unit),
            site: d.site || "site-a",
          });
        }
      }
      return updated;
    });
    sessionStorage.removeItem("sitesync_deliveries");
  }, []);

  const filtered = siteFilter === "all" ? inventory : inventory.filter(m => m.site === siteFilter);

  const statusClass = (status: string) => {
    switch (status) {
      case "Sufficient": return "status-sufficient";
      case "Low": return "status-low";
      case "Critical": return "status-critical";
      default: return "";
    }
  };

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
                <th className="text-right p-3 font-medium text-muted-foreground">Qty</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Unit</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Rate</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3 font-medium text-foreground">{m.name}</td>
                  <td className="p-3 text-muted-foreground">{m.supplier}</td>
                  <td className="p-3 text-right">{m.quantity.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-muted-foreground">{m.unit}</td>
                  <td className="p-3 text-right">{formatINR(m.rate)}/{m.unit.slice(0, -1) || m.unit}</td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className={statusClass(m.status)}>
                      {m.status}
                    </Badge>
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
