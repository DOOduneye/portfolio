import Title from './Title';

import { motion } from 'framer-motion';
import tw from 'tailwind-styled-components';

const Gradient = tw.p`
    bg-clip-text
    bg-gradient-to-r
    from-[#4ECDC4]
    to-[#B4A0E5]
`;

const Underline = tw.span`
    hover:underline
    hover:decoration-[#4ECDC4]
    hover:underline-offset-8 
    hover:decoration-3 
    hover:transition
    hover:duration-300 
    hover:ease-in-out 
    hover:delay-150 
    hover:translatex-1
`;

const Paragraph = motion(tw(Gradient)`
    lg:text-3xl
    md:text-2xl
    text-xl
    text-transparent
    text-left
    font-sans
    font-bold
`);

const variants = {
    hidden: { opacity: 0, x: -100 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 1, delay: 0.5, ease: [0.6, 0.05, -0.01, 0.9] },
    },
    exit: {
        opacity: 0,
        x: 100,
        transition: { duration: 1, ease: [0.6, 0.05, -0.01, 0.9] },
    },
};


const Main = () => {
    return (
        <div>
            <Title />

            <Paragraph variants={variants} initial="hidden" animate="animate">
                Passionate about building <br /> Software that is both
                <Underline> beautiful </Underline>and
                <Underline> functional</Underline>.
            </Paragraph>
        </div>
    );
}

export default Main;