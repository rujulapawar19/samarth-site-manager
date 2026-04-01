import { Plus, Star, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { suppliers, formatINR } from "@/data/sampleData";

export default function SuppliersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-header">Suppliers</h2>
          <p className="text-sm text-muted-foreground">{suppliers.length} active suppliers</p>
        </div>
        <Button size="sm">
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
                <p className="text-sm font-semibold text-foreground">{formatINR(sup.totalBusiness)}</p>
                <p className="text-[10px] text-muted-foreground">this month</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Price Comparison */}
      <Card className="p-5">
        <h3 className="font-semibold text-foreground mb-3">Price Comparison — Cheapest per Material</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground">Cement (OPC 53 Grade)</span>
            <span className="font-medium text-foreground">Nashik Cement Agency — ₹380/bag</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground">TMT Steel 12mm</span>
            <span className="font-medium text-foreground">Shree Steel Traders — ₹58/kg</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground">Red Bricks</span>
            <span className="font-medium text-foreground">Patil Brick Suppliers — ₹8/piece</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-muted-foreground">River Sand</span>
            <span className="font-medium text-foreground">Godavari Sand Suppliers — ₹1,800/brass</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
