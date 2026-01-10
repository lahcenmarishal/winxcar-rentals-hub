import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";

const CATEGORIES = [
  { id: "economique", name: "Économique", description: "Parfait pour les trajets urbains" },
  { id: "compacte", name: "Compacte", description: "Polyvalente et confortable" },
  { id: "berline", name: "Berline", description: "Élégance et espace" },
  { id: "suv", name: "SUV", description: "Aventure et confort" },
  { id: "luxe", name: "Luxe", description: "Prestige et performance" },
  { id: "utilitaire", name: "Utilitaire", description: "Pour vos besoins pros" },
];

const DEFAULT_IMAGES: Record<string, string> = {
  economique: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80",
  compacte: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&q=80",
  berline: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80",
  suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80",
  luxe: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80",
  utilitaire: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
};

export default function Categories() {
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categoryImages, isLoading } = useQuery({
    queryKey: ["category-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_images")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async ({ categoryId, imageUrl }: { categoryId: string; imageUrl: string }) => {
      const { error } = await supabase
        .from("category_images")
        .upsert({ category_id: categoryId, image_url: imageUrl }, { onConflict: "category_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-images"] });
      toast({ title: "Image mise à jour avec succès" });
    },
    onError: (error: Error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from("category_images")
        .delete()
        .eq("category_id", categoryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-images"] });
      toast({ title: "Image supprimée, l'image par défaut sera utilisée" });
    },
    onError: (error: Error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const handleUpload = async (categoryId: string, file: File) => {
    setUploading(categoryId);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${categoryId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("category-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("category-images")
        .getPublicUrl(fileName);

      await upsertMutation.mutateAsync({ categoryId, imageUrl: publicUrl });
    } catch (error: any) {
      toast({ title: "Erreur d'upload", description: error.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const getImageUrl = (categoryId: string) => {
    const customImage = categoryImages?.find((img) => img.category_id === categoryId);
    return customImage?.image_url || DEFAULT_IMAGES[categoryId];
  };

  const hasCustomImage = (categoryId: string) => {
    return categoryImages?.some((img) => img.category_id === categoryId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">Images des Catégories</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les images affichées sur la page d'accueil pour chaque catégorie
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              <img
                src={getImageUrl(category.id)}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-heading font-bold text-lg text-white">{category.name}</h3>
                <p className="text-white/70 text-sm">{category.description}</p>
              </div>
              {hasCustomImage(category.id) && (
                <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                  Personnalisée
                </div>
              )}
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex gap-2">
                <Label
                  htmlFor={`upload-${category.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2 py-2 px-4 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors text-sm font-medium">
                    {uploading === category.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploading === category.id ? "Upload..." : "Changer l'image"}
                  </div>
                  <Input
                    id={`upload-${category.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(category.id, file);
                    }}
                    disabled={uploading !== null}
                  />
                </Label>
                {hasCustomImage(category.id) && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteMutation.mutate(category.id)}
                    disabled={deleteMutation.isPending}
                    title="Réinitialiser à l'image par défaut"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
