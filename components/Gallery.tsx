'use client';

import React from 'react';
import { MediaAsset } from '../types';

// Dummy data, to be replaced by data from Supabase
const galleryItems: MediaAsset[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `${i + 1}`,
  created_at: new Date().toISOString(),
  type: 'image',
  url: `https://picsum.photos/seed/${i + 1}/600/400`,
  thumbnail_url: `https://picsum.photos/seed/${i + 1}/300/200`,
  description: `Imagine din galerie ${i + 1}`,
}));

export const GalleryModal: React.FC<{ asset: MediaAsset | null; onClose: () => void }> = ({ asset, onClose }) => {
  if (!asset) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Vizualizare imagine"
    >
      <div className="relative bg-white rounded-lg p-2 max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={asset.url} alt={asset.description || 'Imagine din galerie'} className="max-w-full max-h-[85vh] rounded" />
      </div>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors"
        aria-label="Închide"
      >
        &times;
      </button>
    </div>
  );
};

const Gallery: React.FC<{ onImageSelect: (asset: MediaAsset) => void }> = ({ onImageSelect }) => {
  return (
    <section id="gallery" className="py-12 md:py-16 bg-brand-cream">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">Galerie Foto & Video</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-10">
          Momente pline de emoție, surprinse la evenimentele unde am avut bucuria să fim prezenți.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {galleryItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg cursor-pointer" onClick={() => onImageSelect(item)}>
              <img src={item.thumbnail_url} alt={item.description || 'Imagine din galerie'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Placeholder text removed as per user request */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;