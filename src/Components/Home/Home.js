import '../../App.scss';

import Navigation from '../Navigation/Navigation.js';
import HomeMainSection from './HomeMainSection';
import Footer from "../Footer";

function Home() {
    return (
        <main className="grid grid-rows-3 h-full w-full">
            <section className="row-start-1 row-end-1">
                <Navigation />
            </section>

            <section className="row-start-2 row-end 3">
                <HomeMainSection />
            </section>

            <section className="flex flex-col-reverse overflow-hidden align-end row-start-3 row-end-4">
                <Footer />
            </section>
        </main>

    );
}

export default Home;
