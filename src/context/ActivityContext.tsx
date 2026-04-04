import { createContext, useContext, useState, ReactNode } from "react";
import { recentActivity as initialActivity } from "@/data/sampleData";

export interface ActivityItem {
  text: string;
  time: string;
  icon: "attendance" | "delivery" | "payment" | "alert";
}

interface ActivityContextType {
  activities: ActivityItem[];
  addActivity: (item: Omit<ActivityItem, "time">) => void;
}

const ActivityContext = createContext<ActivityContextType | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityItem[]>([...initialActivity]);

  const addActivity = (item: Omit<ActivityItem, "time">) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " today";
    setActivities(prev => [{ ...item, time }, ...prev]);
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
