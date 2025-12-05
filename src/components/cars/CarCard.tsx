import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Fuel, Settings2, Snowflake } from "lucide-react";
import type { Voiture } from "@/types/database";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";

interface CarCardProps {
  voiture: Voiture & { agences?: { ville: string } | null };
  className?: string;
}

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
  automatique: "Auto",
};

const carburantLabels: Record<string, string> = {
  essence: "Essence",
  diesel: "Diesel",
  hybride: "Hybride",
  electrique: "Électrique",
};

export function CarCard({ voiture, className }: CarCardProps) {
  const { formatPrice } = useCurrency();

  return (
    <div className={cn("group bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden", className)}>
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={voiture.image_url || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400"}
          alt={`${voiture.marque} ${voiture.modele}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
          {categorieLabels[voiture.categorie]}
        </Badge>
        {voiture.agences?.ville && (
          <Badge variant="secondary" className="absolute top-3 right-3">
            {voiture.agences.ville}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-heading font-semibold text-lg text-card-foreground">
            {voiture.marque} {voiture.modele}
          </h3>
          {voiture.description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {voiture.description}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{voiture.places} places</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings2 className="w-4 h-4" />
            <span>{boiteLabels[voiture.boite]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-4 h-4" />
            <span>{carburantLabels[voiture.carburant]}</span>
          </div>
          {voiture.climatisation && (
            <div className="flex items-center gap-1.5">
              <Snowflake className="w-4 h-4" />
              <span>Clim</span>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-2xl font-bold text-accent">{formatPrice(voiture.prix_jour)}</p>
            <p className="text-xs text-muted-foreground">par jour</p>
          </div>
          <Link to={`/voiture/${voiture.id}`}>
            <Button variant="accent" size="sm">
              Voir détails
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
