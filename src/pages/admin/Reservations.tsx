import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import { AdminCalendar } from "@/components/admin/AdminCalendar";
import { Search, Calendar, MapPin, Car, User, Phone, Mail, Eye, Clock, CalendarDays, List } from "lucide-react";
import { format, differenceInDays } from "date-fns";
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
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          *,
          voitures(marque, modele, image_url),
          clients(nom, prenom, email, telephone, adresse),
          agence_retrait:agences!reservations_agence_retrait_id_fkey(nom, ville, adresse, telephone),
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
      queryClient.invalidateQueries({ queryKey: ["all-reservations-calendar"] });
      toast({ title: "Statut mis à jour" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  const deleteReservationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("reservations")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
      queryClient.invalidateQueries({ queryKey: ["all-reservations-calendar"] });
      toast({ title: "Réservation supprimée" });
      setSelectedReservation(null);
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    },
  });

  const filteredReservations = reservations?.filter((r) => {
    const matchSearch =
      r.numero_reservation.toLowerCase().includes(search.toLowerCase()) ||
      r.clients?.nom?.toLowerCase().includes(search.toLowerCase()) ||
      r.clients?.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      r.clients?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = statutFilter === "all" || r.statut === statutFilter;
    return matchSearch && matchStatut;
  });

  const getDuration = (dateDebut: string, dateFin: string) => {
    return differenceInDays(new Date(dateFin), new Date(dateDebut)) + 1;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">Réservations</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Gérez toutes les réservations</p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Liste</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Calendrier</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par n°, nom, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger className="w-full sm:w-48">
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

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-3">
              <p className="text-2xl font-bold">{reservations?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </Card>
            <Card className="p-3">
              <p className="text-2xl font-bold text-yellow-600">
                {reservations?.filter(r => r.statut === 'en_attente').length || 0}
              </p>
              <p className="text-xs text-muted-foreground">En attente</p>
            </Card>
            <Card className="p-3">
              <p className="text-2xl font-bold text-green-600">
                {reservations?.filter(r => r.statut === 'confirmee').length || 0}
              </p>
              <p className="text-xs text-muted-foreground">Confirmées</p>
            </Card>
            <Card className="p-3">
              <p className="text-2xl font-bold text-blue-600">
                {reservations?.filter(r => r.statut === 'en_cours').length || 0}
              </p>
              <p className="text-xs text-muted-foreground">En cours</p>
            </Card>
          </div>

          {/* List */}
          <div className="space-y-3 sm:space-y-4">
            {isLoading ? (
              <p className="text-muted-foreground">Chargement...</p>
            ) : filteredReservations?.length === 0 ? (
              <p className="text-muted-foreground">Aucune réservation trouvée</p>
            ) : (
              filteredReservations?.map((reservation) => (
                <Card key={reservation.id} className="overflow-hidden">
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="flex flex-col gap-4">
                      {/* Header */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-secondary overflow-hidden shrink-0">
                          {reservation.voitures?.image_url ? (
                            <img 
                              src={reservation.voitures.image_url} 
                              alt="Voiture" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs sm:text-sm bg-secondary px-2 py-0.5 rounded">
                              {reservation.numero_reservation}
                            </span>
                            <Badge variant={statutLabels[reservation.statut]?.variant || "secondary"} className="text-xs">
                              {statutLabels[reservation.statut]?.label || reservation.statut}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {reservation.voitures?.marque} {reservation.voitures?.modele}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {reservation.clients?.prenom} {reservation.clients?.nom}
                          </p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-xs sm:text-sm">
                              {format(new Date(reservation.date_debut), "d MMM yyyy", { locale: fr })}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              au {format(new Date(reservation.date_fin), "d MMM yyyy", { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-xs sm:text-sm">
                              {getDuration(reservation.date_debut, reservation.date_fin)} jours
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {reservation.heure_retrait || "09:00"} - {reservation.heure_retour || "18:00"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-xs sm:text-sm truncate">{reservation.agence_retrait?.ville || "—"}</p>
                            <p className="text-muted-foreground text-xs truncate">
                              → {reservation.agence_retour?.ville || reservation.agence_retrait?.ville || "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="text-left sm:text-right">
                            <p className="text-lg sm:text-xl font-bold text-accent">{formatPrice(reservation.prix_total)}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                        <Select 
                          value={reservation.statut} 
                          onValueChange={(statut) => updateStatutMutation.mutate({ id: reservation.id, statut })}
                        >
                          <SelectTrigger className="w-32 sm:w-36 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statutLabels).map(([value, { label }]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs"
                              onClick={() => setSelectedReservation(reservation)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Réservation {reservation.numero_reservation}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Vehicle */}
                              <div className="flex gap-3 p-3 bg-secondary/50 rounded-lg">
                                {reservation.voitures?.image_url && (
                                  <img 
                                    src={reservation.voitures.image_url} 
                                    alt="Voiture" 
                                    className="w-20 h-14 object-cover rounded" 
                                  />
                                )}
                                <div>
                                  <p className="font-semibold">{reservation.voitures?.marque} {reservation.voitures?.modele}</p>
                                  <Badge variant={statutLabels[reservation.statut]?.variant}>
                                    {statutLabels[reservation.statut]?.label}
                                  </Badge>
                                </div>
                              </div>

                              {/* Client */}
                              <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Client
                                </h4>
                                <div className="text-sm space-y-1 pl-6">
                                  <p>{reservation.clients?.prenom} {reservation.clients?.nom}</p>
                                  <p className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-3.5 w-3.5" />
                                    {reservation.clients?.email}
                                  </p>
                                  <p className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-3.5 w-3.5" />
                                    {reservation.clients?.telephone}
                                  </p>
                                  {reservation.clients?.adresse && (
                                    <p className="text-muted-foreground">{reservation.clients.adresse}</p>
                                  )}
                                </div>
                              </div>

                              {/* Dates */}
                              <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  Dates
                                </h4>
                                <div className="text-sm pl-6 grid grid-cols-2 gap-2">
                                  <div>
                                    <p className="text-muted-foreground">Retrait</p>
                                    <p>{format(new Date(reservation.date_debut), "EEEE d MMMM yyyy", { locale: fr })}</p>
                                    <p className="text-muted-foreground">{reservation.heure_retrait || "09:00"}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Retour</p>
                                    <p>{format(new Date(reservation.date_fin), "EEEE d MMMM yyyy", { locale: fr })}</p>
                                    <p className="text-muted-foreground">{reservation.heure_retour || "18:00"}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Location */}
                              <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  Agence
                                </h4>
                                <div className="text-sm pl-6">
                                  <p>{reservation.agence_retrait?.nom}</p>
                                  <p className="text-muted-foreground">{reservation.agence_retrait?.adresse}</p>
                                  {reservation.agence_retrait?.telephone && (
                                    <p className="text-muted-foreground">{reservation.agence_retrait.telephone}</p>
                                  )}
                                </div>
                              </div>

                              {/* Notes */}
                              {reservation.notes && (
                                <div className="space-y-2">
                                  <h4 className="font-medium">Notes</h4>
                                  <p className="text-sm text-muted-foreground pl-6">{reservation.notes}</p>
                                </div>
                              )}

                              {/* Price */}
                              <div className="p-3 bg-accent/10 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Véhicule ({getDuration(reservation.date_debut, reservation.date_fin)}j)</span>
                                  <span>{formatPrice(reservation.prix_voiture)}</span>
                                </div>
                                {reservation.prix_options > 0 && (
                                  <div className="flex justify-between items-center text-sm">
                                    <span>Options</span>
                                    <span>{formatPrice(reservation.prix_options)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-accent/20">
                                  <span className="font-semibold">Total</span>
                                  <span className="text-xl font-bold text-accent">{formatPrice(reservation.prix_total)}</span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 pt-2">
                                <Select 
                                  value={reservation.statut} 
                                  onValueChange={(statut) => updateStatutMutation.mutate({ id: reservation.id, statut })}
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(statutLabels).map(([value, { label }]) => (
                                      <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => {
                                    if (confirm("Supprimer cette réservation ?")) {
                                      deleteReservationMutation.mutate(reservation.id);
                                    }
                                  }}
                                >
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <AdminCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
