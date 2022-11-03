import { AnimatePresence } from 'framer-motion';
import '@fortawesome/fontawesome-svg-core/styles.css';

import '../styles/globals.scss';

import Navigation from '../components/Navigation/Navigation';
import Footer from '../components/Footer';

export default function MyApp({ Component, pageProps, router }) {
    return (
        <div>
            <Navigation />
            <Component {...pageProps} />
            <Footer />
        </div>
    );
}
