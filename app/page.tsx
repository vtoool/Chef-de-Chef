import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <About />
        
        {/* --- SECTIONS TEMPORARILY DISABLED FOR DEBUGGING --- */}

        <section id="testimoniale" className="py-20 bg-brand-cream">
            <div className="container mx-auto px-6 text-center">
                <h2 className="font-serif text-4xl font-bold text-brand-brown-dark mb-4">Testimoniale (Dezactivat temporar)</h2>
                <p className="text-brand-brown-light">Această secțiune va fi reactivată.</p>
            </div>
        </section>

        <section id="rezerva" className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="font-serif text-4xl font-bold text-brand-brown-dark mb-4">Rezervări (Dezactivat temporar)</h2>
                <p className="text-brand-brown-light">Formularul de rezervare va fi reactivat după configurarea mediului.</p>
            </div>
        </section>

        <section id="contact" className="py-20 bg-brand-cream">
            <div className="container mx-auto px-6 text-center">
                <h2 className="font-serif text-4xl font-bold text-brand-brown-dark mb-4">Contact (Dezactivat temporar)</h2>
                <p className="text-brand-brown-light">Formularul de contact va fi reactivat după configurarea mediului.</p>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}