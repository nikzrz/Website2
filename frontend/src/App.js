import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import Components from "./components";

const { Header, HeroSection, Navigation, ServiceSection, AboutSection, ContactSection } = Components;

const Home = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('RU');

  const sections = [
    { id: 1, component: HeroSection },
    { id: 2, component: ServiceSection },
    { id: 3, component: AboutSection },
    { id: 4, component: ContactSection },
    { id: 5, component: ContactSection }
  ];

  const nextSection = () => {
    setCurrentSection(prev => prev < 5 ? prev + 1 : 1);
  };

  const prevSection = () => {
    setCurrentSection(prev => prev > 1 ? prev - 1 : 5);
  };

  const goToSection = (sectionId) => {
    setCurrentSection(sectionId);
    setIsMenuOpen(false);
  };

  const CurrentSectionComponent = sections.find(s => s.id === currentSection)?.component || HeroSection;

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Header */}
      <Header 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        language={language}
        setLanguage={setLanguage}
        currentSection={currentSection}
      />

      {/* Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <Navigation 
            goToSection={goToSection}
            currentSection={currentSection}
            setIsMenuOpen={setIsMenuOpen}
            language={language}
          />
        )}
      </AnimatePresence>

      {/* Section Counter and Controls */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col items-center space-y-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col space-y-1 cursor-pointer group"
          >
            <span className="text-6xl font-thin text-white">{currentSection}</span>
            <div className="flex flex-col space-y-1">
              {[1,2,3].map((i) => (
                <motion.div
                  key={i}
                  className="w-8 h-0.5 bg-white origin-center"
                  animate={{
                    rotate: isMenuOpen ? (i === 1 ? 45 : i === 3 ? -45 : 0) : 0,
                    opacity: isMenuOpen && i === 2 ? 0 : 1,
                    y: isMenuOpen ? (i === 1 ? 6 : i === 3 ? -6 : 0) : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
            <span className="text-lg font-thin text-white opacity-70">5</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <motion.main 
        className="relative"
        key={currentSection}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <CurrentSectionComponent 
          nextSection={nextSection}
          language={language}
          currentSection={currentSection}
        />
      </motion.main>

      {/* Navigation Arrows */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col space-y-4">
          <button 
            onClick={prevSection}
            className="text-white hover:text-gray-300 transition-colors duration-300"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button 
            onClick={nextSection}
            className="text-white hover:text-gray-300 transition-colors duration-300"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div 
          className="w-px h-16 bg-white opacity-30"
          animate={{ height: [16, 24, 16] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;