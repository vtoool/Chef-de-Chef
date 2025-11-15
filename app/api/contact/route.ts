import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { Resend } from 'resend';
import { ContactMessage } from '../../../types';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;
const adminEmail = process.env.ADMIN_EMAIL;

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ message: 'Supabase client is not configured on the server.' }, { status: 500 });
  }
  
  const message: ContactMessage = await request.json();

  // 1. Save to Supabase
  const { error: supabaseError } = await supabase
    .from('contact_messages')
    .insert([message]);

  if (supabaseError) {
    console.error('Supabase error:', supabaseError);
    return NextResponse.json({ message: 'Database error', error: supabaseError.message }, { status: 500 });
  }

  // 2. Send email via Resend
   if (!fromEmail || !adminEmail || !process.env.RESEND_API_KEY) {
    console.error('Email configuration missing in environment variables.');
    return NextResponse.json({ message: 'Message sent, but email notification failed to configure.' }, { status: 201 });
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
    console.error('Resend error:', emailError);
    return NextResponse.json({ message: 'Message sent, but email notification failed to send.' }, { status: 201 });
  }

  return NextResponse.json({ message: 'Message sent successfully!' }, { status: 201 });
}
