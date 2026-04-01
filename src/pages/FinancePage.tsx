import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { financeData, formatINR } from "@/data/sampleData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

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
  const totalBudget = financeData.budgets.reduce((s, b) => s + b.budget, 0);
  const totalActual = financeData.budgets.reduce((s, b) => s + b.actual, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="page-header">Finance Dashboard</h2>
        <p className="text-sm text-muted-foreground">March 2026 Overview</p>
      </div>

      {/* Budget Forecast */}
      <Card className="p-4 bg-accent/10 border-accent/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Budget Forecast</p>
          <p className="text-sm text-muted-foreground">
            At current rate, project completion cost will be {formatINR(totalActual * 3.2)} vs budgeted {formatINR(totalBudget * 3)}. Tower A is 12% over budget.
          </p>
        </div>
      </Card>

      {/* Budget vs Actual */}
      <Card className="p-5">
        <h3 className="font-semibold text-foreground mb-4">Budget vs Actual — By Site</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financeData.budgets} barGap={4}>
              <XAxis dataKey="site" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="budget" fill="#1B3A6B" name="Budget" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#FF6B35" name="Actual" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Payments */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Weekly Payments</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData.weeklyPayments}>
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="workers" fill="#1B3A6B" name="Workers" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="suppliers" fill="#4A90D9" name="Suppliers" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Breakdown */}
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-4">Monthly Expense Breakdown</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financeData.expenseBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                >
                  {financeData.expenseBreakdown.map((entry, i) => (
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
    </div>
  );
}
