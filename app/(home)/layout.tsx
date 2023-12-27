
import { Footer } from '@/components/footer'
import Navbar from './_components/navbar'
import Link from 'next/link'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='px-10'>

            <Link
                href='/admin'
                className='text-sm mt-10 font-semibold hover:underline hover:underline-offset-4 underlinetext-muted-foreground hover:text-gray-500'>
                Admin
            </Link>
            <main className='flex flex-col max-w-2xl px-5 mx-auto my-5 sm:px-10'>
                <Navbar />
                {children}
            </main>
            <Footer />
        </div>
    )
}
