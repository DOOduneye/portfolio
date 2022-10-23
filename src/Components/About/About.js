import "../../App.scss";

import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";
import Post from "../Post";
import david from "./david.js";

function About() {
    return (
        <main className="grid grid-flow-row auto-rows-max h-full w-full">
            <section>
                <Navigation />
            </section>

            <section className="flex flex-col justify-center items-center pb-12">
                <Post date={david.date} title={david.title} content={david.content} />
            </section>

            <Footer />
        </main>
    );
}

export default About;