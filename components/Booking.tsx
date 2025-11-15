'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Booking } from '../types';

const BookingComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });
  
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      eventType: 'Nuntă',
      location: '',
      notes: ''
  });

  const fetchUnavailableDates = useCallback(async () => {
    if (!supabase) {
      console.warn('Supabase client not available. Cannot fetch unavailable dates.');
      return;
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('event_date')
      .in('status', ['pending', 'confirmed']);

    if (error) {
      console.error('Error fetching unavailable dates:', error);
      return;
    }
    
    const dates = data.map(b => new Date(b.event_date + 'T12:00:00Z')); // Adjust for timezone issues
    setUnavailableDates(dates);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchUnavailableDates();
    }
  }, [fetchUnavailableDates]);
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
        setSelectedDate(new Date(e.target.value + 'T00:00:00'));
    } else {
        setSelectedDate(undefined);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      setFormStatus({ type: 'error', message: 'Vă rugăm să selectați o dată.' });
      return;
    }
    setIsLoading(true);
    setFormStatus({ type: 'idle', message: '' });

    const newBooking: Booking = {
      event_date: format(selectedDate, 'yyyy-MM-dd'),
      event_type: formData.eventType,
      location: formData.location,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
      status: 'pending',
    };
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      setFormStatus({ type: 'success', message: 'Cererea de rezervare a fost trimisă! Vă vom contacta în curând pentru a confirma.' });
      setSelectedDate(undefined);
      setFormData({ name: '', email: '', phone: '', eventType: 'Nuntă', location: '', notes: ''});
      fetchUnavailableDates();

    } catch (error) {
      setFormStatus({ type: 'error', message: 'A apărut o eroare. Vă rugăm să încercați din nou.' });
      console.error('Booking submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isDateBooked = selectedDate && unavailableDates.some(d => format(d, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));

  return (
    <section id="book" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3 text-center">Rezervă Ansamblul</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-10 text-center">
          Verificați disponibilitatea noastră și trimiteți o cerere de rezervare. Vă vom contacta în cel mai scurt timp.
        </p>
        <div className="grid lg:grid-cols-2 gap-10 bg-brand-cream p-6 rounded-lg shadow-lg">
          <div className="flex flex-col items-center justify-center space-y-4">
              <label htmlFor="event-date" className="font-serif text-xl font-bold text-brand-brown-dark">1. Alegeți data evenimentului</label>
              <input
                id="event-date"
                type="date"
                value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                onChange={handleDateChange}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-orange focus:border-brand-orange text-brand-brown-dark disabled:opacity-50"
                aria-label="Selectați data evenimentului"
                disabled={!isSupabaseConfigured}
              />
              {!isSupabaseConfigured && (
                  <p className="mt-2 text-xs text-center text-brand-brown-light/80">
                      Calendarul este inactiv în modul de previzualizare.
                  </p>
              )}
          </div>
          <div>
            {selectedDate ? (
              isDateBooked ? (
                 <div className="text-center p-6 bg-red-100 text-red-800 rounded-lg h-full flex flex-col justify-center items-center">
                    <h3 className="font-bold text-md">Data este indisponibilă</h3>
                    <p className="text-sm">Ne pare rău, data de {format(selectedDate, 'd MMMM yyyy', { locale: ro })} este deja rezervată.</p>
                 </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="font-serif text-lg font-bold mb-4">2. Completați detaliile: <span className="text-brand-orange">{format(selectedDate, 'd MMMM yyyy', { locale: ro })}</span></h3>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <input type="text" name="name" placeholder="Numele Dvs." required value={formData.name} onChange={handleInputChange} disabled={!isSupabaseConfigured} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange disabled:opacity-50"/>
                    <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} disabled={!isSupabaseConfigured} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange disabled:opacity-50"/>
                    <input type="tel" name="phone" placeholder="Telefon" required value={formData.phone} onChange={handleInputChange} disabled={!isSupabaseConfigured} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange disabled:opacity-50"/>
                    <select name="eventType" value={formData.eventType} onChange={handleInputChange} disabled={!isSupabaseConfigured} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange disabled:opacity-50">
                        <option>Nuntă</option>
                        <option>Cumătrie</option>
                        <option>Petrecere</option>
                        <option>Corporate</option>
                        <option>Altul</option>
                    </select>
                  </div>
                  <input type="text" name="location" placeholder="Locația Evenimentului (Oraș)" required value={formData.location} onChange={handleInputChange} disabled={!isSupabaseConfigured} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md mb-3 focus:ring-brand-orange focus:border-brand-orange disabled:opacity-50"/>
                  <textarea name="notes" placeholder="Detalii Suplimentare" rows={2} value={formData.notes} onChange={handleInputChange} disabled={!isSupabaseConfigured} className="w-full p-2 bg-white text-brand-brown-dark border border-gray-300 rounded-md mb-4 focus:ring-brand-orange focus:border-brand-orange disabled:opacity-50"></textarea>
                  <button type="submit" disabled={isLoading || !isSupabaseConfigured} className="w-full bg-chef-gradient text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                    {isLoading ? 'Se trimite...' : 'Trimite Cererea'}
                  </button>
                </form>
              )
            ) : (
              <div className="text-center p-6 flex items-center justify-center h-full">
                <p className="text-md text-brand-brown-light">Vă rugăm să selectați o dată din calendar.</p>
              </div>
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

export default BookingComponent;