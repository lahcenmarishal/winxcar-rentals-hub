import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useVoiture } from "@/hooks/useVoitures";
import { useAgences } from "@/hooks/useAgences";
import { useOptions } from "@/hooks/useOptions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { format, differenceInDays, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, MapPin, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Reservation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: voiture, isLoading: voitureLoading } = useVoiture(id || "");
  const { data: agences } = useAgences();
  const { data: options } = useOptions();

  const [dateDebut, setDateDebut] = useState<Date>();
  const [dateFin, setDateFin] = useState<Date>();
  const [agenceRetrait, setAgenceRetrait] = useState<string>("");
  const [agenceRetour, setAgenceRetour] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client info
  const [clientInfo, setClientInfo] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });

  // Calculate prices
  const nbJours = dateDebut && dateFin ? Math.max(1, differenceInDays(dateFin, dateDebut) + 1) : 0;
  const prixVoiture = voiture ? voiture.prix_jour * nbJours : 0;
  const prixOptions = selectedOptions.reduce((acc, optId) => {
    const opt = options?.find((o) => o.id === optId);
    return acc + (opt ? opt.prix_jour * nbJours : 0);
  }, 0);
  const prixTotal = prixVoiture + prixOptions;

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateDebut || !dateFin || !agenceRetrait || !voiture) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create client
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .insert({
          nom: clientInfo.nom,
          prenom: clientInfo.prenom,
          email: clientInfo.email,
          telephone: clientInfo.telephone,
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Create reservation
      const { data: reservationData, error: reservationError } = await supabase
        .from("reservations")
        .insert({
          voiture_id: voiture.id,
          client_id: clientData.id,
          agence_retrait_id: agenceRetrait,
          agence_retour_id: agenceRetour || agenceRetrait,
          date_debut: format(dateDebut, "yyyy-MM-dd"),
          date_fin: format(dateFin, "yyyy-MM-dd"),
          options_ids: selectedOptions,
          prix_voiture: prixVoiture,
          prix_options: prixOptions,
          prix_total: prixTotal,
        })
        .select()
        .single();

      if (reservationError) throw reservationError;

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
      <section className="bg-secondary/30 py-8">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Réserver : {voiture.marque} {voiture.modele}
          </h1>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Main form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Dates */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h2 className="font-heading font-semibold text-lg mb-4">Dates de location</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date de retrait *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start", !dateDebut && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateDebut ? format(dateDebut, "PPP", { locale: fr }) : "Sélectionner"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateDebut}
                          onSelect={setDateDebut}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Date de retour *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start", !dateFin && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFin ? format(dateFin, "PPP", { locale: fr }) : "Sélectionner"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFin}
                          onSelect={setDateFin}
                          disabled={(date) => date < (dateDebut || new Date())}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Agences */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h2 className="font-heading font-semibold text-lg mb-4">Lieu de retrait et retour</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Agence de retrait *</Label>
                    <Select value={agenceRetrait} onValueChange={setAgenceRetrait}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une agence" />
                      </SelectTrigger>
                      <SelectContent>
                        {agences?.map((agence) => (
                          <SelectItem key={agence.id} value={agence.id}>
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {agence.nom}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Agence de retour</Label>
                    <Select value={agenceRetour} onValueChange={setAgenceRetour}>
                      <SelectTrigger>
                        <SelectValue placeholder="Même agence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Même agence que le retrait</SelectItem>
                        {agences?.map((agence) => (
                          <SelectItem key={agence.id} value={agence.id}>
                            {agence.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h2 className="font-heading font-semibold text-lg mb-4">Options supplémentaires</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {options?.map((option) => (
                    <label
                      key={option.id}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selectedOptions.includes(option.id)
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      )}
                    >
                      <Checkbox
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={() => toggleOption(option.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">{option.nom}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <span className="font-semibold text-accent">{option.prix_jour} DH/j</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Client info */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h2 className="font-heading font-semibold text-lg mb-4">Vos informations</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      required
                      value={clientInfo.prenom}
                      onChange={(e) => setClientInfo({ ...clientInfo, prenom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      required
                      value={clientInfo.nom}
                      onChange={(e) => setClientInfo({ ...clientInfo, nom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone *</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      required
                      value={clientInfo.telephone}
                      onChange={(e) => setClientInfo({ ...clientInfo, telephone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24">
                <h2 className="font-heading font-semibold text-lg mb-4">Récapitulatif</h2>

                {/* Car preview */}
                <div className="flex gap-3 pb-4 border-b border-border mb-4">
                  <img
                    src={voiture.image_url || ""}
                    alt={voiture.modele}
                    className="w-20 h-14 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-card-foreground">{voiture.marque} {voiture.modele}</p>
                    <p className="text-sm text-muted-foreground">{voiture.prix_jour} DH/jour</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durée</span>
                    <span className="font-medium">{nbJours > 0 ? `${nbJours} jour${nbJours > 1 ? "s" : ""}` : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Véhicule</span>
                    <span className="font-medium">{prixVoiture > 0 ? `${prixVoiture} DH` : "-"}</span>
                  </div>
                  {prixOptions > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Options</span>
                      <span className="font-medium">{prixOptions} DH</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-accent">{prixTotal > 0 ? `${prixTotal} DH` : "-"}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3 mb-4">
                  Paiement à la livraison • Annulation gratuite 48h avant
                </p>

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || !dateDebut || !dateFin || !agenceRetrait}
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
