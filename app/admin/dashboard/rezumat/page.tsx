
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
// FIX: Module '"date-fns"' has no exported member 'format'. Import from submodule instead.
import format from 'date-fns/format';
import { ro } from 'date-fns/locale';
import { supabase } from '../../../../lib/supabaseClient';
import { Booking } from '../../../../types';
import { getExchangeRates, ExchangeRates } from '../../../../lib/exchangeRates';
import PieChart from '../../../../components/PieChart';

interface Stats {
    totalRevenueInMDL: number;
    completedEvents: number;
    upcomingEvents: number;
    pendingRequests: number;
    eventTypeCounts: Record<string, number>;
}

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

export default function RezumatPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchAndCalculateStats = useCallback(async (rates: ExchangeRates | null) => {
        if (!supabase) return;
        setIsLoading(true);

        const { data, error } = await supabase
            .from('bookings')
            .select('status, price, event_type, event_date, currency');

        if (error) {
            console.error("Error fetching stats data:", error);
            setIsLoading(false);
            return;
        }

        if (data) {
            const bookingsData = data as (Pick<Booking, 'status' | 'price' | 'event_type' | 'event_date' | 'currency'>)[];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const totalRevenueInMDL = bookingsData
                .filter(b => b.status === 'completed' && b.price)
                .reduce((total, booking) => {
                    const price = booking.price || 0;
                    const currency = booking.currency || 'MDL';
                    if (currency === 'MDL') {
                        return total + price;
                    }
                    if (rates) {
                        if (currency === 'EUR') {
                            return total + (price * Number(rates.rates.MDL));
                        }
                        if (currency === 'USD') {
                            const priceInEUR = price / Number(rates.rates.USD);
                            return total + (priceInEUR * Number(rates.rates.MDL));
                        }
                    }
                    return total;
                }, 0);

            const eventTypeCounts = bookingsData.reduce<Record<string, number>>(
                (acc, b) => {
                    acc[b.event_type] = (acc[b.event_type] ?? 0) + 1;
                    return acc;
                },
                {}
            );
            
            // FIX: Correctly parse event_date to avoid timezone issues when comparing with today's date.
            const upcomingEventsCount = bookingsData.filter(b => {
                if (b.status !== 'confirmed' || !b.event_date) return false;
                const [year, month, day] = b.event_date.split('-').map(Number);
                const eventDate = new Date(year, month - 1, day);
                // FIX: Use getTime() for date comparison to avoid TypeScript errors.
                return eventDate.getTime() >= today.getTime();
            }).length;

            const calculatedStats: Stats = {
                totalRevenueInMDL,
                completedEvents: bookingsData.filter(b => b.status === 'completed').length,
                upcomingEvents: upcomingEventsCount,
                pendingRequests: bookingsData.filter(b => b.status === 'pending').length,
                eventTypeCounts,
            };
            setStats(calculatedStats);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const checkUserAndFetchData = async () => {
            if (!supabase) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/admin');
            } else {
                const rates = await getExchangeRates();
                setExchangeRates(rates);
                await fetchAndCalculateStats(rates);
            }
        };
        checkUserAndFetchData();
    }, [router, fetchAndCalculateStats]);

    const sortedEventTypes = useMemo<[string, number][]>(() => {
        if (!stats) return [];
        return Object.entries(stats.eventTypeCounts).sort(
            ([_typeA, countA], [_typeB, countB]) => countB - countA
        );
    }, [stats]);
    
    if (isLoading) {
        return <div className="text-center text-gray-500">Se încarcă rezumatul...</div>;
    }

    if (!stats) {
        return <div className="text-center text-red-500">Nu s-au putut încărca datele.</div>;
    }
    
    const formattedRevenue = new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'MDL', minimumFractionDigits: 0 }).format(stats.totalRevenueInMDL);

    return (
        <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Rezumat Activitate</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                 <StatCard 
                    title="Încasări Totale (MDL)" 
                    value={exchangeRates ? formattedRevenue : 'N/A'}
                    description={exchangeRates ? "Din evenimente finalizate" : "Cursul valutar nu a putut fi încărcat"}
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

            {exchangeRates && (
                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>
                        * Conversia valutară este calculată cu ratele din {format(new Date(exchangeRates.date), 'd MMMM yyyy', { locale: ro })}:
                        <span className="font-mono ml-2">1 EUR = {exchangeRates.rates.MDL.toFixed(4)} MDL</span>;
                        <span className="font-mono ml-2">1 USD = {((1 / exchangeRates.rates.USD) * exchangeRates.rates.MDL).toFixed(4)} MDL</span>.
                    </p>
                </div>
            )}
        </>
    );
}