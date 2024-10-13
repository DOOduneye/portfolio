'use client';

import {useEffect} from 'react';

import {motion, useAnimation} from 'framer-motion';
import {useInView} from 'react-intersection-observer';

import {HomeScreenExperience} from './_components/hs-experience';
import {HomeScreenProjects} from './_components/hs-projects';
import {getPostMetadata} from '../../services/posts';
import {HomeScreenDescription} from './_components/hs-description';

const Home = () => {
  const controls = useAnimation();
  const {ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: {duration: 0.5, ease: 'easeOut'},
      });
    }
  }, [controls, inView]);

  return (
    <motion.main ref={ref} initial={{y: 0, opacity: 0}} animate={controls}>
      <HomeScreenDescription />
      <HomeScreenExperience />
      <HomeScreenProjects />
    </motion.main>
  );
};

export default Home;
