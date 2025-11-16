'use client';

import React, { useState, useEffect, useRef } from 'react';

// A helper component to handle the count-up animation
const CountUpNumber: React.FC<{ target: number; duration?: number }> = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  // FIX: Initialize useRef with an initial value of `undefined` and update type.
  const frameRef = useRef<number | undefined>(undefined);
  // FIX: Initialize useRef with an initial value of `undefined` and update type.
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }
      const elapsedTime = timestamp - startTimeRef.current!;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentCount = Math.floor(progress * target);
      setCount(currentCount);

      if (elapsedTime < duration) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target); // Ensure it ends on the exact target
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration]);

  return <>{count}</>;
};

const stats = [
  {
    number: 4,
    suffix: '+',
    title: 'Ani de Experiență',
    description: 'Aducem zâmbete și transformăm evenimentele în amintiri de neuitat.',
  },
  {
    number: 120,
    suffix: '+',
    title: 'Clienți Satisfăcuți',
    description: 'Fiecare aplauză ne motivează să fim mai buni. Peste 120 de evenimente finalizate cu succes.',
  },
  {
    number: 10,
    suffix: '+',
    title: 'Ani de Dans',
    description: 'Dansatori profesioniști, cu o pasiune pentru folclor ce se reflectă în fiecare mișcare.',
  },
  {
    number: 0, // Placeholder for a non-numeric stat
    title: 'Servicii Personalizate',
    description: 'Adaptăm programul nostru pentru a se potrivi perfect cu viziunea și dorințele dumneavoastră.',
    isIcon: true,
  },
];

const WhyUs: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the component is visible
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="why-us" className="py-12 md:py-16 bg-white" ref={sectionRef}>
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown-dark mb-3">De Ce Noi?</h2>
        <p className="text-brand-brown-light max-w-2xl mx-auto mb-10">
          Alegerea noastră înseamnă garanția unui eveniment plin de tradiție, energie și profesionalism.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: `${isVisible ? index * 250 : 0}ms` }}
            >
                {stat.isIcon ? (
                     <h3 className="text-4xl md:text-5xl font-black text-brand-orange mb-2 h-[56px] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </h3>
                ) : (
                    <h3 className="text-4xl md:text-5xl font-black bg-chef-gradient bg-clip-text text-transparent mb-2 h-[56px]">
                        {isVisible && <CountUpNumber target={stat.number} />}
                        {stat.suffix}
                    </h3>
                )}
              <h4 className="font-serif text-xl font-bold text-brand-brown-dark mb-2">{stat.title}</h4>
              <p className="text-brand-brown-light text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
