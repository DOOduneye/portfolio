import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { motion } from 'framer-motion';
import tw from 'tailwind-styled-components';

const variants = {
    hidden: { opacity: 0, x: 100 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 1, delay: 0.5, ease: [0.6, 0.05, -0.01, 0.9] },
    },
};

const gradientVariants = {
    hidden: { color: '#000000' },
    animate: {
        color: 'transparent',
        background: 'linear-gradient(90deg, #B4A0E5 0%, #4ECDC4 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        transition: { duration: 1, delay: 0.5, ease: [0.6, 0.05, -0.03, 0.9] },
    },
};

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

const HeaderText = tw.h1`
    text-slate-100
    lg:text-9xl
    text-7xl
    font-sans 
    font-bold 
    pb-3
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


const MotionIcon = motion(tw.a`
    md:inline-block
    hidden
    text-[#4ECDC4]
    drop-shadow-md
    text-8xl
    pl-2
`);

export default function Main() {
    return (
        <div>
            <HeaderText>
                <motion.span variants={variants} initial="hidden" animate="animate" className="drop-shadow-lg">
                    <motion.span initial="initial" animate="animate" variants={gradientVariants}>
                        David Oduneye
                        
                        <MotionIcon variants={variants} initial="hidden" animate="animate"
                            href="mailto:oduneye.d@northeastern.edu">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </MotionIcon>
                    </motion.span>
                </motion.span>
            </HeaderText>

            <Paragraph variants={variants} initial="hidden" animate="animate">
                Passionate about building <br /> Software that is both
                <Underline> beautiful </Underline>and
                <Underline> functional</Underline>.
            </Paragraph>
        </div>
    );
}
