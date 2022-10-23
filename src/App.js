import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import './App.scss'

import Home from "./Components/Home/Home";
import Blog from "./Components/Blog/Blog";
import Portfolio from "./Components/Portfolio/Portfolio";
import About from "./Components/About/About";
import Uses from "./Components/Uses/Uses";
import NotFound from "./Components/NotFound";

function App() {
  return (
      <div className="w-full h-full">
        <BrowserRouter>      
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/about" element={<About />} />
              {/* <Route path="/uses" element={<Uses />} /> */}
              <Route path='*' element={<NotFound />}/>
            </Routes>
        </BrowserRouter> 
      </div>
  );

}

export default App;
