"use client"

import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useEffect } from "react";

import { LinkedinIcon, Music, GithubIcon, BookUser } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { BrandButton } from "./brand-button";
import { ResumeButton } from "./resume-button";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    const pathname = usePathname();

    const controls = useAnimation();
    const { ref, inView } = useInView();

    const isHomePage = pathname === "/";

    useEffect(() => {
        if (inView) {
            controls.start({
                y: 0,
                opacity: 1,
                transition: { duration: 1, ease: 'easeOut' },
            });
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial={{ y: -50, opacity: 0 }}
            animate={controls}
            className='flex flex-row justify-between my-10 flex-center'>
            <div className='flex flex-row'>
                <ModeToggle />
                <BrandButton icon={LinkedinIcon} href='https://www.linkedin.com/in/dooduneye' tip='LinkedIn' />
                <BrandButton icon={Music} href='https://open.spotify.com/user/317gsn3rqunkxocwuvf7njcj5luy' tip='Spotify' />
                <BrandButton icon={GithubIcon} href='https://github.com/DOOduneye/' tip='GitHub' />
                <ResumeButton>
                    <BrandButton icon={BookUser} tip='Resume' />
                </ResumeButton>
            </div>

            <nav className='flex flex-row self-center justify-around space-x-4'>
                {!isHomePage && (
                    <Link href='/' passHref>
                        <Button variant='outline' size='sm' className='text-sm font-semibold dark:text-gray-200 dark:hover:text-gray-100 hover:text-gray-500'>
                            Home
                        </Button>
                    </Link>
                )}
                {isHomePage && (
                    <>
                        {/* <Link
                            href='/posts'
                            className='text-sm font-semibold hover:underline hover:underline-offset-4 underlinetext-muted-foreground hover:text-gray-500'>
                            Writing
                        </Link> */}
                        <Link href='/projects' passHref>
                            <Button variant='outline' size='sm' className='text-sm font-semibold dark:text-gray-200 dark:hover:text-gray-100 hover:text-gray-500'>
                                Projects
                            </Button>
                        </Link>
                    </>
                )}
            </nav>
        </motion.div>
    );
}

export default Navbar;
