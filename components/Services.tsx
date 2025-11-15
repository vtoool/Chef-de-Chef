import React from 'react';

interface Service {
  title: string;
  description: string;
}

const services: Service[] = [
  {
    title: 'Dansuri pentru nunți',
    description: 'Un program artistic complet, de la întâmpinarea oaspeților la hore spectaculoase, pentru o nuntă de vis.',
  },
  {
    title: 'Obiceiuri de nuntă',
    description: 'Păstrăm tradițiile vii: bărbieritul mirelui, închinatul colacilor, spălatul mâinilor, hora mirilor și multe altele.',
  },
  {
    title: 'Cumătrii și petreceri',
    description: 'Animăm orice petrecere de familie, de la cumătrii la zile de naștere, cu dansuri vesele și voie bună.',
  },
  {
    title: 'Evenimente corporate',
    description: 'Adăugăm o notă de culoare și tradiție evenimentelor corporate, festivalurilor sau recepțiilor oficiale.',
  },
];

const Services: React.FC = () => {
  return (
    <section id="servicii" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl font-bold text-brand-brown-dark mb-4">Serviciile Noastre</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-12">
          Oferim programe artistice personalizate pentru a transforma orice eveniment într-o sărbătoare memorabilă.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-brand-cream p-8 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-brand-orange text-5xl mb-4 inline-block">
                 <div className="w-12 h-12 bg-brand-orange/20 rounded-full mx-auto" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-brown-dark mb-2">{service.title}</h3>
              <p className="text-brand-brown-light">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;