import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Booking from '../components/Booking';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <AnimatedSection>
          <Services />
        </AnimatedSection>
        <AnimatedSection>
          <Gallery />
        </AnimatedSection>
        <AnimatedSection>
          <About />
        </AnimatedSection>
        <AnimatedSection>
          <Testimonials />
        </AnimatedSection>
        <AnimatedSection>
          <Booking />
        </AnimatedSection>
        <AnimatedSection>
          <Contact />
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
}