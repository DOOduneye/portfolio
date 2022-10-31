import styles from '../styles/Home.module.scss';
import Main from '../components/Main.js';

import { motion } from 'framer-motion';
import variants from '../utils/motion';

import tw from 'tailwind-styled-components';

const Container = tw.div`
    flex flex-col items-center justify-center min-h-screen py-2
`;

const MotionContainer = motion(Container);

const SubContainer = tw.div`
    row-start-2 row-end-3 flex flex-row
`;
export default function Home() {
    return (
        <MotionContainer initial="hidden" animate="animate" variants={variants}>
            <SubContainer>
                <Main />
            </SubContainer>
        </MotionContainer>
    );
}
