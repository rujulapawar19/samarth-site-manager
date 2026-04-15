import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { formatINR } from "@/data/sampleData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSites } from "@/context/SiteContext";
import { useSelectedSite } from "@/context/SelectedSiteContext";

interface DbInvoice {
  id: string;
  supplier: string;
  description: string;
  amount: number;
  site_id: string | null;
  status: string;
  date: string;
}

export default function InvoicesPage() {
  const { sites } = useSites();
  const { selectedSiteId } = useSelectedSite();
  const [invoices, setInvoices] = useState<DbInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ supplier: "", description: "", amount: "", site: "", status: "Pending" as "Paid" | "Pending" });

  const fetchInvoices = async () => {
    const { data, error } = await supabase.from("invoices").select("*").order("date", { ascending: false });
    if (error) { toast.error("Failed to load invoices"); }
    else setInvoices((data || []).map(i => ({ ...i, amount: Number(i.amount) })));
    setLoading(false);
  };

  const fetchSuppliers = async () => {
    const { data } = await supabase.from("suppliers").select("id, name").order("name");
    setSuppliers(data || []);
  };

  useEffect(() => { fetchInvoices(); fetchSuppliers(); }, []);

  const filtered = invoices
    .filter(i => statusFilter === "all" || i.status === statusFilter)
    .filter(i => !selectedSiteId || selectedSiteId === "all" || i.site_id === selectedSiteId);

  const totalPending = filtered.filter(i => i.status === "Pending").reduce((s, i) => s + i.amount, 0);

  const handleSave = async () => {
    if (!form.supplier || !form.description || !form.amount || !form.site) {
      toast.error("Please fill all required fields");
      return;
    }
    const { error } = await supabase.from("invoices").insert({
      supplier: form.supplier,
      description: form.description,
      amount: Number(form.amount),
      site_id: form.site,
      status: form.status,
      date: new Date().toISOString().split("T")[0],
    });
    if (error) { toast.error("Failed to save invoice"); return; }
    await fetchInvoices();
    setOpen(false);
    setForm({ supplier: "", description: "", amount: "", site: "", status: "Pending" });
    toast.success("Invoice generated successfully");
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="page-header">Invoices</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} invoices</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Generate Invoice
        </Button>
      </div>

      <Card className="p-4 bg-accent/10 border-accent/30">
        <p className="text-sm text-muted-foreground">Total Pending Amount</p>
        <p className="text-2xl font-bold text-foreground">{formatINR(totalPending)}</p>
      </Card>

      <div className="flex gap-2">
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>Create a new supplier invoice entry.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Supplier *</Label>
              <Select value={form.supplier} onValueChange={v => setForm(f => ({ ...f, supplier: v }))}>
                <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description *</Label>
              <Input placeholder="e.g. 200 bags OPC Cement" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Amount (₹) *</Label>
              <Input type="number" placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <Label>Site *</Label>
              <Select value={form.site} onValueChange={v => setForm(f => ({ ...f, site: v }))}>
                <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                <SelectContent>
                  {sites.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.short_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as "Paid" | "Pending" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleSave}>Save Invoice</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
