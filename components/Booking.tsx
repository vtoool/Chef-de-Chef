'use client';

import React, { useState, useEffect, useCallback } from 'react';
// FIX: Changed date-fns import to submodule path.
import { format } from 'date-fns/format';
import { ro } from 'date-fns/locale/ro';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Booking } from '../types';
import Calendar from './Calendar'; // Import the new component

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

    // Query the secure view 'public_booking_dates' instead of the main table
    // to protect sensitive customer information.
    const { data, error } = await supabase
      .from('public_booking_dates')
      .select('event_date');

    if (error) {
      console.error('Error fetching unavailable dates:', error);
      return;
    }
    
    // Supabase returns date as YYYY-MM-DD string. We need to parse it correctly, assuming UTC to avoid timezone shifts.
    const dates = data.map(b => new Date(b.event_date + 'T00:00:00Z')); 
    setUnavailableDates(dates);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchUnavailableDates();
    }
  }, [fetchUnavailableDates]);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFormStatus({ type: 'idle', message: '' }); // Reset status on new date selection
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
    
  // Set minDate for calendar to today
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <section id="book" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3 text-center">Rezervă Acum</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-10 text-center">
          Verificați disponibilitatea și trimiteți o cerere. Vă contactăm rapid pentru confirmare și detalii.
        </p>
        <div className="grid lg:grid-cols-2 gap-10 bg-brand-cream p-6 md:p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
              <h3 className="font-serif text-xl font-bold text-brand-brown-dark mb-4">1. Alegeți data evenimentului</h3>
              {isSupabaseConfigured ? (
                <Calendar 
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  unavailableDates={unavailableDates}
                  minDate={minDate}
                />
              ) : (
                <div className="w-full max-w-sm p-4 text-center bg-white/50 rounded-lg">
                   <p className="text-brand-brown-light/80">
                      Calendarul este inactiv în modul de previzualizare deoarece cheile Supabase nu sunt configurate.
                  </p>
                </div>
              )}
          </div>
          <div className="flex flex-col justify-center">
            {selectedDate ? (
              <form onSubmit={handleSubmit}>
                <h3 className="font-serif text-lg font-bold mb-4">2. Completați detaliile pentru: <br className="sm:hidden"/><span className="text-brand-orange">{format(selectedDate, 'd MMMM yyyy', { locale: ro })}</span></h3>
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