import NavItem from './NavItem';
import Social from './Social';
import ThemeToggle from './ThemeToggle.js';

import {motion} from 'framer-motion';

import { useRouter } from 'next/router';

const variants = {
    hidden: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0, transition: { duration: 1, delay: 0.5, ease: [0.6, 0.05, -0.01, 0.9] } },
}

export default function Navigation() {
    const router = useRouter();
    const path = router.pathname;

    const active = path.includes('/posts/') ? false : true;
       
    return (
        active ? (
         <motion.nav initial='hidden' animate='animate' variants={variants} className="flex flex-row justify-center">
            <section className="flex flex-row gap-20 pt-5"> 
                    <NavItem title={"Home"} link={"/"} />
                    <NavItem title={"Blog"} link={"/posts"} />
                    <NavItem title={"Projects"} link={"/projects"} />
                    <NavItem title={"About"} link={"/about"} />
                    {/* <NavItem title={"Uses"} link={"/uses"} /> */}
                    <Social />

                <section className="flex flex-row flex-nowrap gap-10">
                    <ThemeToggle /> 
                </section> 
            </section>
        </motion.nav>
        )
        : 
        (
            <motion.nav initial='hidden' animate='animate' variants={variants} className="flex flex-row justify-center">
            </motion.nav>
        )
    )

}
