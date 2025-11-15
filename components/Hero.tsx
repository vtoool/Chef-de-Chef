import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="py-16 md:py-24 bg-brand-cream overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-6xl font-black text-brand-brown-dark leading-tight mb-4">
              Creăm momente de neuitat prin dans.
            </h1>
            <p className="text-lg text-brand-brown-light max-w-xl mx-auto md:mx-0 mb-8">
              Ansamblul Chef de Chef aduce tradiții moldovenești, dansuri populare și obiceiuri de nuntă la nunți, cumătrii și orice ocazie ce merită sărbătorită.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="#rezerva" className="bg-chef-gradient text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Rezervă Ansamblul
              </a>
              <a href="#servicii" className="group text-brand-brown-light font-bold py-4 px-8 flex items-center justify-center gap-2 transition-colors duration-300 hover:text-brand-orange">
                Vezi pachetele <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-2 rounded-lg shadow-2xl transform md:rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105">
              <div className="relative">
                <img 
                  src="https://picsum.photos/id/1043/600/700" 
                  alt="Dansatori în costume populare moldovenești" 
                  className="rounded-md w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center p-2 rounded-b-md text-sm">
                  Dansuri pentru nunți · Moldova
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="border-t-2 border-brand-gold/50 pt-4">
                <p className="font-serif text-3xl font-bold text-brand-orange">10+</p>
                <p className="text-brand-brown-light">ani de experiență</p>
            </div>
            <div className="border-t-2 border-brand-gold/50 pt-4">
                <p className="font-serif text-3xl font-bold text-brand-orange">100+</p>
                <p className="text-brand-brown-light">nunți și evenimente</p>
            </div>
            <div className="border-t-2 border-brand-gold/50 pt-4">
                <p className="font-serif text-3xl font-bold text-brand-orange">Autentic</p>
                <p className="text-brand-brown-light">Tradiții veritabile</p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;