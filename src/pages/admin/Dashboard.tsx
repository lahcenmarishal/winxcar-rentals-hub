import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Calendar, Users, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

export default function Dashboard() {
  const { formatPrice } = useCurrency();

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [voituresRes, reservationsRes, clientsRes] = await Promise.all([
        supabase.from("voitures").select("id, disponible", { count: "exact" }),
        supabase.from("reservations").select("id, statut, prix_total, created_at"),
        supabase.from("clients").select("id", { count: "exact" }),
      ]);

      const voitures = voituresRes.data || [];
      const reservations = reservationsRes.data || [];
      const totalClients = clientsRes.count || 0;

      const disponibles = voitures.filter(v => v.disponible).length;
      const enCours = reservations.filter(r => r.statut === "confirmee" || r.statut === "en_cours").length;
      const revenusTotal = reservations
        .filter(r => r.statut !== "annulee")
        .reduce((sum, r) => sum + (r.prix_total || 0), 0);
      
      const today = new Date().toISOString().split("T")[0];
      const reservationsAujourdhui = reservations.filter(
        r => r.created_at?.startsWith(today)
      ).length;

      return {
        totalVoitures: voitures.length,
        voituresDisponibles: disponibles,
        totalReservations: reservations.length,
        reservationsEnCours: enCours,
        totalClients,
        revenusTotal,
        reservationsAujourdhui,
      };
    },
  });

  const statCards = [
    {
      title: "Véhicules",
      value: stats?.totalVoitures || 0,
      subtitle: `${stats?.voituresDisponibles || 0} disponibles`,
      icon: Car,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Réservations",
      value: stats?.totalReservations || 0,
      subtitle: `${stats?.reservationsEnCours || 0} en cours`,
      icon: Calendar,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Clients",
      value: stats?.totalClients || 0,
      subtitle: "Total inscrits",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Revenus",
      value: formatPrice(stats?.revenusTotal || 0),
      subtitle: "Total des réservations",
      icon: DollarSign,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold truncate">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg bg-secondary/50">
                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Nouvelle réservation</p>
                  <p className="text-xs text-muted-foreground">Il y a quelques instants</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg bg-secondary/50">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Véhicule ajouté</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg bg-secondary/50">
                <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Réservation confirmée</p>
                  <p className="text-xs text-muted-foreground">Il y a 5 heures</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="truncate">Taux d'occupation</span>
                  <span className="font-medium ml-2">75%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: "75%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="truncate">Réservations confirmées</span>
                  <span className="font-medium ml-2">85%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="truncate">Satisfaction client</span>
                  <span className="font-medium ml-2">92%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
