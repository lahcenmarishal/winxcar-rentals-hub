import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCarReservations(voitureId: string) {
  return useQuery({
    queryKey: ["car-reservations", voitureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("date_debut, date_fin")
        .eq("voiture_id", voitureId)
        .in("statut", ["en_attente", "confirmee", "en_cours"]);
      
      if (error) throw error;
      return data;
    },
    enabled: !!voitureId,
  });
}

export function useCheckAvailability() {
  return async (voitureId: string, dateDebut: string, dateFin: string) => {
    const { data, error } = await supabase
      .rpc("check_voiture_disponibilite", {
        p_voiture_id: voitureId,
        p_date_debut: dateDebut,
        p_date_fin: dateFin,
      });
    
    if (error) throw error;
    return data as boolean;
  };
}

export function useAllReservations() {
  return useQuery({
    queryKey: ["all-reservations-calendar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          id,
          date_debut,
          date_fin,
          statut,
          voiture_id,
          voitures(marque, modele)
        `)
        .in("statut", ["en_attente", "confirmee", "en_cours"])
        .order("date_debut", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
}
