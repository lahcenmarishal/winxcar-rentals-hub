import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/hooks/useCurrency";
import { Settings as SettingsIcon, Globe } from "lucide-react";

export default function Settings() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Configurez les options du dashboard</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Devise
            </CardTitle>
            <CardDescription>
              Choisissez la devise affichée sur tout le site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Label htmlFor="currency" className="min-w-[100px]">Devise</Label>
                <Select value={currency} onValueChange={(v) => setCurrency(v as "MAD" | "EUR")}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAD">
                      <span className="flex items-center gap-2">
                        🇲🇦 Dirham Marocain (DH)
                      </span>
                    </SelectItem>
                    <SelectItem value="EUR">
                      <span className="flex items-center gap-2">
                        🇪🇺 Euro (€)
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Le taux de conversion utilisé est approximatif (1 € ≈ 10.8 DH)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
