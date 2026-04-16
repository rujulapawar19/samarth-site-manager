import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, IndianRupee, Loader2 } from "lucide-react";
import { useSelectedSite } from "@/context/SelectedSiteContext";
import { useSites } from "@/context/SiteContext";
import { supabase } from "@/integrations/supabase/client";

interface Alert {
  id: string;
  type: "stock" | "budget" | "payment";
  title: string;
  description: string;
  urgency: "high" | "medium" | "low";
  date: string;
  siteId: string;
  siteName: string;
}

const typeIcons = {
  stock: Package,
  budget: AlertTriangle,
  payment: IndianRupee,
};

const urgencyColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-blue-100 text-blue-800 border-blue-200",
};

const urgencyBorder = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-blue-400",
};

export default function AlertsPage() {
  const { selectedSiteId } = useSelectedSite();
  const { sites } = useSites();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateAlerts = async () => {
      const [materialsRes, workersRes, invoicesRes] = await Promise.all([
        supabase.from("materials").select("id, name, status, quantity, unit, site_id"),
        supabase.from("workers").select("id, name, status, amount_due, site_id"),
        supabase.from("invoices").select("id, amount, site_id"),
      ]);

      const materials = materialsRes.data || [];
      const workers = workersRes.data || [];
      const invoices = invoicesRes.data || [];
      const generated: Alert[] = [];
      const today = new Date().toISOString().split("T")[0];

      // Stock alerts from actual material statuses
      for (const m of materials) {
        const site = sites.find(s => s.id === m.site_id);
        if (!site) continue;

        if (m.status === "Critical") {
          generated.push({
            id: `stock-crit-${m.id}`,
            type: "stock",
            title: `${m.name} — Critical Stock`,
            description: `Only ${m.quantity} ${m.unit} remaining at ${site.short_name}. Immediate reorder needed.`,
            urgency: "high",
            date: today,
            siteId: site.id,
            siteName: site.short_name,
          });
        } else if (m.status === "Low") {
          generated.push({
            id: `stock-low-${m.id}`,
            type: "stock",
            title: `${m.name} — Low Stock`,
            description: `${m.quantity} ${m.unit} remaining at ${site.short_name}. Reorder recommended.`,
            urgency: "medium",
            date: today,
            siteId: site.id,
            siteName: site.short_name,
          });
        }
      }

      // Budget alerts — check sites where spending > 80% of budget
      for (const site of sites) {
        const siteInvoices = invoices.filter(i => i.site_id === site.id);
        const totalSpent = siteInvoices.reduce((s, i) => s + Number(i.amount), 0);
        const pct = site.total_budget > 0 ? (totalSpent / site.total_budget) * 100 : 0;

        if (pct > 90) {
          generated.push({
            id: `budget-${site.id}`,
            type: "budget",
            title: "Budget Overrun Warning",
            description: `${site.short_name} has used ${Math.round(pct)}% of its ₹${(site.total_budget / 100000).toFixed(1)}L budget. Review spending immediately.`,
            urgency: "high",
            date: today,
            siteId: site.id,
            siteName: site.short_name,
          });
        } else if (pct > 70) {
          generated.push({
            id: `budget-${site.id}`,
            type: "budget",
            title: "Budget Nearing Limit",
            description: `${site.short_name} has used ${Math.round(pct)}% of its budget. Monitor spending.`,
            urgency: "medium",
            date: today,
            siteId: site.id,
            siteName: site.short_name,
          });
        }
      }

      // Payment alerts — pending worker payments
      const pendingBySite: Record<string, { count: number; total: number }> = {};
      for (const w of workers) {
        if (w.status === "Pending" && Number(w.amount_due) > 0 && w.site_id) {
          if (!pendingBySite[w.site_id]) pendingBySite[w.site_id] = { count: 0, total: 0 };
          pendingBySite[w.site_id].count++;
          pendingBySite[w.site_id].total += Number(w.amount_due);
        }
      }
      for (const [siteId, data] of Object.entries(pendingBySite)) {
        const site = sites.find(s => s.id === siteId);
        if (!site || data.total < 5000) continue;
        generated.push({
          id: `payment-${siteId}`,
          type: "payment",
          title: "Pending Worker Payments",
          description: `₹${data.total.toLocaleString("en-IN")} pending for ${data.count} workers at ${site.short_name}.`,
          urgency: data.total > 50000 ? "high" : "medium",
          date: today,
          siteId: site.id,
          siteName: site.short_name,
        });
      }

      // Sort: high first, then medium, then low
      const order = { high: 0, medium: 1, low: 2 };
      generated.sort((a, b) => order[a.urgency] - order[b.urgency]);

      setAlerts(generated);
      setLoading(false);
    };

    if (sites.length > 0) generateAlerts();
    else setLoading(false);
  }, [sites]);

  const filteredAlerts = selectedSiteId && selectedSiteId !== "all"
    ? alerts.filter(a => a.siteId === selectedSiteId)
    : alerts;

  const highCount = filteredAlerts.filter(a => a.urgency === "high").length;

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="page-header">Alerts</h2>
        <p className="text-sm text-muted-foreground">{filteredAlerts.length} active alerts — {highCount} high urgency</p>
      </div>

      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const Icon = typeIcons[alert.type];
          return (
            <Card key={alert.id} className={`p-4 border-l-4 ${urgencyBorder[alert.urgency]}`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-foreground">{alert.title}</p>
                    <Badge variant="outline" className={urgencyColors[alert.urgency]}>
                      {alert.urgency}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{alert.siteName}</p>
                </div>
              </div>
            </Card>
          );
        })}
        {filteredAlerts.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No active alerts</p>
          </Card>
        )}
      </div>
    </div>
  );
}
