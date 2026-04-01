import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invoices, sites, formatINR } from "@/data/sampleData";

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState("all");

  const filtered = invoices
    .filter(i => statusFilter === "all" || i.status === statusFilter)
    .filter(i => siteFilter === "all" || i.site === siteFilter);

  const totalPending = invoices.filter(i => i.status === "Pending").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="page-header">Invoices</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} invoices</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" /> Generate Invoice
        </Button>
      </div>

      {/* Total Pending */}
      <Card className="p-4 bg-accent/10 border-accent/30">
        <p className="text-sm text-muted-foreground">Total Pending Amount</p>
        <p className="text-2xl font-bold text-foreground">{formatINR(totalPending)}</p>
      </Card>

      {/* Filters */}
      <div className="flex gap-2">
        <Select value={siteFilter} onValueChange={setSiteFilter}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="Site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sites</SelectItem>
            {sites.map(s => (
              <SelectItem key={s.id} value={s.id}>{s.shortName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Supplier</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3 font-medium text-foreground">{inv.supplier}</td>
                  <td className="p-3 text-muted-foreground">{inv.description}</td>
                  <td className="p-3 text-muted-foreground">{new Date(inv.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                  <td className="p-3 text-right font-medium">{formatINR(inv.amount)}</td>
                  <td className="p-3 text-center">
                    <Badge variant="outline" className={inv.status === "Paid" ? "status-paid" : "status-pending"}>
                      {inv.status}
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
