import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Users, 
  Settings,
  LogOut,
  ChevronLeft,
  Image,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/voitures", label: "Véhicules", icon: Car },
  { href: "/admin/categories", label: "Catégories", icon: Image },
  { href: "/admin/blogs", label: "Blog", icon: FileText },
  { href: "/admin/reservations", label: "Réservations", icon: Calendar },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  isMobile?: boolean;
}

export function AdminSidebar({ collapsed, onToggle, onNavigate, isMobile }: AdminSidebarProps) {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const handleNavClick = () => {
    if (onNavigate) onNavigate();
  };

  const handleSignOut = () => {
    signOut();
    if (onNavigate) onNavigate();
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
        isMobile ? "w-full" : "fixed left-0 top-0 z-50",
        !isMobile && (collapsed ? "w-16" : "w-64")
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {(!collapsed || isMobile) && (
          <Link to="/" className="flex items-center gap-2" onClick={handleNavClick}>
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Car className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-heading font-bold text-lg">Winxcar</span>
          </Link>
        )}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className={cn(collapsed && "mx-auto")}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/admin" && location.pathname.startsWith(item.href));
          return (
            <Link key={item.href} to={item.href} onClick={handleNavClick}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  !isMobile && collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {(isMobile || !collapsed) && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        {(isMobile || !collapsed) && user && (
          <p className="text-xs text-muted-foreground truncate mb-2">
            {user.email}
          </p>
        )}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            "w-full justify-start gap-3 text-destructive hover:text-destructive", 
            !isMobile && collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {(isMobile || !collapsed) && <span>Déconnexion</span>}
        </Button>
      </div>
    </aside>
  );
}
