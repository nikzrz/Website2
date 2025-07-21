import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import "./App.css";
import Components from "./components";

const { Header, HeroSection, Navigation, ServiceSection, AboutSection, ContactSection, LiquidCanvas } = Components;

const Home = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('RU');
  const { scrollY } = useScroll();

  const sections = [
    { id: 0, component: HeroSection, name: 'hero' },
    { id: 1, component: ServiceSection, name: 'artifacts' },
    { id: 2, component: ServiceSection, name: 'development' },
    { id: 3, component: AboutSection, name: 'advertising' },
    { id: 4, component: ContactSection, name: 'start' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Update current section based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const newSection = Math.floor(scrollPosition / windowHeight);
      setCurrentSection(Math.min(newSection, sections.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-black text-white font-sans relative">
      {/* Liquid Canvas Background */}
      <LiquidCanvas />
      
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
            scrollToSection={scrollToSection}
            currentSection={currentSection}
            setIsMenuOpen={setIsMenuOpen}
            language={language}
          />
        )}
      </AnimatePresence>

      {/* Side Burger Menu */}
      <motion.div 
        className="fixed left-8 top-1/2 transform -translate-y-1/2 z-30"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Section Counter */}
          <div className="text-center mb-4">
            <motion.span 
              className="text-8xl font-thin text-white"
              key={currentSection}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentSection + 1}
            </motion.span>
            <div className="w-1 h-12 bg-white opacity-40 mx-auto my-3" />
            <span className="text-2xl font-thin text-white opacity-70">{sections.length}</span>
          </div>
          
          {/* Burger Menu Button */}
          <motion.button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col space-y-1 cursor-pointer group p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {[1,2,3].map((i) => (
              <motion.div
                key={i}
                className="w-12 h-1 bg-white origin-center"
                animate={{
                  rotate: isMenuOpen ? (i === 1 ? 45 : i === 3 ? -45 : 0) : 0,
                  opacity: isMenuOpen && i === 2 ? 0 : 1,
                  y: isMenuOpen ? (i === 1 ? 8 : i === 3 ? -8 : 0) : 0
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </motion.button>
        </div>
      </motion.div>

      {/* Scrollable Main Content */}
      <main className="relative z-10">
        {sections.map((section, index) => {
          const SectionComponent = section.component;
          return (
            <div 
              key={section.id}
              id={`section-${section.id}`}
              className="min-h-screen"
            >
              <SectionComponent 
                language={language}
                currentSection={currentSection}
                sectionIndex={index}
                scrollToSection={scrollToSection}
              />
            </div>
          );
        })}
      </main>

      {/* Section Navigation Dots */}
      <motion.div 
        className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="flex flex-col space-y-4">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                currentSection === index 
                  ? 'bg-white border-white' 
                  : 'bg-transparent border-white border-opacity-30 hover:border-opacity-60'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </motion.div>
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