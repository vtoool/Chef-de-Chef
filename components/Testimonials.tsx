import React from 'react';
import { Testimonial } from '../types';

// Dummy data, to be replaced by data from Supabase
const testimonials: Testimonial[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'Ana & Ion Popescu',
    event_type: 'Nuntă',
    message: 'Ați fost absolut fantastici! Ați creat o atmosferă de poveste și toți invitații au fost impresionați. Recomandăm cu toată inima!',
    rating: 5,
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    name: 'Familia Cojocaru',
    event_type: 'Cumătrie',
    message: 'Profesionalism și mult suflet. Ați făcut din cumătria fetiței noastre un eveniment de neuitat. Mulțumim!',
    rating: 5,
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    name: 'Tech Solutions SRL',
    event_type: 'Eveniment Corporate',
    message: 'Oaspeții noștri din străinătate au fost fascinați de programul vostru. O pată de culoare și tradiție la petrecerea noastră corporate.',
    rating: 5,
  },
];

const RatingPlaceholder: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    <span className="text-brand-gold font-bold">{rating} / 5</span>
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <section id="testimoniale" className="py-16 md:py-24 bg-brand-cream">
      <div className="container mx-auto max-w-7xl px-6 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-brown-dark mb-4">Ce spun clienții</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-12">
          Mândria noastră este bucuria celor care ne-au ales să le fim alături în momente speciale.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-lg text-left">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <h4 className="font-bold text-lg text-brand-brown-dark">{testimonial.name}</h4>
                      <p className="text-sm text-brand-orange font-semibold">{testimonial.event_type}</p>
                  </div>
                  <RatingPlaceholder rating={testimonial.rating} />
              </div>
              <p className="text-brand-brown-light italic">"{testimonial.message}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;