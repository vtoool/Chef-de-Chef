'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

const Logo = () => (
    <div className="flex items-center space-x-2">
        <img src="https://scontent.fkiv7-1.fna.fbcdn.net/v/t39.30808-6/456236959_829273562675263_5934463475455699464_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-FwFg2FB9XoQ7kNvwE_khUg&_nc_oc=AdksXFMIZCuyZ_qiRyTobtMYjXbrpMRUTfB_UxWQviL9dwKY2JSbGc9mZ4fG0Jd1PDDofFzdHDXrwb4BgViofAG8&_nc_zt=23&_nc_ht=scontent.fkiv7-1.fna&_nc_gid=M9t8gcOoEteEPolC2SuR9Q&oh=00_AfhhmmqUYoveeMuTaQdkbvqE973TIqDyPsIaCJ4E-mYWAQ&oe=691DA8FB" alt="Chef de Chef Logo" className="h-10 w-10 rounded-full object-cover" />
        <span className="font-cursive text-3xl font-normal bg-chef-gradient bg-clip-text text-transparent pr-1">Chef de Chef</span>
    </div>
);

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            isActive 
                ? 'bg-brand-orange text-white' 
                : 'text-gray-600 hover:bg-gray-200'
        }`}>
            {children}
        </Link>
    );
};


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        router.push('/admin');
    };

    return (
        <div className="min-h-screen text-gray-800 p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-gray-200 gap-4">
                <Logo />
                <div className="flex items-center justify-between sm:justify-end gap-4">
                    <nav className="flex items-center space-x-2 p-1 bg-gray-100 rounded-lg">
                       <NavLink href="/admin/dashboard">Rezervări</NavLink>
                       <NavLink href="/admin/dashboard/clients">Clienți</NavLink>
                    </nav>
                    <button
                        onClick={handleLogout}
                        className="bg-brand-orange/10 text-brand-orange font-semibold py-2 px-4 rounded-lg hover:bg-brand-orange/20 transition-colors"
                    >
                        Deconectare
                    </button>
                </div>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
}
