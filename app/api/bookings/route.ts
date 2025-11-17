import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { Resend } from 'resend';
import { Booking } from '../../../types';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;
const adminEmail = process.env.ADMIN_EMAIL;

// --- STYLED EMAIL TEMPLATES ---

const logoUrl = "https://scontent.fkiv7-1.fna.fbcdn.net/v/t39.30808-6/456236959_829273562675263_5934463475455699464_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-FwFg2FB9XoQ7kNvwE_khUg&_nc_oc=AdksXFMIZCuyZ_qiRyTobtMYjXbrpMRUTfB_UxWQviL9dwKY2JSbGc9mZ4fG0Jd1PDDofFzdHDXrwb4BgViofAG8&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=M9t8gcOoEteEPolC2SuR9Q&oh=00_AfhhmmqUYoveeMuTaQdkbvqE973TIqDyPsIaCJ4E-mYWAQ&oe=691DA8FB";
const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

const emailStyles = {
    body: `background-color: #FFF7E5; font-family: Arial, sans-serif; color: #3B2414; line-height: 1.6;`,
    container: `max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px;`,
    header: `font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #3B2414; text-align: center; margin-bottom: 20px;`,
    h1: `font-family: Georgia, serif; color: #3B2414;`,
    p: `font-size: 16px; color: #5A3A26;`,
    detailsTable: `width: 100%; border-collapse: collapse; margin-top: 20px;`,
    tableCell: `padding: 10px; border-bottom: 1px solid #EAEAEA;`,
    footer: `text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #EAEAEA;`,
    signature: `font-family: 'Yesteryear', cursive; font-size: 28px; color: #F7931E;`,
    contact: `font-size: 12px; color: #5A3A26;`
};

const generateCustomerEmailHtml = (booking: Booking): string => `
<body style="${emailStyles.body}">
  <div style="${emailStyles.container}">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${logoUrl}" alt="Chef de Chef Logo" style="width: 60px; height: 60px; border-radius: 50%;">
    </div>
    <h1 style="${emailStyles.h1}">Salut ${booking.name},</h1>
    <p style="${emailStyles.p}">Vă mulțumim pentru interesul acordat ansamblului nostru! Am primit cu succes cererea dumneavoastră de rezervare și o vom procesa în cel mai scurt timp.</p>
    <p style="${emailStyles.p}">Un membru al echipei noastre vă va contacta telefonic sau prin email pentru a confirma disponibilitatea și pentru a stabili toate detaliile necesare.</p>
    <table style="${emailStyles.detailsTable}">
      <tr><td style="${emailStyles.tableCell}"><strong>Data evenimentului:</strong></td><td style="${emailStyles.tableCell}">${booking.event_date}</td></tr>
      <tr><td style="${emailStyles.tableCell}"><strong>Tipul evenimentului:</strong></td><td style="${emailStyles.tableCell}">${booking.event_type}</td></tr>
      <tr><td style="${emailStyles.tableCell}"><strong>Locația:</strong></td><td style="${emailStyles.tableCell}">${booking.location}</td></tr>
    </table>
    <div style="${emailStyles.footer}">
      <p style="${emailStyles.signature}">Chef de Chef</p>
      <p style="${emailStyles.contact}">
        Cu dragoste pentru tradiție,<br>
        <strong>Ansamblul Chef de Chef</strong><br>
        <a href="tel:+37312345678" style="color: #5A3A26;">+373 12 345 678</a> | <a href="mailto:contact@chefdechef.md" style="color: #5A3A26;">contact@chefdechef.md</a>
      </p>
    </div>
  </div>
</body>
`;

const generateAdminEmailHtml = (booking: Booking): string => `
<body style="${emailStyles.body}">
  <div style="${emailStyles.container}">
    <h1 style="${emailStyles.h1}">Cerere Nouă de Rezervare</h1>
    <p style="${emailStyles.p}">A fost primită o nouă cerere de rezervare prin intermediul website-ului.</p>
    <table style="${emailStyles.detailsTable}">
      <tr><td style="${emailStyles.tableCell} width: 30%;"><strong>Nume Client:</strong></td><td style="${emailStyles.tableCell}">${booking.name}</td></tr>
      <tr><td style="${emailStyles.tableCell}"><strong>Email:</strong></td><td style="${emailStyles.tableCell}"><a href="mailto:${booking.email}">${booking.email}</a></td></tr>
      <tr><td style="${emailStyles.tableCell}"><strong>Telefon:</strong></td><td style="${emailStyles.tableCell}"><a href="tel:${booking.phone}">${booking.phone}</a></td></tr>
      <tr><td style="${emailStyles.tableCell}"><strong>Data Eveniment:</strong></td><td style="${emailStyles.tableCell}"><strong>${booking.event_date}</strong></td></tr>
      <tr><td style="${emailStyles.tableCell}"><strong>Tip Eveniment:</strong></td><td style="${emailStyles.tableCell}">${booking.event_type}</td></tr>
      <tr><td style="${emailStyles.tableCell}"><strong>Locație:</strong></td><td style="${emailStyles.tableCell}">${booking.location}</td></tr>
      <tr><td style="${emailStyles.tableCell}"><strong>Note Client:</strong></td><td style="${emailStyles.tableCell}">${booking.notes || 'N/A'}</td></tr>
    </table>
    <div style="margin-top: 20px; text-align: center;">
      <a href="${siteUrl}/admin/dashboard" style="background-color: #F7931E; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Vezi în Panoul de Admin</a>
    </div>
  </div>
</body>
`;


export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ message: 'Clientul Supabase nu este configurat pe server.' }, { status: 500 });
  }
  
  const booking: Booking = await request.json();

  // 1. Save to Supabase
  const { error: supabaseError } = await supabase
    .from('bookings')
    .insert([booking]);

  if (supabaseError) {
    console.error('Eroare Supabase:', supabaseError);
    return NextResponse.json({ message: 'Eroare la baza de date', error: supabaseError.message }, { status: 500 });
  }

  // 2. Upsert client info, now including notes
  if (booking.name && booking.email && booking.phone) {
      const { error: rpcError } = await supabase.rpc('upsert_client', {
        client_name: booking.name,
        client_email: booking.email.toLowerCase(),
        client_phone: booking.phone,
        new_note: booking.notes,
      });
    
      if (rpcError) {
        // This is a non-critical error, so we just log it and continue
        console.warn('RPC upsert_client error (booking):', rpcError);
      }
  }

  // 3. Send emails via Resend
  if (!fromEmail || !adminEmail || !process.env.RESEND_API_KEY) {
    console.error('Configurația de email lipsește din variabilele de mediu.');
    // Still return success to the user as the booking was saved.
    // The admin will need to check the DB manually.
    return NextResponse.json({ message: 'Rezervare reușită, dar configurarea notificării prin email a eșuat.' }, { status: 201 });
  }

  try {
    // Email to customer
    await resend.emails.send({
      from: `Chef de Chef <${fromEmail}>`,
      to: booking.email,
      subject: 'Cererea de rezervare a fost primită!',
      html: generateCustomerEmailHtml(booking),
    });

    // Email to admin
    await resend.emails.send({
      from: `Notificare Site <${fromEmail}>`,
      to: adminEmail,
      subject: `Cerere nouă de rezervare pentru ${booking.event_date}`,
      html: generateAdminEmailHtml(booking),
    });

  } catch (emailError) {
    console.error('Eroare Resend:', emailError);
    // Again, don't fail the request if the booking was saved.
    return NextResponse.json({ message: 'Rezervare reușită, dar trimiterea notificării prin email a eșuat.' }, { status: 201 });
  }

  return NextResponse.json({ message: 'Rezervare reușită!' }, { status: 201 });
}
