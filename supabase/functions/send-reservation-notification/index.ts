import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReservationNotificationRequest {
  reservation_id: string;
  numero_reservation: string;
  client_nom: string;
  client_prenom: string;
  client_email: string;
  client_telephone: string;
  voiture_marque: string;
  voiture_modele: string;
  date_debut: string;
  date_fin: string;
  heure_retrait: string;
  heure_retour: string;
  prix_total: number;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-reservation-notification function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ReservationNotificationRequest = await req.json();
    console.log("Received reservation data:", JSON.stringify(data));

    const {
      numero_reservation,
      client_nom,
      client_prenom,
      client_email,
      client_telephone,
      voiture_marque,
      voiture_modele,
      date_debut,
      date_fin,
      heure_retrait,
      heure_retour,
      prix_total,
      notes,
    } = data;

    // Format dates for display
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Email to admin (winxcarloc@gmail.com)
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; color: #f97316; margin-bottom: 10px; border-bottom: 2px solid #f97316; padding-bottom: 5px; }
          .info-row { display: flex; margin-bottom: 8px; }
          .info-label { font-weight: bold; width: 150px; color: #6b7280; }
          .info-value { color: #111827; }
          .price { font-size: 24px; font-weight: bold; color: #f97316; }
          .footer { background: #1f2937; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🚗 Nouvelle Réservation</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">#${numero_reservation}</p>
          </div>
          <div class="content">
            <div class="section">
              <div class="section-title">👤 Informations Client</div>
              <div class="info-row">
                <span class="info-label">Nom complet:</span>
                <span class="info-value">${client_prenom} ${client_nom}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${client_email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Téléphone:</span>
                <span class="info-value">${client_telephone}</span>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">🚘 Véhicule Réservé</div>
              <div class="info-row">
                <span class="info-label">Véhicule:</span>
                <span class="info-value">${voiture_marque} ${voiture_modele}</span>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">📅 Dates de Location</div>
              <div class="info-row">
                <span class="info-label">Retrait:</span>
                <span class="info-value">${formatDate(date_debut)} à ${heure_retrait}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Retour:</span>
                <span class="info-value">${formatDate(date_fin)} à ${heure_retour}</span>
              </div>
            </div>
            
            ${notes ? `
            <div class="section">
              <div class="section-title">📝 Notes</div>
              <p>${notes}</p>
            </div>
            ` : ''}
            
            <div class="section" style="text-align: center; padding: 20px; background: white; border-radius: 8px;">
              <div style="color: #6b7280; margin-bottom: 5px;">Prix Total</div>
              <div class="price">${prix_total.toLocaleString("fr-FR")} MAD</div>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0;">Winxcar Location - Marrakech</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">+212 7 20 00 36 61</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email de confirmation au client
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 25px; border: 1px solid #e5e7eb; }
          .section { margin-bottom: 25px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .section-title { font-weight: bold; color: #f97316; margin-bottom: 15px; font-size: 16px; }
          .info-row { margin-bottom: 10px; }
          .info-label { font-weight: bold; color: #6b7280; }
          .info-value { color: #111827; }
          .price-box { text-align: center; padding: 25px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 8px; }
          .price { font-size: 28px; font-weight: bold; color: #f97316; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          .cta-button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">✅ Réservation Confirmée!</h1>
            <p style="margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">Merci pour votre confiance, ${client_prenom}!</p>
            <p style="margin: 10px 0 0 0; font-size: 20px; font-weight: bold;">#${numero_reservation}</p>
          </div>
          <div class="content">
            <div class="section">
              <div class="section-title">🚘 Votre Véhicule</div>
              <p style="font-size: 20px; font-weight: bold; margin: 0; color: #111827;">${voiture_marque} ${voiture_modele}</p>
            </div>
            
            <div class="section">
              <div class="section-title">📅 Détails de la Location</div>
              <div class="info-row">
                <div class="info-label">📍 Retrait</div>
                <div class="info-value">${formatDate(date_debut)} à ${heure_retrait}</div>
              </div>
              <div class="info-row" style="margin-top: 15px;">
                <div class="info-label">📍 Retour</div>
                <div class="info-value">${formatDate(date_fin)} à ${heure_retour}</div>
              </div>
              <div class="info-row" style="margin-top: 15px;">
                <div class="info-label">📍 Lieu</div>
                <div class="info-value">Winxcar Marrakech</div>
              </div>
            </div>
            
            <div class="price-box">
              <div style="color: #92400e; margin-bottom: 5px; font-size: 14px;">Prix Total de la Location</div>
              <div class="price">${prix_total.toLocaleString("fr-FR")} MAD</div>
            </div>
            
            <div class="section" style="background: #fef3c7; border-left: 4px solid #f97316;">
              <div class="section-title" style="color: #92400e;">📞 Contact</div>
              <p style="margin: 0;">Pour toute question, contactez-nous:</p>
              <p style="margin: 10px 0 0 0; font-weight: bold;">+212 7 20 00 36 61</p>
              <p style="margin: 5px 0 0 0;">winxcarloc@gmail.com</p>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0; font-size: 18px; font-weight: bold;">Winxcar Location</p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">Votre partenaire de confiance à Marrakech</p>
            <a href="https://wa.me/212720003661" class="cta-button">💬 Nous contacter sur WhatsApp</a>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email à l'admin
    console.log("Sending admin notification email...");
    const adminEmailResponse = await resend.emails.send({
      from: "Winxcar <notifications@winxcar.com>",
      to: ["winxcarloc@gmail.com"],
      subject: `🚗 Nouvelle Réservation #${numero_reservation} - ${client_prenom} ${client_nom}`,
      html: adminEmailHtml,
    });
    console.log("Admin email response:", JSON.stringify(adminEmailResponse));

    // Envoyer l'email de confirmation au client
    console.log("Sending client confirmation email...");
    const clientEmailResponse = await resend.emails.send({
      from: "Winxcar <reservations@winxcar.com>",
      to: [client_email],
      subject: `✅ Confirmation de réservation #${numero_reservation} - Winxcar`,
      html: clientEmailHtml,
    });
    console.log("Client email response:", JSON.stringify(clientEmailResponse));

    return new Response(
      JSON.stringify({
        success: true,
        adminEmail: adminEmailResponse,
        clientEmail: clientEmailResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-reservation-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
