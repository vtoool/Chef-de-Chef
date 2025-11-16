'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

const Logo = () => (
    <div className="flex flex-col items-center space-y-2 mb-8">
        <img src="https://scontent.fkiv7-1.fna.fbcdn.net/v/t39.30808-6/456236959_829273562675263_5934463475455699464_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-FwFg2FB9XoQ7kNvwE_khUg&_nc_oc=AdksXFMIZCuyZ_qiRyTobtMYjXbrpMRUTfB_UxWQviL9dwKY2JSbGc9mZ4fG0Jd1PDDofFzdHDXrwb4BgViofAG8&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=M9t8gcOoEteEPolC2SuR9Q&oh=00_AfhhmmqUYoveeMuTaQdkbvqE973TIqDyPsIaCJ4E-mYWAQ&oe=691DA8FB" alt="Chef de Chef Logo" className="h-16 w-16 rounded-full object-cover" />
        <span className="font-cursive text-4xl font-normal bg-chef-gradient bg-clip-text text-transparent pr-1">Chef de Chef</span>
    </div>
);

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!supabase) {
            setError('Clientul Supabase nu este disponibil.');
            setIsLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message === 'Invalid login credentials' ? 'Email sau parolă incorectă.' : error.message);
        } else {
            router.push('/admin/dashboard');
        }

        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen text-gray-800 p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <Logo />
                <h1 className="text-xl font-bold text-center text-gray-900">
                    Panou de Administrare
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-600 block mb-1">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-gray-600 block mb-1">Parolă</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md focus:ring-brand-orange focus:border-brand-orange transition-colors"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-center text-red-600">{error}</p>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-chef-gradient text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                        >
                            {isLoading ? 'Se conectează...' : 'Conectare'}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <a href="/" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                        ← Înapoi la site
                    </a>
                </div>
            </div>
        </div>
    );
}