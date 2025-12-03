import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Voiture, CategorieVoiture, BoiteVitesse } from "@/types/database";

interface VoituresFilters {
  categorie?: CategorieVoiture;
  boite?: BoiteVitesse;
  prixMin?: number;
  prixMax?: number;
  ville?: string;
}

export function useVoitures(filters?: VoituresFilters) {
  return useQuery({
    queryKey: ["voitures", filters],
    queryFn: async () => {
      let query = supabase
        .from("voitures")
        .select("*, agences(ville)")
        .eq("disponible", true)
        .order("prix_jour", { ascending: true });

      if (filters?.categorie) {
        query = query.eq("categorie", filters.categorie);
      }
      if (filters?.boite) {
        query = query.eq("boite", filters.boite);
      }
      if (filters?.prixMin) {
        query = query.gte("prix_jour", filters.prixMin);
      }
      if (filters?.prixMax) {
        query = query.lte("prix_jour", filters.prixMax);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as (Voiture & { agences: { ville: string } | null })[];
    },
  });
}

export function useVoiture(id: string) {
  return useQuery({
    queryKey: ["voiture", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("voitures")
        .select("*, agences(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
