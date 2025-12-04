import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 text-white">
            Prêt à prendre la route ?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
            Réservez votre véhicule en quelques minutes et profitez de nos tarifs compétitifs. 
            Livraison gratuite dans toutes les grandes villes du Maroc.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/catalogue">
              <Button variant="hero" size="xl" className="group">
                Réserver maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:+212522123456">
              <Button variant="hero-outline" size="xl" className="group">
                <Phone className="w-5 h-5" />
                Appelez-nous
              </Button>
            </a>
          </div>

          <p className="mt-8 text-sm text-primary-foreground/60">
            Assistance 24h/24 • Annulation gratuite • Kilométrage illimité
          </p>
        </div>
      </div>
    </section>
  );
}
