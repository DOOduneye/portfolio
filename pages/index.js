import Main from '../components/Main/Main.js';
import variants from '../utils/motion';

import { motion } from 'framer-motion';
import tw from 'tailwind-styled-components';

const Container = motion(tw.div`
    h-90
    flex 
    justify-center 
    items-center 
    p-14
`);

const Home = () => {
    return (
        <Container initial="hidden" animate="animate" variants={variants}>
            <Main />
        </Container>
    );
}

export default Home;