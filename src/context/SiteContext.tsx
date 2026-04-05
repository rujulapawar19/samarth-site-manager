import { createContext, useContext, useState, ReactNode } from "react";

export interface Site {
  id: string;
  name: string;
  shortName: string;
  location: string;
  startDate: string;
  totalBudget: number;
}

interface SiteContextType {
  sites: Site[];
  addSite: (site: Omit<Site, "id">) => void;
}

const defaultSites: Site[] = [
  { id: "site-a", name: "Samarth Residency — Tower A", shortName: "Tower A", location: "Nashik", startDate: "2026-01-15", totalBudget: 4500000 },
  { id: "site-b", name: "Samarth Residency — Tower B", shortName: "Tower B", location: "Nashik", startDate: "2026-02-01", totalBudget: 3800000 },
  { id: "site-c", name: "Samarth Commerce Park", shortName: "Commerce Park", location: "Nashik", startDate: "2025-11-10", totalBudget: 2800000 },
];

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [sites, setSites] = useState<Site[]>(defaultSites);

  const addSite = (site: Omit<Site, "id">) => {
    const id = `site-${Date.now()}`;
    setSites(prev => [...prev, { ...site, id }]);
  };

  return (
    <SiteContext.Provider value={{ sites, addSite }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSites() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSites must be used within SiteProvider");
  return ctx;
}
