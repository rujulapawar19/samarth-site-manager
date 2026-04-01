import { Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sites } from "@/data/sampleData";
import { toast } from "sonner";

export default function NewDeliveryPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Delivery saved successfully");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="page-header">New Delivery</h2>
        <p className="text-sm text-muted-foreground">Record a material delivery challan</p>
      </div>

      {/* Camera Upload */}
      <Card className="p-8 border-dashed border-2 border-primary/30 bg-primary/5 text-center cursor-pointer hover:bg-primary/10 transition-colors">
        <Camera className="w-12 h-12 text-primary mx-auto mb-3" />
        <p className="font-semibold text-foreground">📷 Photograph Challan</p>
        <p className="text-sm text-muted-foreground mt-1">AI will read the challan automatically</p>
      </Card>

      {/* Form */}
      <form onSubmit={handleSave}>
        <Card className="p-5 space-y-4">
          <p className="text-xs text-muted-foreground">Fill manually if photo upload unavailable</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Supplier Name</Label>
              <Input placeholder="e.g., Nashik Cement Agency" />
            </div>
            <div className="space-y-1.5">
              <Label>Material</Label>
              <Input placeholder="e.g., OPC Cement 53 Grade" />
            </div>
            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input type="number" placeholder="e.g., 200" />
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Select>
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
              <Input type="number" placeholder="₹" />
            </div>
            <div className="space-y-1.5">
              <Label>Total Amount</Label>
              <Input type="number" placeholder="₹" />
            </div>
            <div className="space-y-1.5">
              <Label>Site</Label>
              <Select>
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
              <Input type="date" defaultValue="2026-03-31" />
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">Save Delivery</Button>
        </Card>
      </form>
    </div>
  );
}
