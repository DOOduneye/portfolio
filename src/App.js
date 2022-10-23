import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import './App.scss'

import Navigation from './Components/Navigation/Navigation';
import Footer from './Components/Footer.js';


import AnimatedRoutes from './Components/AnimatedRoutes';

function App() {
  return (
      <div className="w-full h-full min-h-full relative">
        <BrowserRouter>      
          <section className="row-start-1 row-end-1">
            <Navigation />
          </section>
          <AnimatedRoutes />
          <Footer />
        </BrowserRouter> 
      </div>
  );

}

export default App;
