
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { motion } from 'framer-motion';
import tw from 'tailwind-styled-components';

import variants from '../../utils/motion';


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

const Title = () => {
    return (
        <HeaderText>
            <motion.span variants={variants} initial="hidden" animate="animate" className="drop-shadow-lg">
                <motion.span initial="initial" animate="animate" variants={variants}>
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