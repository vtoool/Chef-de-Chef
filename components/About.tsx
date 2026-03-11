import React from 'react';
import BookingButton from './BookingButton';

const About: React.FC = () => {
  return (
    <section id="about" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img src="/images/about.webp" alt="Dansatori din ansamblul Chef de Chef" className="rounded-lg shadow-lg w-full max-w-sm h-auto object-cover"/>
          </div>
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">Povestea Noastră</h2>
            <p className="text-brand-brown-light mb-4">
              Născut din dragoste pentru folclorul autentic moldovenesc, Chef de Chef nu este doar un ansamblu de dansuri — este o familie unită de aceeași pasiune pentru tradiție.
            </p>
            <p className="text-brand-brown-light mb-4">
              De peste un deceniu, aducem bucurie, ritm și culoare la cele mai importante evenimente din viața oamenilor. Misiunea noastră este să promovăm și să păstrăm moștenirea culturală a Moldovei, transformând fiecare nuntă, cumătrie sau petrecere într-un spectacol memorabil.
            </p>
            <p className="text-brand-brown-light mb-6">
              Ne punem sufletul în fiecare pas de dans, în fiecare obicei și în fiecare zâmbet dăruit publicului.
            </p>
            <BookingButton href="#book">
                Verifică disponibilitatea
            </BookingButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;