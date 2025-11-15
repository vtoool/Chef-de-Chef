import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">Povestea Noastră</h2>
            <p className="text-brand-brown-light mb-4">
              Născut dintr-o pasiune pentru folclorul autentic moldovenesc, "Chef de Chef" este mai mult decât un ansamblu de dansuri – suntem o familie unită de dragostea pentru tradiție. De peste un deceniu, aducem bucurie și energie la cele mai importante evenimente din viața oamenilor.
            </p>
            <p className="text-brand-brown-light mb-6">
              Misiunea noastră este să păstrăm și să promovăm bogata moștenire culturală a Moldovei, transformând fiecare nuntă, cumătrie sau petrecere într-un spectacol de neuitat. Ne punem sufletul în fiecare dans, fiecare obicei și fiecare zâmbet pe care îl oferim.
            </p>
            <a href="#contact" className="font-bold text-brand-orange hover:underline">Contactați-ne pentru detalii →</a>
          </div>
          <div className="flex justify-center">
            <img src="https://picsum.photos/seed/a/400/500" alt="Dansatori din ansamblul Chef de Chef" className="rounded-lg shadow-lg w-full max-w-sm h-auto object-cover"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;