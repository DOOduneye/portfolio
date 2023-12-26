import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface ExperienceCardProps {
    experience: {
        id: number
        title: string
        company: string
        date: string
        description: string
    }
}

export const ExperienceCard = ({ experience: { title, company, date, description } }: ExperienceCardProps) => {
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
            initial={{ y: 30, opacity: 0 }}
            animate={controls}
            className='grid grid-cols-3 gap-5'
        >
            <span className="col-span-1 text-muted-foreground text-sm md:text-md">{date}</span>

            <div className="col-span-2 flex flex-col">
                <span className="text-md md:text-lg font-semibold">{title}</span>
                <span className="text-sm md:text-sm font-normal text-muted-foreground">{company}</span>
                <p className="mt-2 text-sm font-normal text-muted-foreground">
                    {description}
                </p>
            </div>
        </motion.div>
    )
}
