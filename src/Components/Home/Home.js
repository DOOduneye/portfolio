import '../../App.scss';

import HomeMainSection from './HomeMainSection';

import { motion } from 'framer-motion';
import InitialTransition from './InitialTransition.js';

const content = {
    animate: {
      transition: { staggerChildren: 0.1, delayChildren: 2.8 },
    },
  };
  
  const title = {
    initial: { y: -20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };
  
  const products = {
    initial: { y: -20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };
  

function Home() {
    return (
        <motion.main className="grid grid-rows-3 h-full w-full">
            <InitialTransition />

            <section className="row-start-2 row-end 3">
                <HomeMainSection />
            </section>
        </motion.main>

    );
}

export default Home;
