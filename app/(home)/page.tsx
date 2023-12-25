"use client"

import { useEffect } from 'react'
import Link from 'next/link'

import { ArrowRight } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

import { ExperienceCard } from './_components/experience-card'
import { ProjectCard } from './_components/project-card'

export default function Home() {
  const controls = useAnimation();
  const { ref, inView } = useInView();


  const experiences = [
    {
      id: 1,
      title: 'Software Engineer Intern',
      company: 'Microsoft',
      date: 'June - September 2024'
    },
    {
      id: 2,
      title: 'Software Engineer Co-op',
      company: 'Boston Scientific',
      date: 'January - June 2024',
    },
    {
      id: 3,
      title: 'Technical Lead',
      company: 'Generate',
      date: 'August 2022 - Present'
    },
    {
      id: 4,
      title: 'Machine Learning Co-op',
      company: 'Genentech',
      date: 'January - June 2023'
    },
  ]

  const projects = [
    {
      title: 'Jurni',
      description: 'Analyzed journal data for a mental health service. Used NLP techniques to find trigger points in the data that could support experts in their work. Developed tools for large data scraping, preprocessing and subject clustering.',
      tags: ['Python', 'NLP', 'Machine Learning', 'Data Science'],
    },
    {
      title: 'Rate My Dorm',
      description: 'Developed a secure, responsive full-stack web application with Next.js, enabling college students to view, rate, and provide feedback on dormitories. Integrated the Collegescorecard API to pull relevant college statistics, such as student body size, ownership, and associated costs. Set up a polyrepo architecture using Express.js, creating APIs that support CRUD operations on MongoDB schema objects.',
      tags: ['React', 'Next.js', 'Express.js', 'MongoDB'],
    },
    {
      title: 'Jurni',
      description: 'Analyzed journal data for a mental health service. Used NLP techniques to find trigger points in the data that could support experts in their work. Developed tools for large data scraping, preprocessing and subject clustering.',
      tags: ['Python', 'NLP', 'Machine Learning', 'Data Science'],
    },
    {
      title: 'Rate My Dorm',
      description: 'Developed a secure, responsive full-stack web application with Next.js, enabling college students to view, rate, and provide feedback on dormitories. Integrated the Collegescorecard API to pull relevant college statistics, such as student body size, ownership, and associated costs. Set up a polyrepo architecture using Express.js, creating APIs that support CRUD operations on MongoDB schema objects.',
      tags: ['React', 'Next.js', 'Express.js', 'MongoDB'],
    }
  ]



  useEffect(() => {
    if (inView) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
      });
    }
  }, [controls, inView]);

  return (
    <>
      <motion.main
        ref={ref}
        initial={{ y: 0, opacity: 0, }}
        animate={controls}
      >
        <h1 className='text-2xl font-bold'>David Oduneye</h1>
        <p className='mt-4 text-sm font-normal text-muted-foreground'>
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

        <div className='mt-10 space-y-4'>
          <div className='flex flex-row items-center justify-between'>
            <h1 className='text-xl font-semibold'>
              Experiences
            </h1>
          </div>


          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {experiences.map((experience) => (
              <ExperienceCard experience={experience} key={experience.id} />
            ))}
          </div>
        </div>

        <div className='mt-10 space-y-4'>
          <div className='flex flex-row items-center justify-between'>
            <h1 className='text-xl font-semibold'>
              Projects
            </h1>
            <Link href='/projects' className='flex flex-row items-center space-x-2 cursor-pointer group'>
              <ArrowRight className='w-6 h-6 text-gray-500 group-hover:text-gray-400' />
            </Link>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {projects.map((project) => (
              <ProjectCard project={project} key={project.title} />
            ))}
          </div>
        </div>
      </motion.main>
    </>
  )
}