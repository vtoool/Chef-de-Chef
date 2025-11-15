'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { Booking } from '../../../types';

// Helper components defined inside the main component or in a separate file if they grow
const Logo = () => (
    <div className="flex items-center space-x-2">
        <img src="https://scontent.fkiv7-1.fna.fbcdn.net/v/t39.30808-6/456236959_829273562675263_5934463475455699464_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-FwFg2FB9XoQ7kNvwE_khUg&_nc_oc=AdksXFMIZCuyZ_qiRyTobtMYjXbrpMRUTfB_UxWQviL9dwKY2JSbGc9mZ4fG0Jd1PDDofFzdHDXrwb4BgViofAG8&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=M9t8gcOoEteEPolC2SuR9Q&oh=00_AfhhmmqUYoveeMuTaQdkbvqE973TIqDyPsIaCJ4E-mYWAQ&oe=691DA8FB" alt="Chef de Chef Logo" className="h-10 w-10 rounded-full object-cover" />
        <span className="font-cursive text-3xl font-normal bg-chef-gradient bg-clip-text text-transparent pr-1">Chef de Chef</span>
    </div>
);

const StatusBadge: React.FC<{ status: Booking['status'] }> = ({ status }) => {
    const statusMap: Record<Booking['status'], { text: string; classes: string; }> = {
        pending: { text: 'În așteptare', classes: 'bg-yellow-500/20 text-yellow-300' },
        confirmed: { text: 'Confirmat', classes: 'bg-green-500/20 text-green-300' },
        completed: { text: 'Completat', classes: 'bg-blue-500/20 text-blue-300' },
        rejected: { text: 'Refuzat', classes: 'bg-red-500/20 text-red-300' },
    };
    const { text, classes } = statusMap[status] || { text: status, classes: 'bg-gray-500/20 text-gray-300' };
    return <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${classes}`}>{text}</span>;
};

// Modal Component for Booking Details
const BookingDetailsModal: React.FC<{
    booking: Booking;
    onClose: () => void;
    onSave: (updatedBooking: Booking) => Promise<void>;
}> = ({ booking, onClose, onSave }) => {
    const [editedBooking, setEditedBooking] = useState<Booking>(booking);
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedBooking(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = async () => {
        setIsSaving(true);
        await onSave(editedBooking);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-brand-brown-light rounded-lg shadow-2xl w-full max-w-2xl text-white" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-brand-brown-dark/50">
                    <h3 className="text-xl font-bold">Detalii Rezervare: {booking.name}</h3>
                    <p className="text-sm text-brand-cream/70">Data eveniment: {booking.event_date}</p>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                    {/* Details Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-brand-cream/60 block">Nume Client</label>
                            <p>{booking.name}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-brand-cream/60 block">Contact</label>
                            <p>{booking.phone} / {booking.email}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-brand-cream/60 block">Tip Eveniment</label>
                            <p>{booking.event_type}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-brand-cream/60 block">Locație</label>
                            <p>{booking.location}</p>
                        </div>
                         <div>
                            <label className="text-xs font-bold text-brand-cream/60 block">Detalii Suplimentare</label>
                            <p className="text-sm whitespace-pre-wrap">{booking.notes || 'N/A'}</p>
                        </div>
                    </div>
                    {/* Editable Form Column */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="status" className="text-sm font-bold text-brand-cream/80 block mb-1">Status Rezervare</label>
                            <select id="status" name="status" value={editedBooking.status} onChange={handleInputChange} className="w-full p-2 bg-brand-brown-dark/50 text-white border border-brand-brown-dark/80 rounded-md focus:ring-brand-orange focus:border-brand-orange">
                                <option value="pending">În așteptare</option>
                                <option value="confirmed">Confirmat</option>
                                <option value="completed">Completat</option>
                                <option value="rejected">Refuzat</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="price" className="text-sm font-bold text-brand-cream/80 block mb-1">Preț Total (MDL)</label>
                            <input type="number" id="price" name="price" value={editedBooking.price || ''} onChange={handleInputChange} placeholder="ex: 5000" className="w-full p-2 bg-brand-brown-dark/50 text-white border border-brand-brown-dark/80 rounded-md focus:ring-brand-orange focus:border-brand-orange"/>
                        </div>
                         <div>
                            <label htmlFor="prepayment" className="text-sm font-bold text-brand-cream/80 block mb-1">Avans Plătit (MDL)</label>
                            <input type="number" id="prepayment" name="prepayment" value={editedBooking.prepayment || ''} onChange={handleInputChange} placeholder="ex: 1000" className="w-full p-2 bg-brand-brown-dark/50 text-white border border-brand-brown-dark/80 rounded-md focus:ring-brand-orange focus:border-brand-orange"/>
                        </div>
                         <div>
                            <label htmlFor="payment_status" className="text-sm font-bold text-brand-cream/80 block mb-1">Status Plată</label>
                            <select id="payment_status" name="payment_status" value={editedBooking.payment_status || 'neplatit'} onChange={handleInputChange} className="w-full p-2 bg-brand-brown-dark/50 text-white border border-brand-brown-dark/80 rounded-md focus:ring-brand-orange focus:border-brand-orange">
                                <option value="neplatit">Neplătit</option>
                                <option value="avans platit">Avans Plătit</option>
                                <option value="platit integral">Plătit Integral</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-brand-brown-dark/30 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-gray-500/20 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-500/40 transition-colors">
                        Anulează
                    </button>
                    <button onClick={handleSaveClick} disabled={isSaving} className="bg-chef-gradient text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                        {isSaving ? 'Se salvează...' : 'Salvează Modificările'}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function AdminDashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Booking; direction: 'asc' | 'desc' }>({ key: 'event_date', direction: 'asc' });
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const router = useRouter();

    const fetchBookings = useCallback(async () => {
        if (!supabase) return;
        const { data, error } = await supabase.from('bookings').select('*');

        if (data) setBookings(data);
        if (error) console.error("Error fetching bookings:", error);
        
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            if (!supabase) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/admin');
            } else {
                fetchBookings();
            }
        };
        checkUser();
    }, [router, fetchBookings]);

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        router.push('/admin');
    };

    const handleSaveBooking = async (updatedBooking: Booking) => {
        if (!supabase || !updatedBooking.id) return;
        
        const { id, created_at, ...updateData } = updatedBooking;
        // Convert empty strings from inputs to null for the database
        const price = updateData.price ? Number(updateData.price) : null;
        const prepayment = updateData.prepayment ? Number(updateData.prepayment) : null;

        const { error } = await supabase
            .from('bookings')
            .update({ ...updateData, price, prepayment })
            .eq('id', id);

        if (error) {
            console.error("Error updating booking:", error);
            // Here you could add a toast notification for the error
        } else {
            await fetchBookings(); // Refetch data to show updated info
            setSelectedBooking(null); // Close modal on success
        }
    };

    const filteredAndSortedBookings = useMemo(() => {
        let filtered = bookings.filter(b =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.phone.includes(searchQuery)
        );

        return filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;
            
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [bookings, searchQuery, sortConfig]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [key, direction] = e.target.value.split('-');
        setSortConfig({ key: key as keyof Booking, direction: direction as 'asc' | 'desc' });
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

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Caută după nume, email, telefon..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full sm:w-1/2 p-2 bg-brand-brown-light/50 text-white border border-brand-brown-dark/80 rounded-md focus:ring-brand-orange focus:border-brand-orange"
                    />
                    <select
                        onChange={handleSortChange}
                        value={`${sortConfig.key}-${sortConfig.direction}`}
                        className="w-full sm:w-auto p-2 bg-brand-brown-light/50 text-white border border-brand-brown-dark/80 rounded-md focus:ring-brand-orange focus:border-brand-orange"
                    >
                        <option value="event_date-asc">Data Eveniment (Crescător)</option>
                        <option value="event_date-desc">Data Eveniment (Descrescător)</option>
                        <option value="status-asc">Status (A-Z)</option>
                        <option value="status-desc">Status (Z-A)</option>
                    </select>
                </div>


                {isLoading ? (
                    <div className="text-center text-brand-cream/80">Se încarcă rezervările...</div>
                ) : filteredAndSortedBookings.length === 0 ? (
                    <div className="text-center text-brand-cream/80 bg-brand-brown-light/50 p-6 rounded-lg">
                        {searchQuery ? 'Nu am găsit nicio rezervare conform căutării.' : 'Nu există nicio rezervare înregistrată.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-brand-brown-light/30 rounded-lg shadow-lg">
                        <table className="w-full text-sm text-left text-brand-cream/90">
                            <thead className="text-xs text-brand-cream uppercase bg-brand-brown-light/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Data Evenimentului</th>
                                    <th scope="col" className="px-6 py-3">Nume Client</th>
                                    <th scope="col" className="px-6 py-3">Tip Eveniment</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedBookings.map((booking) => (
                                    <tr key={booking.id} className="border-b border-brand-brown-light/30 hover:bg-brand-brown-light/50">
                                        <td className="px-6 py-4 font-medium">{booking.event_date}</td>
                                        <td className="px-6 py-4">{booking.name}</td>
                                        <td className="px-6 py-4">{booking.event_type}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => setSelectedBooking(booking)} className="font-medium text-brand-orange hover:underline">
                                                Detalii
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            {selectedBooking && (
                <BookingDetailsModal 
                    booking={selectedBooking} 
                    onClose={() => setSelectedBooking(null)} 
                    onSave={handleSaveBooking}
                />
            )}
        </div>
    );
}