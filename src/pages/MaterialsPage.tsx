import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { materials, sites, formatINR } from "@/data/sampleData";
import { Link } from "react-router-dom";

export default function MaterialsPage() {
  const [siteFilter, setSiteFilter] = useState("all");
  
  const filtered = siteFilter === "all" ? materials : materials.filter(m => m.site === siteFilter);

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
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger className="w-44 h-9">
              <Filter className="w-3.5 h-3.5 mr-1" />
              <SelectValue placeholder="Filter by Site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              {sites.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.shortName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
