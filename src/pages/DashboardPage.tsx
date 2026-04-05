import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Clock, Package, IndianRupee, CalendarCheck, Truck, FileText, AlertTriangle, Plus, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { dailyWorkers, monthlyStaff, materials, invoices, formatINR, formatINRLakhs } from "@/data/sampleData";
import { useActivity } from "@/context/ActivityContext";
import { useSites } from "@/context/SiteContext";
import { toast } from "sonner";

const activityIcons = {
  attendance: CalendarCheck,
  delivery: Truck,
  payment: IndianRupee,
  alert: AlertTriangle,
};

export default function DashboardPage() {
  const { activities } = useActivity();
  const { sites, addSite } = useSites();
  const [showAddSite, setShowAddSite] = useState(false);
  const [form, setForm] = useState({ name: "", shortName: "", location: "", startDate: "", totalBudget: "" });

  const totalWorkers = dailyWorkers.length + monthlyStaff.length;
  const pendingPayments = dailyWorkers.filter(w => w.status === "Pending").reduce((a, w) => a + w.amountDue, 0)
    + monthlyStaff.filter(s => s.status === "Pending").reduce((a, s) => a + s.monthlySalary, 0);
  const lowStockCount = materials.filter(m => m.status === "Low" || m.status === "Critical").length;
  const totalSpent = invoices.reduce((a, inv) => a + inv.amount, 0);

  const stats = [
    { label: "Total Workers Today", value: String(totalWorkers), icon: Users, change: `${dailyWorkers.length} daily + ${monthlyStaff.length} staff` },
    { label: "Pending Payments", value: formatINR(pendingPayments), icon: Clock, change: "This week" },
    { label: "Materials Low Stock", value: String(lowStockCount), icon: Package, change: `${materials.filter(m => m.status === "Critical").length} critical` },
    { label: "Total Spent This Month", value: formatINRLakhs(totalSpent), icon: IndianRupee, change: "vs ₹16.2L budget" },
  ];

  // Budget data per site
  const budgetMap: Record<string, number> = { "site-a": 4500000, "site-b": 3800000, "site-c": 2800000 };

  const handleAddSite = () => {
    if (!form.name || !form.location || !form.startDate || !form.totalBudget) {
      toast.error("Please fill all fields");
      return;
    }
    const shortName = form.shortName || form.name.split("—").pop()?.trim() || form.name;
    addSite({ name: form.name, shortName, location: form.location, startDate: form.startDate, totalBudget: Number(form.totalBudget) });
    toast.success(`${form.name} added`);
    setForm({ name: "", shortName: "", location: "", startDate: "", totalBudget: "" });
    setShowAddSite(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="page-header">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Overview for Monday, 31 March 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <div className="flex items-start justify-between mb-2">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Budget Alert */}
      <div className="rounded-xl bg-accent/10 border border-accent/30 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Budget Forecast Alert</p>
          <p className="text-sm text-muted-foreground">
            ⚠️ At current spending rate, Tower A will exceed budget by ₹2.3 lakhs in 18 days.
          </p>
        </div>
      </div>

      {/* Site Summary Cards */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Sites</h3>
        <Dialog open={showAddSite} onOpenChange={setShowAddSite}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" /> Add New Site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Site</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Site Name *</Label>
                <Input placeholder="e.g., Samarth Heights — Tower C" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Short Name</Label>
                <Input placeholder="e.g., Tower C" value={form.shortName} onChange={e => setForm(f => ({ ...f, shortName: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Location *</Label>
                <Input placeholder="e.g., Nashik" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date *</Label>
                <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Total Budget (₹) *</Label>
                <Input type="number" placeholder="e.g., 5000000" value={form.totalBudget} onChange={e => setForm(f => ({ ...f, totalBudget: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddSite(false)}>Cancel</Button>
              <Button onClick={handleAddSite}>Save Site</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => {
          const siteWorkers = dailyWorkers.filter(w => w.site === site.id).length + monthlyStaff.filter(s => s.site === site.id).length;
          const siteLowStock = materials.filter(m => m.site === site.id && (m.status === "Low" || m.status === "Critical")).length;
          const siteSpent = invoices.filter(i => i.site === site.id).reduce((s, i) => s + i.amount, 0);
          const budget = budgetMap[site.id] || site.totalBudget;
          const budgetPct = budget > 0 ? Math.min(Math.round((siteSpent / budget) * 100), 100) : 0;
          const siteActivities = activities.filter(a => a.text.toLowerCase().includes(site.shortName.toLowerCase())).slice(0, 2);

          return (
            <Card key={site.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground text-sm">{site.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {site.location}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-muted-foreground">Workers</p>
                  <p className="font-bold text-foreground">{siteWorkers}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-muted-foreground">Low Stock</p>
                  <p className="font-bold text-foreground">{siteLowStock}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Budget Used</span>
                  <span className="font-medium text-foreground">{formatINRLakhs(siteSpent)} / {formatINRLakhs(budget)}</span>
                </div>
                <Progress value={budgetPct} className="h-2" />
                <p className="text-[10px] text-muted-foreground mt-0.5">{budgetPct}% used</p>
              </div>
              {siteActivities.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Recent</p>
                  {siteActivities.map((a, i) => (
                    <p key={i} className="text-[11px] text-muted-foreground truncate">• {a.text}</p>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/attendance">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-1.5 border-primary/20 hover:bg-primary/5">
            <CalendarCheck className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium">Mark Attendance</span>
          </Button>
        </Link>
        <Link to="/new-delivery">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-1.5 border-primary/20 hover:bg-primary/5">
            <Truck className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium">New Delivery</span>
          </Button>
        </Link>
        <Link to="/invoices">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-1.5 border-primary/20 hover:bg-primary/5">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium">Generate Invoice</span>
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card className="p-5">
        <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.slice(0, 10).map((item, i) => {
            const Icon = activityIcons[item.icon];
            return (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground truncate">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
