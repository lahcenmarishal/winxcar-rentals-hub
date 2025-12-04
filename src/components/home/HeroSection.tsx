import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, MapPin } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-primary-foreground space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-medium backdrop-blur-sm">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Location de véhicules au Maroc
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight text-white">
              Louez la voiture 
              <span className="text-accent block mt-2">de vos rêves</span>
            </h1>
            
            <p className="text-lg text-primary-foreground/80 max-w-lg leading-relaxed">
              Découvrez notre flotte de véhicules de qualité pour tous vos besoins. 
              Réservation simple, prix transparents, service exceptionnel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/catalogue">
                <Button variant="hero" className="group">
                  Voir nos véhicules
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="hero-outline">
                  Nous contacter
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-8">
              {[
                { icon: Shield, label: "Assurance incluse" },
                { icon: Clock, label: "Disponible 24/7" },
                { icon: MapPin, label: "4 agences au Maroc" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                  <Icon className="w-5 h-5 text-accent" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-float">
              <img
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80"
                alt="Voiture de luxe disponible à la location"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-card z-20 animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚗</span>
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">+500</p>
                  <p className="text-sm text-muted-foreground">Clients satisfaits</p>
                </div>
              </div>
            </div>
            {/* Price Badge */}
            <div className="absolute top-6 -right-4 bg-accent px-4 py-2 rounded-xl shadow-lg z-20 animate-scale-in" style={{ animationDelay: "0.5s" }}>
              <p className="text-sm font-medium text-white">À partir de</p>
              <p className="text-2xl font-bold text-white">250 DH/jour</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
