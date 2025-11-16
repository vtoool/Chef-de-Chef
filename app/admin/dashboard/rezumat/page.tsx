'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { Booking } from '../../../../types';

interface Stats {
    totalRevenue: number;
    completedEvents: number;
    upcomingEvents: number;
    pendingRequests: number;
    eventTypeCounts: Record<string, number>;
}

const StatCard: React.FC<{ title: string; value: string | number; description: string; icon: React.ReactNode }> = ({ title, value, description, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
        <div className="bg-brand-orange/10 text-brand-orange p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
    </div>
);

export default function RezumatPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    // FIX: Add state for bookings to use in render logic.
    const [bookings, setBookings] = useState<(Pick<Booking, 'status' | 'price' | 'event_type' | 'event_date'>)[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchAndCalculateStats = useCallback(async () => {
        if (!supabase) return;
        setIsLoading(true);

        const { data, error } = await supabase
            .from('bookings')
            .select('status, price, event_type, event_date');

        if (error) {
            console.error("Error fetching stats data:", error);
            setIsLoading(false);
            return;
        }

        if (data) {
            const bookingsData = data as (Pick<Booking, 'status' | 'price' | 'event_type' | 'event_date'>)[];
            setBookings(bookingsData);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const calculatedStats: Stats = {
                totalRevenue: bookingsData
                    .filter(b => b.status === 'completed' && b.price)
                    .reduce((sum, b) => sum + (b.price || 0), 0),
                completedEvents: bookingsData.filter(b => b.status === 'completed').length,
                // FIX: Use explicit UTC date parsing to prevent timezone issues and resolve type errors.
                upcomingEvents: bookingsData.filter(b => b.status === 'confirmed' && new Date(b.event_date + 'T00:00:00Z') >= today).length,
                pendingRequests: bookingsData.filter(b => b.status === 'pending').length,
                eventTypeCounts: bookingsData.reduce((acc, b) => {
                    acc[b.event_type] = (acc[b.event_type] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
            };
            setStats(calculatedStats);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            if (!supabase) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/admin');
            } else {
                fetchAndCalculateStats();
            }
        };
        checkUser();
    }, [router, fetchAndCalculateStats]);

    const sortedEventTypes = useMemo(() => {
        if (!stats) return [];
        return Object.entries(stats.eventTypeCounts).sort(([, a], [, b]) => b - a);
    }, [stats]);
    
    if (isLoading) {
        return <div className="text-center text-gray-500">Se încarcă rezumatul...</div>;
    }

    if (!stats) {
        return <div className="text-center text-red-500">Nu s-au putut încărca datele.</div>;
    }
    
    const formattedRevenue = new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'MDL', minimumFractionDigits: 0 }).format(stats.totalRevenue);

    return (
        <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Rezumat Activitate</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                 <StatCard 
                    title="Încasări Totale" 
                    value={formattedRevenue}
                    description="Din evenimente finalizate"
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

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Repartizare Evenimente</h2>
                 {sortedEventTypes.length > 0 ? (
                    <div className="space-y-4">
                        {sortedEventTypes.map(([type, count]) => (
                            <div key={type}>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-semibold text-gray-600">{type}</span>
                                    <span className="text-gray-500">{count} evenimente</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    {/* FIX: Use `bookings` state which is now available in the render scope. */}
                                    <div className="bg-chef-gradient h-2.5 rounded-full" style={{ width: `${(count / bookings.length) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <p className="text-gray-500">Nu există date despre evenimente.</p>
                )}
            </div>
        </>
    );
}