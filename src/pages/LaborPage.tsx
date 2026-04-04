import { useState } from "react";
import { Plus, Wallet, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { dailyWorkers as initialDailyWorkers, monthlyStaff as initialMonthlyStaff, sites, formatINR, type DailyWorker, type MonthlyStaff } from "@/data/sampleData";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useActivity } from "@/context/ActivityContext";

export default function LaborPage() {
  const navigate = useNavigate();
  const { addActivity } = useActivity();
  const [workers, setWorkers] = useState<DailyWorker[]>([...initialDailyWorkers]);
  const [staff, setStaff] = useState<MonthlyStaff[]>([...initialMonthlyStaff]);
  const [showPayday, setShowPayday] = useState(false);
  const [showAddWorker, setShowAddWorker] = useState(false);

  // Add worker form state
  const [form, setForm] = useState({
    name: "", role: "", wageType: "daily" as "daily" | "monthly", wageRate: "", phone: "", site: "",
  });

  const totalPending = workers.filter(w => w.status === "Pending").reduce((s, w) => s + w.amountDue, 0);

  const markPaid = (id: string) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, status: "Paid" as const } : w));
    toast.success("Marked as paid");
  };

  const addWorker = () => {
    if (!form.name || !form.role || !form.wageRate || !form.site) {
      toast.error("Please fill all required fields");
      return;
    }
    const rate = Number(form.wageRate);
    if (form.wageType === "daily") {
      const newWorker: DailyWorker = {
        id: `w-${Date.now()}`, name: form.name, role: form.role,
        dailyRate: rate, daysPresent: 0, amountDue: 0,
        status: "Pending", site: form.site, phone: form.phone,
      };
      setWorkers(prev => [newWorker, ...prev]);
    } else {
      const newStaff: MonthlyStaff = {
        id: `s-${Date.now()}`, name: form.name, designation: form.role,
        monthlySalary: rate, status: "Pending", site: form.site,
      };
      setStaff(prev => [newStaff, ...prev]);
    }
    toast.success(`${form.name} added as ${form.wageType} worker`);
    setForm({ name: "", role: "", wageType: "daily", wageRate: "", phone: "", site: "" });
    setShowAddWorker(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-header">Labor Management</h2>
          <p className="text-sm text-muted-foreground">Manage daily and monthly workers</p>
        </div>
        <div className="flex gap-2">
          {/* Add Worker Dialog */}
          <Dialog open={showAddWorker} onOpenChange={setShowAddWorker}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Worker
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Worker</DialogTitle>
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

          {/* Run Payday Dialog */}
          <Dialog open={showPayday} onOpenChange={setShowPayday}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Wallet className="w-4 h-4 mr-1" /> Run Payday
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Payday Summary — This Friday</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">{formatINR(totalPending)}</p>
                  <p className="text-sm text-muted-foreground">Total cash required this Friday</p>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{workers.filter(w => w.status === "Pending").length} workers with pending payments</p>
                  <p>{workers.filter(w => w.status === "Paid").length} workers already paid</p>
                </div>
                <Button className="w-full" onClick={() => { setShowPayday(false); navigate("/payday"); }}>
                  Proceed to Payday
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily Workers ({workers.length})</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Staff ({staff.length})</TabsTrigger>
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
                  {workers.map((w) => (
                    <tr key={w.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-medium text-foreground">{w.name}</td>
                      <td className="p-3 text-muted-foreground">{w.role}</td>
                      <td className="p-3 text-right">{formatINR(w.dailyRate)}</td>
                      <td className="p-3 text-center">{w.daysPresent}</td>
                      <td className="p-3 text-right font-medium">{formatINR(w.amountDue)}</td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className={w.status === "Paid" ? "status-paid" : "status-pending"}>
                          {w.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        {w.status === "Pending" && w.amountDue > 0 && (
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => markPaid(w.id)}>
                            <Check className="w-3 h-3 mr-1" /> Pay
                          </Button>
                        )}
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
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-medium text-foreground">{s.name}</td>
                      <td className="p-3 text-muted-foreground">{s.designation}</td>
                      <td className="p-3 text-right">{formatINR(s.monthlySalary)}</td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" className={s.status === "Paid" ? "status-paid" : "status-pending"}>
                          {s.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
