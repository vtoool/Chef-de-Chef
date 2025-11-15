'use client';

import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="py-12 md:py-20 bg-brand-cream overflow-hidden">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-5xl font-black text-brand-brown-dark leading-tight mb-4">
              Tradiție și eleganță pentru un eveniment memorabil
            </h1>
            <p className="text-lg text-brand-brown-light max-w-xl mx-auto md:mx-0 mb-8">
              Celebrați frumusețea culturii populare moldovenești prin spectacole pline de energie, culoare și emoție.
            </p>
            <div className="flex justify-center md:justify-start">
              <a href="#book" className="bg-chef-gradient text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                Rezervă Acum
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-2 rounded-lg shadow-xl transform md:rotate-2 overflow-hidden">
                <img 
                  src="https://scontent.fkiv7-1.fna.fbcdn.net/v/t39.30808-6/480324791_953081760294442_1783990944146547779_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=E9Ugi3ich00Q7kNvwG24Ir0&_nc_oc=AdnVKu1X1lh40_nRoItDbZmqnVajD1kJR6notxKzQBanHFld1n4oMHTJrTVLl8hXxbW_fAfxHYVLIlxQPi6rXA8t&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=f47qOphwVxSDs_JdfrLd4A&oh=00_AfiznpsExseIWO4p392EUF_9LuwaL6wabziHToNGqkIWrw&oe=691DD445" 
                  alt="Ansamblul de dansuri populare Chef de Chef în timpul unui spectacol" 
                  className="rounded-md w-full h-auto object-cover"
                  style={{
                    transform: `translateY(${offsetY * 0.2}px)`,
                    willChange: 'transform',
                  }}
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
