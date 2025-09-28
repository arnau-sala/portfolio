'use client';

import { useEffect } from 'react';
import LanguageSelector from '../src/components/LanguageSelector';
import { useLanguage } from '../src/contexts/LanguageContext';
import { getAssetPath } from '../src/utils/paths';

export default function HomePage() {
  const { t, isLoading } = useLanguage();
  
  // Función para scroll suave a secciones
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Altura del header fijo
      // Ajuste especial para Projects - baja un poco más para mostrar toda la sección
      const extraOffset = sectionId === 'projects' ? 60 : 0; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset + extraOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {

    // Simple scroll-triggered animations for other sections (not About Me)
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-scroll, .slide-in-left-scroll, .slide-in-up-scroll, .slide-in-right-scroll');
      
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible && !element.classList.contains('animate')) {
          element.classList.add('animate');
        }
      });
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show loading spinner while translations are loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-xl font-bold text-blue-400">
                Arnau Sala
              </div>
              <div className="hidden md:block">
                <LanguageSelector />
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('about')} className="hover:text-blue-400 transition-colors cursor-pointer">{t('navigation.about')}</button>
              <button onClick={() => scrollToSection('skills')} className="hover:text-blue-400 transition-colors cursor-pointer">{t('navigation.skills')}</button>
              <button onClick={() => scrollToSection('projects')} className="hover:text-blue-400 transition-colors cursor-pointer">{t('navigation.projects')}</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-blue-400 transition-colors cursor-pointer">{t('navigation.contact')}</button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-16">
        <div className="hero-background absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-purple-900/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="hero-greeting text-lg md:text-xl text-gray-300 mb-4">
              {t('hero.greeting')}
            </p>
            <h1 id="hero-name" className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white hero-name-shine">
              Arnau Sala
            </h1>
            <h2 className="hero-title text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4">
              {t('hero.title')}
            </h2>
            <p className="hero-description text-base md:text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
              {t('hero.description')}
            </p>
            <p className="hero-location text-sm md:text-base text-blue-400 mb-8 flex items-center justify-center gap-2">
              <img src={getAssetPath('/icons/Location.png')} alt="Location" className="w-4 h-4 location-pin" />
              <span className="location-text">{t('hero.location')}</span>
            </p>
            
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                {t('hero.viewProjects')}
              </button>
              <a
                href="/portfolio/cv/Arnau_Sala_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105"
              >
                {t('hero.viewResume')}
              </a>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-8 py-3 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 rounded-full font-medium transition-all duration-300 cursor-pointer"
              >
                {t('hero.getInTouch')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-none">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">{t('about.title')}</h2>
            
            <div className="grid lg:grid-cols-3 gap-12 items-center justify-items-center">
              {/* Profile Image */}
              <div className="about-image-container flex justify-center">
                <div className="relative group">
                  <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-1">
                    <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src={getAssetPath('/icons/draw.jpg')} 
                        alt="Arnau Sala Araujo" 
                        className="w-72 h-72 object-contain rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* About Text */}
              <div className="about-text-content text-center space-y-6">
                <p className="text-lg text-gray-300 leading-relaxed max-w-lg mx-auto">
                  {t('about.description')}
                </p>
              </div>

              {/* Education Card */}
              <div className="about-education-card flex justify-center w-full">
                <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/10 relative group">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-blue-400 mb-2">{t('about.education')}</h3>
                    <div className="w-24 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="font-semibold text-white">{t('about.degree')}</h4>
                      <span className="text-blue-400 text-xs">
                        {t('about.current')}
                      </span>
                    </div>
                    <p className="text-gray-300">{t('about.university')}</p>
                    <div className="flex items-center gap-2 text-sm text-blue-400">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>{t('about.graduation')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="skills-title text-3xl md:text-4xl font-bold mb-12 text-center">{t('skills.title')}</h2>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="skills-main-section space-y-8">
                <h3 className="skills-main-title text-2xl font-semibold text-blue-400 mb-6 flex items-center gap-2">
                  <img src={getAssetPath('/icons/main.png')} alt="Target" className="w-8 h-8" />
                  {t('skills.mainTech')}
                </h3>
                
                <div className="space-y-6">
                  {[
                    { name: 'Java', level: 85, icon: getAssetPath('/icons/java.png') },
                    { name: 'Python', level: 90, icon: getAssetPath('/icons/python.png') },
                    { name: 'C++', level: 85, icon: getAssetPath('/icons/c++.png') },
                    { name: 'C', level: 95, icon: getAssetPath('/icons/c.png') }
                  ].map((skill, index) => (
                    <div key={skill.name} className={`skill-item skill-main-${index}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img src={skill.icon} alt={skill.name} className="w-6 h-6" />
                          <span className="font-medium text-white">{skill.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="skill-progress-main h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ '--progress': `${skill.level}%` } as React.CSSProperties}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="skills-additional-section space-y-8">
                <h3 className="skills-additional-title text-2xl font-semibold text-purple-400 mb-6 flex items-center gap-2">
                  <img src={getAssetPath('/icons/secondary.png')} alt="Additional Tech" className="w-8 h-8" />
                  {t('skills.additionalTech')}
                </h3>
                
                <div className="space-y-6">
                  {[
                    { name: 'JavaScript', level: 70, icon: getAssetPath('/icons/JavaScript.png') },
                    { name: 'SQL', level: 75, icon: getAssetPath('/icons/sql-icon.png') },
                    { name: 'HTML', level: 70, icon: getAssetPath('/icons/html.png') },
                    { name: 'CSS', level: 70, icon: getAssetPath('/icons/css.png') },
                    { name: 'CUDA', level: 75, icon: getAssetPath('/icons/nvidia.png') },
                    { name: 'MATLAB', level: 65, icon: getAssetPath('/icons/matlab.png') }
                  ].map((skill, index) => (
                    <div key={skill.name} className={`skill-item skill-additional-${index}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img src={skill.icon} alt={skill.name} className="w-6 h-6" />
                          <span className="font-medium text-white">{skill.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="skill-progress-additional h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ '--progress': `${skill.level}%` } as React.CSSProperties}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="projects-title text-3xl md:text-4xl font-bold mb-6">{t('projects.title')}</h2>
              <p className="projects-description text-xl text-gray-400 max-w-2xl mx-auto">
                {t('projects.description')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: t('projects.passSide.title'),
                  description: t('projects.passSide.description'),
                  tech: t('projects.passSide.tags'),
                  github: 'https://github.com/arnau-sala/pass-side.git',
                  icon: getAssetPath('/icons/chess.png')
                },
                {
                  title: t('projects.examGrader.title'),
                  description: t('projects.examGrader.description'),
                  tech: t('projects.examGrader.tags'),
                  github: 'https://github.com/arnau-sala/exam-grader.git',
                  icon: getAssetPath('/icons/exam.png')
                },
                {
                  title: t('projects.planB.title'),
                  description: t('projects.planB.description'),
                  tech: t('projects.planB.tags'),
                  github: 'https://github.com/arnau-sala/planB.git',
                  icon: getAssetPath('/icons/group.png')
                },
                {
                  title: t('projects.vladijoc.title'),
                  description: t('projects.vladijoc.description'),
                  tech: t('projects.vladijoc.tags'),
                  github: 'https://github.com/ToniOrtizGil/EDA-II.git',
                  icon: getAssetPath('/icons/dices.png')
                }
              ].map((project, index) => (
                <a
                  key={project.title}
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`project-card project-${index} block bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
                >
                  <div className="project-icon w-16 h-16 mb-4 flex items-center justify-center">
                    <img src={project.icon} alt={project.title} className="w-12 h-12" />
                  </div>
                  <h3 className="project-title text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="project-description text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="project-tags flex flex-wrap gap-2">
                    {Array.isArray(project.tech) ? project.tech.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 bg-gray-700 text-blue-400 rounded-full text-sm font-medium">
                        {tech}
                      </span>
                    )) : null}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="contact-title text-3xl md:text-4xl font-bold mb-6">{t('contact.title')}</h2>
            <p className="contact-description text-xl text-gray-400 mb-12 max-w-4xl mx-auto">
              {t('contact.description')}
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=arnausalaaraujo@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card contact-email block bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
              >
                <div className="contact-icon w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img 
                    src={getAssetPath('/icons/email.png')} 
                    alt="Email"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <span className="contact-text text-blue-400">
                  {t('contact.email')}
                </span>
              </a>

              <a 
                href="https://www.linkedin.com/in/arnau-sala-araujo"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card contact-linkedin block bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
              >
                <div className="contact-icon w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <img 
                    src={getAssetPath('/icons/linkedin.png')} 
                    alt="LinkedIn"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <span className="contact-text text-blue-400">
                  {t('contact.linkedin')}
                </span>
              </a>

              <a 
                href="https://github.com/arnau-sala"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card contact-github block bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
              >
                <div className="contact-icon w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="contact-text text-blue-400">
                  {t('contact.github')}
                </span>
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}