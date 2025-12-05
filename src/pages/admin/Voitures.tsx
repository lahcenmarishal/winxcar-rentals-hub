import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Car, Search, Upload, X } from "lucide-react";
import type { CategorieVoiture, BoiteVitesse, Carburant } from "@/types/database";

const categories: CategorieVoiture[] = ["economique", "compacte", "berline", "suv", "luxe", "utilitaire"];
const carburants: Carburant[] = ["essence", "diesel", "hybride", "electrique"];
const boites: BoiteVitesse[] = ["manuelle", "automatique"];

interface VoitureForm {
  marque: string;
  modele: string;
  categorie: CategorieVoiture;
  prix_jour: number;
  places: number;
  portes: number;
  boite: BoiteVitesse;
  carburant: Carburant;
  climatisation: boolean;
  disponible: boolean;
  image_url: string;
  description: string;
}

const initialForm: VoitureForm = {
  marque: "",
  modele: "",
  categorie: "economique",
  prix_jour: 0,
  places: 5,
  portes: 5,
  boite: "manuelle",
  carburant: "essence",
  climatisation: true,
  disponible: true,
  image_url: "",
  description: "",
};

export default function Voitures() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VoitureForm>(initialForm);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: voitures, isLoading } = useQuery({
    queryKey: ["admin-voitures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("voitures")
        .select("*, agences(nom, ville)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `cars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('voitures-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('voitures-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Veuillez sélectionner une image", variant: "destructive" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "L'image ne doit pas dépasser 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        setForm({ ...form, image_url: url });
        setImagePreview(url);
        toast({ title: "Image uploadée avec succès" });
      }
    } catch (error) {
      toast({ title: "Erreur lors de l'upload de l'image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setForm({ ...form, image_url: "" });
    setImagePreview(null);
  };

  const createMutation = useMutation({
    mutationFn: async (data: VoitureForm) => {
      const { error } = await supabase.from("voitures").insert({
        marque: data.marque,
        modele: data.modele,
        categorie: data.categorie,
        prix_jour: data.prix_jour,
        places: data.places,
        portes: data.portes,
        boite: data.boite,
        carburant: data.carburant,
        climatisation: data.climatisation,
        disponible: data.disponible,
        image_url: data.image_url || null,
        description: data.description || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-voitures"] });
      toast({ title: "Véhicule ajouté avec succès" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Erreur lors de l'ajout", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: VoitureForm }) => {
      const { error } = await supabase.from("voitures").update({
        marque: data.marque,
        modele: data.modele,
        categorie: data.categorie,
        prix_jour: data.prix_jour,
        places: data.places,
        portes: data.portes,
        boite: data.boite,
        carburant: data.carburant,
        climatisation: data.climatisation,
        disponible: data.disponible,
        image_url: data.image_url || null,
        description: data.description || null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-voitures"] });
      toast({ title: "Véhicule mis à jour" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("voitures").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-voitures"] });
      toast({ title: "Véhicule supprimé" });
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setIsOpen(false);
    setImagePreview(null);
  };

  const handleEdit = (voiture: typeof voitures extends (infer T)[] | null | undefined ? T : never) => {
    if (!voiture) return;
    setForm({
      marque: voiture.marque,
      modele: voiture.modele,
      categorie: voiture.categorie as CategorieVoiture,
      prix_jour: voiture.prix_jour,
      places: voiture.places,
      portes: voiture.portes,
      boite: voiture.boite as BoiteVitesse,
      carburant: voiture.carburant as Carburant,
      climatisation: voiture.climatisation ?? true,
      disponible: voiture.disponible ?? true,
      image_url: voiture.image_url || "",
      description: voiture.description || "",
    });
    setImagePreview(voiture.image_url || null);
    setEditingId(voiture.id);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const filteredVoitures = voitures?.filter(
    (v) =>
      v.marque.toLowerCase().includes(search.toLowerCase()) ||
      v.modele.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Véhicules</h1>
          <p className="text-muted-foreground">Gérez votre flotte de véhicules</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un véhicule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Modifier le véhicule" : "Ajouter un véhicule"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Marque</Label>
                  <Input
                    value={form.marque}
                    onChange={(e) => setForm({ ...form, marque: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modèle</Label>
                  <Input
                    value={form.modele}
                    onChange={(e) => setForm({ ...form, modele: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select 
                    value={form.categorie} 
                    onValueChange={(v: CategorieVoiture) => setForm({ ...form, categorie: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prix/jour (DH)</Label>
                  <Input
                    type="number"
                    value={form.prix_jour}
                    onChange={(e) => setForm({ ...form, prix_jour: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Places</Label>
                  <Input
                    type="number"
                    value={form.places}
                    onChange={(e) => setForm({ ...form, places: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Boîte</Label>
                  <Select 
                    value={form.boite} 
                    onValueChange={(v: BoiteVitesse) => setForm({ ...form, boite: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {boites.map((b) => (
                        <SelectItem key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Carburant</Label>
                  <Select 
                    value={form.carburant} 
                    onValueChange={(v: Carburant) => setForm({ ...form, carburant: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {carburants.map((c) => (
                        <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Image du véhicule</Label>
                {imagePreview || form.image_url ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-secondary">
                    <img 
                      src={imagePreview || form.image_url} 
                      alt="Aperçu" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Cliquez pour uploader</span>
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (max. 5MB)</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="accent" className="flex-1" disabled={uploading}>
                  {editingId ? "Mettre à jour" : "Ajouter"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un véhicule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List */}
      <div className="grid gap-4">
        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : filteredVoitures?.length === 0 ? (
          <p className="text-muted-foreground">Aucun véhicule trouvé</p>
        ) : (
          filteredVoitures?.map((voiture) => (
            <Card key={voiture.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-32 sm:h-auto bg-secondary">
                  {voiture.image_url ? (
                    <img src={voiture.image_url} alt={`${voiture.marque} ${voiture.modele}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 p-4 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{voiture.marque} {voiture.modele}</h3>
                      <Badge variant={voiture.disponible ? "default" : "secondary"}>
                        {voiture.disponible ? "Disponible" : "Indisponible"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{voiture.categorie}</span>
                      <span>•</span>
                      <span>{voiture.places} places</span>
                      <span>•</span>
                      <span>{voiture.boite}</span>
                      <span>•</span>
                      <span>{voiture.carburant}</span>
                    </div>
                    <p className="text-lg font-bold text-accent">{voiture.prix_jour} DH/jour</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(voiture)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => deleteMutation.mutate(voiture.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
