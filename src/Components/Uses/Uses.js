import Navigation from "../Navigation/Navigation";
import Footer from "../Footer";
import Post from "../Post";
import tools from "./tools"

function Uses() {
    return (
        <main className="grid grid-flow-row auto-rows-max h-full w-full">
            <section>
                <Navigation />
            </section>

            <section className="flex flex-col justify-center items-center pb-12">
                <Post date={tools.date} title={tools.title} content={tools.content} />
            </section>

            <Footer />
        </main>
    );
}

export default Uses;