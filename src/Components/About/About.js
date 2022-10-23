import "../../App.scss";

import Post from "../Post";
import david from "./david.js";

import {motion} from "framer-motion";
function About() {
    return (
        <motion.main className="grid grid-flow-row auto-rows-max h-full w-full" initial={{ opacity: 0}} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <section className="flex flex-col justify-center items-center pb-12">
                <Post date={david.date} title={david.title} content={david.content} />
            </section>
        </motion.main>
    );
}

export default About;