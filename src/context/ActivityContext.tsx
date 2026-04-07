import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ActivityItem {
  id?: string;
  text: string;
  time: string;
  icon: "attendance" | "delivery" | "payment" | "alert";
}

interface ActivityContextType {
  activities: ActivityItem[];
  addActivity: (item: Omit<ActivityItem, "time" | "id">) => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | null>(null);

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const fetchActivities = async () => {
    const { data } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) {
      setActivities(data.map(a => ({
        id: a.id,
        text: a.text,
        icon: a.icon as ActivityItem["icon"],
        time: timeAgo(a.created_at),
      })));
    }
  };

  useEffect(() => { fetchActivities(); }, []);

  const addActivity = async (item: Omit<ActivityItem, "time" | "id">) => {
    await supabase.from("activities").insert({ text: item.text, icon: item.icon });
    await fetchActivities();
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider");
  return ctx;
}
