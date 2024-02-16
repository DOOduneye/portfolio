"use client"

import { useEffect } from 'react'

import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

import { HomeScreenExperience } from './_components/hs-experience'
import { HomeScreenProjects } from './_components/hs-projects'
import { getPostMetadata } from '../../services/posts';

const Home = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
      });
    }
  }, [controls, inView]);

  useEffect(() => {
    const load = async () => {
      // await getPostMetadata();
    }

    load();
  }, [])

  return (
    <motion.main
      ref={ref}
      initial={{ y: 0, opacity: 0, }}
      animate={controls}
    >
      <h1 className='text-2xl font-bold'>David Oduneye</h1>
      <p className='mt-4 text-sm font-normal dark:text-muted-foreground text-gray-500'>
        I am a third year Computer Science student at Northeastern University.
        I am not only honing my skills in computer science but also expanding my knowledge as a
        Full Stack Software and Machine Learning Engineer. With a strong passion for building
        technology that can solve meaningful problems, I am always seeking new opportunities to learn and grow.
        <br />
        <br />
        When I am not coding, I can often be found in the gym, as I am an avid Powerlifter.
        In addition to my love for technology and fitness,
        I also enjoy photography, traveling, and  film.
      </p>

      <HomeScreenExperience />
      <HomeScreenProjects />
    </motion.main>
  )
}

export default Home;