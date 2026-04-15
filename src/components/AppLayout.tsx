import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, LogOut, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, SUPERVISOR_ROUTES } from "@/context/AuthContext";
import { useSelectedSite } from "@/context/SelectedSiteContext";
import { useSites } from "@/context/SiteContext";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { selectedSiteId } = useSelectedSite();
  const { sites } = useSites();
  const selectedSite = selectedSiteId && selectedSiteId !== "all" ? sites.find(s => s.id === selectedSiteId) : null;
  const showBack = location.pathname !== "/dashboard";

  if (!user) return <Navigate to="/" replace />;
  if (!selectedSiteId) return <Navigate to="/select-site" replace />;

  // Supervisor route restriction
  if (user.role === "supervisor" && !SUPERVISOR_ROUTES.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border bg-card px-3 md:px-4 sticky top-0 z-40">
            {showBack && (
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <SidebarTrigger className="hidden md:flex" />
            <div className="md:hidden">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">S</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-foreground truncate">Samarth Developers</h1>
              <p className="text-[10px] text-muted-foreground hidden sm:block">Nashik, Maharashtra</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => navigate("/select-site")} title="Switch site">
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{selectedSite ? selectedSite.short_name : "All Sites"}</span>
              </Button>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium text-foreground">{user.name}</span>
                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded capitalize">{user.role}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout} title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-3 md:p-6 pb-20 md:pb-6 overflow-auto">
            <Outlet />
          </main>
        </div>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
