import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Loader2 } from "lucide-react";

// Informations de l'unique agence Winxcar
const AGENCE_INFO = {
  nom: "Winxcar Marrakech",
  adresse: "N° 2, Immeuble 224, Al Housna, Mhamid, Marrakech",
  telephone: "+212 7 20 00 36 61",
  email: "winxcarloc@gmail.com",
  horaires: "Lun-Dim: 8h-20h",
};

export default function Contact() {
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
    window.open(`https://wa.me/212720003661?text=${message}`, "_blank");
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
                  <a href={`tel:${AGENCE_INFO.telephone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium text-card-foreground">{AGENCE_INFO.telephone}</p>
                    </div>
                  </a>
                  <a href={`mailto:${AGENCE_INFO.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-card-foreground">{AGENCE_INFO.email}</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Horaires</p>
                      <p className="font-medium text-card-foreground">{AGENCE_INFO.horaires}</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleWhatsApp} className="w-full mt-6 bg-[#25D366] hover:bg-[#128C7E] text-white">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </div>

              {/* Notre Agence */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <h2 className="font-heading font-semibold text-xl mb-4">Notre agence</h2>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent mt-1 shrink-0" />
                  <div>
                    <p className="font-medium text-card-foreground">{AGENCE_INFO.nom}</p>
                    <p className="text-sm text-muted-foreground mt-1">{AGENCE_INFO.adresse}</p>
                    <a href={`tel:${AGENCE_INFO.telephone.replace(/\s/g, '')}`} className="text-sm text-accent hover:underline mt-2 inline-block">
                      {AGENCE_INFO.telephone}
                    </a>
                  </div>
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

              {/* Google Maps */}
              <div className="mt-6 bg-card rounded-2xl overflow-hidden shadow-soft">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.4744665065455!2d-8.0496184!3d31.5934564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafe9006ee8fdbf%3A0x25259f745f2601e4!2sHousna!5e0!3m2!1sfr!2sfr!4v1767689824781!5m2!1sfr!2sfr" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Winxcar Marrakech"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
