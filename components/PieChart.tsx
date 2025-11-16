'use client';

import React from 'react';

interface PieChartProps {
  data: [string, number][];
}

// Pre-defined color palette for chart segments, matching the site's brand
const COLORS = ['#F7931E', '#FFC857', '#3B2414', '#5A3A26', '#E5A967', '#D18C47'];

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">Nu există date pentru a afișa graficul.</p>;
  }

  const total = data.reduce((sum, [, value]) => sum + value, 0);
  let cumulativePercentage = 0;

  const segments = data.map(([label, value], index) => {
    const percentage = (value / total) * 100;
    const segmentData = {
      label,
      value,
      percentage,
      color: COLORS[index % COLORS.length],
      offset: cumulativePercentage,
    };
    cumulativePercentage += percentage;
    return segmentData;
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4">
      <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="transform -rotate-90">
          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx="18"
              cy="18"
              r="15.9155"
              fill="transparent"
              stroke={segment.color}
              strokeWidth="3.8"
              strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
              strokeDashoffset={-segment.offset}
              aria-label={`${segment.label}: ${segment.percentage.toFixed(1)}%`}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-center">
                <span className="text-3xl font-bold text-gray-800">{total}</span>
                <span className="block text-sm text-gray-500">Total</span>
            </span>
        </div>
      </div>
      <div className="w-full md:w-auto self-center">
        <ul className="space-y-2">
          {segments.map((segment) => (
            <li key={segment.label} className="flex items-center text-sm">
              <span
                className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              ></span>
              <span className="font-semibold text-gray-700">{segment.label}</span>
              <span className="ml-auto text-gray-500 pl-4">
                {segment.value} ({segment.percentage.toFixed(1)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PieChart;
