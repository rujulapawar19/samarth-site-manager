import { useState, useEffect } from "react";
import { Plus, Wallet, Check, Loader2, Search, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { formatINR } from "@/data/sampleData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useActivity } from "@/context/ActivityContext";
import { useSites } from "@/context/SiteContext";
import SiteFilter from "@/components/SiteFilter";

interface DbWorker {
  id: string;
  name: string;
  role: string;
  wage_type: string;
  wage_rate: number;
  days_present: number;
  amount_due: number;
  status: string;
  phone: string | null;
  site_id: string | null;
  paid_at: string | null;
}

export default function LaborPage() {
  const navigate = useNavigate();
  const { addActivity } = useActivity();
  const { sites } = useSites();
  const [workers, setWorkers] = useState<DbWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayday, setShowPayday] = useState(false);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [siteFilter, setSiteFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteWorker, setDeleteWorker] = useState<DbWorker | null>(null);

  const [form, setForm] = useState({
    name: "", role: "", wageType: "daily" as "daily" | "monthly", wageRate: "", phone: "", site: "",
  });

  const fetchWorkers = async () => {
    const { data, error } = await supabase.from("workers").select("*").order("name");
    if (error) { toast.error("Failed to load workers"); console.error(error); }
    else setWorkers((data || []).map(w => ({ ...w, wage_rate: Number(w.wage_rate), amount_due: Number(w.amount_due) })));
    setLoading(false);
  };

  useEffect(() => { fetchWorkers(); }, []);

  const dailyWorkers = workers.filter(w => w.wage_type === "daily");
  const monthlyStaff = workers.filter(w => w.wage_type === "monthly");

  const searchLower = search.toLowerCase();
  const applySearch = (list: DbWorker[]) =>
    search ? list.filter(w => w.name.toLowerCase().includes(searchLower) || w.role.toLowerCase().includes(searchLower)) : list;

  const filteredDaily = applySearch(siteFilter === "all" ? dailyWorkers : dailyWorkers.filter(w => w.site_id === siteFilter));
  const filteredMonthly = applySearch(siteFilter === "all" ? monthlyStaff : monthlyStaff.filter(w => w.site_id === siteFilter));
  const totalPending = filteredDaily.filter(w => w.status === "Pending").reduce((s, w) => s + w.amount_due, 0);

  const markPaid = async (id: string) => {
    const worker = workers.find(w => w.id === id);
    const { error } = await supabase.from("workers").update({ status: "Paid", paid_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    await fetchWorkers();
    toast.success("Marked as paid");
    if (worker) {
      addActivity({ text: `${worker.name} marked paid — ${formatINR(worker.amount_due)}`, icon: "payment" });
    }
  };

  const removeWorker = async () => {
    if (!deleteWorker) return;
    const { error } = await supabase.from("workers").delete().eq("id", deleteWorker.id);
    if (error) { toast.error("Failed to remove worker"); return; }
    toast.success(`${deleteWorker.name} removed`);
    addActivity({ text: `Worker removed — ${deleteWorker.name} (${deleteWorker.role})`, icon: "alert" });
    setDeleteWorker(null);
    await fetchWorkers();
  };

  const addWorker = async () => {
    if (!form.name || !form.role || !form.wageRate || !form.site) {
      toast.error("Please fill all required fields");
      return;
    }
    const rate = Number(form.wageRate);
    const { error } = await supabase.from("workers").insert({
      name: form.name,
      role: form.role,
      wage_type: form.wageType,
      wage_rate: rate,
      amount_due: form.wageType === "monthly" ? rate : 0,
      phone: form.phone || null,
      site_id: form.site,
    });
    if (error) { toast.error("Failed to add worker"); return; }
    await fetchWorkers();
    toast.success(`${form.name} added as ${form.wageType} worker`);
    addActivity({ text: `New ${form.wageType} worker added — ${form.name} (${form.role})`, icon: "attendance" });
    setForm({ name: "", role: "", wageType: "daily", wageRate: "", phone: "", site: "" });
    setShowAddWorker(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="page-header">Labor Management</h2>
          <p className="text-sm text-muted-foreground">Manage daily and monthly workers</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <SiteFilter value={siteFilter} onChange={setSiteFilter} />
          <Dialog open={showAddWorker} onOpenChange={setShowAddWorker}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Worker
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Worker</DialogTitle>
                <DialogDescription>Fill in the details to add a new worker.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Worker Name *</Label>
                  <Input placeholder="e.g., Rajesh More" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Role / Designation *</Label>
                  <Input placeholder="e.g., Mason, Plumber, Supervisor" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Wage Type</Label>
                  <Select value={form.wageType} onValueChange={v => setForm(f => ({ ...f, wageType: v as "daily" | "monthly" }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Wage</SelectItem>
                      <SelectItem value="monthly">Monthly Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{form.wageType === "daily" ? "Daily Rate (₹)" : "Monthly Salary (₹)"} *</Label>
                  <Input type="number" placeholder="e.g., 650" value={form.wageRate} onChange={e => setForm(f => ({ ...f, wageRate: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <Input placeholder="e.g., 9876543210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Site Assignment *</Label>
                  <Select value={form.site} onValueChange={v => setForm(f => ({ ...f, site: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                    <SelectContent>
                      {sites.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddWorker(false)}>Cancel</Button>
                <Button onClick={addWorker}>Save Worker</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showPayday} onOpenChange={setShowPayday}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Wallet className="w-4 h-4 mr-1" /> Run Payday
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Payday Summary — This Friday</DialogTitle>
                <DialogDescription>Review pending payments before proceeding.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">{formatINR(totalPending)}</p>
                  <p className="text-sm text-muted-foreground">Total cash required this Friday</p>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{filteredDaily.filter(w => w.status === "Pending").length} workers with pending payments</p>
                  <p>{filteredDaily.filter(w => w.status === "Paid").length} workers already paid</p>
                </div>
                <Button className="w-full" onClick={() => { setShowPayday(false); navigate("/payday"); }}>
                  Proceed to Payday
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily Workers ({filteredDaily.length})</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Staff ({filteredMonthly.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Role</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Daily Rate</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Days</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Amount Due</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDaily.map((w) => (
                    <tr key={w.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-medium text-foreground">{w.name}</td>
                      <td className="p-3 text-muted-foreground">{w.role}</td>
                      <td className="p-3 text-right">{formatINR(w.wage_rate)}</td>
                      <td className="p-3 text-center">{w.days_present}</td>
                      <td className="p-3 text-right font-medium">{formatINR(w.amount_due)}</td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className={w.status === "Paid" ? "status-paid" : "status-pending"}>
                          {w.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {w.status === "Pending" && w.amount_due > 0 && (
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => markPaid(w.id)}>
                              <Check className="w-3 h-3 mr-1" /> Pay
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => setDeleteWorker(w)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="monthly">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Designation</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Monthly Salary</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMonthly.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-medium text-foreground">{s.name}</td>
                      <td className="p-3 text-muted-foreground">{s.role}</td>
                      <td className="p-3 text-right">{formatINR(s.wage_rate)}</td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className={s.status === "Paid" ? "status-paid" : "status-pending"}>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => setDeleteWorker(s)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteWorker} onOpenChange={open => !open && setDeleteWorker(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to remove this worker?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteWorker?.name}</strong> ({deleteWorker?.role}) from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeWorker} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
