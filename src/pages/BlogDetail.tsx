import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useBlog } from "@/hooks/useBlogs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading } = useBlog(slug || "");

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 text-center text-muted-foreground">Chargement...</div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Article non trouvé</h1>
          <Link to="/blog">
            <Button variant="accent">Retour au blog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-8 md:py-12">
        <div className="container max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-accent hover:underline mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>

          {blog.image_url && (
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full aspect-video object-cover rounded-2xl mb-8"
            />
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(blog.created_at), "d MMMM yyyy", { locale: fr })}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {blog.author}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            {blog.title}
          </h1>

          <div
            className="prose prose-lg max-w-none text-foreground prose-headings:font-heading prose-headings:text-foreground prose-a:text-accent"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>
    </Layout>
  );
}
