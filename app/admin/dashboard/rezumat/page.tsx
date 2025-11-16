
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { supabase } from '../../../../lib/supabaseClient';
import { Booking } from '../../../../types';
import { getExchangeRates, ExchangeRates } from '../../../../lib/exchangeRates';

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
                            return total + (price * rates.rates.MDL);
                        }
                        if (currency === 'USD') {
                            const priceInEUR = price / rates.rates.USD;
                            return total + (priceInEUR * rates.rates.MDL);
                        }
                    }
                    // Fallback: If rates fail, add original currency value but we will handle the display
                    return total;
                }, 0);

            const calculatedStats: Stats = {
                totalRevenueInMDL,
                completedEvents: bookingsData.filter(b => b.status === 'completed').length,
                upcomingEvents: bookingsData.filter(b => b.status === 'confirmed' && new Date(b.event_date + 'T00:00:00Z') >= today).length,
                pendingRequests: bookingsData.filter(b => b.status === 'pending').length,
                eventTypeCounts: bookingsData.reduce((acc: Record<string, number>, b) => {
                    acc[b.event_type] = (acc[b.event_type] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
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

    const sortedEventTypes = useMemo(() => {
        if (!stats) return [];
        // FIX: Explicitly cast `a` and `b` to number to ensure correct sorting and type inference.
        return Object.entries(stats.eventTypeCounts).sort(([, a], [, b]) => (b as number) - (a as number));
    }, [stats]);
    
    if (isLoading) {
        return <div className="text-center text-gray-500">Se încarcă rezumatul...</div>;
    }

    if (!stats) {
        return <div className="text-center text-red-500">Nu s-au putut încărca datele.</div>;
    }
    
    const formattedRevenue = new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'MDL', minimumFractionDigits: 0 }).format(stats.totalRevenueInMDL);
    
    // FIX: Explicitly cast `count` to number to ensure `totalBookings` is inferred as a number.
    const totalBookings = Object.values(stats.eventTypeCounts).reduce((sum: number, count) => sum + (count as number), 0);

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
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Repartizare Evenimente</h2>
                    {sortedEventTypes.length > 0 ? (
                        <div className="space-y-4">
                            {sortedEventTypes.map(([type, count]) => (
                                <div key={type}>
                                    <div className="flex justify-between items-center mb-1 text-sm">
                                        <span className="font-semibold text-gray-600">{type}</span>
                                        <span className="text-gray-500">{count as number} evenimente</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-chef-gradient h-2.5 rounded-full" style={{ width: `${totalBookings > 0 ? (Number(count) / totalBookings) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Nu există date despre evenimente.</p>
                    )}
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
