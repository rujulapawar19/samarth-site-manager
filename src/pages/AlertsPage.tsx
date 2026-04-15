import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, IndianRupee } from "lucide-react";
import { alerts } from "@/data/sampleData";
import { useSelectedSite } from "@/context/SelectedSiteContext";
import { useSites } from "@/context/SiteContext";

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

// Map sample data site IDs to real site short names for filtering
const SAMPLE_SITE_MAP: Record<string, string> = {
  "site-a": "Tower A",
  "site-b": "Tower B",
  "site-c": "Commerce Park",
};

export default function AlertsPage() {
  const { selectedSiteId } = useSelectedSite();
  const { sites } = useSites();

  // Filter alerts by selected site
  const filteredAlerts = selectedSiteId && selectedSiteId !== "all"
    ? alerts.filter(a => {
        const site = sites.find(s => s.id === selectedSiteId);
        if (!site) return true;
        // Match by short_name against the sample data site names
        const sampleSiteName = SAMPLE_SITE_MAP[a.site];
        return sampleSiteName && site.short_name.toLowerCase().includes(sampleSiteName.toLowerCase()) ||
               site.short_name.toLowerCase() === sampleSiteName?.toLowerCase();
      })
    : alerts;

  const highCount = filteredAlerts.filter(a => a.urgency === "high").length;

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
                  <p className="text-xs text-muted-foreground/60 mt-1">{new Date(alert.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
