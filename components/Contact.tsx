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

            setFormStatus({ type: 'success', message: 'Message sent! Thank you.' });
            setFormData({ name: '', email: '', phone: '', message: '' });

        } catch (error) {
            setFormStatus({ type: 'error', message: 'An error occurred. Please try again.' });
            console.error('Contact form submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <section id="contact" className="py-12 md:py-16 bg-brand-cream">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">Contact Us</h2>
            <p className="text-brand-brown-light mb-6">
              Have questions or want a custom quote? Fill out the form or contact us directly. We're here to help you create an unforgettable event.
            </p>
            <div className="space-y-3 text-brand-brown-light">
                <p><strong>Phone:</strong> +373 12 345 678</p>
                <p><strong>Email:</strong> contact@chefdechef.md</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleInputChange} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"/>
                  <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"/>
              </div>
              <input type="tel" name="phone" placeholder="Phone" required value={formData.phone} onChange={handleInputChange} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md mb-3 focus:ring-brand-orange focus:border-brand-orange"/>
              <textarea name="message" placeholder="Your Message" rows={3} required value={formData.message} onChange={handleInputChange} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md mb-4 focus:ring-brand-orange focus:border-brand-orange"></textarea>
              <button type="submit" disabled={isLoading || !isSupabaseConfigured} className="w-full bg-chef-gradient text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
             {!isSupabaseConfigured && (
              <p className="mt-3 text-xs text-center text-brand-brown-light">
                Form is inactive in preview mode.
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