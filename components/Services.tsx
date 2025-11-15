import React from 'react';

interface Service {
  title: string;
  description: string;
}

const services: Service[] = [
  {
    title: 'Weddings',
    description: 'A complete artistic program to bring tradition and spectacle to your dream wedding.',
  },
  {
    title: 'Folk Traditions',
    description: 'We keep traditions alive, performing authentic customs for a memorable experience.',
  },
  {
    title: 'Private Parties',
    description: 'We bring energy and joy to any family celebration, from baptisms to birthdays.',
  },
  {
    title: 'Corporate Events',
    description: 'Add a touch of unique culture and tradition to your corporate events, festivals, or receptions.',
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">Our Services</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-10">
          We offer tailored artistic programs to make any event an unforgettable celebration.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-brand-cream p-5 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-brand-orange text-4xl mb-3 inline-block">
                 <div className="w-8 h-8 bg-brand-orange/20 rounded-full mx-auto" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-brown-dark mb-2">{service.title}</h3>
              <p className="text-brand-brown-light text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;