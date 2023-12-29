"use client"

import { motion } from "framer-motion"

export const Gradient = () => {
    return (
        <>
            <motion.div
                className="bg-[#fbe2e3] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]"
                animate={{
                    y: ['0%', '-10%', '0%'], // Define y-axis animation values for a bounce effect
                    transition: {
                        duration: 5, // Animation duration
                        ease: "easeInOut", // Animation easing function
                        loop: Infinity, // Infinite loop
                    },
                }}
            />
            <motion.div
                className="bg-[#dbd7fb] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]"
                animate={{
                    y: ['0%', '10%', '0%'], // Define y-axis animation values for a bounce effect
                    transition: {
                        duration: 5, // Animation duration
                        ease: "easeInOut", // Animation easing function
                        loop: Infinity, // Infinite loop
                    },
                }}
            />
        </>
    )
}