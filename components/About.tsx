import React from 'react';

const About: React.FC = () => {
  return (
    <section id="despre" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-brown-dark mb-4">Despre Ansamblul Nostru</h2>
            <p className="text-brand-brown-light mb-4">
              Născut din pasiune pentru folclorul autentic moldovenesc, "Chef de Chef" este mai mult decât un ansamblu de dansuri – suntem o familie unită de dragostea pentru tradiție. De peste un deceniu, aducem bucurie și energie la cele mai importante evenimente din viața oamenilor.
            </p>
            <p className="text-brand-brown-light mb-6">
              Misiunea noastră este să păstrăm și să promovăm bogăția culturală a Moldovei, transformând fiecare nuntă, cumătrie sau petrecere într-un spectacol de neuitat. Punem suflet în fiecare dans, în fiecare obicei și în fiecare zâmbet pe care îl oferim.
            </p>
            <a href="#contact" className="font-bold text-brand-orange hover:underline">Contactează-ne pentru detalii →</a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://picsum.photos/seed/a/400/500" alt="Dansatori Chef de Chef" className="rounded-lg shadow-md w-full h-auto object-cover"/>
            <img src="https://picsum.photos/seed/b/400/500" alt="Dansatori Chef de Chef in actiune" className="rounded-lg shadow-md w-full h-auto object-cover mt-8"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;