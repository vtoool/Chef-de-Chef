import React from 'react';

interface Service {
  title: string;
  description: string;
}

const services: Service[] = [
  {
    title: 'Nunți',
    description: 'Un program artistic complet, special gândit pentru a aduce tradiție, eleganță și atmosferă de sărbătoare în ziua cea mare.',
  },
  {
    title: 'Tradiții Populare',
    description: 'Aducem în scenă obiceiuri autentice, dansuri tradiționale și momente simbolice ce păstrează vie moștenirea folclorică.',
  },
  {
    title: 'Petreceri Private',
    description: 'Energie, voie bună și dansuri spectaculoase pentru cumetrii, aniversări și alte momente importante ale familiei.',
  },
  {
    title: 'Evenimente Corporative',
    description: 'Adăugați un strop de tradiție și autenticitate evenimentelor corporative, recepțiilor sau festivalurilor pe care le organizați.',
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">Serviciile Noastre</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-10">
          Oferim programe artistice adaptate fiecărui tip de eveniment, astfel încât să transformăm orice moment într-o adevărată sărbătoare.
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