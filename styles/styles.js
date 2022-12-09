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

export const MotionNavigationContainer = motion(NavigationContainer);

export const FooterContainer = tw.div`
    w-full
    left-0
    bottom-0 
    flex 
    flex-row 
    justify-center 
    items-center
    text-slate-100 
    py-5
`;

export const TextContainer = tw.section`
    flex 
    flex-col
    justify-center
    bg-[#191919] 
    border
    border-zinc-100/10 
    text-lg 
    text-gray-400 
    font-light
    leading-relaxed
    racking-wide 
    rounded-md 
    p-10 
    my-10
    mx-auto
    max-w-prose

    lg:hover:border-zinc-200/50 
    lg:hover:inner-shadow 
    lg:hover:transition 
    lg:hover:scale-200 
    lg:hover:-translate-y-2 
    lg:ease-in-out 
    lg:delay-150 
    lg:duration-300 
    lg:shadow-md 
    lg:drop-shadow-sm 
    lg:transform

`;

/* Posts and Projects */
export const ContentContainer = tw.main`  
    grid
    grid-flow-row
    auto-row-max
    h-full
    w-full

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
