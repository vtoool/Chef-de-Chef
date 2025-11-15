'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { Booking } from '../../../types';

const Logo = () => (
    <div className="flex items-center space-x-2">
        <img src="https://scontent.fkiv7-1.fna.fbcdn.net/v/t39.30808-6/456236959_829273562675263_5934463475455699464_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-FwFg2FB9XoQ7kNvwE_khUg&_nc_oc=AdksXFMIZCuyZ_qiRyTobtMYjXbrpMRUTfB_UxWQviL9dwKY2JSbGc9mZ4fG0Jd1PDDofFzdHDXrwb4BgViofAG8&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=M9t8gcOoEteEPolC2SuR9Q&oh=00_AfhhmmqUYoveeMuTaQdkbvqE973TIqDyPsIaCJ4E-mYWAQ&oe=691DA8FB" alt="Chef de Chef Logo" className="h-10 w-10 rounded-full object-cover" />
        <span className="font-cursive text-3xl font-normal bg-chef-gradient bg-clip-text text-transparent pr-1">Chef de Chef</span>
    </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-bold rounded-full capitalize";
    let colorClasses = "";
    switch (status) {
        case 'pending':
            colorClasses = 'bg-yellow-500/20 text-yellow-300';
            break;
        case 'confirmed':
            colorClasses = 'bg-green-500/20 text-green-300';
            break;
        case 'rejected':
            colorClasses = 'bg-red-500/20 text-red-300';
            break;
        default:
            colorClasses = 'bg-gray-500/20 text-gray-300';
    }
    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};


export default function AdminDashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (!supabase) return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/admin');
                return;
            }

            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('event_date', { ascending: true });

            if (data) {
                setBookings(data);
            }
            if (error) {
                console.error("Error fetching bookings:", error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        router.push('/admin');
    };

    return (
        <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-brand-brown-light/30">
                <Logo />
                <button
                    onClick={handleLogout}
                    className="bg-brand-orange/20 text-brand-orange font-semibold py-2 px-4 rounded-lg hover:bg-brand-orange/40 transition-colors"
                >
                    Deconectare
                </button>
            </header>

            <main>
                <h1 className="text-2xl md:text-3xl font-bold text-brand-cream mb-6">Dashboard Rezervări</h1>

                {isLoading ? (
                    <div className="text-center text-brand-cream/80">Se încarcă rezervările...</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center text-brand-cream/80 bg-brand-brown-light/50 p-6 rounded-lg">
                        Nu există nicio rezervare înregistrată.
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-brand-brown-light/30 rounded-lg shadow-lg">
                        <table className="w-full text-sm text-left text-brand-cream/90">
                            <thead className="text-xs text-brand-cream uppercase bg-brand-brown-light/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Data Evenimentului</th>
                                    <th scope="col" className="px-6 py-3">Nume Client</th>
                                    <th scope="col" className="px-6 py-3">Tip Eveniment</th>
                                    <th scope="col" className="px-6 py-3">Locație</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Contact</th>
                                    <th scope="col" className="px-6 py-3">Detalii</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="border-b border-brand-brown-light/30 hover:bg-brand-brown-light/50">
                                        <td className="px-6 py-4 font-medium">{booking.event_date}</td>
                                        <td className="px-6 py-4">{booking.name}</td>
                                        <td className="px-6 py-4">{booking.event_type}</td>
                                        <td className="px-6 py-4">{booking.location}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{booking.phone}</div>
                                            <div className="text-xs text-brand-cream/60">{booking.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-brand-cream/80 max-w-[200px]" title={booking.notes || ''}>
                                            <p className="truncate">{booking.notes || 'N/A'}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}