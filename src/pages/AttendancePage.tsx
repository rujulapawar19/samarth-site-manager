import { useState, useEffect } from "react";
import { Check, X, QrCode, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/data/sampleData";
import { useActivity } from "@/context/ActivityContext";
import { useSites } from "@/context/SiteContext";
import SiteFilter from "@/components/SiteFilter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DbWorker {
  id: string;
  name: string;
  role: string;
  wage_rate: number;
  site_id: string | null;
}

interface AttendanceRecord {
  workerId: string;
  present: boolean;
  time: string | null;
  dbId: string | null;
}

export default function AttendancePage() {
  const { addActivity } = useActivity();
  const { sites } = useSites();
  const [siteFilter, setSiteFilter] = useState("all");
  const [workers, setWorkers] = useState<DbWorker[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  const fetchData = async () => {
    const { data: wData } = await supabase.from("workers").select("id, name, role, wage_rate, site_id").eq("wage_type", "daily").order("name");
    const dailyWorkers = (wData || []).map(w => ({ ...w, wage_rate: Number(w.wage_rate) }));
    setWorkers(dailyWorkers);

    const { data: aData } = await supabase.from("attendance").select("*").eq("date", today);
    const attendanceMap = new Map((aData || []).map(a => [a.worker_id, a]));

    setAttendance(dailyWorkers.map(w => {
      const rec = attendanceMap.get(w.id);
      return {
        workerId: w.id,
        present: rec?.present || false,
        time: rec?.check_in_time || null,
        dbId: rec?.id || null,
      };
    }));
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filteredWorkers = siteFilter === "all" ? workers : workers.filter(w => w.site_id === siteFilter);

  const toggle = async (id: string) => {
    const worker = workers.find(w => w.id === id);
    const record = attendance.find(a => a.workerId === id);
    if (!record || !worker) return;

    const willBePresent = !record.present;
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    if (record.dbId) {
      await supabase.from("attendance").update({
        present: willBePresent,
        check_in_time: willBePresent ? now : null,
      }).eq("id", record.dbId);
    } else {
      const { data } = await supabase.from("attendance").insert({
        worker_id: id,
        date: today,
        present: willBePresent,
        check_in_time: willBePresent ? now : null,
        site_id: worker.site_id,
      }).select("id").single();
      if (data) {
        setAttendance(prev => prev.map(a => a.workerId === id ? { ...a, dbId: data.id } : a));
      }
    }

    setAttendance(prev =>
      prev.map(a => a.workerId === id ? { ...a, present: willBePresent, time: willBePresent ? now : null } : a)
    );

    if (willBePresent) {
      const site = sites.find(s => s.id === worker.site_id);
      addActivity({ text: `${worker.name} marked present at ${site?.short_name || "site"}`, icon: "attendance" });
    }
  };

  const markAll = async () => {
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const workerIds = new Set(filteredWorkers.map(w => w.id));

    for (const w of filteredWorkers) {
      const rec = attendance.find(a => a.workerId === w.id);
      if (rec?.present) continue;
      if (rec?.dbId) {
        await supabase.from("attendance").update({ present: true, check_in_time: now }).eq("id", rec.dbId);
      } else {
        await supabase.from("attendance").insert({
          worker_id: w.id, date: today, present: true, check_in_time: now, site_id: w.site_id,
        });
      }
    }

    setAttendance(prev => prev.map(a => workerIds.has(a.workerId) ? { ...a, present: true, time: now } : a));
    toast.success("All workers marked present");
  };

  const presentCount = filteredWorkers.filter(w => attendance.find(a => a.workerId === w.id)?.present).length;
  const totalWage = filteredWorkers
    .filter(w => attendance.find(a => a.workerId === w.id)?.present)
    .reduce((sum, w) => sum + w.wage_rate, 0);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="page-header">Attendance</h2>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <div className="flex gap-2">
          <SiteFilter value={siteFilter} onChange={setSiteFilter} />
          <Button onClick={markAll} className="bg-primary">
            <Check className="w-4 h-4 mr-1" /> Mark All Present
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredWorkers.map((worker) => {
          const record = attendance.find(a => a.workerId === worker.id);
          const isPresent = record?.present || false;
          return (
            <Card
              key={worker.id}
              className={`p-4 cursor-pointer transition-all ${isPresent ? "border-emerald-300 bg-emerald-50/50" : "border-border"}`}
              onClick={() => toggle(worker.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">{worker.name}</p>
                  <p className="text-xs text-muted-foreground">{worker.role} — {formatINR(worker.wage_rate)}/day</p>
                  {record?.time && (
                    <p className="text-[10px] text-muted-foreground mt-1">Marked at {record.time}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-muted-foreground/40" />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPresent ? "bg-emerald-500" : "bg-muted"}`}>
                    {isPresent ? <Check className="w-4 h-4 text-primary-foreground" /> : <X className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{presentCount} workers present today</p>
            <p className="text-xs text-muted-foreground">out of {filteredWorkers.length} daily workers</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">{formatINR(totalWage)}</p>
            <p className="text-xs text-muted-foreground">Total wage for today</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
