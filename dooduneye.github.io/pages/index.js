import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import Main from '../components/Main.js'

import { motion } from 'framer-motion'
import variants from '../utils/motion' 

export default function Home() {
    return (
        <motion.main initial='hidden' animate='animate' exit='exit' variants={variants} className={`grid grid-rows-2 {styles.container} `}>
            <section className="row-start-2 row-end-3 flex flex-row">
                <Main />
            </section>
        </motion.main>

    );
}
