import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Car, Phone, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Nos Véhicules" },
  { href: "/a-propos", label: "À Propos" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <nav className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow duration-300">
            <Car className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl text-foreground">
            Winx<span className="text-primary">car</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Button
                variant={location.pathname === link.href ? "nav-active" : "nav"}
                size="sm"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+212522123456" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="w-4 h-4" />
            <span>+212 522 123 456</span>
          </a>
          
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          )}
          
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Connexion
              </Button>
            </Link>
          )}
          
          <Link to="/catalogue">
            <Button variant="default" size="default">
              Réserver
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          aria-label="Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div className="container py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "px-4 py-3 rounded-lg font-medium transition-colors",
                location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
          
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-lg font-medium transition-colors hover:bg-secondary flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Admin
            </Link>
          )}
          
          {user ? (
            <button
              onClick={() => { signOut(); setIsOpen(false); }}
              className="px-4 py-3 rounded-lg font-medium transition-colors hover:bg-secondary flex items-center gap-2 text-left"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-lg font-medium transition-colors hover:bg-secondary flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Connexion
            </Link>
          )}
          
          <div className="mt-4 pt-4 border-t border-border">
            <Link to="/catalogue" onClick={() => setIsOpen(false)}>
              <Button variant="default" className="w-full">
                Réserver Maintenant
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
