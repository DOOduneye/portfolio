import { Footer } from '@/components/footer'
import Navbar from './_components/navbar'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='px-10'>
            <main className='flex flex-col max-w-2xl px-5 mx-auto my-5 sm:px-10'>
                <Navbar />
                {children}
            </main>
            <Footer />
        </div>
    )
}
