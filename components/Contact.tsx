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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Phone */}
                    <a href="tel:+37312345678" className="flex items-center space-x-4 group">
                        <div className="flex-shrink-0 w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center transition-colors group-hover:bg-brand-orange/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-orange" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.758a10.024 10.024 0 004.486 4.486l.758-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-bold text-brand-brown-dark block text-sm">Sunați Acum</span>
                            <span className="text-brand-brown-light group-hover:text-brand-orange group-hover:underline transition-colors text-md">+373 12 345 678</span>
                        </div>
                    </a>
                    {/* Email */}
                    <a href="mailto:contact@chefdechef.md" className="flex items-center space-x-4 group">
                         <div className="flex-shrink-0 w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center transition-colors group-hover:bg-brand-orange/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-orange" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-bold text-brand-brown-dark block text-sm">Trimiteți Email</span>
                            <span className="text-brand-brown-light group-hover:text-brand-orange group-hover:underline transition-colors text-md">contact@chefdechef.md</span>
                        </div>
                    </a>
                    {/* Facebook */}
                    <a href="https://www.facebook.com/ansamblul.chefdechef/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                        <div className="flex-shrink-0 w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center transition-colors group-hover:bg-brand-orange/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-orange" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                            </svg>
                        </div>
                        <div>
                            <span className="font-bold text-brand-brown-dark block text-sm">Facebook</span>
                            <span className="text-brand-brown-light group-hover:text-brand-orange group-hover:underline transition-colors text-md">Ansamblul Chef de Chef</span>
                        </div>
                    </a>
                    {/* Instagram */}
                    <a href="https://instagram.com/ansamblul_chef_de_chef" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                        <div className="flex-shrink-0 w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center transition-colors group-hover:bg-brand-orange/20">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-orange" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.198-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
                            </svg>
                        </div>
                        <div>
                            <span className="font-bold text-brand-brown-dark block text-sm">Instagram</span>
                            <span className="text-brand-brown-light group-hover:text-brand-orange group-hover:underline transition-colors text-md">@ansamblul_chef_de_chef</span>
                        </div>
                    </a>
                    {/* Telegram */}
                    <a href="https://t.me/chefdechef_md" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><defs><linearGradient id="prefix__a" gradientUnits="userSpaceOnUse" x1="256" y1="3.84" x2="256" y2="512"><stop offset="0" stop-color="#2AABEE"/><stop offset="1" stop-color="#229ED9"/></linearGradient></defs><circle fill="url(#prefix__a)" cx="256" cy="256" r="256"/><path fill="#fff" d="M115.88 253.3c74.63-32.52 124.39-53.95 149.29-64.31 71.1-29.57 85.87-34.71 95.5-34.88 2.12-.03 6.85.49 9.92 2.98 2.59 2.1 3.3 4.94 3.64 6.93.34 2 .77 6.53.43 10.08-3.85 40.48-20.52 138.71-29 184.05-3.59 19.19-10.66 25.62-17.5 26.25-14.86 1.37-26.15-9.83-40.55-19.27-22.53-14.76-35.26-23.96-57.13-38.37-25.28-16.66-8.89-25.81 5.51-40.77 3.77-3.92 69.27-63.5 70.54-68.9.16-.68.31-3.2-1.19-4.53s-3.71-.87-5.3-.51c-2.26.51-38.25 24.3-107.98 71.37-10.22 7.02-19.48 10.43-27.77 10.26-9.14-.2-26.72-5.17-39.79-9.42-16.03-5.21-28.77-7.97-27.66-16.82.57-4.61 6.92-9.32 19.04-14.14z"/></svg>
                        </div>
                        <div>
                            <span className="font-bold text-brand-brown-dark block text-sm">Telegram</span>
                            <span className="text-brand-brown-light group-hover:text-brand-orange group-hover:underline transition-colors text-md">@chefdechef_md</span>
                        </div>
                    </a>
                    {/* WhatsApp */}
                    <a href="https://wa.me/37312345678" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                        <div className="flex-shrink-0 w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center transition-colors group-hover:bg-brand-orange/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-orange" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.078 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                        </div>
                        <div>
                            <span className="font-bold text-brand-brown-dark block text-sm">WhatsApp</span>
                            <span className="text-brand-brown-light group-hover:text-brand-orange group-hover:underline transition-colors text-md">+373 12 345 678</span>
                        </div>
                    </a>
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
