import tw from 'tailwind-styled-components';
import { motion } from 'framer-motion';

/* Containers */

export const HomeContainer = tw.div`
    flex 
    flex-col 
    items-center 
    justify-center 
    h-screen
    py-2
`;

export const NavItemContainer = tw.div`
    pt-2
    font-sans
    font-regular 
    text-[#F57A89]
    text-xl
    hover:text-slate-200
    hover:underline
    hover:decoration-slate-200
    hover:underline-offset-8
    hover:decoration-3
    hover:transition
    hover:duration-300
    hover:ease-in-out
    hover:delay-150
    hover:translatex-1
    cursor-pointer
`;

export const SocialContainer = tw.ul`
    flex 
    flex-row 
    gap-10 
    animate-pulse
`;

export const NavigationContainer = tw.nav`
    fixed 
    z-50 
    w-full 
    pb-1 
    pattern-dots-sm 
    bg-[#191919] 
    sm:static
`;


export const FooterContainer = tw.div`
    w-full
    left-0
    bottom-0 
    flex 
    flex-row 
    justify-center 
    items-center
    text-slate-100 
    pb-5
`;


/* Posts and Projects */
export const ContentContainer = tw.main`  
    grid
    grid-flow-row
    auto-rows-max
    h-full
    w-full
    mb-10
`;

export const MapPosts = tw.section`
    grid 
    grid-col-1 
    md:grid-cols-1 
    lg:grid-cols-3 
    gap-5 
    px-5
    
`;

export const MapProjects = tw.section`
    grid
    mx-auto 
    grid-flow-rows
    gap-5
    sm:px-1
    px-5
`;

export const HeadingSection = tw.section`
    flex
    flex-row
    justify-center
    p-10
`;

export const HeadingText = tw.p`
    mt-1
    text-base
    text-gray-500
`;

