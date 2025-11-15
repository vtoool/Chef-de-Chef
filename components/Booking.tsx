'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBooking),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      setFormStatus({ type: 'success', message: 'Rezervarea a fost trimisă! Vă vom contacta în curând pentru confirmare.' });
      setSelectedDate(undefined);
      setFormData({ name: '', email: '', phone: '', eventType: 'Nuntă', location: '', notes: ''});
      fetchUnavailableDates(); // Refresh dates

    } catch (error) {
      setFormStatus({ type: 'error', message: 'A apărut o eroare. Vă rugăm să încercați din nou.' });
      console.error('Booking submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isDateBooked = selectedDate && unavailableDates.some(d => format(d, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'));

  if (!isSupabaseConfigured) {
    return (
      <section id="rezerva" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-4xl font-bold text-brand-brown-dark mb-4 text-center">Rezervă Ansamblul</h2>
          <div className="bg-brand-cream p-8 rounded-lg shadow-xl text-center">
            <p className="text-lg text-brand-brown-light">
              Calendarul pentru rezervări este momentan indisponibil în acest mediu de previzualizare.
            </p>
            <p className="mt-2 text-sm text-brand-brown-light/80">
              Funcționalitatea completă va fi activată după configurarea cheilor Supabase.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rezerva" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="font-serif text-4xl font-bold text-brand-brown-dark mb-4 text-center">Rezervă Ansamblul</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-12 text-center">
          Verifică disponibilitatea și trimite o cerere de rezervare. Vom reveni cu un răspuns în cel mai scurt timp.
        </p>
        <div className="grid lg:grid-cols-2 gap-12 bg-brand-cream p-8 rounded-lg shadow-xl">
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={[{ before: new Date() }, ...unavailableDates]}
              locale={ro}
              className="m-0"
              styles={{
                caption: { color: '#3B2414', fontWeight: 'bold' },
                day_selected: { backgroundColor: '#F7931E', color: 'white' },
                day_today: { color: '#F7931E', fontWeight: 'bold' },
              }}
            />
          </div>
          <div>
            {selectedDate ? (
              isDateBooked ? (
                 <div className="text-center p-8 bg-red-100 text-red-800 rounded-lg">
                    <h3 className="font-bold text-lg">Data este indisponibilă</h3>
                    <p>Ne pare rău, data de {format(selectedDate, 'd MMMM yyyy', { locale: ro })} este deja rezervată.</p>
                 </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="font-serif text-2xl font-bold mb-4">Cerere pentru: <span className="text-brand-orange">{format(selectedDate, 'd MMMM yyyy', { locale: ro })}</span></h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <input type="text" name="name" placeholder="Numele dvs." required value={formData.name} onChange={handleInputChange} className="w-full p-3 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"/>
                    <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} className="w-full p-3 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"/>
                    <input type="tel" name="phone" placeholder="Telefon" required value={formData.phone} onChange={handleInputChange} className="w-full p-3 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"/>
                    <select name="eventType" value={formData.eventType} onChange={handleInputChange} className="w-full p-3 bg-white text-brand-brown-dark border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange">
                        <option>Nuntă</option>
                        <option>Cumătrie</option>
                        <option>Petrecere</option>
                        <option>Corporate</option>
                        <option>Altceva</option>
                    </select>
                  </div>
                  <input type="text" name="location" placeholder="Locația evenimentului (oraș)" required value={formData.location} onChange={handleInputChange} className="w-full p-3 bg-white text-brand-brown-dark border border-gray-300 rounded-md mb-4 focus:ring-brand-orange focus:border-brand-orange"/>
                  <textarea name="notes" placeholder="Detalii suplimentare" rows={3} value={formData.notes} onChange={handleInputChange} className="w-full p-3 bg-white text-brand-brown-dark border border-gray-300 rounded-md mb-4 focus:ring-brand-orange focus:border-brand-orange"></textarea>
                  <button type="submit" disabled={isLoading} className="w-full bg-chef-gradient text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50">
                    {isLoading ? 'Se trimite...' : 'Trimite Cererea'}
                  </button>
                </form>
              )
            ) : (
              <div className="text-center p-8 flex items-center justify-center h-full">
                <p className="text-lg text-brand-brown-light">Vă rugăm să selectați o dată din calendar.</p>
              </div>
            )}
            {formStatus.message && (
              <div className={`mt-4 p-3 rounded-md text-center ${formStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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