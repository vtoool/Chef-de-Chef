'use client';

import React, { useMemo } from 'react';
import { Booking } from '../../../../types';
import PieChart from '../../../../components/PieChart';

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
    status: 'completed',
    price: 5000,
    prepayment: 5000,
    payment_status: 'platit integral',
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
    status: 'completed',
    price: 3500,
    prepayment: 3500,
    payment_status: 'platit integral',
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
    event_date: '2026-04-14',
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
    event_date: '2026-05-20',
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
  {
    id: '6',
    created_at: '2024-05-01T11:20:00Z',
    event_date: '2026-06-10',
    event_type: 'Nuntă',
    location: 'Chișinău',
    name: 'Ana Popa',
    email: 'ana@popa.md',
    phone: '+373 64 678 901',
    status: 'pending',
    price: 5500,
    prepayment: 0,
    payment_status: 'neplatit',
    currency: 'EUR',
  },
  {
    id: '7',
    created_at: '2024-05-15T11:20:00Z',
    event_date: '2026-07-15',
    event_type: 'Cumătrie',
    location: 'Soroca',
    name: 'Ion Crucerescu',
    email: 'ion@crucerescu.md',
    phone: '+373 63 789 012',
    status: 'confirmed',
    price: 3200,
    prepayment: 1600,
    payment_status: 'avans platit',
    currency: 'EUR',
  },
];

const StatCard: React.FC<{ title: string; value: string | number; description: string; icon: React.ReactNode }> = ({ title, value, description, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
        <div className="bg-brand-orange/10 text-brand-orange p-3 rounded-full flex-shrink-0">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 break-words">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
    </div>
);

const pluralizeEventType = (type: string): string => {
    const plurals: Record<string, string> = {
        'Nuntă': 'Nunți',
        'Cumătrie': 'Cumătrii',
        'Corporativă': 'Corporative',
        'Petrecere': 'Petreceri',
        'Altul': 'Altele',
    };
    return plurals[type] || type;
};

const EXCHANGE_RATE_EUR_TO_MDL = 19.5;

export default function DemoRezumatPage() {
    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalRevenueInMDL = mockBookings
            .filter(b => b.status === 'completed' && b.price)
            .reduce((total, booking) => {
                const price = booking.price || 0;
                const currency = booking.currency || 'MDL';
                if (currency === 'MDL') {
                    return total + price;
                }
                if (currency === 'EUR') {
                    return total + (price * EXCHANGE_RATE_EUR_TO_MDL);
                }
                return total;
            }, 0);

        const eventTypeCounts = mockBookings.reduce<Record<string, number>>(
            (acc, b) => {
                acc[b.event_type] = (acc[b.event_type] ?? 0) + 1;
                return acc;
            },
            {}
        );

        const upcomingEventsCount = mockBookings.filter(b => {
            if (b.status !== 'confirmed' || !b.event_date) return false;
            const [year, month, day] = b.event_date.split('-').map(Number);
            const eventDate = new Date(year, month - 1, day);
            return eventDate.getTime() >= today.getTime();
        }).length;

        return {
            totalRevenueInMDL,
            completedEvents: mockBookings.filter(b => b.status === 'completed').length,
            upcomingEvents: upcomingEventsCount,
            pendingRequests: mockBookings.filter(b => b.status === 'pending').length,
            eventTypeCounts,
        };
    }, []);

    const sortedEventTypes = useMemo<[string, number][]>(() => {
        const pluralizedData = Object.entries(stats.eventTypeCounts).map(([type, count]) => {
            return [pluralizeEventType(type), count] as [string, number];
        });
        return pluralizedData.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
    }, [stats]);

    const formattedRevenue = new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'MDL', minimumFractionDigits: 0 }).format(stats.totalRevenueInMDL);

    return (
        <>
            <div className="mb-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
                    MOD DEMO
                </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Panou de Bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard 
                    title="Încasări Totale (MDL)" 
                    value={formattedRevenue}
                    description="Din evenimente finalizate (estimare)"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <StatCard 
                    title="Evenimente Finalizate" 
                    value={stats.completedEvents}
                    description="Total evenimente completate"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard 
                    title="Evenimente Viitoare" 
                    value={stats.upcomingEvents}
                    description="Confirmate în calendar"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                />
                <StatCard 
                    title="Cereri în Așteptare" 
                    value={stats.pendingRequests}
                    description="Necesită confirmare"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>

            <div className="mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 text-center md:text-left">Repartizare Evenimente</h2>
                    <PieChart data={sortedEventTypes} />
                </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
                <p>
                    * Conversia valutară este estimată: 
                    <span className="font-mono ml-2">1 EUR = {EXCHANGE_RATE_EUR_TO_MDL} MDL</span>
                </p>
            </div>
        </>
    );
}
