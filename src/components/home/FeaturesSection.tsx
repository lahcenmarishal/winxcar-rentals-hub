import { Car, CreditCard, Headphones, MapPin, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Car,
    title: "Flotte variée",
    description: "Des économiques aux SUV de luxe, trouvez le véhicule parfait pour votre voyage.",
  },
  {
    icon: CreditCard,
    title: "Paiement flexible",
    description: "Payez à la livraison ou en ligne. Devis gratuit et sans engagement.",
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Notre équipe est disponible jour et nuit pour vous assister.",
  },
  {
    icon: MapPin,
    title: "Livraison partout",
    description: "Récupérez votre véhicule à l'aéroport, à l'hôtel ou à l'adresse de votre choix.",
  },
  {
    icon: Shield,
    title: "Assurance complète",
    description: "Roulez l'esprit tranquille avec nos options d'assurance tous risques.",
  },
  {
    icon: Clock,
    title: "Réservation rapide",
    description: "Réservez en quelques clics et recevez une confirmation instantanée.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Pourquoi choisir <span className="text-accent">Winxcar</span> ?
          </h2>
          <p className="text-muted-foreground text-lg">
            Une expérience de location simple, transparente et adaptée à vos besoins.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card p-6 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent group-hover:shadow-glow transition-all duration-300">
                <feature.icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
