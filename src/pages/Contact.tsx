import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAgences } from "@/hooks/useAgences";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Loader2 } from "lucide-react";

export default function Contact() {
  const { data: agences } = useAgences();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    setFormData({ nom: "", email: "", telephone: "", sujet: "", message: "" });
    setIsSubmitting(false);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je souhaite obtenir des informations sur la location de véhicules.");
    window.open(`https://wa.me/212522123456?text=${message}`, "_blank");
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary/30 py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Contactez-nous
          </h1>
          <p className="text-muted-foreground text-lg">
            Une question ? Notre équipe est là pour vous aider.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h2 className="font-heading font-semibold text-xl mb-4">Contact rapide</h2>
                <div className="space-y-4">
                  <a href="tel:+212522123456" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium text-card-foreground">+212 522 123 456</p>
                    </div>
                  </a>
                  <a href="mailto:contact@winxcar.ma" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-card-foreground">contact@winxcar.ma</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Horaires</p>
                      <p className="font-medium text-card-foreground">Lun-Sam: 8h-20h</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleWhatsApp} className="w-full mt-6 bg-[#25D366] hover:bg-[#128C7E] text-white">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </div>

              {/* Agences */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h2 className="font-heading font-semibold text-xl mb-4">Nos agences</h2>
                <div className="space-y-4">
                  {agences?.slice(0, 4).map((agence) => (
                    <div key={agence.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-accent mt-1 shrink-0" />
                        <div>
                          <p className="font-medium text-card-foreground">{agence.nom}</p>
                          <p className="text-sm text-muted-foreground">{agence.adresse}</p>
                          {agence.telephone && (
                            <a href={`tel:${agence.telephone}`} className="text-sm text-accent hover:underline">
                              {agence.telephone}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft">
                <h2 className="font-heading font-semibold text-xl mb-6">Envoyez-nous un message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom complet *</Label>
                      <Input
                        id="nom"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                        id="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        placeholder="+212 6XX XXX XXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sujet">Sujet *</Label>
                      <Input
                        id="sujet"
                        required
                        value={formData.sujet}
                        onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                        placeholder="Objet de votre message"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez votre demande..."
                    />
                  </div>

                  <Button type="submit" variant="accent" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Map placeholder */}
              <div className="mt-6 bg-secondary rounded-2xl overflow-hidden h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p>Carte Google Maps</p>
                  <p className="text-sm">123 Boulevard Mohammed V, Casablanca</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
