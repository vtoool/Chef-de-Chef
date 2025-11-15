'use client';

import React from 'react';

const Logo = () => (
    <div className="flex items-center space-x-2">
        <img src="https://scontent.fkiv7-1.fna.fbcdn.net/v/t39.30808-6/456236959_829273562675263_5934463475455699464_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-FwFg2FB9XoQ7kNvwE_khUg&_nc_oc=AdksXFMIZCuyZ_qiRyTobtMYjXbrpMRUTfB_UxWQviL9dwKY2JSbGc9mZ4fG0Jd1PDDofFzdHDXrwb4BgViofAG8&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=M9t8gcOoEteEPolC2SuR9Q&oh=00_AfhhmmqUYoveeMuTaQdkbvqE973TIqDyPsIaCJ4E-mYWAQ&oe=691DA8FB" alt="Chef de Chef Logo" className="h-10 w-10 rounded-full object-cover" />
        <span className="font-serif-alt font-bold text-xl text-brand-brown-dark">Chef de Chef</span>
    </div>
);

const Header: React.FC = () => {
  const navLinks = [
    { name: 'Servicii', href: '#services' },
    { name: 'Galerie', href: '#gallery' },
    { name: 'Despre Noi', href: '#about' },
    { name: 'Testimoniale', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="w-full bg-brand-cream sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-6 py-3 flex justify-between items-center">
        <a href="#" aria-label="Pagina principală"><Logo /></a>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-brand-brown-light hover:text-brand-orange transition-colors duration-300 font-medium">
              {link.name}
            </a>
          ))}
        </nav>
        <a href="#book" className="hidden md:inline-block bg-chef-gradient text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
          Rezervă Acum
        </a>
        <button className="md:hidden text-brand-brown-dark">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;