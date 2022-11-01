import NavItem from './NavItem';
import Social from './Social';
import ThemeToggle from './ThemeToggle.js';

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import tw from 'tailwind-styled-components';

import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const variants = {
    hidden: { opacity: 0, x: -100 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 1, delay: 0.5, ease: [0.6, 0.05, -0.01, 0.9] },
    },
};

const NavContainer = tw.nav`
`;

const Section = tw.section`
    justify-center
    flex 
    flex-row 
    flex-nowrap 
    gap-10
`;

const MotionNavContainer = motion(NavContainer);

export default function Navigation() {
    const router = useRouter();
    const path = router.pathname;

    const active = path.includes('/posts/') ? false : true;

    return active ? (
        <MotionNavContainer variants={variants} initial="hidden" animate="animate" className="fixed z-50 w-full pb-1 pattern-dots-sm bg-[#191919] sm:static">
            <Section className="pt-5 flex">
                <NavItem title={'Home'} link={'/'} />
                <NavItem title={'Blog'} link={'/posts'} />
                <NavItem title={'Projects'} link={'/projects'} />
                <NavItem title={'About'} link={'/about'} />
                {/* <NavItem title={"Uses"} link={"/uses"} /> */}
                
                {/* <Section>
                    <ThemeToggle />
                </Section> */}

            </Section>
            <Section className="sm:flex block justify-center">
            </Section>

        </MotionNavContainer>
        
    ) : (
        <MotionNavContainer variants={variants} initial="hidden" animate="animate" />
    );
}

// const Navagation = () => {
//     const path = userRouter().pathname;
//     const active = path.includes('/posts/') ? false : true;

//     return active ? (
//         <nav className="md:hiden flex flex-row justify-center">

//         </nav>
//     )
// }

