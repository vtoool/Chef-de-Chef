'use client';

import React, { useState, useEffect, useRef } from 'react';

const Logo = () => (
    <div className="flex items-center space-x-2">
        <img src="https://picsum.photos/40/40" alt="Chef de Chef Logo" className="rounded-full" />
        <span className="font-serif-alt font-bold text-xl text-brand-brown-dark">Chef de Chef</span>
    </div>
);

const FolkBorder = () => {
    const colors = {
        b: '#3B2414', // brand-brown-dark
        g: '#FFC857', // brand-gold
        o: '#F7931E', // brand-orange
    };
    
    // ASCII art representation of the simplified folk pattern.
    const patternMatrix = [
        "..b..   g...g   ",
        ".bgb.   .g.g.   ",
        "bgobg   ..g..   ",
        ".bgb.   .g.g.   ",
        "..b..   g...g   ",
    ];

    const unit = 2; // Each 'pixel' will be a 2x2 square
    const patternHeight = patternMatrix.length * unit;
    const patternWidth = patternMatrix[0].length * unit;

    const patternElements = patternMatrix.flatMap((row, y) => 
        row.split('').map((char, x) => {
            if (char === ' ' || char === '.') return null;
            return (
                <rect 
                    key={`${y}-${x}`}
                    x={x * unit} 
                    y={y * unit} 
                    width={unit} 
                    height={unit} 
                    fill={colors[char as keyof typeof colors]} 
                />
            );
        })
    );

    return (
        <div className="bg-brand-cream" aria-hidden="true">
            <svg width="100%" height={patternHeight + (unit * 2)} preserveAspectRatio="none">
                <defs>
                    <pattern id="folk-pattern-simple" x="0" y="0" width={patternWidth} height={patternHeight} patternUnits="userSpaceOnUse">
                        {patternElements}
                    </pattern>
                </defs>
                <rect y="0" width="100%" height={unit} fill={colors.b} />
                <rect y={unit} width="100%" height={patternHeight} fill="url(#folk-pattern-simple)" />
                <rect y={patternHeight + unit} width="100%" height={unit} fill={colors.b} />
            </svg>
        </div>
    );
};


const Header: React.FC = () => {
  const navLinks = [
    { name: 'Servicii', href: '#servicii' },
    { name: 'Galerie', href: '#galerie' },
    { name: 'Despre noi', href: '#despre' },
    { name: 'Testimoniale', href: '#testimoniale' },
    { name: 'Contact', href: '#contact' },
  ];

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const servicesSection = document.getElementById('servicii');
      
      const servicesTop = servicesSection ? servicesSection.offsetTop : Infinity;

      if (currentScrollY < servicesTop) {
        // Always show the header when above the "Servicii" section
        setIsVisible(true);
      } else {
        // When past the "Servicii" section, hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <header className={`w-full bg-brand-cream/80 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto max-w-7xl px-6 py-2 flex justify-between items-center">
        <a href="#" aria-label="Pagina principală"><Logo /></a>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-brand-brown-light hover:text-brand-orange transition-colors duration-300 font-medium">
              {link.name}
            </a>
          ))}
        </nav>
        <a href="#rezerva" className="hidden md:inline-block bg-chef-gradient text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
          Rezervă Acum
        </a>
        <button className="md:hidden text-brand-brown-dark">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <FolkBorder />
    </header>
  );
};

export default Header;