'use client';

import React from 'react';
import { Booking } from '../../../types';

const mockBookings: Booking[] = [
  {
    id: '1',
    created_at: '2024-01-15T10:00:00Z',
    event_date: '2024-06-15',
    event_type: 'Nuntă',
    location: 'Chișinău',
    name: 'Ion Popescu',
    email: 'ion@popescu.md',
    phone: '+373 69 123 456',
    status: 'confirmed',
    price: 5000,
    prepayment: 1000,
    payment_status: 'avans platit',
    currency: 'EUR',
  },
  {
    id: '2',
    created_at: '2024-02-20T14:30:00Z',
    event_date: '2024-07-22',
    event_type: 'Cumătrie',
    location: 'Bălți',
    name: 'Maria Dumitrescu',
    email: 'maria@dumitrescu.md',
    phone: '+373 68 234 567',
    status: 'pending',
    price: 3500,
    prepayment: 0,
    payment_status: 'neplatit',
    currency: 'EUR',
  },
  {
    id: '3',
    created_at: '2024-03-10T09:15:00Z',
    event_date: '2024-08-05',
    event_type: 'Petrecere',
    location: 'Chișinău',
    name: 'Alexandru Ionescu',
    email: 'alex@ionescu.md',
    phone: '+373 67 345 678',
    status: 'completed',
    price: 2500,
    prepayment: 2500,
    payment_status: 'platit integral',
    currency: 'EUR',
  },
  {
    id: '4',
    created_at: '2024-03-25T16:45:00Z',
    event_date: '2024-09-14',
    event_type: 'Corporativă',
    location: 'Orhei',
    name: 'Elena Vasilescu',
    email: 'elena@vasilescu.md',
    phone: '+373 66 456 789',
    status: 'confirmed',
    price: 4000,
    prepayment: 2000,
    payment_status: 'avans platit',
    currency: 'EUR',
  },
  {
    id: '5',
    created_at: '2024-04-01T11:20:00Z',
    event_date: '2024-10-20',
    event_type: 'Nuntă',
    location: 'Ungheni',
    name: 'Victor Munteanu',
    email: 'victor@munteanu.md',
    phone: '+373 65 567 890',
    status: 'pending',
    price: 6000,
    prepayment: 0,
    payment_status: 'neplatit',
    currency: 'EUR',
  },
];

const mockClients = [
  { id: '1', name: 'Ion Popescu', emails: ['ion@popescu.md'], phones: ['+373 69 123 456'] },
  { id: '2', name: 'Maria Dumitrescu', emails: ['maria@dumitrescu.md'], phones: ['+373 68 234 567'] },
  { id: '3', name: 'Alexandru Ionescu', emails: ['alex@ionescu.md'], phones: ['+373 67 345 678'] },
  { id: '4', name: 'Elena Vasilescu', emails: ['elena@vasilescu.md'], phones: ['+373 66 456 789'] },
  { id: '5', name: 'Victor Munteanu', emails: ['victor@munteanu.md'], phones: ['+373 65 567 890'] },
];

const formatNumber = (value: number | null | undefined, currency: string | null | undefined): string => {
  const displayCurrency = currency || 'EUR';
  if (value === null || value === undefined || isNaN(value)) return '—';
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: displayCurrency,
    minimumFractionDigits: 0,
  }).format(value);
};

const StatusBadge: React.FC<{ status: Booking['status'] }> = ({ status }) => {
  const statusMap: Record<Booking['status'], { text: string; classes: string }> = {
    pending: { text: 'În așteptare', classes: 'bg-yellow-100 text-yellow-800' },
    confirmed: { text: 'Confirmat', classes: 'bg-green-100 text-green-800' },
    completed: { text: 'Completat', classes: 'bg-blue-100 text-blue-800' },
    rejected: { text: 'Refuzat', classes: 'bg-red-100 text-red-800' },
  };
  const { text, classes } = statusMap[status] || { text: status, classes: 'bg-gray-100 text-gray-800' };
  return <span className={`px-2 py-1 text-xs font-bold rounded-full ${classes}`}>{text}</span>;
};

export default function AdminDemoPage() {
  const totalRevenue = mockBookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const totalCollected = mockBookings.reduce((sum, b) => sum + (b.prepayment || 0), 0);
  const pendingBookings = mockBookings.filter(b => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Admin Demo</h1>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
              DEMO
            </span>
          </div>
          <p className="text-gray-600">Aceasta este o versiune demo cu date fictive.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500 mb-1">Total Rezervări</p>
            <p className="text-3xl font-bold text-gray-900">{mockBookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500 mb-1">În Așteptare</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingBookings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500 mb-1">Venituri Totale</p>
            <p className="text-3xl font-bold text-green-600">{formatNumber(totalRevenue, 'EUR')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500 mb-1">Încasări</p>
            <p className="text-3xl font-bold text-blue-600">{formatNumber(totalCollected, 'EUR')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rezervări Recente</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Data</th>
                    <th className="px-4 py-2">Client</th>
                    <th className="px-4 py-2">Tip</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 text-right">Preț</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100">
                      <td className="px-4 py-3">{booking.event_date}</td>
                      <td className="px-4 py-3 font-medium">{booking.name}</td>
                      <td className="px-4 py-3">{booking.event_type}</td>
                      <td className="px-4 py-3"><StatusBadge status={booking.status} /></td>
                      <td className="px-4 py-3 text-right">{formatNumber(booking.price, booking.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Clienți</h2>
            <div className="space-y-4">
              {mockClients.map((client) => (
                <div key={client.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.emails[0]}</p>
                  </div>
                  <p className="text-sm text-gray-600">{client.phones[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
