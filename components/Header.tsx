import React from 'react';

const Logo = () => (
    <div className="flex items-center space-x-2">
        <img src="https://picsum.photos/40/40" alt="Chef de Chef Logo" className="rounded-full" />
        <span className="font-serif-alt font-bold text-xl text-brand-brown-dark">Chef de Chef</span>
    </div>
);

const FolkBorder = () => (
  <div 
    className="h-1 bg-repeat-x" 
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='4' viewBox='0 0 20 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 2h2V0h2v2h2V0h2v2h2V0h2v2h2V0h2v2h2V0h2v2h2V0h2v2h-2v2h-2v-2h-2v2h-2v-2h-2v2h-2v-2h-2v2H2v-2H0v2z' fill='%235A3A26' fill-opacity='0.2'/%3E%3C/svg%3E")`
    }}
  />
);

const Header: React.FC = () => {
  const navLinks = [
    { name: 'Servicii', href: '#servicii' },
    { name: 'Galerie', href: '#galerie' },
    { name: 'Despre noi', href: '#despre' },
    { name: 'Testimoniale', href: '#testimoniale' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="bg-brand-cream/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
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
