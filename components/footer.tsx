import { CopyrightIcon } from "lucide-react"

export const Footer = () => {
    return (
        <footer className='flex flex-row items-center justify-center w-full h-24 gap-2 p-10 mt-10 border-t border-gray-100 dark:border-gray-900 text-muted-foreground'>
            <CopyrightIcon className='self-center w-6 h-6 sm:w-4 sm:h-4' />
            <p className='text-sm font-normal'>
                {new Date().getFullYear()} - David Oduneye.

                Built with ❤️ using
                <a className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500' href='https://nextjs.org'>
                    Next.js
                </a>

                and

                <a className='text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500' href='https://tailwindcss.com'>
                    Tailwind CSS
                </a>.
            </p>
        </footer >
    )
}