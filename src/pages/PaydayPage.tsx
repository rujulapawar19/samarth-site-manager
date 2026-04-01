import { useState } from "react";
import { MessageCircle, Check, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dailyWorkers as initialWorkers, formatINR } from "@/data/sampleData";
import { toast } from "sonner";

interface PaidRecord {
  paidAt: string;
}

export default function PaydayPage() {
  const [workers, setWorkers] = useState(
    initialWorkers.map(w => ({
      ...w,
      paidAt: w.status === "Paid" ? "28 Mar 2026, 4:30 PM" : null as string | null,
    }))
  );

  const markPaid = (id: string) => {
    const now = new Date().toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
    setWorkers(prev =>
      prev.map(w => w.id === id ? { ...w, status: "Paid" as const, paidAt: now } : w)
    );
    toast.success("Marked as paid");
  };

  const pendingWorkers = workers.filter(w => w.status === "Pending");
  const paidWorkers = workers.filter(w => w.status === "Paid");
  const totalRequired = pendingWorkers.reduce((s, w) => s + w.amountDue, 0);

  const sendWhatsApp = (worker: typeof workers[0]) => {
    const msg = `${worker.name} — ${worker.daysPresent} days x ${formatINR(worker.dailyRate)} = ${formatINR(worker.amountDue)} — Samarth Developers Nashik`;
    toast.success(`WhatsApp slip sent to ${worker.name}`, { description: msg });
  };

  const sendAllSlips = () => {
    toast.success(`WhatsApp slips sent to all ${pendingWorkers.length} workers`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-header">Payday</h2>
          <p className="text-sm text-muted-foreground">Week ending 4 April 2026</p>
        </div>
        <Button onClick={sendAllSlips} className="bg-emerald-600 hover:bg-emerald-700 text-primary-foreground">
          <Send className="w-4 h-4 mr-1" /> Send All Slips
        </Button>
      </div>

      {/* Total Required */}
      <Card className="p-5 bg-accent/10 border-accent/30">
        <p className="text-sm text-muted-foreground">Total cash required this week</p>
        <p className="text-3xl font-bold text-foreground">{formatINR(totalRequired)}</p>
        <p className="text-xs text-muted-foreground mt-1">{pendingWorkers.length} workers pending</p>
      </Card>

      {/* Pending Workers */}
      {pendingWorkers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pending</h3>
          {pendingWorkers.map((worker) => (
            <Card key={worker.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground">{worker.name}</p>
                    <Badge variant="outline" className="status-pending">Pending</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {worker.daysPresent} days × {formatINR(worker.dailyRate)} = <span className="font-semibold text-foreground">{formatINR(worker.amountDue)}</span>
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => sendWhatsApp(worker)}>
                    <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
                  </Button>
                  <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-primary-foreground" onClick={() => markPaid(worker.id)}>
                    <Check className="w-3.5 h-3.5 mr-1" /> Paid
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Paid Workers */}
      {paidWorkers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Paid ✓</h3>
          {paidWorkers.map((worker) => (
            <Card key={worker.id} className="p-4 opacity-60 border-emerald-200 bg-emerald-50/30">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground">{worker.name}</p>
                    <Badge variant="outline" className="status-paid">Paid</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {worker.daysPresent} days × {formatINR(worker.dailyRate)} = <span className="font-semibold text-foreground">{formatINR(worker.amountDue)}</span>
                  </p>
                  {worker.paidAt && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">Paid on {worker.paidAt}</p>
                  )}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => sendWhatsApp(worker)}>
                    <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
