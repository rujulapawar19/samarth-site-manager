import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type SitePhase = "Planning" | "Foundation" | "Structural" | "Finishing";

export interface Site {
  id: string;
  name: string;
  short_name: string;
  location: string;
  start_date: string;
  total_budget: number;
  phase: SitePhase;
}

interface SiteContextType {
  sites: Site[];
  loading: boolean;
  addSite: (site: Omit<Site, "id">) => Promise<void>;
  refreshSites: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSites = async () => {
    const { data, error } = await supabase.from("sites").select("*").order("name");
    if (error) {
      console.error("Failed to load sites:", error);
    } else {
      setSites((data || []).map(s => ({
        id: s.id,
        name: s.name,
        short_name: s.short_name,
        location: s.location,
        start_date: s.start_date,
        total_budget: Number(s.total_budget),
        phase: (s as any).phase || "Foundation",
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchSites(); }, []);

  const addSite = async (site: Omit<Site, "id">) => {
    const { error } = await supabase.from("sites").insert({
      name: site.name,
      short_name: site.short_name,
      location: site.location,
      start_date: site.start_date,
      total_budget: site.total_budget,
    });
    if (error) {
      toast.error("Failed to add site");
      console.error(error);
    } else {
      await fetchSites();
    }
  };

  return (
    <SiteContext.Provider value={{ sites, loading, addSite, refreshSites: fetchSites }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSites() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSites must be used within SiteProvider");
  return ctx;
}
