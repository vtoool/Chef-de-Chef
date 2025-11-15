import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">Our Story</h2>
            <p className="text-brand-brown-light mb-4">
              Born from a passion for authentic Moldovan folklore, "Chef de Chef" is more than a dance ensemble – we are a family united by a love for tradition. For over a decade, we have brought joy and energy to the most important events in people's lives.
            </p>
            <p className="text-brand-brown-light mb-6">
              Our mission is to preserve and promote the rich cultural heritage of Moldova, turning every wedding, baptism, or party into an unforgettable performance. We pour our soul into every dance, every custom, and every smile we offer.
            </p>
            <a href="#contact" className="font-bold text-brand-orange hover:underline">Contact us for details →</a>
          </div>
          <div className="flex justify-center">
            <img src="https://picsum.photos/seed/a/400/500" alt="Chef de Chef folk dancers" className="rounded-lg shadow-lg w-full max-w-sm h-auto object-cover"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;