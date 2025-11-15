import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="py-12 md:py-20 bg-brand-cream overflow-hidden">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-5xl font-black text-brand-brown-dark leading-tight mb-4">
              Elevate Your Events!
            </h1>
            <p className="text-lg text-brand-brown-light max-w-xl mx-auto md:mx-0 mb-8">
              Join us in celebrating Moldovan folk culture through vibrant performances.
            </p>
            <div className="flex justify-center md:justify-start">
              <a href="#book" className="bg-chef-gradient text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                Reserve Now
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-2 rounded-lg shadow-xl transform md:rotate-2">
                <img 
                  src="https://images.unsplash.com/photo-1594822039235-76624941a53c?q=80&w=1887&auto=format&fit=crop" 
                  alt="Dancer in a traditional red Moldovan dress" 
                  className="rounded-md w-full h-auto object-cover"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;