import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/useCurrency";
import { CheckCircle, Calendar, MapPin, Phone, Mail, ArrowRight, Clock, Car, User, CreditCard, Printer } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

export default function Confirmation() {
  const { id } = useParams<{ id: string }>();
  const { formatPrice } = useCurrency();

  const { data: reservation, isLoading } = useQuery({
    queryKey: ["reservation", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          *,
          voitures(marque, modele, image_url, categorie),
          clients(nom, prenom, email, telephone, adresse),
          agence_retrait:agences!reservations_agence_retrait_id_fkey(nom, adresse, telephone, ville),
          agence_retour:agences!reservations_agence_retour_id_fkey(nom, adresse, telephone, ville)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <div className="animate-pulse">Chargement...</div>
        </div>
      </Layout>
    );
  }

  if (!reservation) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Réservation non trouvée</h1>
          <Link to="/catalogue">
            <Button variant="accent">Retour au catalogue</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const nbJours = differenceInDays(new Date(reservation.date_fin), new Date(reservation.date_debut)) + 1;

  return (
    <Layout>
      <div className="container py-8 sm:py-12 md:py-16 max-w-3xl print:py-4">
        {/* Success header */}
        <div className="text-center mb-8 sm:mb-10 print:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
            Réservation confirmée !
          </h1>
          <p className="text-muted-foreground">
            Votre numéro de réservation :
          </p>
          <p className="font-mono font-bold text-xl sm:text-2xl text-accent mt-1">
            {reservation.numero_reservation}
          </p>
        </div>

        {/* Reservation details */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden print:shadow-none print:border">
          {/* Car */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 border-b border-border">
            <img
              src={reservation.voitures?.image_url || "/placeholder.svg"}
              alt="Véhicule"
              className="w-full sm:w-32 h-24 sm:h-24 object-cover rounded-xl"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-heading font-semibold text-xl text-card-foreground">
                    {reservation.voitures?.marque} {reservation.voitures?.modele}
                  </h2>
                  <p className="text-muted-foreground text-sm capitalize mt-1">
                    {reservation.voitures?.categorie}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handlePrint}
                  className="print:hidden"
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Client info */}
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-accent mt-1 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium text-card-foreground">
                  {reservation.clients?.prenom} {reservation.clients?.nom}
                </p>
                <p className="text-sm text-muted-foreground">{reservation.clients?.email}</p>
                <p className="text-sm text-muted-foreground">{reservation.clients?.telephone}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Retrait</p>
                  <p className="font-medium text-card-foreground">
                    {format(new Date(reservation.date_debut), "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                  <p className="text-sm text-accent flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {reservation.heure_retrait || "09:00"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Retour</p>
                  <p className="font-medium text-card-foreground">
                    {format(new Date(reservation.date_fin), "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                  <p className="text-sm text-accent flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {reservation.heure_retour || "18:00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Duration badge */}
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              Durée : {nbJours} jour{nbJours > 1 ? "s" : ""}
            </div>

            {/* Agence */}
            {reservation.agence_retrait && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Lieu de retrait</p>
                  <p className="font-medium text-card-foreground">{reservation.agence_retrait.nom}</p>
                  <p className="text-sm text-muted-foreground">{reservation.agence_retrait.adresse}</p>
                  <p className="text-sm text-muted-foreground">{reservation.agence_retrait.ville}</p>
                  {reservation.agence_retrait.telephone && (
                    <a href={`tel:${reservation.agence_retrait.telephone}`} className="text-sm text-accent hover:underline">
                      {reservation.agence_retrait.telephone}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Return location if different */}
            {reservation.agence_retour && reservation.agence_retour_id !== reservation.agence_retrait_id && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Lieu de retour</p>
                  <p className="font-medium text-card-foreground">{reservation.agence_retour.nom}</p>
                  <p className="text-sm text-muted-foreground">{reservation.agence_retour.adresse}</p>
                </div>
              </div>
            )}

            {/* Notes */}
            {reservation.notes && (
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm mt-1">{reservation.notes}</p>
              </div>
            )}

            {/* Price breakdown */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Véhicule ({nbJours} jour{nbJours > 1 ? "s" : ""})</span>
                <span>{formatPrice(reservation.prix_voiture)}</span>
              </div>
              {reservation.prix_options > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Options</span>
                  <span>{formatPrice(reservation.prix_options)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="font-semibold">Total à payer</span>
                <span className="text-2xl font-bold text-accent">{formatPrice(reservation.prix_total)}</span>
              </div>
            </div>

            {/* Payment info */}
            <div className="flex items-start gap-3 bg-accent/5 rounded-lg p-3">
              <CreditCard className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Paiement à la livraison</p>
                <p className="text-xs text-muted-foreground">
                  Le paiement sera effectué lors du retrait du véhicule
                </p>
              </div>
            </div>
          </div>

          {/* Contact footer */}
          <div className="bg-secondary/30 p-4 sm:p-6 border-t border-border print:bg-transparent">
            <p className="text-sm text-muted-foreground mb-3">
              Un email de confirmation a été envoyé à <strong className="text-foreground">{reservation.clients?.email}</strong>
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="tel:+212720003661" className="flex items-center gap-2 text-accent hover:underline">
                <Phone className="w-4 h-4" />
                +212 7 20 00 36 61
              </a>
              <a href="mailto:winxcarloc@gmail.com" className="flex items-center gap-2 text-accent hover:underline">
                <Mail className="w-4 h-4" />
                winxcarloc@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Important notice */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl print:hidden">
          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">📋 À prévoir pour le retrait</h3>
          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
            <li>• Permis de conduire valide</li>
            <li>• Pièce d'identité ou passeport</li>
            <li>• Carte bancaire au nom du conducteur</li>
            <li>• Confirmation de réservation (ce document)</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center print:hidden">
          <Link to="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Retour à l'accueil
            </Button>
          </Link>
          <Link to="/catalogue">
            <Button variant="accent" size="lg" className="w-full sm:w-auto">
              Louer un autre véhicule
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
