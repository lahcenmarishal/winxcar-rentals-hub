import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Agence } from "@/types/database";

export function useAgences() {
  return useQuery({
    queryKey: ["agences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agences")
        .select("*")
        .order("ville", { ascending: true });
      if (error) throw error;
      return data as Agence[];
    },
  });
}
