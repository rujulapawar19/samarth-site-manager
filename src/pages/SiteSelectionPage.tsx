import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Loader2, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSites } from "@/context/SiteContext";
import { useSelectedSite } from "@/context/SelectedSiteContext";
import { useAuth } from "@/context/AuthContext";

export default function SiteSelectionPage() {
  const navigate = useNavigate();
  const { sites, loading } = useSites();
  const { setSelectedSiteId } = useSelectedSite();
  const { user } = useAuth();

  if (!user) {
    navigate("/");
    return null;
  }

  const handleSelect = (siteId: string) => {
    setSelectedSiteId(siteId);
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-accent mx-auto mb-3 flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">Select Site</h1>
          <p className="text-primary-foreground/60 text-xs mt-0.5">Welcome, {user.name}. Choose a site to manage.</p>
        </div>

        <div className="space-y-3">
          <Card
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-2 border-transparent hover:border-primary/30"
            onClick={() => handleSelect("all")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">All Sites</p>
                <p className="text-xs text-muted-foreground">View combined data across all sites</p>
              </div>
            </div>
          </Card>

          {sites.map((site) => (
            <Card
              key={site.id}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-2 border-transparent hover:border-primary/30"
              onClick={() => handleSelect(site.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{site.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {site.location}
                  </p>
                </div>
                {site.phase && (
                  <Badge variant="outline" className="text-[10px] shrink-0">{site.phase}</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
