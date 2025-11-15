import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { Resend } from 'resend';
import { ContactMessage } from '../../../types';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;
const adminEmail = process.env.ADMIN_EMAIL;

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ message: 'Clientul Supabase nu este configurat pe server.' }, { status: 500 });
  }
  
  const message: ContactMessage = await request.json();

  // 1. Save to Supabase
  const { error: supabaseError } = await supabase
    .from('contact_messages')
    .insert([message]);

  if (supabaseError) {
    console.error('Eroare Supabase:', supabaseError);
    return NextResponse.json({ message: 'Eroare la baza de date', error: supabaseError.message }, { status: 500 });
  }

  // 2. Send email via Resend
   if (!fromEmail || !adminEmail || !process.env.RESEND_API_KEY) {
    console.error('Configurația de email lipsește din variabilele de mediu.');
    return NextResponse.json({ message: 'Mesaj trimis, dar configurarea notificării prin email a eșuat.' }, { status: 201 });
  }

  try {
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
  } catch (emailError) {
    console.error('Eroare Resend:', emailError);
    return NextResponse.json({ message: 'Mesaj trimis, dar trimiterea notificării prin email a eșuat.' }, { status: 201 });
  }

  return NextResponse.json({ message: 'Mesaj trimis cu succes!' }, { status: 201 });
}