'use client';

import React, { useState, useEffect, useCallback } from 'react';
// FIX: Changed date-fns import to submodule path.
import { format } from 'date-fns/format';
import { ro } from 'date-fns/locale/ro';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Booking } from '../types';
import Calendar from './Calendar'; // Import the new component

// --- New Confirmation and Confetti Components ---

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-2 h-4" style={style}></div>
);

const Confetti: React.FC = () => {
    const confettiCount = 60;
    const pieces = Array.from({ length: confettiCount }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animation: `confetti-fall ${3 + Math.random() * 4}s ${Math.random() * 2}s linear forwards`,
            backgroundColor: Math.random() > 0.5 ? '#FFC857' : '#F7931E',
            transform: `rotate(${Math.random() * 360}deg)`,
            opacity: 0,
        };
        return <ConfettiPiece key={i} style={style} />;
    });

    return <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">{pieces}</div>;
};

const ConfirmationView: React.FC = () => {
  return (
    <div className="relative bg-brand-cream p-8 md:p-12 rounded-lg shadow-lg text-center overflow-hidden">
        <Confetti />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
            <div className="mx-auto mb-5 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center ring-4 ring-white/50">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">Cererea a fost trimisă!</h2>
            <p className="text-brand-brown-light max-w-lg mx-auto">
                Vă mulțumim! Am primit solicitarea dumneavoastră. Un membru al echipei noastre vă va contacta în cel mai scurt timp pentru a confirma toate detaliile.
            </p>
            <p className="text-brand-brown-light max-w-lg mx-auto mt-4 font-semibold">
                Suntem nerăbdători să aducem tradiția și voia bună la evenimentul dumneavoastră!
            </p>
        </div>
    </div>
  );
};


const BookingComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  
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
      .from('public_booking_dates')
      .select('event_date');

    if (error) {
      console.error('Error fetching unavailable dates:', error);
      return;
    }
    
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
    setFormError(''); // Reset error on new date selection
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      setFormError('Vă rugăm să selectați o dată.');
      return;
    }
    setIsLoading(true);
    setFormError('');

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
      
      setIsSubmitted(true); // Trigger the confirmation view

    } catch (error) {
      setFormError('A apărut o eroare. Vă rugăm să încercați din nou.');
      console.error('Booking submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };
    
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <section id="book" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        {isSubmitted ? (
            <ConfirmationView />
        ) : (
            <>
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
                            <option>Corporativă</option>
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
                    {formError && (
                    <div className={`mt-3 p-2 rounded-md text-center text-sm bg-red-100 text-red-800`}>
                        {formError}
                    </div>
                    )}
                </div>
                </div>
            </>
        )}
      </div>
    </section>
  );
};

export default BookingComponent;