'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import { Client } from '../../../../types';

// Helper functions for note snippets
const getLastNote = (notes: string | null | undefined): string => {
    if (!notes) return '';
    // Split by the note header, filter out empty strings from split, and return the last non-empty part.
    const parts = notes.trim().split(/--- Notă adăugată la .*? ---/);
    return parts.filter(p => p.trim()).pop()?.trim() || '';
};

const getSnippet = (text: string, maxLength = 70): string => {
    if (!text) return '';
    // Normalize whitespace to prevent long empty spaces from taking up the snippet
    const cleanedText = text.trim().replace(/\s+/g, ' '); 
    if (cleanedText.length <= maxLength) return cleanedText;
    return cleanedText.substring(0, maxLength) + '...';
};


// Sub-component for the Add/Edit Modal
const ClientModal: React.FC<{
    client: Client | null;
    onClose: () => void;
    onSave: (client: Client) => void;
}> = ({ client, onClose, onSave }) => {
    const [editedClient, setEditedClient] = useState<Client | null>(client);
    const [newItem, setNewItem] = useState({ email: '', phone: '' });

    if (!editedClient) return null;
    const isAddMode = !editedClient.id;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedClient(prev => prev ? { ...prev, [name]: value } : null);
    };
    
    const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };
    
    const addItem = (type: 'emails' | 'phones') => {
        const value = type === 'emails' ? newItem.email.trim() : newItem.phone.trim();
        if (value && !editedClient[type].includes(value)) {
            setEditedClient(prev => prev ? { ...prev, [type]: [...prev[type], value] } : null);
            setNewItem(prev => ({ ...prev, [type === 'emails' ? 'email' : 'phone']: ''}));
        }
    };
    
    const removeItem = (type: 'emails' | 'phones', value: string) => {
        setEditedClient(prev => prev ? { ...prev, [type]: prev[type].filter(item => item !== value) } : null);
    };

    const handleSave = () => {
        if (editedClient.name && editedClient.emails.length > 0 && editedClient.phones.length > 0) {
            onSave(editedClient);
        } else {
            alert('Numele, cel puțin un email și un telefon sunt obligatorii.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg text-gray-800" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-200">
                    <h3 className="text-xl font-bold">{isAddMode ? 'Adaugă Client Nou' : `Editează Client: ${client?.name}`}</h3>
                </div>
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label htmlFor="name" className="text-sm font-bold text-gray-600 block mb-1">Nume</label>
                        <input type="text" id="name" name="name" value={editedClient.name} onChange={handleInputChange} required className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md"/>
                    </div>
                    {/* Emails */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 block">Email-uri</label>
                        {editedClient.emails.map(email => (
                            <div key={email} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                <span className="text-sm">{email}</span>
                                <button onClick={() => removeItem('emails', email)} className="text-red-500 hover:text-red-700">&times;</button>
                            </div>
                        ))}
                        <div className="flex gap-2">
                            <input type="email" name="email" value={newItem.email} onChange={handleNewItemChange} placeholder="Adaugă email nou" className="flex-1 p-2 bg-gray-50 border border-gray-300 rounded-md"/>
                            <button onClick={() => addItem('emails')} className="bg-gray-200 text-sm font-semibold px-4 rounded-md hover:bg-gray-300">Adaugă</button>
                        </div>
                    </div>
                     {/* Phones */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 block">Telefoane</label>
                        {editedClient.phones.map(phone => (
                            <div key={phone} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                <span className="text-sm">{phone}</span>
                                <button onClick={() => removeItem('phones', phone)} className="text-red-500 hover:text-red-700">&times;</button>
                            </div>
                        ))}
                         <div className="flex gap-2">
                            <input type="tel" name="phone" value={newItem.phone} onChange={handleNewItemChange} placeholder="Adaugă telefon nou" className="flex-1 p-2 bg-gray-50 border border-gray-300 rounded-md"/>
                            <button onClick={() => addItem('phones')} className="bg-gray-200 text-sm font-semibold px-4 rounded-md hover:bg-gray-300">Adaugă</button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes_client" className="text-sm font-bold text-gray-600 block mb-1">Istoric Notițe Client</label>
                        <textarea 
                            id="notes_client" 
                            name="notes_client" 
                            value={editedClient.notes_client || ''} 
                            readOnly 
                            rows={4} 
                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed focus:ring-0 focus:border-gray-300"
                            placeholder="Nicio notiță de la client."
                        />
                    </div>
                    <div>
                        <label htmlFor="notes_interne" className="text-sm font-bold text-gray-600 block mb-1">Notițe Interne (Admin)</label>
                        <textarea 
                            id="notes_interne" 
                            name="notes_interne" 
                            value={editedClient.notes_interne || ''} 
                            onChange={handleInputChange} 
                            rows={4} 
                            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange"
                            placeholder="Adaugă notițe private aici..."
                        />
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50">Anulează</button>
                    <button onClick={handleSave} className="bg-chef-gradient text-white font-bold py-2 px-6 rounded-lg">Salvează</button>
                </div>
            </div>
        </div>
    );
};

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMigrationNeeded, setIsMigrationNeeded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Client; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const router = useRouter();

    const fetchClients = useCallback(async () => {
        if (!supabase) return;
        setIsLoading(true);
        setIsMigrationNeeded(false);

        const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');

        if (clientsError) {
            console.error("Error fetching from 'clients' table:", clientsError);
            if (clientsError.code === 'PGRST205') {
                setIsMigrationNeeded(true);
                
                const { data: bookings } = await supabase.from('bookings').select('name, email, phone');
                const { data: contacts } = await supabase.from('contact_messages').select('name, email, phone, message');

                const combined = [...(bookings || []), ...(contacts || [])];
                const clientMap = new Map<string, any>();

                combined.forEach(item => {
                    const email = item.email?.toLowerCase();
                    if (!email) return;
                    
                    if (!clientMap.has(email)) {
                        clientMap.set(email, {
                            id: email,
                            created_at: '',
                            name: item.name,
                            emails: [item.email],
                            phones: [item.phone],
                            notes_interne: (item as any).message || null,
                        });
                    } else {
                        const existing = clientMap.get(email);
                        if (!existing.phones.includes(item.phone)) {
                            existing.phones.push(item.phone);
                        }
                    }
                });

                setClients(Array.from(clientMap.values()));
            } else {
                 setClients([]);
            }
        } else if (clientsData) {
            setClients(clientsData as Client[]);
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
                fetchClients();
            }
        };
        checkUser();
    }, [router, fetchClients]);
    
     useEffect(() => {
        if (isMigrationNeeded && sortConfig.key === 'created_at') {
            setSortConfig({ key: 'name', direction: 'asc' });
        }
    }, [isMigrationNeeded, sortConfig.key]);

    const handleSaveClient = async (client: Client) => {
        if (!supabase || isMigrationNeeded) return;
        
        const { id, created_at, ...upsertData } = client;

        if (client.id) { // Update
            const { error } = await supabase.from('clients').update(upsertData).eq('id', client.id);
            if (error) console.error("Error updating client:", error);
        } else { // Insert
            const { error } = await supabase.from('clients').insert([upsertData]);
            if (error) console.error("Error inserting client:", error);
        }
        setSelectedClient(null);
        fetchClients();
    };

    const handleDeleteClient = async (clientId: string) => {
        if (!supabase || isMigrationNeeded || !window.confirm('Sunteți sigur că doriți să ștergeți acest client?')) return;
        const { error } = await supabase.from('clients').delete().eq('id', clientId);
        if (error) console.error("Error deleting client:", error);
        else fetchClients();
    };
    
    const handleOpenAddModal = () => {
        setSelectedClient({
            id: '', created_at: '', name: '', emails: [], phones: [], notes_interne: '', notes_client: ''
        });
    };

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
            {isMigrationNeeded && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-md shadow" role="alert">
                    <p className="font-bold">Actualizare Necesară a Bazei de Date</p>
                    <p className="text-sm">
                        Funcționalitatea completă de gestionare (adăugare, editare, ștergere) este dezactivată. Pentru a o activa, vă rugăm să rulați scriptul SQL din fișierul <strong>DEVELOPER_GUIDE.md</strong> în editorul SQL Supabase.
                    </p>
                </div>
            )}
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Lista Clienților</h1>
                 <button 
                    onClick={handleOpenAddModal} 
                    disabled={isMigrationNeeded}
                    className="bg-chef-gradient text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isMigrationNeeded ? "Funcționalitate dezactivată. Necesită actualizarea bazei de date." : "Adaugă client nou"}
                 >
                    Adaugă Client
                 </button>
            </div>
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
                        {!isMigrationNeeded && (
                            <>
                                <option value="created_at-desc">Cei mai recenți</option>
                                <option value="created_at-asc">Cei mai vechi</option>
                            </>
                        )}
                    </select>
                </div>
            </div>

            <div>
                {isLoading ? (
                    <div className="text-center py-10">Se încarcă clienții...</div>
                ) : filteredAndSortedClients.length === 0 ? (
                    <div className="text-center bg-white p-6 rounded-lg shadow">
                        {searchQuery ? 'Nu am găsit niciun client.' : 'Nu există niciun client înregistrat.'}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-lg">
                            <table className="w-full text-sm text-left text-gray-700">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Nume</th>
                                        <th className="px-6 py-3">Email-uri</th>
                                        <th className="px-6 py-3">Telefoane</th>
                                        {isMigrationNeeded ? (
                                            <th className="px-6 py-3">Mesaj Inițial</th>
                                        ) : (
                                            <>
                                                <th className="px-6 py-3">Mesaj Client</th>
                                                <th className="px-6 py-3">Notițe Admin</th>
                                            </>
                                        )}
                                        <th className="px-6 py-3 text-right">Acțiuni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedClients.map((client) => {
                                        const clientNoteSnippet = getSnippet(getLastNote(client.notes_client));
                                        const adminNoteSnippet = getSnippet(client.notes_interne || '');

                                        return (
                                            <tr key={client.id} className="border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium align-top">{client.name}</td>
                                                <td className="px-6 py-4 whitespace-pre-wrap max-w-xs align-top">{client.emails.join('\n')}</td>
                                                <td className="px-6 py-4 whitespace-pre-wrap max-w-xs align-top">{client.phones.join('\n')}</td>
                                                
                                                {isMigrationNeeded ? (
                                                    <td className="px-6 py-4 text-xs max-w-sm align-top">
                                                        <span className="whitespace-pre-wrap">{getSnippet(client.notes_interne || '') || '—'}</span>
                                                    </td>
                                                ) : (
                                                    <>
                                                        <td className="px-6 py-4 text-xs max-w-xs align-top italic text-gray-600">
                                                            {clientNoteSnippet || '—'}
                                                        </td>
                                                        <td className="px-6 py-4 text-xs max-w-xs align-top">
                                                            {adminNoteSnippet || '—'}
                                                        </td>
                                                    </>
                                                )}

                                                <td className="px-6 py-4 text-right space-x-3 align-top">
                                                    <button onClick={() => setSelectedClient(client)} disabled={isMigrationNeeded} className="font-medium text-brand-orange hover:underline disabled:opacity-50 disabled:cursor-not-allowed">Editează</button>
                                                    <button onClick={() => handleDeleteClient(client.id)} disabled={isMigrationNeeded} className="font-medium text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed">Șterge</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                         {/* Mobile Card View */}
                        <div className="block md:hidden space-y-4">
                            {filteredAndSortedClients.map((client) => {
                                const clientNoteSnippet = getSnippet(getLastNote(client.notes_client));
                                const adminNoteSnippet = getSnippet(client.notes_interne || '');
                                return (
                                    <div key={client.id} className="bg-white p-4 rounded-lg shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-lg text-gray-900 pr-2">{client.name}</p>
                                            <div className="flex space-x-3 flex-shrink-0">
                                                <button onClick={() => setSelectedClient(client)} disabled={isMigrationNeeded} className="font-medium text-brand-orange hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-sm">Editează</button>
                                                <button onClick={() => handleDeleteClient(client.id)} disabled={isMigrationNeeded} className="font-medium text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-sm">Șterge</button>
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-3 border-t border-gray-200 space-y-3 text-sm">
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</p>
                                                <p className="whitespace-pre-wrap">{client.emails.join('\n')}</p>
                                                <p className="whitespace-pre-wrap">{client.phones.join('\n')}</p>
                                            </div>
                                            {isMigrationNeeded ? (
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mesaj Inițial</p>
                                                    <p className="italic text-gray-600">{getSnippet(client.notes_interne || '') || '—'}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mesaj Client</p>
                                                        <p className="italic text-gray-600">{clientNoteSnippet || '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notițe Admin</p>
                                                        <p className="text-gray-800">{adminNoteSnippet || '—'}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
            {selectedClient && <ClientModal client={selectedClient} onClose={() => setSelectedClient(null)} onSave={handleSaveClient} />}
        </>
    );
}