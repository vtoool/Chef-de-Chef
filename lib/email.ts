// WARNING: CRITICAL SECURITY RISK
// This implementation exposes your RESEND_API_KEY to the public in the browser.
// An attacker could find this key and use your Resend account to send emails,
// which could lead to high costs and your account being suspended.
//
// FOR PRODUCTION: This logic MUST be moved to a secure backend environment,
// such as a Vercel Serverless Function, Next.js API Route, or a Supabase Edge Function.
// This client-side implementation is for demonstration purposes ONLY.

import { Booking, ContactMessage } from '../types';

// --- IMPORTANT ---
// Replace this placeholder value with your actual Resend API Key.
// You can create one in your Resend dashboard under "API Keys".
const resendApiKey = 'YOUR_RESEND_API_KEY';

const isResendConfigured = resendApiKey && resendApiKey !== 'YOUR_RESEND_API_KEY';

if (!isResendConfigured) {
  console.warn("Resend API key is not set. Email functionality will be disabled. Update the placeholder in lib/email.ts");
}

// IMPORTANT: Replace with your verified Resend domain and admin email address.
const fromEmail = 'noreply@your-verified-domain.com'; 
const adminEmail = 'your-admin-email@example.com'; 

export const sendBookingConfirmationEmail = async (booking: Booking) => {
  if (!isResendConfigured) return;

  try {
    // Dynamically import Resend to avoid module-loading issues on page render.
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    // Email to customer
    await resend.emails.send({
      from: `Chef de Chef <${fromEmail}>`,
      to: booking.email,
      subject: 'Cererea de rezervare a fost primită!',
      html: `<h1>Salut ${booking.name},</h1><p>Am primit cererea ta de rezervare pentru data de <strong>${booking.event_date}</strong>. Te vom contacta în cel mai scurt timp pentru a confirma toate detaliile.</p><p>Cu drag,<br>Ansamblul Chef de Chef</p>`,
    });

    // Email to admin
    await resend.emails.send({
      from: `Notificare Site <${fromEmail}>`,
      to: adminEmail,
      subject: `Cerere nouă de rezervare pentru ${booking.event_date}`,
      html: `<h1>Cerere Nouă de Rezervare</h1>
             <p><strong>Nume:</strong> ${booking.name}</p>
             <p><strong>Email:</strong> ${booking.email}</p>
             <p><strong>Telefon:</strong> ${booking.phone}</p>
             <p><strong>Data Eveniment:</strong> ${booking.event_date}</p>
             <p><strong>Tip Eveniment:</strong> ${booking.event_type}</p>
             <p><strong>Locație:</strong> ${booking.location}</p>
             <p><strong>Note:</strong> ${booking.notes || 'N/A'}</p>`,
    });
  } catch (error) {
    console.error('Error sending booking emails:', error);
  }
};

export const sendContactNotificationEmail = async (message: ContactMessage) => {
    if (!isResendConfigured) return;
  try {
    // Dynamically import Resend to avoid module-loading issues on page render.
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: `Notificare Site <${fromEmail}>`,
      to: adminEmail,
      subject: `Mesaj nou de la ${message.name}`,
      html: `<h1>Mesaj Nou de Contact</h1>
             <p><strong>Nume:</strong> ${message.name}</p>
             <p><strong>Email:</strong> ${message.email}</p>
             <p><strong>Telefon:</strong> ${message.phone}</p>
             <p><strong>Mesaj:</strong></p>
             <p>${message.message}</p>`,
    });
  } catch (error)
{
    console.error('Error sending contact email:', error);
  }
};
