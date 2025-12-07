import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Clock, MapPin, Search, CalendarDays, Car } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAgences } from "@/hooks/useAgences";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "Toutes catégories" },
  { value: "economique", label: "Économique" },
  { value: "compacte", label: "Compacte" },
  { value: "berline", label: "Berline" },
  { value: "suv", label: "SUV" },
  { value: "luxe", label: "Luxe" },
  { value: "utilitaire", label: "Utilitaire" },
];

export function HeroSection() {
  const navigate = useNavigate();
  const { data: agences } = useAgences();
  
  const [villeDepart, setVilleDepart] = useState("");
  const [villeRetour, setVilleRetour] = useState("");
  const [dateDepart, setDateDepart] = useState<Date>();
  const [dateRetour, setDateRetour] = useState<Date>();
  const [categorie, setCategorie] = useState("all");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (villeDepart) params.set("agence", villeDepart);
    if (villeRetour && villeRetour !== villeDepart) params.set("agence_retour", villeRetour);
    if (dateDepart) params.set("date_debut", format(dateDepart, "yyyy-MM-dd"));
    if (dateRetour) params.set("date_fin", format(dateRetour, "yyyy-MM-dd"));
    if (categorie && categorie !== "all") params.set("categorie", categorie);
    
    navigate(`/catalogue?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-primary-foreground space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-full text-sm font-medium backdrop-blur-sm">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Location de véhicules au Maroc
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight text-white">
              Louez la voiture 
              <span className="text-white block mt-2">de vos rêves</span>
            </h1>
            
            <p className="text-lg text-primary-foreground/80 max-w-lg leading-relaxed">
              Découvrez notre flotte de véhicules de qualité pour tous vos besoins. 
              Réservation simple, prix transparents, service exceptionnel.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              {[
                { icon: Shield, label: "Assurance incluse" },
                { icon: Clock, label: "Disponible 24/7" },
                { icon: MapPin, label: "4 agences au Maroc" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                  <Icon className="w-5 h-5 text-white" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reservation Form */}
          <div className="relative">
            <div className="bg-card/95 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl border border-border/50 animate-scale-in">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-card-foreground mb-6 flex items-center gap-2">
                <Car className="w-6 h-6 text-accent" />
                Réservez votre véhicule
              </h2>

              <div className="space-y-4">
                {/* Ville de départ */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Ville de départ</label>
                  <Select value={villeDepart} onValueChange={setVilleDepart}>
                    <SelectTrigger className="w-full bg-background border-border">
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      {agences?.map((agence) => (
                        <SelectItem key={agence.id} value={agence.id}>
                          {agence.nom} - {agence.ville}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ville de retour */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Ville de retour</label>
                  <Select value={villeRetour || "same"} onValueChange={(val) => setVilleRetour(val === "same" ? "" : val)}>
                    <SelectTrigger className="w-full bg-background border-border">
                      <SelectValue placeholder="Même ville que le départ" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      <SelectItem value="same">Même ville que le départ</SelectItem>
                      {agences?.map((agence) => (
                        <SelectItem key={agence.id} value={agence.id}>
                          {agence.nom} - {agence.ville}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dates row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date de départ */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">Date de départ</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background border-border",
                            !dateDepart && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {dateDepart ? format(dateDepart, "dd MMM yyyy", { locale: fr }) : "Sélectionner"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover border-border z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={dateDepart}
                          onSelect={setDateDepart}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Date de retour */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">Date de retour</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background border-border",
                            !dateRetour && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {dateRetour ? format(dateRetour, "dd MMM yyyy", { locale: fr }) : "Sélectionner"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover border-border z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRetour}
                          onSelect={setDateRetour}
                          disabled={(date) => date < (dateDepart || new Date())}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Catégorie de véhicule</label>
                  <Select value={categorie} onValueChange={setCategorie}>
                    <SelectTrigger className="w-full bg-background border-border">
                      <SelectValue placeholder="Toutes catégories" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <Button 
                  onClick={handleSearch}
                  className="w-full mt-4 bg-accent hover:bg-accent/90 text-white font-semibold py-6 text-lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-card z-20 animate-scale-in hidden md:block" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚗</span>
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">+500</p>
                  <p className="text-sm text-muted-foreground">Clients satisfaits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
