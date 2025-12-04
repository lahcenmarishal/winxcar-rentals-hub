import { Link } from "react-router-dom";
import { Car, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Car className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="font-heading font-bold text-xl">
                Winx<span className="text-white">car</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Votre partenaire de confiance pour la location de véhicules au Maroc. 
              Qualité, fiabilité et service client d'exception.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-white">Liens Rapides</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Accueil" },
                { href: "/catalogue", label: "Nos Véhicules" },
                { href: "/a-propos", label: "À Propos" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-white">Nos Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Location courte durée</li>
              <li>Location longue durée</li>
              <li>Véhicules avec chauffeur</li>
              <li>Transferts aéroport</li>
              <li>Location pour entreprises</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span>123 Boulevard Mohammed V, Casablanca, Maroc</span>
              </li>
              <li>
                <a href="tel:+212522123456" className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-white" />
                  <span>+212 522 123 456</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@winxcar.ma" className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-white" />
                  <span>contact@winxcar.ma</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Winxcar. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <a href="#" className="hover:text-white transition-colors">Conditions générales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
