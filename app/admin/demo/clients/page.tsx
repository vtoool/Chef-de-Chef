'use client';

import React, { useState, useMemo } from 'react';
import { Client } from '../../../../types';

const mockClients: Client[] = [
  {
    id: '1',
    created_at: '2024-01-15T10:00:00Z',
    name: 'Ion Popescu',
    emails: ['ion@popescu.md'],
    phones: ['+373 69 123 456'],
    notes_interne: 'Client fidel, a mai avut 2 nunți cu noi.',
  },
  {
    id: '2',
    created_at: '2024-02-20T14:30:00Z',
    name: 'Maria Dumitrescu',
    emails: ['maria@dumitrescu.md'],
    phones: ['+373 68 234 567', '+373 22 123 456'],
    notes_interne: 'Pregătire nuntă - necesită transport.',
  },
  {
    id: '3',
    created_at: '2024-03-10T09:15:00Z',
    name: 'Alexandru Ionescu',
    emails: ['alex@ionescu.md'],
    phones: ['+373 67 345 678'],
    notes_client: 'Dorește muzică live.',
    notes_interne: '',
  },
  {
    id: '4',
    created_at: '2024-03-25T16:45:00Z',
    name: 'Elena Vasilescu',
    emails: ['elena@vasilescu.md'],
    phones: ['+373 66 456 789'],
    notes_interne: 'Eveniment corporativ, buget mare.',
  },
  {
    id: '5',
    created_at: '2024-04-01T11:20:00Z',
    name: 'Victor Munteanu',
    emails: ['victor@munteanu.md'],
    phones: ['+373 65 567 890'],
    notes_interne: '',
  },
];

const getSnippet = (text: string, maxLength = 70): string => {
    if (!text) return '';
    const cleanedText = text.trim().replace(/\s+/g, ' '); 
    if (cleanedText.length <= maxLength) return cleanedText;
    return cleanedText.substring(0, maxLength) + '...';
};

export default function DemoClientsPage() {
    const [clients] = useState<Client[]>(mockClients);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const filteredAndSortedClients = useMemo(() => {
        const filtered = clients.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.emails.some(email => email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            c.phones.some(phone => phone.includes(searchQuery))
        );

        return filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                 if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                 if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [clients, searchQuery, sortConfig]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [key, direction] = e.target.value.split('-');
        setSortConfig({ key: key as keyof Client, direction: direction as 'asc' | 'desc' });
    };

    return (
        <>
            <div className="mb-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
                    MOD DEMO
                </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Lista Clienților</h1>

            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow">
                    <input
                        type="text"
                        placeholder="Caută după nume, email, telefon..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full sm:flex-1 p-2 bg-gray-50 border border-gray-300 rounded-md"
                    />
                    <select
                        onChange={handleSortChange}
                        value={`${sortConfig.key}-${sortConfig.direction}`}
                        className="w-full sm:w-60 p-2 bg-gray-50 border border-gray-300 rounded-md"
                    >
                        <option value="name-asc">Nume (A-Z)</option>
                        <option value="name-desc">Nume (Z-A)</option>
                    </select>
                </div>
            </div>

            <div>
                {filteredAndSortedClients.length === 0 ? (
                    <div className="text-center bg-white p-6 rounded-lg shadow">
                        {searchQuery ? 'Nu am găsit niciun client.' : 'Nu există niciun client înregistrat.'}
                    </div>
                ) : (
                    <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-lg">
                        <table className="w-full text-xs text-left text-gray-700">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2">Nume</th>
                                    <th className="px-4 py-2">Email-uri</th>
                                    <th className="px-4 py-2">Telefoane</th>
                                    <th className="px-4 py-2">Mesaj Client</th>
                                    <th className="px-4 py-2">Notițe Admin</th>
                                    <th className="px-4 py-2 text-right">Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedClients.map((client) => {
                                    const adminNoteSnippet = getSnippet(client.notes_interne || '');
                                    return (
                                        <tr key={client.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium align-top">{client.name}</td>
                                            <td className="px-4 py-3 whitespace-pre-wrap max-w-xs align-top">{client.emails.join('\n')}</td>
                                            <td className="px-4 py-3 whitespace-pre-wrap max-w-xs align-top">{client.phones.join('\n')}</td>
                                            <td className="px-4 py-3 text-xs max-w-xs align-top italic text-gray-600">
                                                {getSnippet(client.notes_client || '') || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-xs max-w-xs align-top">
                                                {adminNoteSnippet || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2 align-top">
                                                <button
                                                    onClick={() => setSelectedClient(client)}
                                                    className="p-2 rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                                                    title="Vezi detalii"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedClient && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedClient(null)}>
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg text-gray-800 p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">{selectedClient.name}</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-bold text-gray-500">Email-uri</p>
                                <p className="whitespace-pre-wrap">{selectedClient.emails.join('\n')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500">Telefoane</p>
                                <p className="whitespace-pre-wrap">{selectedClient.phones.join('\n')}</p>
                            </div>
                            {selectedClient.notes_client && (
                                <div>
                                    <p className="text-sm font-bold text-gray-500">Mesaj Client</p>
                                    <p className="italic text-gray-600">{selectedClient.notes_client}</p>
                                </div>
                            )}
                            {selectedClient.notes_interne && (
                                <div>
                                    <p className="text-sm font-bold text-gray-500">Notițe Interne</p>
                                    <p>{selectedClient.notes_interne}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setSelectedClient(null)} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                                Închide
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
