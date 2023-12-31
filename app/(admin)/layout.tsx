"use client"

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { User } from 'firebase/auth';
import { Toaster, toast } from 'sonner'

import { auth } from "@/lib/firebase";

import { Spinner } from '@/components/spinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((userData) => {
            if (userData) {
                setUser(userData);
            } else {
                if (pathname !== '/login') {
                    router.push('/login');
                }
                setUser(null);
            }
        }, (_) => {
            toast.error('Failed to fetch user data!');
        });

        return () => unsubscribe();

    }, [router]);

    if (user !== null && pathname === '/login') {
        router.push('/admin');
        return <Spinner />
    }

    if (user === null && pathname !== '/login') return <Spinner />

    return (
        <main className='flex flex-col mt-5'>
            <Toaster />
            {children}
        </main>
    )
}
