import { Link, useLocation } from "react-router-dom";
import { navItems } from "./AppSidebar";
import { useAuth, SUPERVISOR_ROUTES } from "@/context/AuthContext";

export function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();

  const allMobile = ["Dashboard", "Labor", "Materials", "Invoices", "Alerts"];
  const supervisorMobile = ["Dashboard", "Attendance", "Materials", "New Delivery"];

  const mobileTitles = user?.role === "supervisor" ? supervisorMobile : allMobile;
  const mobileItems = navItems.filter(i => mobileTitles.includes(i.title));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex justify-around items-center h-14">
        {mobileItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center gap-0.5 px-1 py-1 text-[10px] font-medium transition-colors min-w-0 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
