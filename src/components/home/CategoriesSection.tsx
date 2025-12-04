import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "economique",
    name: "Économique",
    description: "Parfait pour les trajets urbains",
    price: "250",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80",
  },
  {
    id: "compacte",
    name: "Compacte",
    description: "Polyvalente et confortable",
    price: "300",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&q=80",
  },
  {
    id: "berline",
    name: "Berline",
    description: "Élégance et espace",
    price: "450",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80",
  },
  {
    id: "suv",
    name: "SUV",
    description: "Aventure et confort",
    price: "400",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80",
  },
  {
    id: "luxe",
    name: "Luxe",
    description: "Prestige et performance",
    price: "800",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80",
  },
  {
    id: "utilitaire",
    name: "Utilitaire",
    description: "Pour vos besoins pros",
    price: "350",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
              Nos catégories de véhicules
            </h2>
            <p className="text-muted-foreground text-lg">
              Un véhicule adapté à chaque besoin et budget.
            </p>
          </div>
          <Link to="/catalogue">
            <Button variant="outline" className="group">
              Voir tout le catalogue
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/catalogue?categorie=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-soft hover:shadow-card transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-white mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-white/70 text-sm">{cat.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-xl">{cat.price} DH</p>
                    <p className="text-white/60 text-xs">par jour</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
