import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useBlogs } from "@/hooks/useBlogs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, ArrowRight, User } from "lucide-react";

export default function Blog() {
  const { data: blogs, isLoading } = useBlogs(true);

  return (
    <Layout>
      <section className="bg-secondary/30 py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Notre <span className="text-accent">Blog</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Conseils, guides et actualités sur la location de voitures au Maroc.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Chargement...</div>
          ) : !blogs?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun article pour le moment. Revenez bientôt !
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.slug}`}
                  className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                >
                  {blog.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(blog.created_at), "d MMM yyyy", { locale: fr })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {blog.author}
                      </span>
                    </div>
                    <h2 className="font-heading font-semibold text-lg text-card-foreground mb-2 group-hover:text-accent transition-colors">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-2">{blog.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center gap-1 text-accent text-sm font-medium">
                      Lire la suite
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
