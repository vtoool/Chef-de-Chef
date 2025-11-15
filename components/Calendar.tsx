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
  isBefore,
  isToday,
} from 'date-fns';
import { ro } from 'date-fns/locale';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  unavailableDates: Date[];
  minDate: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  unavailableDates,
  minDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-brand-cream transition-colors"
          aria-label="Luna precedentă"
        >
          &lt;
        </button>
        <h2 className="font-serif font-bold text-lg text-brand-brown-dark capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ro })}
        </h2>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-brand-cream transition-colors"
          aria-label="Luna următoare"
        >
          &gt;
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];
    return (
      <div className="grid grid-cols-7 text-center text-sm font-semibold text-brand-brown-light">
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
          const isDaySelected = selectedDate && isSameDay(day, selectedDate);
          const isDayBeforeMin = isBefore(day, minDate) && !isSameDay(day, minDate);
          const isDayUnavailable = unavailableDates.some((unavailableDate) =>
            isSameDay(day, unavailableDate)
          );

          const isDisabled = isDayBeforeMin || isDayUnavailable;

          const cellClasses = [
            'w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200',
            isDayInCurrentMonth ? 'text-brand-brown-dark' : 'text-gray-400',
            !isDisabled && 'cursor-pointer hover:bg-brand-cream',
            isDaySelected && 'bg-brand-orange text-white hover:bg-brand-orange/90',
            isToday(day) && !isDaySelected && 'ring-2 ring-brand-orange/50',
            isDisabled && 'text-gray-300 line-through cursor-not-allowed',
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
                onClick={() => onDateSelect(day)}
                disabled={isDisabled}
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
    </div>
  );
};

export default Calendar;
