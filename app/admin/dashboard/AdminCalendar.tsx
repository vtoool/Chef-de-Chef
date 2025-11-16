'use client';

import React, { useState } from 'react';
// FIX: Module '"date-fns"' has no exported members. Import from submodules instead.
import format from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import isSameMonth from 'date-fns/isSameMonth';
import isSameDay from 'date-fns/isSameDay';
import isToday from 'date-fns/isToday';
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
          className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
          aria-label="Luna precedentă"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="font-serif font-bold text-lg text-gray-800 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ro })}
        </h2>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
          aria-label="Luna următoare"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];
    return (
      <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500">
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
          
          // FIX: Correctly parse date string to avoid timezone issues.
          // The browser can interpret 'YYYY-MM-DD' as UTC, which can shift the day
          // back by one in timezones west of GMT. This ensures the date is
          // treated as a local date, matching the calendar's behavior.
          const bookingsOnDay = bookings.filter(b => {
              if (!b.event_date) return false;
              // b.event_date is 'YYYY-MM-DD'
              const [year, month, dayOfMonth] = b.event_date.split('-').map(Number);
              // new Date(year, month - 1, day) creates a date in the local timezone.
              const eventDate = new Date(year, month - 1, dayOfMonth);
              return isSameDay(eventDate, day);
          });
          
          let statusClass = '';
          if (bookingsOnDay.length > 0) {
              if (bookingsOnDay.some(b => b.status === 'confirmed')) {
                  statusClass = 'bg-green-100 text-green-800 font-bold hover:bg-green-200';
              } else if (bookingsOnDay.some(b => b.status === 'pending')) {
                  statusClass = 'bg-yellow-100 text-yellow-800 font-bold hover:bg-yellow-200';
              } else if (bookingsOnDay.some(b => b.status === 'completed')) {
                  statusClass = 'bg-blue-100 text-blue-800 font-bold hover:bg-blue-200';
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
            isDayInCurrentMonth ? 'text-gray-700' : 'text-gray-400',
            !statusClass && 'hover:bg-gray-100',
            statusClass,
            isToday(day) && !isFilterActive && 'ring-2 ring-brand-orange/70',
            isFilterActive && 'ring-2 ring-brand-orange ring-offset-2 ring-offset-white',
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
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm mx-auto">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
       <div className="mt-4 flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200"></span>
                <span>În așteptare</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></span>
                <span>Confirmat</span>
            </div>
             <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200"></span>
                <span>Completat</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full ring-2 ring-brand-orange/70"></span>
                <span>Astăzi</span>
            </div>
        </div>
    </div>
  );
};

export default AdminCalendar;