'use client';

import React, { useRef, useEffect } from 'react';

interface BookingButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const BookingButton: React.FC<BookingButtonProps> = ({ href, children, className, onClick }) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      button.style.setProperty('--mouse-x', `${x}px`);
      button.style.setProperty('--mouse-y', `${y}px`);
    };

    button.addEventListener('mousemove', handleMouseMove);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <a
      ref={buttonRef}
      href={href}
      className={`booking-button ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default BookingButton;
