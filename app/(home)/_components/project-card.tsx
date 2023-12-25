import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

interface ProjectCardProps {
    project: {
        title: string;
        description: string;
        tags: string[];
        link?: string;
    }
}
export const ProjectCard = ({ project: { title, description, tags, link } }: ProjectCardProps) => {
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
        <motion.div
            ref={ref}
            initial={{ y: 30, opacity: 0 }}
            animate={controls}
            className='py-5 transition-all duration-300 ease-in-out transform border-2 border-transparent border-gray-200 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 rounded-xl hover:scale-105 hover:border-gray-500'
            style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexGrow: 1 }}>
                <h2 className='px-4 py-2 text-xl font-bold'>{title}</h2>
                <p className='px-4 py-2 text-sm font-normal text-muted-foreground'>
                    {description}
                </p>
            </div>

            <div className='flex flex-row flex-wrap gap-2 px-4 mt-2 self-end'>
                <div style={{ flex: '1 0 100%' }}></div>

                {tags?.map((tag, index) => (
                    <Badge key={index} variant={'outline'}>{tag}</Badge>
                ))}
            </div>
        </motion.div>
    )
}
