import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useVoiture } from "@/hooks/useVoitures";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/hooks/useCurrency";
import { 
  ArrowLeft, Users, Fuel, Settings2, Snowflake, 
  DoorOpen, Calendar, MapPin, Check 
} from "lucide-react";

const categorieLabels: Record<string, string> = {
  economique: "Économique",
  compacte: "Compacte",
  berline: "Berline",
  suv: "SUV",
  luxe: "Luxe",
  utilitaire: "Utilitaire",
};

const boiteLabels: Record<string, string> = {
  manuelle: "Manuelle",
  automatique: "Automatique",
};

const carburantLabels: Record<string, string> = {
  essence: "Essence",
  diesel: "Diesel",
  hybride: "Hybride",
  electrique: "Électrique",
};

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: voiture, isLoading, error } = useVoiture(id || "");
  const { formatPrice } = useCurrency();

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-[4/3] rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !voiture) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Véhicule non trouvé</h1>
          <p className="text-muted-foreground mb-6">Ce véhicule n'existe pas ou n'est plus disponible.</p>
          <Link to="/catalogue">
            <Button variant="accent">Retour au catalogue</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const features = [
    { icon: Users, label: "Places", value: `${voiture.places} places` },
    { icon: DoorOpen, label: "Portes", value: `${voiture.portes} portes` },
    { icon: Settings2, label: "Boîte", value: boiteLabels[voiture.boite] },
    { icon: Fuel, label: "Carburant", value: carburantLabels[voiture.carburant] },
    { icon: Snowflake, label: "Climatisation", value: voiture.climatisation ? "Oui" : "Non" },
  ];

  return (
    <Layout>
      <div className="container py-8">
        {/* Back button */}
        <Link to="/catalogue" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
              <img
                src={voiture.image_url || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"}
                alt={`${voiture.marque} ${voiture.modele}`}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm">
                {categorieLabels[voiture.categorie]}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
                {voiture.marque} {voiture.modele}
              </h1>
              {voiture.agences && (
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Disponible à {voiture.agences.ville}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="bg-secondary/50 rounded-xl p-5">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-accent">{formatPrice(voiture.prix_jour)}</span>
                <span className="text-muted-foreground">/ jour</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Kilométrage illimité • Assurance de base incluse
              </p>
            </div>

            {/* Description */}
            {voiture.description && (
              <div>
                <h3 className="font-heading font-semibold text-lg mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{voiture.description}</p>
              </div>
            )}

            {/* Features grid */}
            <div>
              <h3 className="font-heading font-semibold text-lg mb-3">Caractéristiques</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {features.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-card rounded-xl p-3 border border-border">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{label}</span>
                    </div>
                    <p className="font-medium text-card-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Included */}
            <div>
              <h3 className="font-heading font-semibold text-lg mb-3">Inclus dans la location</h3>
              <ul className="grid grid-cols-2 gap-2">
                {["Assurance de base", "Kilométrage illimité", "Assistance 24h/24", "Annulation gratuite"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-winx-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link to={`/reservation/${voiture.id}`} className="flex-1">
                <Button variant="accent" size="lg" className="w-full">
                  <Calendar className="w-5 h-5 mr-2" />
                  Réserver maintenant
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Demander un devis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
