'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { Booking, ContactMessage } from '../../../../types';

interface Client {
    name: string;
    email: string;
    phone: string;
    source: 'Booking' | 'Contact';
    createdAt: string;
    message?: string;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    const router = useRouter();

    const fetchClients = useCallback(async () => {
        if (!supabase) return;
        setIsLoading(true);

        const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select('name, email, phone, created_at');

        const { data: contactsData, error: contactsError } = await supabase
            .from('contact_messages')
            .select('name, email, phone, created_at, message');
            
        if (bookingsError || contactsError) {
            console.error("Error fetching client data:", bookingsError || contactsError);
            setIsLoading(false);
            return;
        }

        const clientMap = new Map<string, Client>();

        // Combine and sort all entries chronologically to process oldest first
        const allEntries = [
            ...((bookingsData as any[]) || []).map(item => ({ ...item, source: 'Booking' as const })),
            ...((contactsData as any[]) || []).map(item => ({ ...item, source: 'Contact' as const }))
        ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());


        // Process entries to build the final client list, with newest data overwriting older data
        allEntries.forEach(item => {
            if (!item.email || !item.name || !item.phone) return;

            const emailKey = item.email.toLowerCase();
            const existingClient = clientMap.get(emailKey);

            const updatedClient: Client = {
                name: item.name,
                email: item.email,
                phone: item.phone,
                source: item.source,
                createdAt: item.created_at,
                // Preserve existing message if the current item is a booking, otherwise update with new message
                message: item.source === 'Contact' && item.message ? item.message : existingClient?.message,
            };

            clientMap.set(emailKey, updatedClient);
        });
        
        setClients(Array.from(clientMap.values()));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            if (!supabase) return;
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/admin');
            } else {
                fetchClients();
            }
        };
        checkUser();
    }, [router, fetchClients]);

    const filteredAndSortedClients = useMemo(() => {
        const filtered = clients.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery)
        );

        return filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Handle null or undefined values to prevent runtime errors
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;
            
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [clients, searchQuery, sortConfig]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [key, direction] = e.target.value.split('-');
        setSortConfig({ key: key as keyof Client, direction: direction as 'asc' | 'desc' });
    };

    return (
        <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Lista Clienților</h1>

            <div className="mb-6">
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
                        <option value="name-asc">Nume (A-Z)</option>
                        <option value="name-desc">Nume (Z-A)</option>
                        <option value="createdAt-desc">Cei mai recenți</option>
                        <option value="createdAt-asc">Cei mai vechi</option>
                    </select>
                </div>
            </div>

            <div>
                {isLoading ? (
                    <div className="text-center text-gray-500 py-10">Se încarcă clienții...</div>
                ) : filteredAndSortedClients.length === 0 ? (
                    <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
                        {searchQuery ? 'Nu am găsit niciun client.' : 'Nu există niciun client înregistrat.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Nume</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Telefon</th>
                                    <th scope="col" className="px-6 py-3">Sursă Contact</th>
                                    <th scope="col" className="px-6 py-3">Mesaj</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedClients.map((client) => (
                                    <tr key={client.email} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{client.name}</td>
                                        <td className="px-6 py-4">{client.email}</td>
                                        <td className="px-6 py-4">{client.phone}</td>
                                        <td className="px-6 py-4">{client.source}</td>
                                        <td className="px-6 py-4 text-xs whitespace-pre-wrap max-w-sm">{client.message || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}