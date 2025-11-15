import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-brown-dark text-brand-cream py-8">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <p className="font-serif-alt text-lg font-bold mb-2">Ansamblul Chef de Chef</p>
        <p className="text-brand-cream/80 text-sm mb-5">Creăm momente de neuitat prin dans.</p>
        <div className="flex justify-center space-x-5 mb-6">
            <a href="#" aria-label="Facebook" className="hover:text-brand-gold transition-colors text-sm">Facebook</a>
            <a href="#" aria-label="Instagram" className="hover:text-brand-gold transition-colors text-sm">Instagram</a>
            <a href="tel:+37312345678" aria-label="Telefon" className="hover:text-brand-gold transition-colors text-sm">Telefon</a>
        </div>
        <div className="text-xs text-brand-cream/60">
            &copy; {new Date().getFullYear()} Ansamblul Chef de Chef. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  );
};

export default Footer;