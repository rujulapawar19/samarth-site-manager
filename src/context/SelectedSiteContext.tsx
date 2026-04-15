import { createContext, useContext, useState, ReactNode } from "react";

export type SitePhase = "Planning" | "Foundation" | "Structural" | "Finishing";

export const PHASE_ROLES: Record<SitePhase, string[]> = {
  Planning: ["Architect", "Civil Engineer", "Structural Engineer", "Surveyor", "Project Manager", "Planning Coordinator"],
  Foundation: ["Site Engineer", "Supervisor", "Excavation Worker", "Mason", "Steel Fixer", "Machine Operator", "Safety Officer"],
  Structural: ["Site Engineer", "Supervisor", "Carpenter", "Concrete Worker", "Steel Fixer", "Crane Operator", "Quality Inspector"],
  Finishing: ["Site Engineer", "Electrician", "Plumber", "Painter", "Tile Worker", "Interior Worker", "Finishing Supervisor"],
};

export const PHASE_MATERIALS: Record<SitePhase, string[]> = {
  Planning: ["Design documents", "Survey tools"],
  Foundation: ["Cement", "Sand", "Aggregate", "Steel rods"],
  Structural: ["Concrete", "Bricks", "Blocks", "Steel", "Formwork"],
  Finishing: ["Paint", "Tiles", "Electrical wiring", "Wire", "Pipes", "Fittings"],
};

interface SelectedSiteContextType {
  selectedSiteId: string; // "all" or site UUID
  setSelectedSiteId: (id: string) => void;
}

const SelectedSiteContext = createContext<SelectedSiteContextType | null>(null);

export function SelectedSiteProvider({ children }: { children: ReactNode }) {
  const [selectedSiteId, setSelectedSiteIdState] = useState<string>(() => {
    return localStorage.getItem("sitesync_selected_site") || "";
  });

  const setSelectedSiteId = (id: string) => {
    setSelectedSiteIdState(id);
    localStorage.setItem("sitesync_selected_site", id);
  };

  return (
    <SelectedSiteContext.Provider value={{ selectedSiteId, setSelectedSiteId }}>
      {children}
    </SelectedSiteContext.Provider>
  );
}

export function useSelectedSite() {
  const ctx = useContext(SelectedSiteContext);
  if (!ctx) throw new Error("useSelectedSite must be used within SelectedSiteProvider");
  return ctx;
}
