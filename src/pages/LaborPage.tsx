import { useState } from "react";
import { Plus, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dailyWorkers, monthlyStaff, formatINR } from "@/data/sampleData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function LaborPage() {
  const [showPayday, setShowPayday] = useState(false);
  const totalPending = dailyWorkers.filter(w => w.status === "Pending").reduce((s, w) => s + w.amountDue, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-header">Labor Management</h2>
          <p className="text-sm text-muted-foreground">Manage daily and monthly workers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Worker
          </Button>
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
                  <p>{dailyWorkers.filter(w => w.status === "Pending").length} workers with pending payments</p>
                  <p>{dailyWorkers.filter(w => w.status === "Paid").length} workers already paid</p>
                </div>
                <Button className="w-full">Proceed to Payday</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily Workers (200)</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Staff (30)</TabsTrigger>
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
                  </tr>
                </thead>
                <tbody>
                  {dailyWorkers.map((w) => (
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
                  {monthlyStaff.map((s) => (
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
