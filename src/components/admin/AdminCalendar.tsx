import { useMemo, useState } from "react";
import { useAllReservations } from "@/hooks/useCarReservations";
import { useVoitures } from "@/hooks/useVoitures";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isWithinInterval, addMonths, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statutColors: Record<string, string> = {
  en_attente: "bg-yellow-500",
  confirmee: "bg-green-500",
  en_cours: "bg-blue-500",
};

export function AdminCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedVoiture, setSelectedVoiture] = useState<string>("all");
  const { data: reservations, isLoading } = useAllReservations();
  const { data: voitures } = useVoitures();

  const filteredReservations = useMemo(() => {
    if (!reservations) return [];
    if (selectedVoiture === "all") return reservations;
    return reservations.filter((r) => r.voiture_id === selectedVoiture);
  }, [reservations, selectedVoiture]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group reservations by day
  const reservationsByDay = useMemo(() => {
    const map = new Map<string, typeof filteredReservations>();
    
    filteredReservations.forEach((res) => {
      const start = parseISO(res.date_debut);
      const end = parseISO(res.date_fin);
      const interval = eachDayOfInterval({ start, end });
      
      interval.forEach((day) => {
        const key = format(day, "yyyy-MM-dd");
        const existing = map.get(key) || [];
        if (!existing.find(r => r.id === res.id)) {
          map.set(key, [...existing, res]);
        }
      });
    });
    
    return map;
  }, [filteredReservations]);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg sm:text-xl">Calendrier des réservations</CardTitle>
          <Select value={selectedVoiture} onValueChange={setSelectedVoiture}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Filtrer par véhicule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les véhicules</SelectItem>
              {voitures?.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.marque} {v.modele}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold text-base sm:text-lg capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: fr })}
          </h3>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Header */}
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before month start */}
          {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days */}
          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayReservations = reservationsByDay.get(dateKey) || [];
            const hasReservations = dayReservations.length > 0;

            return (
              <div
                key={dateKey}
                className={cn(
                  "aspect-square border rounded-md p-1 min-h-[60px] sm:min-h-[80px] overflow-hidden",
                  isToday(day) && "border-accent border-2",
                  hasReservations && "bg-secondary/30"
                )}
              >
                <div className={cn(
                  "text-xs sm:text-sm font-medium mb-1",
                  isToday(day) && "text-accent"
                )}>
                  {format(day, "d")}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  {dayReservations.slice(0, 2).map((res) => (
                    <div
                      key={res.id}
                      className={cn(
                        "text-[9px] sm:text-[10px] text-white px-1 py-0.5 rounded truncate",
                        statutColors[res.statut] || "bg-gray-500"
                      )}
                      title={`${res.voitures?.marque} ${res.voitures?.modele}`}
                    >
                      {res.voitures?.marque}
                    </div>
                  ))}
                  {dayReservations.length > 2 && (
                    <div className="text-[9px] text-muted-foreground">
                      +{dayReservations.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>En attente</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Confirmée</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>En cours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
