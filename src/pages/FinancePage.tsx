import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { formatINR } from "@/data/sampleData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import SiteFilter from "@/components/SiteFilter";
import { useSites } from "@/context/SiteContext";
import { supabase } from "@/integrations/supabase/client";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-2 shadow-md text-xs">
        <p className="font-medium">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {formatINR(p.value)}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinancePage() {
  const { sites } = useSites();
  const [siteFilter, setSiteFilter] = useState("all");
  const [budgetData, setBudgetData] = useState<{ site: string; budget: number; actual: number; siteId: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: invoices } = await supabase.from("invoices").select("amount, site_id");
      const spentBySite: Record<string, number> = {};
      for (const inv of invoices || []) {
        if (inv.site_id) spentBySite[inv.site_id] = (spentBySite[inv.site_id] || 0) + Number(inv.amount);
      }

      setBudgetData(sites.map(s => ({
        site: s.short_name,
        siteId: s.id,
        budget: s.total_budget,
        actual: spentBySite[s.id] || 0,
      })));
      setLoading(false);
    };
    if (sites.length > 0) fetchData();
  }, [sites]);

  const filteredBudgets = siteFilter === "all" ? budgetData : budgetData.filter(b => b.siteId === siteFilter);
  const totalBudget = filteredBudgets.reduce((s, b) => s + b.budget, 0);
  const totalActual = filteredBudgets.reduce((s, b) => s + b.actual, 0);

  const expenseBreakdown = [
    { category: "Labor — Daily", amount: 750000, color: "#1B3A6B" },
    { category: "Labor — Monthly", amount: 380000, color: "#2D5AA0" },
    { category: "Cement & Steel", amount: 520000, color: "#FF6B35" },
    { category: "Bricks & Sand", amount: 280000, color: "#FFA366" },
    { category: "Electrical & Plumbing", amount: 145000, color: "#4A90D9" },
    { category: "Other Materials", amount: 95000, color: "#7FB3E0" },
  ];

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="page-header">Finance Dashboard</h2>
          <p className="text-sm text-muted-foreground">Budget & Spending Overview</p>
        </div>
        <SiteFilter value={siteFilter} onChange={setSiteFilter} />
      </div>

      <Card className="p-4 bg-accent/10 border-accent/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Budget Summary</p>
          <p className="text-sm text-muted-foreground">
            Total Budget: {formatINR(totalBudget)} | Total Spent: {formatINR(totalActual)} | Remaining: {formatINR(totalBudget - totalActual)}
          </p>
        </div>
      </Card>

      <Card className="p-3 sm:p-5">
        <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">Budget vs Actual — By Site</h3>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredBudgets} barGap={4}>
              <XAxis dataKey="site" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="budget" fill="#1B3A6B" name="Budget" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#FF6B35" name="Actual" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-3 sm:p-5">
        <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">Monthly Expense Breakdown</h3>
        <div className="h-48 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={expenseBreakdown} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                {expenseBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => formatINR(val)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
