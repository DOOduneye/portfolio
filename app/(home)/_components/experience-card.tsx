import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface ExperienceCardProps {
    experience: {
        id: number
        title: string
        company: string
        date: string
    }
}

export const ExperienceCard = ({ experience: { title, company, date } }: ExperienceCardProps) => {
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

    return (
        <motion.div
            ref={ref}
            initial={{ y: 50, opacity: 0 }}
            animate={controls}
            className='py-5 transition-all duration-300 ease-in-out transform border-2 border-transparent border-gray-200 shadow-sm dark:border-gray-900 dark:hover:border-gray-300 rounded-xl hover:scale-105 hover:border-gray-500'
        >
            <div className='flex flex-col justify-between gap-y-1'>
                <h2 className='px-4 text-xl font-bold'>{title}</h2>
                <h3 className='px-4 text-sm font-semibold text-muted-foreground'>{company}</h3>
                <p className='px-4 text-sm font-normal text-muted-foreground'>{date}</p>
            </div>
        </motion.div>
    )
}
