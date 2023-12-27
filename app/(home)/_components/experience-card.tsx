import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Experience } from "@/services/experiences";
import { formatDateRange } from "@/lib/utils";

interface ExperienceCardProps {
    experience: Experience;
}

export const ExperienceCard = ({ experience: { role, company, to, from, description } }: ExperienceCardProps) => {
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

    let date;
    if (to === undefined) {
        date = formatDateRange(from.toDate(), null);
    } else {
        date = formatDateRange(from.toDate(), to.toDate());
    }

    return (
        <motion.div
            ref={ref}
            initial={{ y: 30, opacity: 0 }}
            animate={controls}
            className='grid grid-cols-3 gap-5'
        >
            <span className="col-span-1 text-muted-foreground text-sm md:text-md">{date}</span>

            <div className="col-span-2 flex flex-col">
                <span className="text-md md:text-lg font-semibold">{role}</span>
                <span className="text-sm md:text-sm font-normal text-muted-foreground">{company}</span>
                <p className="mt-2 text-sm font-normal text-muted-foreground">
                    {description}
                </p>
            </div>
        </motion.div>
    )
}
