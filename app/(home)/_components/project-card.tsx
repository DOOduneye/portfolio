import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

interface ProjectCardProps {
    project: {
        title: string;
        description: string;
        tags: string[];
        date: Date;
        link?: string;
    }
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
            className='flex flex-col px-5 py-5 transition-all duration-300 ease-in-out transform border-2 border-transparent border-gray-200 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 rounded-xl hover:scale-105 hover:border-gray-500 cursor-pointer'
            href={link}
            target='_blank'
        >
            <div className="flex-1">
                <div className='flex flex-row justify-between gap-x-4 pb-2'>
                    <h2 className='text-xl font-bold'>{title}</h2>
                    <span className='text-sm text-muted-foreground'>
                        {date.getFullYear()}
                    </span>
                </div>
                <p className='text-sm font-normal text-muted-foreground'>
                    {description}
                </p>
            </div>

            <div className='flex flex-row flex-wrap gap-2 self-end'>
                <div style={{ flex: '1 0 100%' }}></div>

                {tags?.map((tag, index) => (
                    <Badge key={index} variant={'outline'} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                        {tag}
                    </Badge>
                ))}
            </div>
        </motion.a>
    )
}
