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

const FlexColContainer = tw.section`
    flex
    flex-col
`;

const FlexRowContainer = tw.section`
    flex
    flex-row
`;

const UnderlineTransition = tw.span`
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

const GradientP = tw.p`
    font-sans
    font-bold 
    text-transparent
    text-3xl
    bg-clip-text
    bg-gradient-to-r
    from-[#4ECDC4]
    to-[#B4A0E5]
`;

const MotionGradientP = motion(GradientP);

const HeaderText = tw.h1`
    font-sans 
    font-bold 
    text-8xl 
    pb-3
    text-slate-100
`;

const MotionIcon = motion(tw.a`
    text-[#4ECDC4]
    transition
    ease-in-out 
    delay-150
    hover:-translate-y-1 
    hover:scale-110 
    duration-300 
    drop-shadow-md
`);

export default function Main() {
    return (
        <FlexRowContainer className="p-12">
            <FlexColContainer>
                <FlexRowContainer className="gap-20">
                    <div>
                        <HeaderText>
                            <motion.span
                                variants={variants}
                                initial="hidden"
                                animate="animate"
                                className="drop-shadow-lg"
                            >
                                <motion.span initial="initial" animate="animate" variants={gradientVariants}>
                                    {"Hi, I'm David Oduneye"}
                                    <MotionIcon
                                        variants={variants}
                                        initial="hidden"
                                        animate="animate"
                                        href="mailto:oduneye.d@northeastern.edu"
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    </MotionIcon>
                                </motion.span>
                            </motion.span>
                        </HeaderText>

                        <MotionGradientP variants={variants} initial="hidden" animate="animate">
                            {'Passionate about building'}
                            <br />
                            {'software that is both'}
                            <UnderlineTransition>{'beautiful'}</UnderlineTransition>
                            {'and'}
                            <UnderlineTransition>{'functional'}</UnderlineTransition>
                            {'.'}
                        </MotionGradientP>
                    </div>
                </FlexRowContainer>
            </FlexColContainer>
        </FlexRowContainer>
    );
}
