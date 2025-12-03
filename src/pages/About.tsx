import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Users, Award, MapPin, ArrowRight } from "lucide-react";

const stats = [
  { value: "500+", label: "Clients satisfaits" },
  { value: "50+", label: "Véhicules disponibles" },
  { value: "4", label: "Agences au Maroc" },
  { value: "24/7", label: "Support client" },
];

const values = [
  {
    icon: Shield,
    title: "Fiabilité",
    description: "Des véhicules entretenus régulièrement et une assurance complète pour votre tranquillité.",
  },
  {
    icon: Users,
    title: "Service client",
    description: "Une équipe dédiée à votre satisfaction, disponible 24h/24 pour répondre à vos besoins.",
  },
  {
    icon: Award,
    title: "Qualité",
    description: "Une flotte moderne de véhicules premium pour une expérience de conduite exceptionnelle.",
  },
  {
    icon: MapPin,
    title: "Proximité",
    description: "4 agences stratégiquement situées dans les principales villes du Maroc.",
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              À propos de <span className="text-accent">Winxcar</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Depuis notre création, Winxcar s'engage à offrir une expérience de location de véhicules 
              exceptionnelle au Maroc. Notre mission : rendre la mobilité accessible, simple et agréable.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-heading font-bold text-accent mb-1">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-6">
                Notre histoire
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Fondée avec la vision de révolutionner la location de voitures au Maroc, 
                  Winxcar est née de la passion de proposer un service de qualité à des prix justes.
                </p>
                <p>
                  Aujourd'hui, nous sommes fiers de servir des centaines de clients chaque mois, 
                  qu'il s'agisse de touristes découvrant les merveilles du Maroc ou de professionnels 
                  ayant besoin d'une solution de mobilité flexible.
                </p>
                <p>
                  Notre engagement envers l'excellence nous pousse à améliorer continuellement 
                  nos services, notre flotte et notre présence à travers le royaume.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1449965408869-ebd3fee82830?w=600&q=80"
                alt="Route au Maroc"
                className="rounded-2xl shadow-card"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <p className="text-3xl font-heading font-bold">+10 ans</p>
                <p className="text-sm opacity-90">d'expérience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Nos valeurs
            </h2>
            <p className="text-muted-foreground">
              Les principes qui guident chacune de nos actions au quotidien.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-card p-6 rounded-2xl shadow-soft text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
            Prêt à nous faire confiance ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Découvrez notre catalogue de véhicules et réservez en quelques clics.
          </p>
          <Link to="/catalogue">
            <Button variant="accent" size="lg">
              Voir nos véhicules
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
