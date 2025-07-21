import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Fluid Canvas Component
const FluidCanvas = () => {
  const canvasRef = React.useRef(null);
  const mouseRef = React.useRef({ x: 0, y: 0 });
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Liquid simulation variables
    let time = 0;
    const drops = [];
    const dropCount = 80;
    const mouse = mouseRef.current;
    
    // Initialize liquid drops
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 8 + 3,
        opacity: Math.random() * 0.6 + 0.2,
        originalSize: Math.random() * 8 + 3
      });
    }
    
    // Mouse tracking
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;
      
      // Create liquid-like gradient background
      const gradient = ctx.createRadialGradient(
        mouse.x || canvas.width / 2, 
        mouse.y || canvas.height / 2, 
        0,
        mouse.x || canvas.width / 2, 
        mouse.y || canvas.height / 2, 
        canvas.width / 3
      );
      gradient.addColorStop(0, `rgba(30, 144, 255, ${0.15 + Math.sin(time) * 0.1})`);
      gradient.addColorStop(0.5, `rgba(0, 100, 200, ${0.08 + Math.sin(time * 0.7) * 0.05})`);
      gradient.addColorStop(1, 'rgba(0, 50, 100, 0.02)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw liquid drops
      drops.forEach((drop, index) => {
        // Mouse interaction - attract drops to mouse
        const dx = mouse.x - drop.x;
        const dy = mouse.y - drop.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          drop.vx += (dx / distance) * force * 0.3;
          drop.vy += (dy / distance) * force * 0.3;
          drop.size = drop.originalSize * (1 + force * 0.5);
        } else {
          drop.size = drop.originalSize;
        }
        
        // Update position with liquid motion
        drop.x += drop.vx + Math.sin(time + index * 0.1) * 0.8;
        drop.y += drop.vy + Math.cos(time + index * 0.1) * 0.8;
        
        // Add some damping
        drop.vx *= 0.98;
        drop.vy *= 0.98;
        
        // Wrap around screen
        if (drop.x < 0) drop.x = canvas.width;
        if (drop.x > canvas.width) drop.x = 0;
        if (drop.y < 0) drop.y = canvas.height;
        if (drop.y > canvas.height) drop.y = 0;
        
        // Draw liquid drop with glow effect
        ctx.save();
        ctx.globalAlpha = drop.opacity;
        
        // Create liquid-like gradient for each drop
        const dropGradient = ctx.createRadialGradient(
          drop.x, drop.y, 0,
          drop.x, drop.y, drop.size
        );
        dropGradient.addColorStop(0, 'rgba(100, 200, 255, 0.9)');
        dropGradient.addColorStop(0.7, 'rgba(50, 150, 255, 0.6)');
        dropGradient.addColorStop(1, 'rgba(0, 100, 200, 0.2)');
        
        ctx.fillStyle = dropGradient;
        ctx.shadowBlur = 25;
        ctx.shadowColor = 'rgba(100, 200, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      // Draw connecting lines between nearby drops (liquid effect)
      drops.forEach((drop, i) => {
        drops.slice(i + 1).forEach(otherDrop => {
          const dx = drop.x - otherDrop.x;
          const dy = drop.y - otherDrop.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.save();
            ctx.globalAlpha = (120 - distance) / 120 * 0.3;
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(100, 200, 255, 0.4)';
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(otherDrop.x, otherDrop.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

// Header Component
const Header = ({ isMenuOpen, setIsMenuOpen, language, setLanguage, currentSection }) => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-30 px-8 py-6"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="text-6xl font-bold text-white cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          V
        </motion.div>

        {/* Brand Name */}
        <motion.div 
          className="absolute left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-2xl font-light tracking-wider text-white">
            VOLOSHIN <span className="font-normal">IT AGENCY</span>
          </h1>
        </motion.div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-8">
          {/* Instagram Icon */}
          <motion.a
            href="#"
            className="text-white hover:text-gray-300 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </motion.a>

          {/* Language Switcher */}
          <div className="flex items-center space-x-2 text-lg">
            <button 
              onClick={() => setLanguage('EN')}
              className={`transition-colors duration-300 ${
                language === 'EN' ? 'text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-gray-500">/</span>
            <button 
              onClick={() => setLanguage('RU')}
              className={`transition-colors duration-300 ${
                language === 'RU' ? 'text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              RU
            </button>
          </div>

          {/* Phone Icon */}
          <motion.a
            href="tel:+375"
            className="text-white hover:text-gray-300 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
};

// Navigation Component
const Navigation = ({ scrollToSection, currentSection, setIsMenuOpen, language, sections }) => {
  const menuItems = language === 'RU' ? [
    { id: 1, title: 'ГЛАВНАЯ', subtitle: 'Добро пожаловать' },
    { id: 2, title: 'УСЛУГИ', subtitle: 'Что мы делаем' },
    { id: 3, title: 'О НАС', subtitle: 'Наша команда' },
    { id: 4, title: 'ПРОЕКТЫ', subtitle: 'Наши работы' },
    { id: 5, title: 'КОНТАКТЫ', subtitle: 'Связаться с нами' }
  ] : [
    { id: 1, title: 'HOME', subtitle: 'Welcome' },
    { id: 2, title: 'SERVICES', subtitle: 'What we do' },
    { id: 3, title: 'ABOUT', subtitle: 'Our team' },
    { id: 4, title: 'PROJECTS', subtitle: 'Our work' },
    { id: 5, title: 'CONTACT', subtitle: 'Get in touch' }
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 h-full w-96 bg-black bg-opacity-95 backdrop-blur-lg z-50 border-r border-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Close Button */}
      <button
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors z-10"
      >
        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m18 6-12 12"/>
          <path d="m6 6 12 12"/>
        </svg>
      </button>
      
      {/* Menu Content */}
      <div className="flex flex-col justify-center h-full p-10 space-y-8">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={`cursor-pointer group ${
              currentSection === index ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => scrollToSection(index)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-6 border-l-4 border-transparent hover:border-white transition-colors duration-300">
              <div className="text-2xl font-light mb-2">{(index + 1).toString().padStart(2, '0')}</div>
              <h3 className="text-2xl font-medium mb-2">{item.title}</h3>
              <p className="text-base opacity-70">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
};

// Hero Section Component
const HeroSection = ({ language, scrollToSection }) => {
  const content = language === 'RU' ? {
    title1: 'РЕШАЕМ ЗАДАЧИ',
    title2: 'ИСПОЛЬЗУЯ ТЕХНОЛОГИИ',
    description: 'Увеличение продаж, рост узнаваемости, повышение конверсии, автоматизация бизнеса, любые КРИ',
    buttonText: 'НАЧАТЬ'
  } : {
    title1: 'SOLVING PROBLEMS',
    title2: 'USING TECHNOLOGIES',
    description: 'Sales increase, brand awareness growth, conversion improvement, business automation, any KPIs',
    buttonText: 'START'
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8 relative">
      {/* Background geometric elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-2 h-40 bg-white opacity-30"
          initial={{ height: 0 }}
          animate={{ height: 160 }}
          transition={{ delay: 1, duration: 1 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-1 h-32 bg-white opacity-20"
          initial={{ height: 0 }}
          animate={{ height: 128 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl w-full">
        {/* Left Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl lg:text-8xl font-light leading-tight">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {content.title1}
              </motion.div>
              <motion.div
                className="text-white opacity-80"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {content.title2}
              </motion.div>
            </h1>
          </motion.div>

          <motion.div
            className="max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="text-xl text-gray-300 leading-relaxed">
              <span className="text-3xl font-light">"</span>
              {content.description}
            </p>
          </motion.div>
        </div>

        {/* Right Content - Start Button */}
        <div className="flex items-center justify-center lg:justify-end">
          <motion.button
            onClick={() => scrollToSection(1)}
            className="relative group"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Triangle outline */}
            <svg width="400" height="340" className="text-white">
              <path
                d="M200 30 L370 290 L30 290 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="group-hover:stroke-white transition-colors duration-300"
              />
            </svg>
            
            {/* Button text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-light tracking-wider">
                {content.buttonText}
              </span>
            </div>
            
            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"
              style={{
                clipPath: 'polygon(50% 8%, 92% 85%, 8% 85%)'
              }}
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Service Section Component
const ServiceSection = ({ language }) => {
  const content = language === 'RU' ? {
    title: 'НАШИ УСЛУГИ',
    subtitle: 'Технологии которые мы используем',
    services: [
      {
        title: 'ВЕБ-РАЗРАБОТКА',
        description: 'Создание современных веб-сайтов и веб-приложений',
        icon: '💻'
      },
      {
        title: 'МОБИЛЬНЫЕ ПРИЛОЖЕНИЯ',
        description: 'Разработка приложений для iOS и Android',
        icon: '📱'
      },
      {
        title: 'UI/UX ДИЗАЙН',
        description: 'Создание удобных и красивых интерфейсов',
        icon: '🎨'
      },
      {
        title: 'АВТОМАТИЗАЦИЯ',
        description: 'Автоматизация бизнес-процессов',
        icon: '⚙️'
      }
    ]
  } : {
    title: 'OUR SERVICES',
    subtitle: 'Technologies we use',
    services: [
      {
        title: 'WEB DEVELOPMENT',
        description: 'Creating modern websites and web applications',
        icon: '💻'
      },
      {
        title: 'MOBILE APPS',
        description: 'Development of iOS and Android applications',
        icon: '📱'
      },
      {
        title: 'UI/UX DESIGN',
        description: 'Creating convenient and beautiful interfaces',
        icon: '🎨'
      },
      {
        title: 'AUTOMATION',
        description: 'Business process automation',
        icon: '⚙️'
      }
    ]
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="max-w-7xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl lg:text-7xl font-light mb-6">{content.title}</h2>
          <p className="text-2xl text-gray-400">{content.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.services.map((service, index) => (
            <motion.div
              key={index}
              className="p-10 border-2 border-gray-800 hover:border-gray-600 transition-colors duration-300 group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className="text-6xl mb-8">{service.icon}</div>
              <h3 className="text-2xl font-medium mb-6 group-hover:text-white transition-colors">
                {service.title}
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// About Section Component
const AboutSection = ({ language }) => {
  const content = language === 'RU' ? {
    title: 'О НАС',
    subtitle: 'Команда профессионалов',
    description: 'Мы — команда опытных разработчиков, дизайнеров и маркетологов. Наша цель — помочь вашему бизнесу расти с помощью современных технологий.',
    stats: [
      { number: '50+', label: 'Проектов' },
      { number: '5+', label: 'Лет опыта' },
      { number: '100%', label: 'Довольных клиентов' }
    ]
  } : {
    title: 'ABOUT US',
    subtitle: 'Team of professionals',
    description: 'We are a team of experienced developers, designers and marketers. Our goal is to help your business grow using modern technologies.',
    stats: [
      { number: '50+', label: 'Projects' },
      { number: '5+', label: 'Years experience' },
      { number: '100%', label: 'Happy clients' }
    ]
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl lg:text-7xl font-light mb-10">{content.title}</h2>
            <h3 className="text-3xl text-gray-400 mb-10">{content.subtitle}</h3>
            <p className="text-xl text-gray-300 leading-relaxed mb-16">
              {content.description}
            </p>

            <div className="grid grid-cols-3 gap-8">
              {content.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                >
                  <div className="text-5xl font-light text-white mb-4">{stat.number}</div>
                  <div className="text-lg text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-8xl opacity-30">👥</span>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 border-t-4 border-r-4 border-white opacity-40" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-4 border-l-4 border-white opacity-40" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Contact Section Component
const ContactSection = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const content = language === 'RU' ? {
    title: 'СВЯЗАТЬСЯ С НАМИ',
    subtitle: 'Готовы начать проект?',
    form: {
      name: 'Имя',
      email: 'Email',
      message: 'Сообщение',
      button: 'ОТПРАВИТЬ'
    },
    contact: {
      phone: '+375 (29) 123-45-67',
      email: 'hello@voloshin.by',
      address: 'Минск, Беларусь'
    }
  } : {
    title: 'CONTACT US',
    subtitle: 'Ready to start a project?',
    form: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      button: 'SEND'
    },
    contact: {
      phone: '+375 (29) 123-45-67',
      email: 'hello@voloshin.by',
      address: 'Minsk, Belarus'
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="max-w-7xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl lg:text-7xl font-light mb-6">{content.title}</h2>
          <p className="text-2xl text-gray-400">{content.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder={content.form.name}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-6 bg-transparent border-b-2 border-gray-600 focus:border-white transition-colors duration-300 outline-none text-white placeholder-gray-400 text-lg"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={content.form.email}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-6 bg-transparent border-b-2 border-gray-600 focus:border-white transition-colors duration-300 outline-none text-white placeholder-gray-400 text-lg"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder={content.form.message}
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full p-6 bg-transparent border-b-2 border-gray-600 focus:border-white transition-colors duration-300 outline-none text-white placeholder-gray-400 resize-none text-lg"
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="px-12 py-6 border-2 border-white text-white hover:bg-white hover:text-black transition-colors duration-300 font-light tracking-wider text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {content.form.button}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <span className="text-xl text-gray-300">{content.contact.phone}</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m4 4 16 16m0-16L4 20"/>
                  </svg>
                </div>
                <span className="text-xl text-gray-300">{content.contact.email}</span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <span className="text-xl text-gray-300">{content.contact.address}</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-8 border-t border-gray-800">
              <div className="flex space-x-6">
                <motion.a
                  href="#"
                  className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center hover:border-white transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Components = {
  FluidCanvas,
  Header,
  Navigation,
  HeroSection,
  ServiceSection,
  AboutSection,
  ContactSection
};

export default Components;