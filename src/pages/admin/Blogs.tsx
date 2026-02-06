import { useState } from "react";
import { useBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog, uploadBlogImage } from "@/hooks/useBlogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, Loader2, Image } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Blog } from "@/hooks/useBlogs";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  image_url: "",
  published: false,
  author: "Winxcar",
};

export default function Blogs() {
  const { data: blogs, isLoading } = useBlogs();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditingBlog(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || "",
      image_url: blog.image_url || "",
      published: blog.published,
      author: blog.author,
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadBlogImage(file);
      setForm((f) => ({ ...f, image_url: url }));
      toast({ title: "Image téléchargée" });
    } catch {
      toast({ title: "Erreur", description: "Échec du téléchargement", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast({ title: "Erreur", description: "Titre et contenu requis", variant: "destructive" });
      return;
    }
    setSaving(true);
    const slug = form.slug || slugify(form.title);
    try {
      if (editingBlog) {
        await updateBlog.mutateAsync({ id: editingBlog.id, ...form, slug });
        toast({ title: "Article mis à jour" });
      } else {
        await createBlog.mutateAsync({ ...form, slug });
        toast({ title: "Article créé" });
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    try {
      await deleteBlog.mutateAsync(id);
      toast({ title: "Article supprimé" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const togglePublish = async (blog: Blog) => {
    await updateBlog.mutateAsync({ id: blog.id, published: !blog.published });
    toast({ title: blog.published ? "Article dépublié" : "Article publié" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Blog</h1>
          <p className="text-muted-foreground">Gérez vos articles de blog</p>
        </div>
        <Button onClick={openNew} variant="accent">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel article
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : !blogs?.length ? (
        <div className="text-center py-12 bg-card rounded-2xl">
          <p className="text-muted-foreground">Aucun article. Créez votre premier article !</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-card rounded-xl p-4 flex items-center gap-4 shadow-soft">
              {blog.image_url ? (
                <img src={blog.image_url} alt="" className="w-20 h-14 object-cover rounded-lg shrink-0" />
              ) : (
                <div className="w-20 h-14 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                  <Image className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-card-foreground truncate">{blog.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(blog.created_at), "d MMM yyyy", { locale: fr })} • {blog.author}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => togglePublish(blog)} title={blog.published ? "Dépublier" : "Publier"}>
                  {blog.published ? <Eye className="w-4 h-4 text-accent" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(blog)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })}
                placeholder="Titre de l'article"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="url-de-larticle"
              />
            </div>
            <div className="space-y-2">
              <Label>Extrait</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Résumé court de l'article"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Contenu * (HTML)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="<p>Contenu de l'article...</p>"
                rows={10}
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="URL de l'image ou téléchargez"
                  className="flex-1"
                />
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <Button variant="outline" size="icon" asChild disabled={uploading}>
                    <span>{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}</span>
                  </Button>
                </label>
              </div>
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg mt-2" />
              )}
            </div>
            <div className="space-y-2">
              <Label>Auteur</Label>
              <Input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              <Label>Publié</Label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button variant="accent" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingBlog ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
