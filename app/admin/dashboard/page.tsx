'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { supabase } from '../../../lib/supabaseClient';
import { Booking } from '../../../types';
import AdminCalendar from './AdminCalendar';

// Helper components
const StatusBadge: React.FC<{ status: Booking['status'] }> = ({ status }) => {
    const statusMap: Record<Booking['status'], { text: string; classes: string; }> = {
        pending: { text: 'În așteptare', classes: 'bg-yellow-100 text-yellow-800' },
        confirmed: { text: 'Confirmat', classes: 'bg-green-100 text-green-800' },
        completed: { text: 'Completat', classes: 'bg-blue-100 text-blue-800' },
        rejected: { text: 'Refuzat', classes: 'bg-red-100 text-red-800' },
    };
    const { text, classes } = statusMap[status] || { text: status, classes: 'bg-gray-100 text-gray-800' };
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
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl text-gray-800" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold">Detalii Rezervare: {booking.name}</h3>
                    <p className="text-sm text-gray-500">Data eveniment: {booking.event_date}</p>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                    {/* Details Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 block">Nume Client</label>
                            <p>{booking.name}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block">Contact</label>
                            <p>{booking.phone} / {booking.email}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block">Tip Eveniment</label>
                            <p>{booking.event_type}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block">Locație</label>
                            <p>{booking.location}</p>
                        </div>
                         <div>
                            <label className="text-xs font-bold text-gray-500 block">Detalii Suplimentare (Client)</label>
                            <p className="text-sm whitespace-pre-wrap">{booking.notes || 'N/A'}</p>
                        </div>
                    </div>
                    {/* Editable Form Column */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="status" className="text-sm font-bold text-gray-600 block mb-1">Status Rezervare</label>
                            <select id="status" name="status" value={editedBooking.status} onChange={handleInputChange} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange">
                                <option value="pending">În așteptare</option>
                                <option value="confirmed">Confirmat</option>
                                <option value="completed">Completat</option>
                                <option value="rejected">Refuzat</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="price" className="text-sm font-bold text-gray-600 block mb-1">Preț Total (MDL)</label>
                            <input type="number" id="price" name="price" value={editedBooking.price ?? ''} onChange={handleInputChange} placeholder="ex: 5000" className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"/>
                        </div>
                         <div>
                            <label htmlFor="prepayment" className="text-sm font-bold text-gray-600 block mb-1">Avans Plătit (MDL)</label>
                            <input type="number" id="prepayment" name="prepayment" value={editedBooking.prepayment ?? ''} onChange={handleInputChange} placeholder="ex: 1000" className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"/>
                        </div>
                         <div>
                            <label htmlFor="payment_status" className="text-sm font-bold text-gray-600 block mb-1">Status Plată</label>
                            <select id="payment_status" name="payment_status" value={editedBooking.payment_status || 'neplatit'} onChange={handleInputChange} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange">
                                <option value="neplatit">Neplătit</option>
                                <option value="avans platit">Avans Plătit</option>
                                <option value="platit integral">Plătit Integral</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="notes_interne" className="text-sm font-bold text-gray-600 block mb-1">Notițe Interne</label>
                            <textarea id="notes_interne" name="notes_interne" value={editedBooking.notes_interne || ''} onChange={handleInputChange} rows={3} placeholder="Detalii confidențiale, planificări..." className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"></textarea>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
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

// Toast Notification Component
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void; }> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const baseClasses = 'fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 z-50';
    const typeClasses = type === 'success' ? 'bg-green-600' : 'bg-red-600';

    return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
};

export default function AdminDashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Booking; direction: 'asc' | 'desc' }>({ key: 'event_date', direction: 'asc' });
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({ message: '', type: 'success', visible: false });
    const [filterDate, setFilterDate] = useState<Date | null>(null);
    const router = useRouter();

    const fetchBookings = useCallback(async () => {
        if (!supabase) return;
        setIsLoading(true);
        const { data, error } = await supabase.from('bookings').select('*').order('event_date', { ascending: true });

        if (data) setBookings(data as Booking[]);
        if (error) {
          console.error("Error fetching bookings:", error);
          showToast(`Eroare la preluarea datelor: ${error.message}`, 'error');
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
                fetchBookings();
            }
        };
        checkUser();
    }, [router, fetchBookings]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type, visible: true });
    };

    const handleSaveBooking = async (updatedBooking: Booking) => {
        if (!supabase || !updatedBooking.id) return;

        // The state from the form will have string values for number inputs.
        // We must correctly parse them to number or null for the database.
        const priceAsAny = updatedBooking.price as any;
        const price = (priceAsAny === '' || priceAsAny === null) ? null : Number(priceAsAny);

        const prepaymentAsAny = updatedBooking.prepayment as any;
        const prepayment = (prepaymentAsAny === '' || prepaymentAsAny === null) ? null : Number(prepaymentAsAny);

        const updateData = {
            status: updatedBooking.status,
            price: price,
            prepayment: prepayment,
            payment_status: updatedBooking.payment_status || 'neplatit',
            notes_interne: updatedBooking.notes_interne || null,
        };
        
        const { data, error } = await supabase
            .from('bookings')
            .update(updateData)
            .eq('id', updatedBooking.id)
            .select();

        if (error) {
            console.error("Error updating booking:", error);
            showToast(`Eroare la salvare: ${error.message}`, 'error');
        } else if (data && data.length > 0) {
            showToast('Modificări salvate cu succes!', 'success');
            
            // Use the data returned from the database as the source of truth
            const savedBooking = data[0] as Booking;

            setBookings(prevBookings =>
                prevBookings.map(b => (b.id === savedBooking.id ? savedBooking : b))
            );
            setSelectedBooking(null); // Close modal on success
        } else {
            // This is the crucial part: if Supabase returns success (no error) but no data,
            // it means the update didn't affect any rows. We treat this as an error.
            console.error("Update returned no data. Check RLS policies or if the row exists.", { id: updatedBooking.id });
            showToast('Salvarea nu a putut fi confirmată. Vă rugăm reîncărcați pagina și încercați din nou.', 'error');
        }
    };


    const filteredAndSortedBookings = useMemo(() => {
        let filtered = bookings.filter(b =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.phone.includes(searchQuery)
        );

        if (filterDate) {
            const formattedFilterDate = format(filterDate, 'yyyy-MM-dd');
            filtered = filtered.filter(b => b.event_date === formattedFilterDate);
        }

        return filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;
            
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [bookings, searchQuery, sortConfig, filterDate]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [key, direction] = e.target.value.split('-');
        setSortConfig({ key: key as keyof Booking, direction: direction as 'asc' | 'desc' });
    };

    return (
        <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Dashboard Rezervări</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left & Main Column: Filters and Bookings List */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Filtre & Sortare</h2>
                        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow">
                            <input
                                type="text"
                                placeholder="Caută după nume, email, telefon..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full sm:flex-1 p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"
                            />
                            <select
                                onChange={handleSortChange}
                                value={`${sortConfig.key}-${sortConfig.direction}`}
                                className="w-full sm:w-60 p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"
                            >
                                <option value="event_date-asc">Data Eveniment (Crescător)</option>
                                <option value="event_date-desc">Data Eveniment (Descrescător)</option>
                                <option value="status-asc">Status (A-Z)</option>
                                <option value="status-desc">Status (Z-A)</option>
                            </select>
                        </div>
                        {filterDate && (
                            <div className="bg-gray-200 p-3 rounded-md text-center mt-4">
                                <p className="text-sm text-gray-700">Afișez rezervări pentru: <span className="font-bold">{format(filterDate, 'd MMMM yyyy', { locale: ro })}</span></p>
                                <button onClick={() => setFilterDate(null)} className="text-xs text-brand-orange hover:underline mt-1">Șterge filtru</button>
                            </div>
                        )}
                    </div>

                    <div>
                        {isLoading ? (
                            <div className="text-center text-gray-500 py-10">Se încarcă rezervările...</div>
                        ) : filteredAndSortedBookings.length === 0 ? (
                            <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
                                {searchQuery || filterDate ? 'Nu am găsit nicio rezervare conform filtrelor.' : 'Nu există nicio rezervare înregistrată.'}
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-lg">
                                    <table className="w-full text-sm text-left text-gray-700">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Data Evenimentului</th>
                                                <th scope="col" className="px-6 py-3">Nume Client</th>
                                                <th scope="col" className="px-6 py-3">Tip Eveniment</th>
                                                <th scope="col" className="px-6 py-3">Status</th>
                                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAndSortedBookings.map((booking) => (
                                                <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium">{booking.event_date}</td>
                                                    <td className="px-6 py-4">{booking.name}</td>
                                                    <td className="px-6 py-4">{booking.event_type}</td>
                                                    <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button onClick={() => setSelectedBooking(booking)} className="font-medium text-brand-orange hover:underline">Detalii</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="block md:hidden space-y-4">
                                    {filteredAndSortedBookings.map((booking) => (
                                        <div key={booking.id} className="bg-white p-4 rounded-lg shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-lg text-gray-900">{booking.name}</p>
                                                    <p className="text-sm text-gray-500">{booking.event_date}</p>
                                                </div>
                                                <StatusBadge status={booking.status} />
                                            </div>
                                            <div className="mt-4 text-right">
                                                <button onClick={() => setSelectedBooking(booking)} className="font-medium text-brand-orange hover:underline">
                                                    Vezi Detalii & Editează
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Column: Calendar */}
                <div className="xl:col-span-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Calendar Evenimente</h2>
                    <AdminCalendar
                        bookings={bookings}
                        filterDate={filterDate}
                        onDateClick={setFilterDate}
                    />
                </div>
            </div>

            {selectedBooking && (
                <BookingDetailsModal 
                    booking={selectedBooking} 
                    onClose={() => setSelectedBooking(null)} 
                    onSave={handleSaveBooking}
                />
            )}
            {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast(prev => ({...prev, visible: false}))} />}
        </>
    );
}