'use client';

import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ro } from 'date-fns/locale';
import { Booking } from '../../../types';

interface AdminCalendarProps {
  bookings: Booking[];
  filterDate: Date | null;
  onDateClick: (date: Date | null) => void;
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({
  bookings,
  filterDate,
  onDateClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-brand-brown-dark/50 transition-all duration-200"
          aria-label="Luna precedentă"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="font-serif font-bold text-lg text-white capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ro })}
        </h2>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-brand-brown-dark/50 transition-all duration-200"
          aria-label="Luna următoare"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];
    return (
      <div className="grid grid-cols-7 text-center text-sm font-semibold text-brand-cream/70">
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 text-center mt-2">
        {days.map((day) => {
          const isDayInCurrentMonth = isSameMonth(day, monthStart);
          const isFilterActive = filterDate && isSameDay(day, filterDate);
          
          const bookingsOnDay = bookings.filter(b => isSameDay(new Date(b.event_date + 'T00:00:00Z'), day));
          
          let statusClass = '';
          if (bookingsOnDay.length > 0) {
              if (bookingsOnDay.some(b => b.status === 'confirmed')) {
                  statusClass = 'bg-green-500/30 text-white font-bold hover:bg-green-500/50';
              } else if (bookingsOnDay.some(b => b.status === 'pending')) {
                  statusClass = 'bg-yellow-500/30 text-white font-bold hover:bg-yellow-500/50';
              } else if (bookingsOnDay.some(b => b.status === 'completed')) {
                  statusClass = 'bg-blue-500/30 text-white font-bold hover:bg-blue-500/50';
              }
          }

          const handleDayClick = () => {
             if (isFilterActive) {
                onDateClick(null); // Deselect if clicked again
             } else {
                onDateClick(day);
             }
          }

          const cellClasses = [
            'w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer',
            isDayInCurrentMonth ? 'text-white' : 'text-gray-500',
            !statusClass && 'hover:bg-brand-brown-dark/50',
            statusClass,
            isToday(day) && !isFilterActive && 'ring-2 ring-white/50',
            isFilterActive && 'ring-2 ring-brand-orange ring-offset-2 ring-offset-brand-brown-light',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={day.toString()}
              className="py-1 flex justify-center"
            >
              <button
                type="button"
                className={cellClasses}
                onClick={handleDayClick}
              >
                {format(day, 'd')}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-brand-brown-light/30 p-4 rounded-lg shadow-md w-full max-w-sm mx-auto">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
       <div className="mt-4 flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs text-brand-cream/80">
            <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500/30"></span>
                <span>În așteptare</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-green-500/30"></span>
                <span>Confirmat</span>
            </div>
             <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-500/30"></span>
                <span>Completat</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full ring-2 ring-white/50"></span>
                <span>Astăzi</span>
            </div>
        </div>
    </div>
  );
};

export default AdminCalendar;