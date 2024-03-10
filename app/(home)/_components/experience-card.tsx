import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

import { formatDateRange } from "@/lib/utils";
import { Experience } from "@/types/experience";
import { Skeleton } from "@/components/ui/skeleton";

interface ExperienceCardProps {
    experience: Experience;
}

export const ExperienceCard = ({ experience: { role, company, to, from, description, location } }: ExperienceCardProps) => {
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
            className='md:grid md:grid-cols-3 gap-2 p-5 border md:border-transparent border-gray-200 md:border-0 md:p-0 shadow-sm md:shadow-none md:border-none dark:border-gray-900 rounded-xl flex flex-col'
        >
            <div className="md:col-span-1 flex flex-row justify-between md:flex-col md:justify-normal md:gap-2 md:border-r-[1.5px] md:mr-6 pl-2 md:border-dashed">
                <span className="text-sm md:text-md dark:text-muted-foreground text-gray-500">{date}</span>
                <span className="dark:text-muted-foreground text-gray-500 text-sm">{location}</span>
            </div>

            <div className="col-span-2 flex flex-col">
                <span className="text-md md:text-lg font-semibold">{role}</span>
                <span className="text-sm md:text-sm font-normal dark:text-muted-foreground text-gray-500">{company}</span>
                <p className="mt-2 text-sm font-normal dark:text-muted-foreground text-gray-500">
                    {description}
                </p>
            </div>
        </motion.div>
    )
}

ExperienceCard.Skeleton = () => {
    return (
        <div className="grid grid-cols-3 gap-5">
            <span className="col-span-1">
                <Skeleton className="w-10 h-4" />
            </span>
            <div className="col-span-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-12 h-4 mt-2" />
                <Skeleton className="w-32 h-4 mt-2" />
            </div>
        </div>
    )
}