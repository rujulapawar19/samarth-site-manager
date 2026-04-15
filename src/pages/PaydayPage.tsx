import { useState, useEffect } from "react";
import { MessageCircle, Check, Send, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/data/sampleData";
import { supabase } from "@/integrations/supabase/client";
import { useActivity } from "@/context/ActivityContext";
import { useSelectedSite } from "@/context/SelectedSiteContext";
import { toast } from "sonner";

interface DbWorker {
  id: string;
  name: string;
  role: string;
  wage_rate: number;
  days_present: number;
  amount_due: number;
  status: string;
  paid_at: string | null;
  site_id: string | null;
}

export default function PaydayPage() {
  const { addActivity } = useActivity();
  const { selectedSiteId } = useSelectedSite();
  const [workers, setWorkers] = useState<DbWorker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkers = async () => {
    const { data } = await supabase.from("workers").select("*").eq("wage_type", "daily").order("name");
    setWorkers((data || []).map(w => ({ ...w, wage_rate: Number(w.wage_rate), amount_due: Number(w.amount_due) })));
    setLoading(false);
  };

  useEffect(() => { fetchWorkers(); }, []);

  // Apply global site filter
  const filteredAllWorkers = selectedSiteId && selectedSiteId !== "all"
    ? workers.filter(w => w.site_id === selectedSiteId)
    : workers;

  const markPaid = async (id: string) => {
    const worker = workers.find(w => w.id === id);
    const now = new Date().toISOString();
    const { error } = await supabase.from("workers").update({ status: "Paid", paid_at: now }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    await fetchWorkers();
    toast.success("Marked as paid");
    if (worker) {
      addActivity({ text: `${worker.name} marked paid — ${formatINR(worker.amount_due)}`, icon: "payment" });
    }
  };

  const pendingWorkers = filteredAllWorkers.filter(w => w.status === "Pending");
  const paidWorkers = filteredAllWorkers.filter(w => w.status === "Paid");
  const totalRequired = pendingWorkers.reduce((s, w) => s + w.amount_due, 0);

  const sendWhatsApp = (worker: DbWorker) => {
    const msg = `${worker.name} — ${worker.days_present} days x ${formatINR(worker.wage_rate)} = ${formatINR(worker.amount_due)} — Samarth Developers Nashik`;
    toast.success(`WhatsApp slip sent to ${worker.name}`, { description: msg });
  };

  const sendAllSlips = () => {
    toast.success(`WhatsApp slips sent to all ${pendingWorkers.length} workers`);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="page-header">Payday</h2>
          <p className="text-sm text-muted-foreground">Weekly payment management</p>
        </div>
        <Button onClick={sendAllSlips} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-primary-foreground">
          <Send className="w-4 h-4 mr-1" /> Send All Slips
        </Button>
      </div>

      <Card className="p-5 bg-accent/10 border-accent/30">
        <p className="text-sm text-muted-foreground">Total cash required this week</p>
        <p className="text-3xl font-bold text-foreground">{formatINR(totalRequired)}</p>
        <p className="text-xs text-muted-foreground mt-1">{pendingWorkers.length} workers pending</p>
      </Card>

      {pendingWorkers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pending</h3>
          {pendingWorkers.map((worker) => (
            <Card key={worker.id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground">{worker.name}</p>
                    <Badge variant="outline" className="status-pending">Pending</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {worker.days_present} days × {formatINR(worker.wage_rate)} = <span className="font-semibold text-foreground">{formatINR(worker.amount_due)}</span>
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => sendWhatsApp(worker)}>
                    <MessageCircle className="w-3.5 h-3.5 mr-1" /> <span className="hidden sm:inline">WhatsApp</span><span className="sm:hidden">WA</span>
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
                    {worker.days_present} days × {formatINR(worker.wage_rate)} = <span className="font-semibold text-foreground">{formatINR(worker.amount_due)}</span>
                  </p>
                  {worker.paid_at && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">Paid on {new Date(worker.paid_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
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
