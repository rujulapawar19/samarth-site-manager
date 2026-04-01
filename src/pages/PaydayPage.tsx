import { useState } from "react";
import { MessageCircle, Check, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dailyWorkers, formatINR } from "@/data/sampleData";
import { toast } from "sonner";

export default function PaydayPage() {
  const [paidWorkers, setPaidWorkers] = useState<Set<string>>(
    new Set(dailyWorkers.filter(w => w.status === "Paid").map(w => w.id))
  );

  const pendingWorkers = dailyWorkers.filter(w => !paidWorkers.has(w.id));
  const totalRequired = pendingWorkers.reduce((s, w) => s + w.amountDue, 0);

  const sendWhatsApp = (worker: typeof dailyWorkers[0]) => {
    const msg = `${worker.name} — ${worker.daysPresent} days x ${formatINR(worker.dailyRate)} = ${formatINR(worker.amountDue)} — Samarth Developers Nashik`;
    toast.success(`WhatsApp slip sent to ${worker.name}`, { description: msg });
  };

  const markPaid = (id: string) => {
    setPaidWorkers(prev => new Set([...prev, id]));
    toast.success("Marked as paid");
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

      {/* Worker List */}
      <div className="space-y-2">
        {dailyWorkers.map((worker) => {
          const isPaid = paidWorkers.has(worker.id);
          return (
            <Card key={worker.id} className={`p-4 ${isPaid ? "opacity-60" : ""}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground">{worker.name}</p>
                    <Badge variant="outline" className={isPaid ? "status-paid" : "status-pending"}>
                      {isPaid ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {worker.daysPresent} days × {formatINR(worker.dailyRate)} = <span className="font-semibold text-foreground">{formatINR(worker.amountDue)}</span>
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => sendWhatsApp(worker)}
                  >
                    <MessageCircle className="w-3.5 h-3.5 mr-1" />
                    WhatsApp
                  </Button>
                  {!isPaid && (
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-primary-foreground"
                      onClick={() => markPaid(worker.id)}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Paid
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
