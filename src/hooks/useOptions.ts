import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Option } from "@/types/database";

export function useOptions() {
  return useQuery({
    queryKey: ["options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("options")
        .select("*")
        .order("prix_jour", { ascending: true });
      if (error) throw error;
      return data as Option[];
    },
  });
}
