import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CarCard } from "@/components/cars/CarCard";
import { CarFilters } from "@/components/cars/CarFilters";
import { useVoitures } from "@/hooks/useVoitures";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { CategorieVoiture, BoiteVitesse } from "@/types/database";

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<{
    categorie?: CategorieVoiture;
    boite?: BoiteVitesse;
    prixMax?: number;
  }>({});

  // Initialize filters from URL
  useEffect(() => {
    const categorie = searchParams.get("categorie") as CategorieVoiture | null;
    if (categorie) {
      setFilters((prev) => ({ ...prev, categorie }));
    }
  }, [searchParams]);

  const { data: voitures, isLoading } = useVoitures(filters);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Update URL
    const params = new URLSearchParams();
    if (newFilters.categorie) params.set("categorie", newFilters.categorie);
    setSearchParams(params);
  };

  const FilterContent = () => (
    <CarFilters filters={filters} onFilterChange={handleFilterChange} />
  );

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary/30 py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Nos Véhicules
          </h1>
          <p className="text-muted-foreground text-lg">
            Trouvez le véhicule parfait pour votre prochaine aventure.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container">
          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24">
                <FilterContent />
              </div>
            </aside>

            {/* Cars Grid */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer les véhicules
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Results count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {isLoading ? "Chargement..." : `${voitures?.length || 0} véhicules trouvés`}
                </p>
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-card rounded-2xl overflow-hidden">
                      <Skeleton className="aspect-[16/10]" />
                      <div className="p-5 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex gap-3">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex justify-between pt-4">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-9 w-28" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cars */}
              {!isLoading && voitures && voitures.length > 0 && (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {voitures.map((voiture) => (
                    <CarCard key={voiture.id} voiture={voiture} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && (!voitures || voitures.length === 0) && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-2">Aucun véhicule trouvé</h3>
                  <p className="text-muted-foreground mb-4">
                    Essayez de modifier vos filtres pour voir plus de résultats.
                  </p>
                  <Button variant="outline" onClick={() => handleFilterChange({})}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
