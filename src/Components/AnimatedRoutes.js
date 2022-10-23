import Uses from "./Uses/Uses";
import NotFound from "./NotFound";
import Home from "./Home/Home";
import Blog from "./Blog/Blog";
import Portfolio from "./Portfolio/Portfolio";
import About from "./About/About";

import { useLocation } from "react-router-dom";
import {Routes, Route} from "react-router-dom";

import {AnimatePresence} from 'framer-motion';

function AnimatedRoutes() {

const location = useLocation(); 

  return (
    <AnimatePresence>
        <Routes location={location} key={location.pathname}>    
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/uses" element={<Uses />} /> */}
            <Route path='*' element={<NotFound />}/>
        </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;