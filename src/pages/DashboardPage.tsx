import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Clock, Package, IndianRupee, CalendarCheck, Truck, FileText, AlertTriangle, Plus, MapPin, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { formatINR, formatINRLakhs } from "@/data/sampleData";
import { useActivity } from "@/context/ActivityContext";
import { useSites } from "@/context/SiteContext";
import { useSelectedSite } from "@/context/SelectedSiteContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const activityIcons = {
  attendance: CalendarCheck,
  delivery: Truck,
  payment: IndianRupee,
  alert: AlertTriangle,
};

interface DashStats {
  totalWorkers: number;
  presentToday: number;
  dailyCount: number;
  monthlyCount: number;
  pendingPayments: number;
  lowStockCount: number;
  criticalCount: number;
  totalSpent: number;
}

export default function DashboardPage() {
  const { activities } = useActivity();
  const { sites, addSite } = useSites();
  const { selectedSiteId } = useSelectedSite();
  const [showAddSite, setShowAddSite] = useState(false);
  const [form, setForm] = useState({ name: "", shortName: "", location: "", startDate: "", totalBudget: "" });
  const [stats, setStats] = useState<DashStats>({ totalWorkers: 0, presentToday: 0, dailyCount: 0, monthlyCount: 0, pendingPayments: 0, lowStockCount: 0, criticalCount: 0, totalSpent: 0 });
  const [siteStats, setSiteStats] = useState<Record<string, { workers: number; lowStock: number; spent: number }>>({});
  const [loading, setLoading] = useState(true);

  const filteredSites = selectedSiteId && selectedSiteId !== "all"
    ? sites.filter(s => s.id === selectedSiteId)
    : sites;

  const selectedSite = selectedSiteId && selectedSiteId !== "all"
    ? sites.find(s => s.id === selectedSiteId)
    : null;

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split("T")[0];
      const [workersRes, materialsRes, invoicesRes, attendanceRes] = await Promise.all([
        supabase.from("workers").select("id, wage_type, status, amount_due, site_id"),
        supabase.from("materials").select("id, status, site_id"),
        supabase.from("invoices").select("id, amount, site_id"),
        supabase.from("attendance").select("worker_id, present, site_id").eq("date", today).eq("present", true),
      ]);

      let workers = workersRes.data || [];
      let materials = materialsRes.data || [];
      let invoices = invoicesRes.data || [];
      let attendance = attendanceRes.data || [];

      // Apply global site filter
      if (selectedSiteId && selectedSiteId !== "all") {
        workers = workers.filter(w => w.site_id === selectedSiteId);
        materials = materials.filter(m => m.site_id === selectedSiteId);
        invoices = invoices.filter(i => i.site_id === selectedSiteId);
        attendance = attendance.filter(a => a.site_id === selectedSiteId);
      }

      const dailyCount = workers.filter(w => w.wage_type === "daily").length;
      const monthlyCount = workers.filter(w => w.wage_type === "monthly").length;
      const presentToday = attendance.length;
      const pendingPayments = workers.filter(w => w.status === "Pending").reduce((s, w) => s + Number(w.amount_due), 0);
      const lowStockCount = materials.filter(m => m.status === "Low" || m.status === "Critical").length;
      const criticalCount = materials.filter(m => m.status === "Critical").length;
      const totalSpent = invoices.reduce((s, i) => s + Number(i.amount), 0);

      setStats({ totalWorkers: workers.length, presentToday, dailyCount, monthlyCount, pendingPayments, lowStockCount, criticalCount, totalSpent });

      const ss: Record<string, { workers: number; lowStock: number; spent: number }> = {};
      for (const site of filteredSites) {
        const allWorkers = workersRes.data || [];
        const allMaterials = materialsRes.data || [];
        const allInvoices = invoicesRes.data || [];
        ss[site.id] = {
          workers: allWorkers.filter(w => w.site_id === site.id).length,
          lowStock: allMaterials.filter(m => m.site_id === site.id && (m.status === "Low" || m.status === "Critical")).length,
          spent: allInvoices.filter(i => i.site_id === site.id).reduce((s, i) => s + Number(i.amount), 0),
        };
      }
      setSiteStats(ss);
      setLoading(false);
    };
    if (sites.length > 0) fetchStats();
    else setLoading(false);
  }, [sites, selectedSiteId]);

  const statCards = [
    { label: "Workers Present Today", value: String(stats.presentToday), icon: Users, change: `of ${stats.totalWorkers} total (${stats.dailyCount} daily + ${stats.monthlyCount} staff)` },
    { label: "Pending Payments", value: formatINR(stats.pendingPayments), icon: Clock, change: "This week" },
    { label: "Materials Low Stock", value: String(stats.lowStockCount), icon: Package, change: `${stats.criticalCount} critical` },
    { label: "Total Spent This Month", value: formatINRLakhs(stats.totalSpent), icon: IndianRupee, change: "from invoices" },
  ];

  const handleAddSite = async () => {
    if (!form.name || !form.location || !form.startDate || !form.totalBudget) {
      toast.error("Please fill all fields");
      return;
    }
    const shortName = form.shortName || form.name.split("—").pop()?.trim() || form.name;
    await addSite({ name: form.name, short_name: shortName, location: form.location, start_date: form.startDate, total_budget: Number(form.totalBudget), phase: "Foundation" });
    toast.success(`${form.name} added`);
    setForm({ name: "", shortName: "", location: "", startDate: "", totalBudget: "" });
    setShowAddSite(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="page-header">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview for {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          {selectedSite && ` — ${selectedSite.short_name}`}
        </p>
      </div>

      {/* Phase badge for selected site */}
      {selectedSite && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">Phase: {selectedSite.phase}</Badge>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => (
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
        {filteredSites.map((site) => {
          const ss = siteStats[site.id] || { workers: 0, lowStock: 0, spent: 0 };
          const budget = site.total_budget;
          const budgetPct = budget > 0 ? Math.min(Math.round((ss.spent / budget) * 100), 100) : 0;
          const siteActivities = activities.filter(a => a.text.toLowerCase().includes(site.short_name.toLowerCase())).slice(0, 2);

          return (
            <Card key={site.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground text-sm">{site.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {site.location}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px]">{site.phase}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-muted-foreground">Workers</p>
                  <p className="font-bold text-foreground">{ss.workers}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-muted-foreground">Low Stock</p>
                  <p className="font-bold text-foreground">{ss.lowStock}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Budget Used</span>
                  <span className="font-medium text-foreground">{formatINRLakhs(ss.spent)} / {formatINRLakhs(budget)}</span>
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

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Link to="/attendance">
          <Button variant="outline" className="w-full h-auto py-3 sm:py-4 flex flex-col gap-1 sm:gap-1.5 border-primary/20 hover:bg-primary/5">
            <CalendarCheck className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            <span className="text-[10px] sm:text-xs font-medium">Attendance</span>
          </Button>
        </Link>
        <Link to="/new-delivery">
          <Button variant="outline" className="w-full h-auto py-3 sm:py-4 flex flex-col gap-1 sm:gap-1.5 border-primary/20 hover:bg-primary/5">
            <Truck className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            <span className="text-[10px] sm:text-xs font-medium">Delivery</span>
          </Button>
        </Link>
        <Link to="/invoices">
          <Button variant="outline" className="w-full h-auto py-3 sm:py-4 flex flex-col gap-1 sm:gap-1.5 border-primary/20 hover:bg-primary/5">
            <FileText className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
            <span className="text-[10px] sm:text-xs font-medium">Invoice</span>
          </Button>
        </Link>
      </div>

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
