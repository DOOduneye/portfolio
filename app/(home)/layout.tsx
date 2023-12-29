import Link from 'next/link'

import Navbar from './_components/navbar'
import { Footer } from '@/components/footer'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main className='flex flex-col max-w-2xl px-5 mx-auto my-5 sm:px-10'>
                <Navbar />
                {children}
            </main>
            <Footer />
        </>
    )
}
