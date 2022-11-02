
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { motion } from 'framer-motion';
import tw from 'tailwind-styled-components';

const HeaderText = tw.h1`
    text-slate-100
    lg:text-9xl
    text-7xl
    font-sans 
    font-bold 
    pb-3
`;

const MotionIcon = motion(tw.div`
    md:inline-block
    hidden
    text-[#4ECDC4]
    drop-shadow-md
    text-8xl
    pl-2
`);

const gradientVariants = {
    hidden: { color: '#000000' },
    animate: {
        color: 'transparent',
        background: 'linear-gradient(90deg, #B4A0E5 0%, #4ECDC4 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        transition: { duration: 1, delay: 0.5, ease: [0.6, 0.05, -0.03, 0.9] },
    },
    exit: {
        color: '#000000',
        transition: { duration: 1, ease: [0.6, 0.05, -0.01, 0.9] },
    },
};

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




const Title = () => {
    return (
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
    );
}

export default Title;