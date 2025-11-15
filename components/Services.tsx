import React from 'react';

const services = [
  {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="-0.5 -0.5 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M0.9375 9.5875a4.475 4.475 0 1 0 8.95 0 4.475 4.475 0 1 0 -8.95 0" strokeMiterlimit="10"></path>
            <path d="M6.3125 7.800000000000001a3.875 3.875 0 1 0 7.75 0 3.875 3.875 0 1 0 -7.75 0" strokeMiterlimit="10"></path>
            <path d="m10.48125 3.9187499999999997 -0.59375 0 -1.7874999999999999 -1.7874999999999999 0.59375 -1.1937499999999999 2.9812499999999997 0 0.6 1.1937499999999999 -1.7937500000000002 1.7874999999999999z" strokeMiterlimit="10"></path>
        </svg>
    ),
    title: 'Nunți',
    description: 'De la întâmpinarea oaspeților la tradiții, creăm un program complet ce aduce emoție și autenticitate nunții voastre, transformând ziua cea mare într-o poveste memorabilă.',
  },
  {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 4.5a9 9 0 0 1 3.864 5.89 2.5 2.5 0 0 1 -0.29 4.36 9 9 0 0 1 -17.137 0 2.5 2.5 0 0 1 -0.29 -4.36 9 9 0 0 1 3.746 -5.81"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 16a3.5 3.5 0 0 0 5 0"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 2C10 3 11 5.5 11 7"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 2c1.5 2 2 3.5 2 5"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 0.01 0"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 12 0.01 0"></path>
        </svg>
    ),
    title: 'Cumătrii',
    description: 'Sărbătorim venirea pe lume a noului membru al familiei cu dansuri pline de voie bună și urări de bine, într-un program vesel și colorat, adaptat pentru a aduce zâmbete tuturor.',
  },
  {
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 256 256" fill="currentColor">
            <path d="M 128 0 C 147.68 0 164.04 14.213 167.377 32.934 C 182.974 22.055 204.594 23.574 218.51 37.49 C 232.426 51.406 233.944 73.025 223.066 88.622 C 241.787 91.96 256 108.32 256 128 C 256 147.68 241.787 164.04 223.065 167.377 C 233.944 182.974 232.426 204.594 218.51 218.51 C 204.594 232.426 182.974 233.944 167.377 223.065 C 164.04 241.787 147.68 256 128 256 C 108.32 256 91.959 241.787 88.622 223.065 C 73.025 233.944 51.406 232.426 37.49 218.51 C 23.574 204.594 22.055 182.974 32.934 167.377 C 14.213 164.04 0 147.68 0 128 C 0 108.32 14.213 91.96 32.934 88.622 C 22.056 73.025 23.574 51.406 37.49 37.49 C 51.406 23.574 73.025 22.055 88.622 32.934 C 91.96 14.213 108.32 0 128 0 Z" />
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