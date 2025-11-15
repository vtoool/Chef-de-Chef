import React from 'react';

interface Service {
  title: string;
  description: string;
}

const services: Service[] = [
  {
    title: 'Nunți',
    description: 'Un program artistic complet pentru a aduce tradiție și spectacol la nunta de vis.',
  },
  {
    title: 'Tradiții Populare',
    description: 'Păstrăm tradițiile vii, interpretând obiceiuri autentice pentru o experiență memorabilă.',
  },
  {
    title: 'Petreceri Private',
    description: 'Aducem energie și bucurie la orice sărbătoare de familie, de la cumetrii la zile de naștere.',
  },
  {
    title: 'Evenimente Corporate',
    description: 'Adăugați o notă de cultură și tradiție unică evenimentelor corporate, festivalurilor sau recepțiilor.',
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">Serviciile Noastre</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-10">
          Oferim programe artistice personalizate pentru a transforma orice eveniment într-o sărbătoare de neuitat.
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