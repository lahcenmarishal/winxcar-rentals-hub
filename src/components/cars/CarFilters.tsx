import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { CategorieVoiture, BoiteVitesse } from "@/types/database";

interface CarFiltersProps {
  filters: {
    categorie?: CategorieVoiture;
    boite?: BoiteVitesse;
    prixMax?: number;
  };
  onFilterChange: (filters: CarFiltersProps["filters"]) => void;
}

const categories: { value: CategorieVoiture; label: string }[] = [
  { value: "economique", label: "Économique" },
  { value: "compacte", label: "Compacte" },
  { value: "berline", label: "Berline" },
  { value: "suv", label: "SUV" },
  { value: "luxe", label: "Luxe" },
  { value: "utilitaire", label: "Utilitaire" },
];

const boites: { value: BoiteVitesse; label: string }[] = [
  { value: "manuelle", label: "Manuelle" },
  { value: "automatique", label: "Automatique" },
];

export function CarFilters({ filters, onFilterChange }: CarFiltersProps) {
  const hasFilters = filters.categorie || filters.boite || filters.prixMax;

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-lg text-card-foreground">Filtres</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      {/* Catégorie */}
      <div className="space-y-2">
        <Label>Catégorie</Label>
        <Select
          value={filters.categorie || "all"}
          onValueChange={(value) => onFilterChange({ ...filters, categorie: value === "all" ? undefined : value as CategorieVoiture })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Boîte de vitesse */}
      <div className="space-y-2">
        <Label>Boîte de vitesse</Label>
        <Select
          value={filters.boite || "all"}
          onValueChange={(value) => onFilterChange({ ...filters, boite: value === "all" ? undefined : value as BoiteVitesse })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {boites.map((b) => (
              <SelectItem key={b.value} value={b.value}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Prix max */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Prix maximum</Label>
          <span className="text-sm font-medium text-accent">
            {filters.prixMax || 1000} DH/jour
          </span>
        </div>
        <Slider
          value={[filters.prixMax || 1000]}
          onValueChange={([value]) => onFilterChange({ ...filters, prixMax: value === 1000 ? undefined : value })}
          min={200}
          max={1000}
          step={50}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>200 DH</span>
          <span>1000 DH</span>
        </div>
      </div>
    </div>
  );
}
