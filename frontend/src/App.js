import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import "./App.css";
import Components from "./components";

const { Header, HeroSection, Navigation, ServiceSection, AboutSection, ContactSection, FluidCanvas } = Components;

const Home = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('RU');
  const { scrollY } = useScroll();

  const sections = [
    { id: 0, component: HeroSection, name: 'hero' },
    { id: 1, component: ServiceSection, name: 'services' },
    { id: 2, component: AboutSection, name: 'about' },
    { id: 3, component: ContactSection, name: 'projects' },
    { id: 4, component: ContactSection, name: 'contact' }
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
      {/* Fluid Canvas Background */}
      <FluidCanvas />
      
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
            sections={sections}
          />
        )}
      </AnimatePresence>

      {/* Side Burger Menu */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-30">
        <div className="flex flex-col items-center space-y-4">
          {/* Section Counter */}
          <div className="text-center mb-4">
            <span className="text-6xl font-thin text-white">{currentSection + 1}</span>
            <div className="w-px h-8 bg-white opacity-30 mx-auto my-2" />
            <span className="text-lg font-thin text-white opacity-70">{sections.length}</span>
          </div>
          
          {/* Burger Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col space-y-1 cursor-pointer group p-2"
          >
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
          </button>
        </div>
      </div>

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
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30">
        <div className="flex flex-col space-y-3">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                currentSection === index 
                  ? 'bg-white border-white' 
                  : 'bg-transparent border-white border-opacity-30 hover:border-opacity-60'
              }`}
            />
          ))}
        </div>
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