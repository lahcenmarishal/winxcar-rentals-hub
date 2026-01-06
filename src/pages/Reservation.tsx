import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useVoiture } from "@/hooks/useVoitures";
import { useAgences } from "@/hooks/useAgences";
import { useOptions } from "@/hooks/useOptions";
import { useCurrency } from "@/hooks/useCurrency";
import { useCarReservations, useCheckAvailability } from "@/hooks/useCarReservations";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReservationCalendar } from "@/components/reservation/ReservationCalendar";
import { toast } from "@/hooks/use-toast";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Check, Loader2, User, Mail, Phone, CreditCard, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const heures = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
];

// Informations de l'unique agence
const AGENCE_INFO = {
  nom: "Winxcar Marrakech",
  adresse: "N° 2, Immeuble 224, Al Housna, Mhamid, Marrakech",
};

export default function Reservation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: voiture, isLoading: voitureLoading } = useVoiture(id || "");
  const { data: agences } = useAgences();
  const { data: options } = useOptions();
  const { formatPrice } = useCurrency();
  const { data: existingReservations } = useCarReservations(id || "");
  const checkAvailability = useCheckAvailability();

  const [dateDebut, setDateDebut] = useState<Date>();
  const [dateFin, setDateFin] = useState<Date>();
  const [heureRetrait, setHeureRetrait] = useState("09:00");
  const [heureRetour, setHeureRetour] = useState("18:00");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // Get the single agency ID
  const agenceId = agences?.[0]?.id || null;

  // Client info
  const [clientInfo, setClientInfo] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    notes: "",
  });

  // Calculate prices
  const nbJours = dateDebut && dateFin ? Math.max(1, differenceInDays(dateFin, dateDebut) + 1) : 0;
  const prixVoiture = voiture ? voiture.prix_jour * nbJours : 0;
  const prixOptions = selectedOptions.reduce((acc, optId) => {
    const opt = options?.find((o) => o.id === optId);
    return acc + (opt ? opt.prix_jour * nbJours : 0);
  }, 0);
  const prixTotal = prixVoiture + prixOptions;

  // Check availability when dates change
  const verifyAvailability = useCallback(async () => {
    if (!dateDebut || !dateFin || !id) return;

    setIsCheckingAvailability(true);
    setAvailabilityError(null);
    
    try {
      const available = await checkAvailability(
        id,
        format(dateDebut, "yyyy-MM-dd"),
        format(dateFin, "yyyy-MM-dd")
      );
      
      setIsAvailable(available);
      if (!available) {
        setAvailabilityError("Ce véhicule n'est pas disponible pour les dates sélectionnées. Veuillez choisir d'autres dates.");
      }
    } catch (error) {
      console.error("Availability check error:", error);
      setAvailabilityError("Erreur lors de la vérification de disponibilité");
      setIsAvailable(false);
    } finally {
      setIsCheckingAvailability(false);
    }
  }, [dateDebut, dateFin, id, checkAvailability]);

  useEffect(() => {
    if (dateDebut && dateFin) {
      verifyAvailability();
    } else {
      setIsAvailable(null);
      setAvailabilityError(null);
    }
  }, [dateDebut, dateFin, verifyAvailability]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateDebut || !dateFin || !voiture || !agenceId) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }

    if (!isAvailable) {
      toast({ title: "Erreur", description: "Le véhicule n'est pas disponible pour ces dates.", variant: "destructive" });
      return;
    }

    if (!clientInfo.nom || !clientInfo.prenom || !clientInfo.email || !clientInfo.telephone) {
      toast({ title: "Erreur", description: "Veuillez remplir vos informations personnelles.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Final availability check
      const stillAvailable = await checkAvailability(
        voiture.id,
        format(dateDebut, "yyyy-MM-dd"),
        format(dateFin, "yyyy-MM-dd")
      );

      if (!stillAvailable) {
        toast({ 
          title: "Véhicule indisponible", 
          description: "Ce véhicule vient d'être réservé pour ces dates. Veuillez choisir d'autres dates.",
          variant: "destructive" 
        });
        setIsAvailable(false);
        setAvailabilityError("Ce véhicule vient d'être réservé pour ces dates.");
        return;
      }

      // Create client
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .insert({
          nom: clientInfo.nom,
          prenom: clientInfo.prenom,
          email: clientInfo.email,
          telephone: clientInfo.telephone,
          adresse: clientInfo.adresse || null,
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Create reservation with the single agency
      const { data: reservationData, error: reservationError } = await supabase
        .from("reservations")
        .insert({
          voiture_id: voiture.id,
          client_id: clientData.id,
          agence_retrait_id: agenceId,
          agence_retour_id: agenceId,
          date_debut: format(dateDebut, "yyyy-MM-dd"),
          date_fin: format(dateFin, "yyyy-MM-dd"),
          heure_retrait: heureRetrait,
          heure_retour: heureRetour,
          options_ids: selectedOptions,
          prix_voiture: prixVoiture,
          prix_options: prixOptions,
          prix_total: prixTotal,
          notes: clientInfo.notes || null,
        })
        .select()
        .single();

      if (reservationError) throw reservationError;

      // Send email notifications
      try {
        await supabase.functions.invoke("send-reservation-notification", {
          body: {
            reservation_id: reservationData.id,
            numero_reservation: reservationData.numero_reservation,
            client_nom: clientInfo.nom,
            client_prenom: clientInfo.prenom,
            client_email: clientInfo.email,
            client_telephone: clientInfo.telephone,
            voiture_marque: voiture.marque,
            voiture_modele: voiture.modele,
            date_debut: format(dateDebut, "yyyy-MM-dd"),
            date_fin: format(dateFin, "yyyy-MM-dd"),
            heure_retrait: heureRetrait,
            heure_retour: heureRetour,
            prix_total: prixTotal,
            notes: clientInfo.notes || null,
          },
        });
      } catch (emailError) {
        console.error("Email notification error:", emailError);
        // Don't block the reservation if email fails
      }

      toast({
        title: "Réservation confirmée !",
        description: `Votre numéro de réservation est ${reservationData.numero_reservation}`,
      });

      navigate(`/confirmation/${reservationData.id}`);
    } catch (error) {
      console.error("Reservation error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (voitureLoading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!voiture) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Véhicule non trouvé</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-secondary/30 py-6 sm:py-8">
        <div className="container">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-foreground">
            Réserver : {voiture.marque} {voiture.modele}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Complétez le formulaire pour finaliser votre réservation
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-8 md:py-12">
        <div className="container">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dates with Calendar */}
              <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft">
                <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  Dates et horaires de location
                </h2>
                
                <ReservationCalendar
                  dateDebut={dateDebut}
                  dateFin={dateFin}
                  onDateDebutChange={setDateDebut}
                  onDateFinChange={setDateFin}
                  reservations={existingReservations}
                  isCheckingAvailability={isCheckingAvailability}
                  availabilityError={availabilityError}
                />

                {/* Time selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label>Heure de retrait</Label>
                    <Select value={heureRetrait} onValueChange={setHeureRetrait}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {heures.map((h) => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Heure de retour</Label>
                    <Select value={heureRetour} onValueChange={setHeureRetour}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {heures.map((h) => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Duration display */}
                {nbJours > 0 && (
                  <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                    <p className="text-sm font-medium text-accent">
                      Durée : {nbJours} jour{nbJours > 1 ? "s" : ""} de location
                    </p>
                  </div>
                )}
              </div>

              {/* Single Agency - Display only */}
              <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft">
                <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  Lieu de retrait et retour
                </h2>
                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl">
                  <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-card-foreground">{AGENCE_INFO.nom}</p>
                    <p className="text-sm text-muted-foreground">{AGENCE_INFO.adresse}</p>
                    <p className="text-xs text-muted-foreground mt-1">Retrait et retour au même endroit</p>
                  </div>
                </div>
              </div>

              {/* Options */}
              {options && options.length > 0 && (
                <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft">
                  <h2 className="font-heading font-semibold text-lg mb-4">Options supplémentaires</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {options.map((option) => (
                      <label
                        key={option.id}
                        className={cn(
                          "flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all",
                          selectedOptions.includes(option.id)
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        )}
                      >
                        <Checkbox
                          checked={selectedOptions.includes(option.id)}
                          onCheckedChange={() => toggleOption(option.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-card-foreground text-sm sm:text-base">{option.nom}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{option.description}</p>
                        </div>
                        <span className="font-semibold text-accent text-sm whitespace-nowrap">{formatPrice(option.prix_jour)}/j</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Client info */}
              <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft">
                <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Vos informations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      required
                      placeholder="Votre prénom"
                      value={clientInfo.prenom}
                      onChange={(e) => setClientInfo({ ...clientInfo, prenom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      required
                      placeholder="Votre nom"
                      value={clientInfo.nom}
                      onChange={(e) => setClientInfo({ ...clientInfo, nom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="votre@email.com"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone" className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      Téléphone *
                    </Label>
                    <Input
                      id="telephone"
                      type="tel"
                      required
                      placeholder="+212 6XX XXX XXX"
                      value={clientInfo.telephone}
                      onChange={(e) => setClientInfo({ ...clientInfo, telephone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="adresse">Adresse (optionnel)</Label>
                    <Input
                      id="adresse"
                      placeholder="Votre adresse"
                      value={clientInfo.adresse}
                      onChange={(e) => setClientInfo({ ...clientInfo, adresse: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="notes">Notes ou demandes spéciales (optionnel)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Informations supplémentaires..."
                      rows={3}
                      value={clientInfo.notes}
                      onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft">
                <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />
                  Mode de paiement
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-accent bg-accent/5 cursor-pointer">
                    <div className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Paiement à la livraison</p>
                      <p className="text-sm text-muted-foreground">Payez lors du retrait du véhicule</p>
                    </div>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  * Annulation gratuite jusqu'à 48h avant le retrait
                </p>
              </div>
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft sticky top-24">
                <h2 className="font-heading font-semibold text-lg mb-4">Récapitulatif</h2>

                {/* Car preview */}
                <div className="flex gap-3 pb-4 border-b border-border mb-4">
                  <img
                    src={voiture.image_url || "/placeholder.svg"}
                    alt={voiture.modele}
                    className="w-20 h-14 object-cover rounded-lg"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-card-foreground truncate">{voiture.marque} {voiture.modele}</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(voiture.prix_jour)}/jour</p>
                  </div>
                </div>

                {/* Dates summary */}
                {dateDebut && dateFin && (
                  <div className="pb-4 border-b border-border mb-4 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Du</span>
                      <span className="font-medium">{format(dateDebut, "d MMM yyyy", { locale: fr })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Au</span>
                      <span className="font-medium">{format(dateFin, "d MMM yyyy", { locale: fr })}</span>
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durée</span>
                    <span className="font-medium">{nbJours > 0 ? `${nbJours} jour${nbJours > 1 ? "s" : ""}` : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Véhicule ({nbJours}j × {formatPrice(voiture.prix_jour)})</span>
                    <span className="font-medium">{prixVoiture > 0 ? formatPrice(prixVoiture) : "-"}</span>
                  </div>
                  {prixOptions > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Options</span>
                      <span className="font-medium">{formatPrice(prixOptions)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-accent text-lg">{prixTotal > 0 ? formatPrice(prixTotal) : "-"}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3 mb-4">
                  Paiement à la livraison • Annulation gratuite 48h avant
                </p>

                {/* Availability status */}
                {isAvailable === true && dateDebut && dateFin && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 p-2 rounded-lg mb-4">
                    <Check className="h-4 w-4" />
                    Véhicule disponible
                  </div>
                )}

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || !dateDebut || !dateFin || !agenceId || !isAvailable || isCheckingAvailability}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Confirmation...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirmer la réservation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
