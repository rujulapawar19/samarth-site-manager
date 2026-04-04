import { Link } from "react-router-dom";
import { Users, Clock, Package, IndianRupee, CalendarCheck, Truck, FileText, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dailyWorkers, monthlyStaff, materials, invoices, formatINR, formatINRLakhs } from "@/data/sampleData";
import { useActivity } from "@/context/ActivityContext";

const activityIcons = {
  attendance: CalendarCheck,
  delivery: Truck,
  payment: IndianRupee,
  alert: AlertTriangle,
};

export default function DashboardPage() {
  const { activities } = useActivity();
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
          {recentActivity.map((item, i) => {
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
