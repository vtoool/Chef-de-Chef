import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
            <a href="#contact" className="font-bold text-brand-orange hover:underline">Contactați-ne pentru detalii →</a>
          </div>
          <div className="flex justify-center">
            <img src="https://scontent.fkiv7-1.fna.fbcdn.net/v/t51.75761-15/489819483_18064728098497854_328374795977381274_n.jpg?stp=dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=5KtJpC55L7oQ7kNvwFgg3-5&_nc_oc=AdlLQeKK030MFRf40-9sDdewX3VwDNnAoiH8Pt7CNJgEVrqOq8C9kYbYN5R4kE452MxgCIWxukGpfqEzrHrWg1p9&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=pfUXxIzP7TPYkefvAkuJ8A&oh=00_AfiynKs8CihkSt_tw_20OowzixXg1qPPIsZs9jmnB2nfug&oe=691EA433" alt="Dansatori din ansamblul Chef de Chef" className="rounded-lg shadow-lg w-full max-w-sm h-auto object-cover"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;