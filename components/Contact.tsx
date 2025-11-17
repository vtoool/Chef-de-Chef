'use client';

import React, { useState } from 'react';
import { ContactMessage } from '../types';
import { isSupabaseConfigured } from '../lib/supabaseClient';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setFormStatus({ type: 'idle', message: '' });

        const newContactMessage: ContactMessage = { ...formData };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContactMessage),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }

            setFormStatus({ type: 'success', message: 'Mesaj trimis! Vă mulțumim.' });
            setFormData({ name: '', email: '', phone: '', message: '' });

        } catch (error) {
            setFormStatus({ type: 'error', message: 'A apărut o eroare. Vă rugăm să încercați din nou.' });
            console.error('Contact form submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <section id="contact" className="py-12 md:py-16 bg-brand-cream">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">Contactați-ne</h2>
            <p className="text-brand-brown-light max-w-3xl mx-auto mb-10">
                Alegeți metoda preferată: contactați-ne direct pentru o discuție rapidă sau completați formularul și vă vom suna noi pentru a stabili toate detaliile.
            </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Direct Contact Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg h-full">
                <h3 className="font-serif text-xl font-bold text-brand-brown-dark mb-4">Contact Direct</h3>
                <p className="text-brand-brown-light mb-6">
                    Pentru discuții rapide și întrebări, nu ezitați să ne sunați sau să ne scrieți.
                </p>
                <div className="space-y-4 text-brand-brown-light">
                    <p>
                        <strong>📞 Telefon:</strong> 
                        <a href="tel:+37312345678" className="hover:text-brand-orange transition-colors"> +373 12 345 678</a>
                    </p>
                    <p>
                        <strong>✉️ Email:</strong> 
                        <a href="mailto:contact@chefdechef.md" className="hover:text-brand-orange transition-colors"> contact@chefdechef.md</a>
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-serif text-xl font-bold text-brand-brown-dark mb-4">Lasă-ne datele și te sunăm noi</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                        <input type="text" name="name" placeholder="Nume" required value={formData.name} onChange={handleInputChange} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"/>
                        <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"/>
                    </div>
                    <input type="tel" name="phone" placeholder="Telefon" required value={formData.phone} onChange={handleInputChange} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md mb-3 focus:ring-brand-orange focus:border-brand-orange"/>
                    <textarea name="message" placeholder="Mesajul Dvs." rows={3} required value={formData.message} onChange={handleInputChange} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md mb-4 focus:ring-brand-orange focus:border-brand-orange"></textarea>
                    <button type="submit" disabled={isLoading || !isSupabaseConfigured} className="w-full bg-chef-gradient text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                        {isLoading ? 'Se trimite...' : 'Trimite Mesajul'}
                    </button>
                </form>
                {!isSupabaseConfigured && (
                    <p className="mt-3 text-xs text-center text-brand-brown-light">
                        Formularul este inactiv în modul de previzualizare.
                    </p>
                )}
                {formStatus.message && (
                    <div className={`mt-3 p-2 rounded-md text-center text-sm ${formStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {formStatus.message}
                    </div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;