import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-brown-dark text-brand-cream py-10">
      <div className="container mx-auto max-w-7xl px-6 text-center">
        <p className="font-serif-alt text-xl font-bold mb-4">Ansamblul Chef de Chef</p>
        <p className="text-brand-cream/80 mb-6">Creăm momente de neuitat prin dans.</p>
        <div className="flex justify-center space-x-6 mb-8">
            <a href="#" aria-label="Facebook" className="hover:text-brand-gold transition-colors">Facebook</a>
            <a href="#" aria-label="Instagram" className="hover:text-brand-gold transition-colors">Instagram</a>
            <a href="tel:+37312345678" aria-label="Telefon" className="hover:text-brand-gold transition-colors">Telefon</a>
        </div>
        <div className="text-sm text-brand-cream/60">
            &copy; {new Date().getFullYear()} Ansamblul Chef de Chef. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  );
};

export default Footer;