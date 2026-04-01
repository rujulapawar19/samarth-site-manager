import { useState } from "react";
import { Check, X, QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dailyWorkers, formatINR } from "@/data/sampleData";

interface AttendanceRecord {
  workerId: string;
  present: boolean;
  time: string | null;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(
    dailyWorkers.map((w, i) => ({
      workerId: w.id,
      present: i < 8, // first 8 already marked
      time: i < 8 ? `${7 + Math.floor(i / 3)}:${(15 + i * 7) % 60 < 10 ? "0" : ""}${(15 + i * 7) % 60} AM` : null,
    }))
  );

  const toggle = (id: string) => {
    setAttendance(prev =>
      prev.map(a =>
        a.workerId === id
          ? { ...a, present: !a.present, time: !a.present ? new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : null }
          : a
      )
    );
  };

  const markAll = () => {
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setAttendance(prev => prev.map(a => ({ ...a, present: true, time: now })));
  };

  const presentCount = attendance.filter(a => a.present).length;
  const totalWage = attendance
    .filter(a => a.present)
    .reduce((sum, a) => {
      const worker = dailyWorkers.find(w => w.id === a.workerId);
      return sum + (worker?.dailyRate || 0);
    }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-header">Attendance</h2>
          <p className="text-sm text-muted-foreground">Monday, 31 March 2026</p>
        </div>
        <Button onClick={markAll} className="bg-primary">
          <Check className="w-4 h-4 mr-1" /> Mark All Present
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {dailyWorkers.map((worker) => {
          const record = attendance.find(a => a.workerId === worker.id)!;
          return (
            <Card
              key={worker.id}
              className={`p-4 cursor-pointer transition-all ${
                record.present ? "border-emerald-300 bg-emerald-50/50" : "border-border"
              }`}
              onClick={() => toggle(worker.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">{worker.name}</p>
                  <p className="text-xs text-muted-foreground">{worker.role} — {formatINR(worker.dailyRate)}/day</p>
                  {record.time && (
                    <p className="text-[10px] text-muted-foreground mt-1">Marked at {record.time}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-muted-foreground/40" />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    record.present ? "bg-emerald-500" : "bg-muted"
                  }`}>
                    {record.present ? (
                      <Check className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Daily Total */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{presentCount} workers present today</p>
            <p className="text-xs text-muted-foreground">out of {dailyWorkers.length} daily workers</p>
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
