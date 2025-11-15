'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery, { GalleryModal } from '../components/Gallery';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Booking from '../components/Booking';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';
import { MediaAsset } from '../types';

export default function HomePage() {
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  useEffect(() => {
    if (selectedAsset) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedAsset]);

  return (
    <div className="relative overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <AnimatedSection>
          <Services />
        </AnimatedSection>
        <AnimatedSection>
          <Gallery onImageSelect={setSelectedAsset} />
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
      <GalleryModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </div>
  );
}