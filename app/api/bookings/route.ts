import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { Resend } from 'resend';
import { Booking } from '../../../types';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;
const adminEmail = process.env.ADMIN_EMAIL;

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

  } catch (emailError) {
    console.error('Eroare Resend:', emailError);
    // Again, don't fail the request if the booking was saved.
    return NextResponse.json({ message: 'Rezervare reușită, dar trimiterea notificării prin email a eșuat.' }, { status: 201 });
  }

  return NextResponse.json({ message: 'Rezervare reușită!' }, { status: 201 });
}