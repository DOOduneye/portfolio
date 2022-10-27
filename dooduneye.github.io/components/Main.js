import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { motion } from 'framer-motion';

const variants = {
    hidden: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.5, ease: [0.6, 0.05, -0.01, 0.9] } },
}

const gradientVariants = {
    hidden: { color: '#000000' },
    animate: { color: 'transparent', 
        background: 'linear-gradient(90deg, #F43B47 0%, #453A94 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        transition: { duration: 4, delay: 0.5, ease: [0.6, 0.05, -0.03, 0.9] } },
}


export default function Main() {
    return (
        <section className="flex flex-row p-12">
            <div className="flex flex-col">
                <div className="flex flex-row gap-20">
                    <div>
                        <h1 className="font-sans font-bold text-8xl pb-3 text-slate-100">
                           <motion.span variants={variants} initial="hidden" animate="animate" className="drop-shadow-lg">
                            <motion.span initial='initial' animate='animate' variants={gradientVariants}>
                                Hi, I'm David <motion.a variants={variants} initial="hidden" animate="animate" href="mailto:oduneye.d@northeastern.edu" className="text-[#453A94] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 drop-shadow-md"><FontAwesomeIcon icon={faPaperPlane} /></motion.a>
                            </motion.span>
                           </motion.span>
                        </h1>

                        <motion.p variants={variants} initial="hidden" animate="animate" className="font-sans font-bold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-pink-500 to-[#453A94]">
                            Passionate about building 
                            <br /> 
                            software that is both <span className="hover:underline hover:decoration-sky-600 hover:underline-offset-8 hover:decoration-3 hover:transition hover:duration-300 hover:ease-in-out hover:delay-150 hover:translatex-1">beautiful</span> and <span className="hover:underline hover:decoration-sky-600 hover:underline-offset-8 hover:decoration-3 hover:transition hover:duration-300 hover:ease-in-out hover:delay-150 ">functional</span>.
                        </motion.p>
                    </div>

                </div>
            </div>
        </section>
    );
}
