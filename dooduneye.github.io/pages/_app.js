import { AnimatePresence } from 'framer-motion';

import '../styles/globals.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'

import Navigation from '../components/Navigation/Navigation'
import Footer from '../components/Footer';

export default function MyApp({ Component, pageProps, router }) {
  return (
    <AnimatePresence wait>
        <div>
          <Navigation />
            <Component {...pageProps} />
          <Footer />
        </div>
    </AnimatePresence>
  )
}
