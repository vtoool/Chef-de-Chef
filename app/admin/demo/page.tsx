'use client';

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns/format';
import { ro } from 'date-fns/locale/ro';
import { Booking } from '../../../types';
import AdminCalendar from '../dashboard/AdminCalendar';

const mockBookings: Booking[] = [
  {
    id: '1',
    created_at: '2024-01-15T10:00:00Z',
    event_date: '2026-03-20',
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
    event_date: '2026-03-25',
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
    event_date: '2026-04-05',
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
];

const formatNumber = (value: number | null | undefined, currency: string | null | undefined): string => {
    const displayCurrency = currency || 'MDL';
    if (value === null || value === undefined || isNaN(value)) {
        return '—';
    }
    try {
        return new Intl.NumberFormat('ro-RO', {
            style: 'currency',
            currency: displayCurrency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    } catch (e) {
        return `${value.toLocaleString('ro-RO')} ${displayCurrency}`;
    }
};

const StatusBadge: React.FC<{ status: Booking['status'] }> = ({ status }) => {
    const statusMap: Record<Booking['status'], { text: string; classes: string; }> = {
        pending: { text: 'În așteptare', classes: 'bg-yellow-100 text-yellow-800' },
        confirmed: { text: 'Confirmat', classes: 'bg-green-100 text-green-800' },
        completed: { text: 'Completat', classes: 'bg-blue-100 text-blue-800' },
        rejected: { text: 'Refuzat', classes: 'bg-red-100 text-red-800' },
    };
    const { text, classes } = statusMap[status] || { text: status, classes: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize whitespace-nowrap ${classes}`}>{text}</span>;
};

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
                    <p className="text-sm text-gray-500">Data evenimentului: {booking.event_date}</p>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-600 block mb-1">Nume Client</label>
                            <input type="text" name="name" value={editedBooking.name} onChange={handleInputChange} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600 block mb-1">Telefon</label>
                            <input type="tel" name="phone" value={editedBooking.phone} onChange={handleInputChange} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600 block mb-1">Email</label>
                            <input type="email" name="email" value={editedBooking.email || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600 block mb-1">Tip Eveniment</label>
                            <select name="event_type" value={editedBooking.event_type} onChange={handleInputChange} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md">
                                <option>Nuntă</option>
                                <option>Cumătrie</option>
                                <option>Petrecere</option>
                                <option>Corporativă</option>
                                <option>Altul</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600 block mb-1">Locație</label>
                            <input type="text" name="location" value={editedBooking.location} onChange={handleInputChange} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md"/>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-600 block mb-1">Status Rezervare</label>
                            <select name="status" value={editedBooking.status} onChange={handleInputChange} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md">
                                <option value="pending">În așteptare</option>
                                <option value="confirmed">Confirmat</option>
                                <option value="completed">Completat</option>
                                <option value="rejected">Refuzat</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600 block mb-1">Preț și Monedă</label>
                            <div className="flex items-center gap-2">
                                <input type="number" name="price" value={editedBooking.price ?? ''} onChange={handleInputChange} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md"/>
                                <select name="currency" value={editedBooking.currency || 'MDL'} onChange={handleInputChange} className="p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md">
                                    <option value="MDL">MDL</option>
                                    <option value="EUR">EUR</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600 block mb-1">Avans Plătit</label>
                            <input type="number" name="prepayment" value={editedBooking.prepayment ?? ''} onChange={handleInputChange} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600 block mb-1">Status Plată</label>
                            <select name="payment_status" value={editedBooking.payment_status || 'neplatit'} onChange={handleInputChange} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md">
                                <option value="neplatit">Neplătit</option>
                                <option value="avans platit">Avans Plătit</option>
                                <option value="platit integral">Plătit Integral</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-600 block mb-1">Notițe Interne</label>
                            <textarea name="notes_interne" value={editedBooking.notes_interne || ''} onChange={handleInputChange} rows={3} className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md"></textarea>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                        Închide
                    </button>
                </div>
            </div>
        </div>
    );
};

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void; }> = ({ message, type, onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const baseClasses = 'fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 z-50';
    const typeClasses = type === 'success' ? 'bg-green-600' : 'bg-red-600';

    return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
};

export default function AdminDemoPage() {
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Booking; direction: 'asc' | 'desc' }>({ key: 'event_date', direction: 'asc' });
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({ message: '', type: 'success', visible: false });
    const [filterDate, setFilterDate] = useState<Date | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type, visible: true });
    };

    const handleSaveBooking = async (updatedBooking: Booking) => {
        setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
        showToast('Modificări salvate cu succes! (Demo)', 'success');
        setSelectedBooking(null);
    };

    const filteredAndSortedBookings = useMemo(() => {
        let filtered = bookings.filter(b =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <div className="mb-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
                    MOD DEMO
                </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Rezervări</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col gap-8">
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Filtre & Sortare</h2>
                        </div>
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
                        {filteredAndSortedBookings.length === 0 ? (
                            <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
                                {searchQuery || filterDate ? 'Nu am găsit nicio rezervare conform filtrelor.' : 'Nu există nicio rezervare înregistrată.'}
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-lg">
                                    <table className="w-full text-xs text-left text-gray-700">
                                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-2">Data Evenimentului</th>
                                                <th scope="col" className="px-4 py-2">Nume Client</th>
                                                <th scope="col" className="px-4 py-2">Tip Eveniment</th>
                                                <th scope="col" className="px-4 py-2">Status</th>
                                                <th scope="col" className="px-4 py-2 text-right">Preț Total</th>
                                                <th scope="col" className="px-4 py-2 text-right">Avans Plătit</th>
                                                <th scope="col" className="px-4 py-2 text-right">De Plătit</th>
                                                <th scope="col" className="px-4 py-2"><span className="sr-only">Actions</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAndSortedBookings.map((booking) => {
                                                const remaining = (booking.price || 0) - (booking.prepayment || 0);

                                                return (
                                                <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium">{booking.event_date}</td>
                                                    <td className="px-4 py-3">{booking.name}</td>
                                                    <td className="px-4 py-3">{booking.event_type}</td>
                                                    <td className="px-4 py-3"><StatusBadge status={booking.status} /></td>
                                                    <td className="px-4 py-3 text-right font-mono">{formatNumber(booking.price, booking.currency)}</td>
                                                    <td className="px-4 py-3 text-right font-mono">{formatNumber(booking.prepayment, booking.currency)}</td>
                                                    <td className="px-4 py-3 text-right font-mono font-bold">{formatNumber(remaining, booking.currency)}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            onClick={() => setSelectedBooking(booking)}
                                                            className="p-2 rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                                                            title="Vezi detalii"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )})}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="block md:hidden space-y-4">
                                    {filteredAndSortedBookings.map((booking) => {
                                        const remaining = (booking.price || 0) - (booking.prepayment || 0);
                                        
                                        return (
                                        <div key={booking.id} className="bg-white p-3 rounded-lg shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-lg text-gray-900">{booking.name}</p>
                                                    <p className="text-sm text-gray-500">{booking.event_date}</p>
                                                    <p className="text-sm text-gray-500">{booking.event_type}</p>
                                                </div>
                                                <StatusBadge status={booking.status} />
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 gap-1 text-center text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-500">Preț Total</p>
                                                    <p className="font-semibold text-gray-800">{formatNumber(booking.price, booking.currency)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Avans</p>
                                                    <p className="font-semibold text-gray-800">{formatNumber(booking.prepayment, booking.currency)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">De Plătit</p>
                                                    <p className="font-bold text-gray-900">{formatNumber(remaining, booking.currency)}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-right">
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="p-2 rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </>
                        )}
                    </div>
                </div>

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
