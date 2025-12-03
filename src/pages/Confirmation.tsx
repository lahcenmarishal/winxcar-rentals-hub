import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Confirmation() {
  const { id } = useParams<{ id: string }>();

  const { data: reservation, isLoading } = useQuery({
    queryKey: ["reservation", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select(`
          *,
          voitures(marque, modele, image_url),
          clients(nom, prenom, email, telephone),
          agence_retrait:agences!reservations_agence_retrait_id_fkey(nom, adresse, telephone),
          agence_retour:agences!reservations_agence_retour_id_fkey(nom, adresse, telephone)
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

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

  return (
    <Layout>
      <div className="container py-12 md:py-16 max-w-3xl">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-winx-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-winx-success" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Réservation confirmée !
          </h1>
          <p className="text-muted-foreground">
            Votre numéro de réservation : <span className="font-mono font-semibold text-foreground">{reservation.numero_reservation}</span>
          </p>
        </div>

        {/* Reservation details */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {/* Car */}
          <div className="flex gap-4 p-6 border-b border-border">
            <img
              src={reservation.voitures?.image_url || ""}
              alt="Véhicule"
              className="w-28 h-20 object-cover rounded-xl"
            />
            <div>
              <h2 className="font-heading font-semibold text-xl text-card-foreground">
                {reservation.voitures?.marque} {reservation.voitures?.modele}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {reservation.clients?.prenom} {reservation.clients?.nom}
              </p>
            </div>
          </div>

          {/* Details grid */}
          <div className="p-6 space-y-6">
            {/* Dates */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Retrait</p>
                  <p className="font-medium text-card-foreground">
                    {format(new Date(reservation.date_debut), "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                  <p className="text-sm text-muted-foreground">{reservation.heure_retrait}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Retour</p>
                  <p className="font-medium text-card-foreground">
                    {format(new Date(reservation.date_fin), "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                  <p className="text-sm text-muted-foreground">{reservation.heure_retour}</p>
                </div>
              </div>
            </div>

            {/* Agence */}
            {reservation.agence_retrait && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Lieu de retrait</p>
                  <p className="font-medium text-card-foreground">{reservation.agence_retrait.nom}</p>
                  <p className="text-sm text-muted-foreground">{reservation.agence_retrait.adresse}</p>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total à payer</span>
                <span className="text-2xl font-bold text-accent">{reservation.prix_total} DH</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Paiement à effectuer lors du retrait du véhicule
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-secondary/30 p-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Un email de confirmation a été envoyé à <strong>{reservation.clients?.email}</strong>
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="tel:+212522123456" className="flex items-center gap-2 text-accent hover:underline">
                <Phone className="w-4 h-4" />
                +212 522 123 456
              </a>
              <a href="mailto:contact@winxcar.ma" className="flex items-center gap-2 text-accent hover:underline">
                <Mail className="w-4 h-4" />
                contact@winxcar.ma
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link to="/">
            <Button variant="outline" size="lg">
              Retour à l'accueil
            </Button>
          </Link>
          <Link to="/catalogue">
            <Button variant="accent" size="lg">
              Louer un autre véhicule
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
