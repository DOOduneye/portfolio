"use client"

import { Toaster, toast } from 'sonner'

import { AdminNavbar } from "./_components/AdminNavbar";
import Providers from '@/components/providers/atom-provider';
import { auth } from "@/lib/firebase";
import { use, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { Loader } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/user-atom';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useAtom(userAtom);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((userData) => {
            if (userData) {
                setUser(userData);
            } else {
                if (pathname !== '/login') {
                    router.push('/login');
                }
            }
        }, (error) => {
            toast.error('Failed to fetch user data!');
        });

        return () => unsubscribe();
    }, [router]);

    if (user === null && pathname !== '/login') {
        return (
            <div className='flex flex-col justify-center items-center h-screen'>
                <div className='w-8 h-8 flex items-center justify-center animate-spin'>
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <Providers>
            <main className='flex flex-col my-5 '>
                <Toaster />
                {children}
            </main>
        </Providers>
    )
}
