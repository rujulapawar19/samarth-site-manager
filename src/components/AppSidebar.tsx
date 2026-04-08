import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, CalendarCheck, Wallet, Package,
  Truck, Building2, FileText, TrendingUp, AlertTriangle, LogOut
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth, SUPERVISOR_ROUTES } from "@/context/AuthContext";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Labor", url: "/labor", icon: Users },
  { title: "Attendance", url: "/attendance", icon: CalendarCheck },
  { title: "Payday", url: "/payday", icon: Wallet },
  { title: "Materials", url: "/materials", icon: Package },
  { title: "New Delivery", url: "/new-delivery", icon: Truck },
  { title: "Suppliers", url: "/suppliers", icon: Building2 },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Finance", url: "/finance", icon: TrendingUp },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
];

export { navItems };

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const filteredItems = user?.role === "supervisor"
    ? navItems.filter(i => SUPERVISOR_ROUTES.includes(i.url))
    : navItems;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Building2 className="w-4 h-4 text-accent-foreground" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="font-bold text-sm text-sidebar-foreground">SiteSync</p>
            <p className="text-[10px] text-sidebar-foreground/60">Samarth Developers</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.url} className="gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-3 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
