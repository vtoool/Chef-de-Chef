import React from 'react';
import { Testimonial } from '../types';

// Dummy data, to be replaced by data from Supabase
const testimonials: Testimonial[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'Ana & Ion Popescu',
    event_type: 'Nuntă',
    message: 'Ați fost extraordinari! Atmosfera creată a fost exact ce ne-am dorit, iar invitații au fost încântați. Vă recomandăm din toată inima!',
    rating: 5,
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    name: 'Familia Cojocaru',
    event_type: 'Cumătrie',
    message: 'Mult profesionalism și mult suflet. Ați făcut ca ziua fetiței noastre să fie cu adevărat specială. Mulțumim pentru tot!',
    rating: 5,
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    name: 'Tech Solutions SRL',
    event_type: 'Eveniment Corporativ',
    message: 'Oaspeții noștri internaționali au fost fascinați de programul vostru. A fost exact elementul de tradiție și energie de care evenimentul nostru corporativ avea nevoie.',
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-12 md:py-16 bg-brand-cream">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">Ce Spun Clienții Noștri</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-10">
          Ne mândrim cu bucuria și recunoștința celor care ne aleg să le fim alături în momentele speciale.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-5 rounded-lg shadow-md text-left">
              <div className="flex justify-between items-start mb-3">
                  <div>
                      <h4 className="font-bold text-md text-brand-brown-dark">{testimonial.name}</h4>
                      <p className="text-xs text-brand-orange font-semibold">{testimonial.event_type}</p>
                  </div>
                  <div className="text-brand-gold text-sm">
                    {'★★★★★'.slice(5 - testimonial.rating)}
                  </div>
              </div>
              <p className="text-brand-brown-light italic text-sm">"{testimonial.message}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;