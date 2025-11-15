import React from 'react';

const services = [
  {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    ),
    title: 'Nunți',
    description: 'De la întâmpinarea oaspeților la tradiții, creăm un program complet ce aduce emoție și autenticitate nunții voastre, transformând ziua cea mare într-o poveste memorabilă.',
  },
  {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    title: 'Cumătrii',
    description: 'Sărbătorim venirea pe lume a noului membru al familiei cu dansuri pline de voie bună și urări de bine, într-un program vesel și colorat, adaptat pentru a aduce zâmbete tuturor.',
  },
  {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
    ),
    title: 'Tradiții Populare',
    description: 'Revitalizăm cele mai frumoase obiceiuri, de la colaci și prosoape la hore și sârbe autentice. Fiecare moment este o celebrare a rădăcinilor noastre, plină de suflet moldovenesc.',
  },
  {
    icon: (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18M18.75 3v18M9 6.75h6.375M9 12h6.375M9 17.25h6.375" />
        </svg>
    ),
    title: 'Evenimente Corporative',
    description: 'Impresionați-vă partenerii și oaspeții cu un moment artistic unic. Adăugăm o notă de eleganță, energie și cultură oricărei recepții, transformând-o într-o experiență memorabilă.',
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
            <div key={index} className="bg-brand-cream p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-5 text-brand-orange group-hover:bg-brand-orange/10 transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-brown-dark mb-2">{service.title}</h3>
              <p className="text-brand-brown-light text-sm flex-grow">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;