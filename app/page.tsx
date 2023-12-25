import { ModeToggle } from '@/components/mode-toggle'
import Image from 'next/image'
import { BrandButton } from './_components/brand-button'
import { GithubIcon, LinkedinIcon, Music } from 'lucide-react'

export default function Home() {
  return (
    <>
      <main className="flex flex-col max-w-2xl px-10 mx-auto my-5">
        <div className='flex flex-row justify-between my-10 flex-end'>
          <div className='flex flex-row space-x-4'>
            <BrandButton icon={LinkedinIcon} href='https://www.linkedin.com/in/dooduneye' />
            <BrandButton icon={Music} href='https://open.spotify.com/user/317gsn3rqunkxocwuvf7njcj5luy' />
            <BrandButton icon={GithubIcon} href='https://github.com/DOOduneye/' />
          </div>
          <span className='flex flex-row'>
            <ModeToggle />
          </span>
        </div>
        <h1 className='text-2xl font-bold'>David Oduneye</h1>
        <p className='mt-4 text-sm font-normal text-muted-foreground'>
          Based out of Boston MA, I am a Computer Science student at Northeastern University. I am not only honing my skills in computer science but also expanding my knowledge as a Full Stack Software and Machine Learning Engineer. With a strong passion for building technology that can solve meaningful problems, I am always seeking new opportunities to learn and grow.
          <br />
          <br />
          When I am not coding, I can often be found in the gym, as I am an avid Powerlifter. I compete regularly and have set my sights on completeing a couple meets in the next few months. In addition to my love for technology and fitness, I also enjoy photography, traveling, and watching films. Currently, I am a huge fan of the film Spiderman Across the Spiderverse and a large fan of Jordan Peele.
        </p>

        <div className='mt-10 space-y-4'>
          <h1 className='text-2xl font-bold'>
            Experience
          </h1>

          <ExperienceCard />
          <ExperienceCard />
          <ExperienceCard />

        </div>

        {/* <div className='mt-10 space-y-4'>
          <h1 className='text-2xl font-bold'>
            Projects
          </h1>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>

            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
          </div>
        </div> */}
      </main>
    </>
  )
}

export const ExperienceCard = () => {
  return (
    <div className='py-5 transition-all duration-300 ease-in-out transform border-2 border-transparent border-gray-100 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 rounded-xl hover:scale-105 hover:border-gray-300'>
      <div className='flex flex-row justify-between'>
        <h1 className='px-4 py-2 text-xl font-bold'>Software Engineer Intern</h1>
        <h2 className='px-4 py-2 text-sm text-muted-foreground'>May - August 2021</h2>
      </div>
      <h3 className='px-4 py-1 font-semibold text-md text-muted-foreground'>Microsoft</h3>
      <p className='px-4 py-2 text-sm font-normal text-muted-foreground'>
        I worked on the Data Platform team at Salsify, where I built a data pipeline that ingested data from a third party API and stored it in a database. I also worked on a project that allowed users to create and manage their own custom data pipelines.
      </p>
    </div>
  )
}


export const ProjectCard = () => {
  return (
    <div className='py-5 transition-all duration-300 ease-in-out transform border-2 border-transparent border-gray-100 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 rounded-xl hover:scale-105 hover:border-gray-300'>
      <h2 className='px-4 py-2 text-xl font-bold'>Project 1</h2>

      <p className='px-4 py-2 text-sm font-normal text-muted-foreground'>
        Here are some of my favorite projects I have worked on.
      </p>

      <div className='flex flex-row gap-2 px-4'>
        <Tag />
        <Tag />
        <Tag />
      </div>

    </div>
  )
}

export const Tag = () => {
  return (
    <div className='w-auto px-2 py-1 text-xs font-bold bg-gray-100 rounded-md dark:bg-gray-900'>
      Tag
    </div>
  )
}