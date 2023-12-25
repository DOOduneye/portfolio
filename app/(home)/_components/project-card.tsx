import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";


export const ProjectCard = () => {
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
            className='py-5 transition-all duration-300 ease-in-out transform border-2 border-transparent border-gray-200 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 rounded-xl hover:scale-105 hover:border-gray-500'>
            <h2 className='px-4 py-2 text-xl font-bold'>Project 1</h2>

            <p className='px-4 py-2 text-sm font-normal text-muted-foreground'>
                Here are some of my favorite projects I have worked on.
            </p>

            <div className='flex flex-row flex-wrap gap-2 px-4 mt-2'>
                <Badge variant={'outline'}>React</Badge>
                <Badge variant={'outline'}>TypeScript</Badge>
            </div>
        </motion.div>
    )
}
