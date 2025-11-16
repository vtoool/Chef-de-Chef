'use client';

import React, { useState, useEffect } from 'react';
import BookingButton from './BookingButton';

const Logo = () => (
    <div className="flex items-center space-x-2">
        <img src="https://scontent.fkiv7-1.fna.fbcdn.net/v/t39.30808-6/456236959_829273562675263_5934463475455699464_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-FwFg2FB9XoQ7kNvwE_khUg&_nc_oc=AdksXFMIZCuyZ_qiRyTobtMYjXbrpMRUTfB_UxWQviL9dwKY2JSbGc9mZ4fG0Jd1PDDofFzdHDXrwb4BgViofAG8&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=M9t8gcOoEteEPolC2SuR9Q&oh=00_AfhhmmqUYoveeMuTaQdkbvqE973TIqDyPsIaCJ4E-mYWAQ&oe=691DA8FB" alt="Chef de Chef Logo" className="h-10 w-10 rounded-full object-cover" />
        <span className="font-cursive text-3xl font-normal bg-chef-gradient bg-clip-text text-transparent pr-1">Chef de Chef</span>
    </div>
);

const navLinks = [
  { name: 'Servicii', href: '#services' },
  { name: 'Galerie', href: '#gallery' },
  { name: 'Despre Noi', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
  const [activeLink, setActiveLink] = useState('#home');

  // Effect to handle body scroll lock for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  // Effect to handle the sticky behavior of the header
  useEffect(() => {
    const servicesSection = document.getElementById('services');
    if (!servicesSection) return;

    const servicesOffsetTop = servicesSection.offsetTop;
    
    const handleScroll = () => {
      if (window.scrollY >= servicesOffsetTop) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Effect to track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        document.querySelector('#home'),
        ...navLinks.map(link => document.querySelector(link.href))
      ].filter(Boolean) as HTMLElement[];

      const scrollY = window.scrollY;
      // Define a trigger point on the screen (e.g., 100px from the top)
      // to determine which section is considered "active".
      const scrollTriggerPoint = scrollY + 100;

      let newActiveLink = '#home'; // Default to home

      // Iterate backwards from the last section to the first.
      // The first section whose top is above the trigger point is the active one.
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= scrollTriggerPoint) {
          newActiveLink = `#${section.id}`;
          break; // Found the active section, no need to check further
        }
      }

      // Edge case: If scrolled to the very bottom, ensure the last link is active.
      const isAtBottom = (window.innerHeight + scrollY) >= document.body.offsetHeight - 2;
      if (isAtBottom) {
        newActiveLink = navLinks[navLinks.length - 1].href;
      }

      setActiveLink(newActiveLink);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Call once on mount to set the initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`w-full bg-brand-cream z-50 ${isSticky ? 'sticky top-0' : ''}`}>
        <div className="container mx-auto max-w-6xl px-6 py-3 flex justify-between items-center">
          <a href="#home" onClick={() => setActiveLink('#home')} aria-label="Pagina principală"><Logo /></a>
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = activeLink === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-orange/10 text-brand-orange'
                      : 'text-brand-brown-light hover:bg-brand-orange/10 hover:text-brand-orange'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>
          <BookingButton href="#book" className="hidden md:inline-block">
            Rezervă Acum
          </BookingButton>
          <button 
            className="md:hidden text-brand-brown-dark z-50" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label={isMenuOpen ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div 
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={`fixed inset-0 z-40 bg-brand-cream transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
      >
        <nav className="flex flex-col items-center justify-center h-full space-y-6">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={handleLinkClick} className="text-2xl font-serif text-brand-brown-dark hover:text-brand-orange transition-colors">
              {link.name}
            </a>
          ))}
          <BookingButton href="#book" onClick={handleLinkClick} className="mt-8 !py-3 !px-8">
            Rezervă Acum
          </BookingButton>
        </nav>
      </div>
    </>
  );
};

export default Header;