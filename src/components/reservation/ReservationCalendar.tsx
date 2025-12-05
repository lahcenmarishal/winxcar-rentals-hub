import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, eachDayOfInterval, parseISO, isWithinInterval, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReservationCalendarProps {
  dateDebut: Date | undefined;
  dateFin: Date | undefined;
  onDateDebutChange: (date: Date | undefined) => void;
  onDateFinChange: (date: Date | undefined) => void;
  reservations: { date_debut: string; date_fin: string }[] | undefined;
  isCheckingAvailability?: boolean;
  availabilityError?: string | null;
}

export function ReservationCalendar({
  dateDebut,
  dateFin,
  onDateDebutChange,
  onDateFinChange,
  reservations,
  isCheckingAvailability,
  availabilityError,
}: ReservationCalendarProps) {
  // Get all reserved dates
  const reservedDates = useMemo(() => {
    if (!reservations) return new Set<string>();
    
    const dates = new Set<string>();
    reservations.forEach((res) => {
      const start = parseISO(res.date_debut);
      const end = parseISO(res.date_fin);
      const days = eachDayOfInterval({ start, end });
      days.forEach((day) => dates.add(format(day, "yyyy-MM-dd")));
    });
    return dates;
  }, [reservations]);

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return true;
    return reservedDates.has(format(date, "yyyy-MM-dd"));
  };

  const isDateDisabledForEnd = (date: Date) => {
    if (!dateDebut) return isDateDisabled(date);
    if (isBefore(date, dateDebut)) return true;
    
    // Check if any reserved date is between start and this date
    const reservedBetween = Array.from(reservedDates).some((reservedDate) => {
      const reserved = parseISO(reservedDate);
      return isWithinInterval(reserved, { start: dateDebut, end: date });
    });
    
    return reservedBetween || isDateDisabled(date);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date début */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date de retrait *</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-11",
                  !dateDebut && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateDebut ? format(dateDebut, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateDebut}
                onSelect={(date) => {
                  onDateDebutChange(date);
                  // Reset end date if it's before new start date
                  if (dateFin && date && isBefore(dateFin, date)) {
                    onDateFinChange(undefined);
                  }
                }}
                disabled={isDateDisabled}
                initialFocus
                className="pointer-events-auto"
                locale={fr}
                modifiers={{
                  reserved: (date) => reservedDates.has(format(date, "yyyy-MM-dd")),
                }}
                modifiersStyles={{
                  reserved: { 
                    backgroundColor: "hsl(var(--destructive) / 0.2)",
                    color: "hsl(var(--destructive))",
                    textDecoration: "line-through"
                  },
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date fin */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date de retour *</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-11",
                  !dateFin && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFin ? format(dateFin, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFin}
                onSelect={onDateFinChange}
                disabled={isDateDisabledForEnd}
                initialFocus
                className="pointer-events-auto"
                locale={fr}
                modifiers={{
                  reserved: (date) => reservedDates.has(format(date, "yyyy-MM-dd")),
                }}
                modifiersStyles={{
                  reserved: { 
                    backgroundColor: "hsl(var(--destructive) / 0.2)",
                    color: "hsl(var(--destructive))",
                    textDecoration: "line-through"
                  },
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Availability status */}
      {isCheckingAvailability && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          Vérification de la disponibilité...
        </div>
      )}

      {availabilityError && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {availabilityError}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive/50" />
          <span>Dates réservées</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>Date sélectionnée</span>
        </div>
      </div>
    </div>
  );
}
