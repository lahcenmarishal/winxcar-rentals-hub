import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Calendar, MapPin, Car } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statutLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  en_attente: { label: "En attente", variant: "secondary" },
  confirmee: { label: "Confirmée", variant: "default" },
  en_cours: { label: "En cours", variant: "outline" },
  terminee: { label: "Terminée", variant: "secondary" },
  annulee: { label: "Annulée", variant: "destructive" },
};

export default function Reservations() {
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          *,
          voitures(marque, modele, image_url),
          clients(nom, prenom, email, telephone),
          agence_retrait:agences!reservations_agence_retrait_id_fkey(nom, ville),
          agence_retour:agences!reservations_agence_retour_id_fkey(nom, ville)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatutMutation = useMutation({
    mutationFn: async ({ id, statut }: { id: string; statut: string }) => {
      const { error } = await supabase
        .from("reservations")
        .update({ statut })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      toast({ title: "Statut mis à jour" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  const filteredReservations = reservations?.filter((r) => {
    const matchSearch =
      r.numero_reservation.toLowerCase().includes(search.toLowerCase()) ||
      r.clients?.nom?.toLowerCase().includes(search.toLowerCase()) ||
      r.clients?.prenom?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = statutFilter === "all" || r.statut === statutFilter;
    return matchSearch && matchStatut;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Réservations</h1>
        <p className="text-muted-foreground">Gérez toutes les réservations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro ou client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statutFilter} onValueChange={setStatutFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(statutLabels).map(([value, { label }]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : filteredReservations?.length === 0 ? (
          <p className="text-muted-foreground">Aucune réservation trouvée</p>
        ) : (
          filteredReservations?.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row gap-4 justify-between">
                  {/* Info principale */}
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-secondary overflow-hidden shrink-0">
                      {reservation.voitures?.image_url ? (
                        <img 
                          src={reservation.voitures.image_url} 
                          alt="Voiture" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm bg-secondary px-2 py-0.5 rounded">
                          {reservation.numero_reservation}
                        </span>
                        <Badge variant={statutLabels[reservation.statut]?.variant || "secondary"}>
                          {statutLabels[reservation.statut]?.label || reservation.statut}
                        </Badge>
                      </div>
                      <h3 className="font-semibold">
                        {reservation.voitures?.marque} {reservation.voitures?.modele}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {reservation.clients?.prenom} {reservation.clients?.nom}
                        {reservation.clients?.telephone && ` • ${reservation.clients.telephone}`}
                      </p>
                    </div>
                  </div>

                  {/* Dates et lieux */}
                  <div className="flex flex-col sm:flex-row gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {format(new Date(reservation.date_debut), "d MMM yyyy", { locale: fr })}
                        </p>
                        <p className="text-muted-foreground">
                          au {format(new Date(reservation.date_fin), "d MMM yyyy", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{reservation.agence_retrait?.ville || "—"}</p>
                        <p className="text-muted-foreground">
                          → {reservation.agence_retour?.ville || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Prix et actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent">{reservation.prix_total} DH</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <Select 
                      value={reservation.statut} 
                      onValueChange={(statut) => updateStatutMutation.mutate({ id: reservation.id, statut })}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statutLabels).map(([value, { label }]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
