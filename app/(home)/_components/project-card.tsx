import { useEffect } from "react";

import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import type { Project } from "@/types/project";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectCardProps {
    project: Project
}

export const ProjectCard = ({ project: { title, description, tags, date, link } }: ProjectCardProps) => {
    const controls = useAnimation();
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            controls.start({
                y: 0,
                opacity: 1,
                transition: { duration: 0.5, ease: 'circInOut' },
            });
        }
    }, [controls, inView]);

    return (
        <motion.a
            ref={ref}
            initial={{ y: 30, opacity: 0 }}
            animate={controls}
            className='flex flex-col px-5 py-5 transition-all duration-300 ease-in-out transform border-2 border-gray-300/60 shadow-sm dark:border-gray-900 sm:dark:hover:border-gray-300 rounded-xl sm:hover:scale-105 sm:hover:border-gray-500 cursor-pointer'
            href={link}
            target='_blank'
        >
            <div className="flex-1">
                <div className='flex flex-row justify-between gap-x-4 pb-2'>
                    <h2 className='text-xl font-bold'>{title}</h2>
                    <span className='text-sm text-muted-foreground'>
                        {date.toDate().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                </div>
                <p className='text-sm font-normal text-muted-foreground'>
                    {description}
                </p>
            </div>

            <div className='flex flex-row flex-wrap gap-2 self-start'>
                <div style={{ flex: '1 0 100%' }}></div>

                {tags?.map((tag, index) => (
                    <Badge key={index} variant={'outline'} className="sm:hover:bg-gray-100 sm:dark:hover:bg-gray-800">
                        {tag}
                    </Badge>
                ))}
            </div>
        </motion.a>
    )
}

ProjectCard.Skeleton = () => {
    return (
        <div className='flex flex-col px-5 py-5 transition-all duration-300 ease-in-out transform border-2 border-gray-300/60 shadow-sm dark:border-gray-900 sm:dark:hover:border-gray-300 rounded-xl sm:hover:scale-105 sm:hover:border-gray-500'>
            <div className="flex-1">
                <div className='flex flex-row justify-between gap-x-4 pb-2'>
                    <Skeleton className='w-10 h-4' />
                    <Skeleton className='w-10 h-4' />
                </div>
                <Skeleton className='w-20 h-4' />
                <Skeleton className='w-20 h-4 mt-2' />
                <Skeleton className='w-20 h-4 mt-2' />
            </div>

            <div className='flex flex-row flex-wrap gap-2 self-end'>
                <div style={{ flex: '1 0 100%' }}></div>

                <Skeleton className='w-20 h-4' />
                <Skeleton className='w-20 h-4' />
                <Skeleton className='w-20 h-4' />
            </div>
        </div>
    )
}