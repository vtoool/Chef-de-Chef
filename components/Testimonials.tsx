import React from 'react';
import { Testimonial } from '../types';

// Dummy data, to be replaced by data from Supabase
const testimonials: Testimonial[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'Ana & Ion Popescu',
    event_type: 'Wedding',
    message: 'You were absolutely fantastic! You created a fairytale atmosphere and all the guests were impressed. We wholeheartedly recommend you!',
    rating: 5,
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    name: 'The Cojocaru Family',
    event_type: 'Baptism',
    message: 'Professionalism and a lot of heart. You made our daughter\'s baptism an unforgettable event. Thank you!',
    rating: 5,
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    name: 'Tech Solutions LLC',
    event_type: 'Corporate Event',
    message: 'Our international guests were fascinated by your performance. A wonderful touch of color and tradition at our corporate party.',
    rating: 5,
  },
];

const RatingPlaceholder: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    <span className="text-brand-gold font-bold text-sm">{rating} / 5</span>
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-12 md:py-16 bg-brand-cream">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">What Our Clients Say</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-10">
          Our pride is the joy of those who have chosen us to be with them in their special moments.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-5 rounded-lg shadow-md text-left">
              <div className="flex justify-between items-start mb-3">
                  <div>
                      <h4 className="font-bold text-md text-brand-brown-dark">{testimonial.name}</h4>
                      <p className="text-xs text-brand-orange font-semibold">{testimonial.event_type}</p>
                  </div>
                  <RatingPlaceholder rating={testimonial.rating} />
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