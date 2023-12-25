"use client"

import Link from "next/link";
import { usePathname } from 'next/navigation'

import { LinkedinIcon, Music, GithubIcon, BookUser } from "lucide-react";

import { BrandButton } from "./brand-button";
import { ModeToggle } from "@/components/mode-toggle";

export const Navbar = () => {
    const pathname = usePathname();

    const isHomePage = pathname === "/";

    return (
        <div className='flex flex-row justify-between my-10 flex-center'>
            <div className='flex flex-row space-x-4'>
                <ModeToggle />
                <BrandButton icon={LinkedinIcon} href='https://www.linkedin.com/in/dooduneye' tip='LinkedIn' />
                <BrandButton icon={Music} href='https://open.spotify.com/user/317gsn3rqunkxocwuvf7njcj5luy' tip='Spotify' />
                <BrandButton icon={GithubIcon} href='https://github.com/DOOduneye/' tip='GitHub' />
                <BrandButton icon={BookUser} href='/resume.pdf' tip='Resume' />
            </div>

            <nav className='flex flex-row self-center justify-around space-x-4'>
                {!isHomePage && (
                    <Link
                        href='/'
                        className='px-4 text-sm font-semibold hover:underline hover:underline-offset-4 underlinetext-muted-foreground hover:text-gray-500'>
                        Home
                    </Link>
                )}
                {isHomePage && (
                    <>
                        <Link
                            href='/blog'
                            className='text-sm font-semibold hover:underline hover:underline-offset-4 underlinetext-muted-foreground hover:text-gray-500'>
                            Blog
                        </Link>
                        <Link
                            href='/projects'
                            className='text-sm font-semibold hover:underline hover:underline-offset-4 underlinetext-muted-foreground hover:text-gray-500'>
                            Projects
                        </Link>
                    </>
                )}
            </nav>
        </div>
    );
}

export default Navbar;
