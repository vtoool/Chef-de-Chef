import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { Resend } from 'resend';
import { Booking } from '../../../types';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;
const adminEmail = process.env.ADMIN_EMAIL;

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ message: 'Supabase client is not configured on the server.' }, { status: 500 });
  }
  
  const booking: Booking = await request.json();

  // 1. Save to Supabase
  const { error: supabaseError } = await supabase
    .from('bookings')
    .insert([booking]);

  if (supabaseError) {
    console.error('Supabase error:', supabaseError);
    return NextResponse.json({ message: 'Database error', error: supabaseError.message }, { status: 500 });
  }

  // 2. Send emails via Resend
  if (!fromEmail || !adminEmail || !process.env.RESEND_API_KEY) {
    console.error('Email configuration missing in environment variables.');
    // Still return success to the user as the booking was saved.
    // The admin will need to check the DB manually.
    return NextResponse.json({ message: 'Booking successful, but email notification failed to configure.' }, { status: 201 });
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
    console.error('Resend error:', emailError);
    // Again, don't fail the request if the booking was saved.
    return NextResponse.json({ message: 'Booking successful, but email notification failed to send.' }, { status: 201 });
  }

  return NextResponse.json({ message: 'Booking successful!' }, { status: 201 });
}
