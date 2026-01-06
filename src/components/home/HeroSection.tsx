import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Clock, MapPin, Search, CalendarDays, Car, ChevronRight, Star } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
  
  const [dateDepart, setDateDepart] = useState<Date>();
  const [dateRetour, setDateRetour] = useState<Date>();
  const [categorie, setCategorie] = useState("all");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (dateDepart) params.set("date_debut", format(dateDepart, "yyyy-MM-dd"));
    if (dateRetour) params.set("date_fin", format(dateRetour, "yyyy-MM-dd"));
    if (categorie && categorie !== "all") params.set("categorie", categorie);
    
    navigate(`/catalogue?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-primary/40" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>

      <div className="container relative z-10 py-12 md:py-20 lg:py-24">
        <div className="flex flex-col items-center text-center max-w-6xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-white border border-white/20 mb-8 animate-fade-in">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span>Location de voitures à Marrakech</span>
            <ChevronRight className="w-4 h-4" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight text-white mb-6 animate-slide-up">
            Trouvez votre
            <span className="block mt-2 bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">
              véhicule idéal
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Large choix de véhicules disponibles à Marrakech. 
            Réservez en quelques clics et prenez la route en toute sérénité.
          </p>

          {/* Main Reservation Form Card */}
          <div className="w-full max-w-4xl animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 via-white/20 to-accent/50 rounded-3xl blur-xl opacity-50" />
              
              {/* Form Card */}
              <div className="relative bg-white/95 backdrop-blur-xl p-6 md:p-8 lg:p-10 rounded-3xl shadow-2xl border border-white/50">
                
                {/* Form Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                        Réservez maintenant
                      </h2>
                      <p className="text-sm text-muted-foreground">Retrait et retour à Marrakech</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-accent" />
                    <span>Annulation gratuite</span>
                  </div>
                </div>

                {/* Form Grid - Simplified without agency selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Date de départ */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Date de départ
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-14 justify-start text-left font-normal bg-secondary/50 border-border/50 hover:bg-secondary/80 transition-colors rounded-xl",
                            !dateDepart && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-3 h-5 w-5 text-accent shrink-0" />
                          <span className="truncate">
                            {dateDepart ? format(dateDepart, "dd MMM yyyy", { locale: fr }) : "Choisir date"}
                          </span>
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
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Date de retour
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-14 justify-start text-left font-normal bg-secondary/50 border-border/50 hover:bg-secondary/80 transition-colors rounded-xl",
                            !dateRetour && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-3 h-5 w-5 text-accent shrink-0" />
                          <span className="truncate">
                            {dateRetour ? format(dateRetour, "dd MMM yyyy", { locale: fr }) : "Choisir date"}
                          </span>
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

                  {/* Search Button */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-transparent uppercase tracking-wider select-none">
                      Action
                    </label>
                    <Button 
                      onClick={handleSearch}
                      className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground font-medium">Catégorie :</span>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setCategorie(cat.value)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                            categorie === cat.value
                              ? "bg-accent text-white shadow-md"
                              : "bg-secondary/70 text-foreground hover:bg-secondary"
                          )}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges - Updated for single agency */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Shield, label: "Assurance tous risques", sublabel: "Incluse" },
              { icon: Clock, label: "Disponible", sublabel: "24h/24 - 7j/7" },
              { icon: MapPin, label: "Marrakech", sublabel: "Retrait & Retour" },
              { icon: Star, label: "+500 clients", sublabel: "Satisfaits" },
            ].map(({ icon: Icon, label, sublabel }) => (
              <div key={label} className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-white/60">{sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
