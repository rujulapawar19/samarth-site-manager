import { Link, useLocation } from "react-router-dom";
import { navItems } from "./AppSidebar";

export function MobileNav() {
  const location = useLocation();
  // Show only 5 key items on mobile
  const mobileItems = navItems.filter(i =>
    ["Dashboard", "Labor", "Materials", "Invoices", "Alerts"].includes(i.title)
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16">
        {mobileItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
