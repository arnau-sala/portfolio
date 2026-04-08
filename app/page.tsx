'use client';

import { useEffect, useRef, useState } from 'react';
import LanguageSelector from '../src/components/LanguageSelector';
import { LimelightNav } from '../src/components/LimelightNav';
import { RainingLettersBackground, ScrambledText } from '../src/components/RainingLetters';
import { HoverGlowButton } from '../src/components/ui/HoverGlowButton';
import { SkillClipCard } from '../src/components/ui/SkillClipCard';
import { GlowCard } from '../src/components/ui/spotlight-card';
import { useLanguage } from '../src/contexts/LanguageContext';
import { getAssetPath } from '../src/utils/paths';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'contact'] as const;

// ── Skills Bento Grid ───────────────────────────────────────
// size: 1 (smallest) → 5 (largest)
const BENTO_SKILLS = [
  { name: 'HTML',       iconPath: '/icons/html.png',       size: 3, area: 'ht' },
  { name: 'CSS',        iconPath: '/icons/css.png',        size: 3, area: 'cs' },
  { name: 'C++',        iconPath: '/icons/c++.png',        size: 4, area: 'cp' },
  { name: 'JavaScript', iconPath: '/icons/JavaScript.png', size: 3, area: 'js' },
  { name: 'Git',        iconPath: '/icons/git.png',        size: 3, area: 'gi' },
  { name: 'CUDA',       iconPath: '/icons/cuda.png',     size: 1, area: 'cu' },
  { name: 'Java',       iconPath: '/icons/java.png',       size: 4, area: 'ja' },
  { name: 'React',      iconPath: '/icons/react.png',      size: 4, area: 're' },
  { name: 'Python',     iconPath: '/icons/python.png',     size: 5, area: 'py' },
  { name: 'Docker',     iconPath: '/icons/docker.png',     size: 2, area: 'dk' },
  { name: 'MATLAB',     iconPath: '/icons/matlab.png',     size: 1, area: 'ma' },
  { name: 'SQL',        iconPath: '/icons/sql.png',        size: 4, area: 'sq' },
  { name: 'C',          iconPath: '/icons/c.png',          size: 4, area: 'cc' },
];
const SKILL_ICONS_VERSION = '20260401';

type SkillSize = 1 | 2 | 3 | 4 | 5;

const SIZE_STYLES: Record<SkillSize, { span: string; border: string }> = {
  5: { span: 'col-span-6 row-span-6', border: 'border-gold-400/24 hover:border-gold-400/38 shadow-[0_0_20px_rgba(201,164,78,0.1)]' },
  4: { span: 'col-span-4 row-span-4', border: 'border-gold-400/24 hover:border-gold-400/38 shadow-[0_0_20px_rgba(201,164,78,0.1)]' },
  3: { span: 'col-span-3 row-span-3', border: 'border-gold-400/24 hover:border-gold-400/38 shadow-[0_0_20px_rgba(201,164,78,0.1)]' },
  2: { span: 'col-span-2 row-span-2', border: 'border-gold-400/24 hover:border-gold-400/38 shadow-[0_0_20px_rgba(201,164,78,0.1)]' },
  1: { span: 'col-span-2 row-span-2', border: 'border-gold-400/24 hover:border-gold-400/38 shadow-[0_0_20px_rgba(201,164,78,0.1)]' },
};
// ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const { t, isLoading, currentLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [showNavName, setShowNavName] = useState(false);
  const [activeMobileSkill, setActiveMobileSkill] = useState<string | null>(null);
  const scrollLockRef = useRef(false);
  const scrollLockTimer = useRef<ReturnType<typeof setTimeout>>(null);
  
  const getResumeUrl = () => {
    return getAssetPath(`/Resume/resume_${currentLanguage}.pdf`);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    scrollLockRef.current = true;
    if (scrollLockTimer.current) clearTimeout(scrollLockTimer.current);
    scrollLockTimer.current = setTimeout(() => { scrollLockRef.current = false; }, 900);

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
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
    const ANIM_SELECTORS: Record<string, string> = {
      about:    '.about-title, .about-image-container, .about-text-content, .about-education-card',
      skills:   '.skills-title, .skills-main-section',
      projects: '.projects-title, .projects-description, .project-card',
      contact:  '.contact-title, .contact-description, .contact-email, .contact-linkedin, .contact-github',
    };

    const setAnimate = (parent: Element, selectors: string, on: boolean) => {
      parent.querySelectorAll(selectors).forEach(el => {
        if (on) el.classList.add('animate');
        else el.classList.remove('animate');
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const section = entry.target;
        const sel = ANIM_SELECTORS[section.id];
        if (!sel) return;

        if (entry.intersectionRatio >= 0.15) {
          section.classList.add('section-visible');
          setAnimate(section, sel, true);
        } else if (!entry.isIntersecting) {
          setAnimate(section, sel, false);
        }
      });
    }, { threshold: [0, 0.15] });

    document.querySelectorAll('#about, #skills, #projects, #contact')
      .forEach(s => observer.observe(s));

    const handleScroll = () => {
      // Generic scroll-triggered elements
      document.querySelectorAll('.fade-in-scroll, .slide-in-left-scroll, .slide-in-up-scroll, .slide-in-right-scroll')
        .forEach(el => {
          const r = el.getBoundingClientRect();
          const inView = r.top < window.innerHeight * 0.8 && r.bottom > 0;
          if (inView) el.classList.add('animate');
          else el.classList.remove('animate');
        });

      // Section-specific enter/exit — only exit when fully off-screen
      for (const [id, sel] of Object.entries(ANIM_SELECTORS)) {
        const section = document.getElementById(id);
        if (!section) continue;
        const r = section.getBoundingClientRect();
        const shouldEnter = r.top < window.innerHeight * 0.75 && r.bottom > window.innerHeight * 0.2;
        const fullyGone = r.bottom < 0 || r.top > window.innerHeight;

        if (shouldEnter) setAnimate(section, sel, true);
        else if (fullyGone) {
          setAnimate(section, sel, false);
          if (id === 'skills') setActiveMobileSkill(null);
        }
      }

      // Scroll spy
      if (!scrollLockRef.current) {
        const mid = window.innerHeight / 2;
        let current = 'home';
        for (const id of SECTION_IDS) {
          if (id === 'home') continue;
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= mid) {
            current = id;
          }
        }
        setActiveSection(current);
      }

      // Show name in navbar once the hero name scrolls behind the bar
      const heroName = document.getElementById('hero-name');
      if (heroName) {
        setShowNavName(heroName.getBoundingClientRect().bottom < 70);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <p className="text-warm-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-950 text-white">

      {/* Frosted band behind the floating header gap */}
      <div className="fixed top-0 left-0 right-0 h-16 z-40 backdrop-blur-md pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(12,10,16,0.95) 0%, rgba(12,10,16,0.7) 60%, transparent 100%)' }} />

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="fixed top-3 left-2 right-2 md:left-4 md:right-4 z-50 bg-warm-900/80 backdrop-blur-xl border border-gold-400/20 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4),0_0_30px_rgba(201,164,78,0.12),0_0_2px_rgba(201,164,78,0.3)]">
        <nav className="px-3 py-2 md:px-5 md:py-3">
          <div className="flex items-center justify-between">
            {/* Left — Language selector */}
            <div className="hidden md:block min-w-[140px]">
              <LanguageSelector />
            </div>
            <div className="md:hidden">
              <LanguageSelector compact />
            </div>

            {/* Center — Name (desktop only, appears when hero name scrolls behind bar) */}
            <div
              className="hidden md:block text-xl font-bold text-gold-400 tracking-wide absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
              style={{
                opacity: showNavName ? 1 : 0,
                transform: showNavName ? 'rotateX(0deg)' : 'rotateX(-90deg)',
                transformOrigin: 'top center',
                perspective: '300px',
                pointerEvents: showNavName ? 'auto' : 'none',
              }}
            >
              <button
                onClick={() => scrollToSection('home')}
                className="cursor-pointer"
                style={{ display: 'inline-block', perspective: '300px' }}
              >
                Arnau Sala
              </button>
            </div>

            {/* Right — Section nav: text on desktop, icons on mobile */}
            <div className="hidden md:block">
              <LimelightNav
                items={SECTION_IDS.map(id => ({ id, label: t(`navigation.${id}`) }))}
                activeIndex={SECTION_IDS.indexOf(activeSection as typeof SECTION_IDS[number])}
                onItemClick={(_, id) => scrollToSection(id)}
              />
            </div>
            <div className="md:hidden">
              <LimelightNav
                items={[
                  { id: 'home', label: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
                  { id: 'about', label: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                  { id: 'skills', label: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
                  { id: 'projects', label: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> },
                  { id: 'contact', label: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> },
                ]}
                activeIndex={SECTION_IDS.indexOf(activeSection as typeof SECTION_IDS[number])}
                onItemClick={(_, id) => scrollToSection(id)}
                size="sm"
              />
            </div>
          </div>
        </nav>
      </header>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="min-h-screen flex items-center justify-center relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-warm-950" />

        {/* Golden ambient spotlight */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 90% 55% at 50% 15%, rgba(201,164,78,0.07) 0%, transparent 70%)' }}
        />

        <RainingLettersBackground />

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(12,10,16,0.88) 0%, rgba(12,10,16,0.45) 70%, transparent 100%)' }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="hero-greeting text-lg md:text-xl text-[#cdbf99] mb-4">
              {t('hero.greeting')}
            </p>
            <div id="hero-name">
              <ScrambledText
                text="Arnau Sala"
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#f6f0de] via-[#f3dfaa] to-[#cfab57] bg-clip-text text-transparent tracking-wider uppercase drop-shadow-[0_0_18px_rgba(201,164,78,0.25)]"
                delay={400}
              />
            </div>
            <h2 className="hero-title text-xl md:text-2xl lg:text-3xl text-[#ddd1b0] mb-4">
              {t('hero.title')}
            </h2>
            <p className="hero-description text-base md:text-lg text-[#b9ab85] mb-6 max-w-2xl mx-auto">
              {t('hero.description')}
            </p>
            <p className="hero-location text-sm md:text-base text-[#caa85d] mb-8 flex items-center justify-center gap-2">
              <img src={getAssetPath('/icons/Location.png')} alt="Location" className="w-4 h-4 location-pin" />
              <span className="location-text">{t('hero.location')}</span>
            </p>
            
            <div className="hero-buttons flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <HoverGlowButton
                onClick={() => window.open(getResumeUrl(), '_blank', 'noopener,noreferrer')}
                glowColor="rgba(248, 217, 135, 0.55)"
                background="linear-gradient(90deg, #b8902d 0%, #d1ac43 50%, #b8902d 100%)"
                textColor="#1b1509"
                className="w-[min(88vw,390px)] px-6 py-3.5 rounded-full font-semibold transition-colors duration-300 text-sm sm:text-base shadow-[0_8px_24px_rgba(201,164,78,0.2)] text-center"
              >
                {t('hero.viewResume')}
              </HoverGlowButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Section ──────────────────────────────────── */}
      <section id="about" className="py-12 md:py-20 bg-warm-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-none">
            <h2 className="about-title text-3xl md:text-4xl font-bold mb-8 md:mb-16 text-center text-warm-50">{t('about.title')}</h2>
            
            <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-center justify-items-center">

              {/* About Text — shows first on mobile, left column on desktop */}
              <div className="about-text-content order-2 lg:order-1 text-center">
                <GlowCard customSize className="w-full rounded-2xl">
                  <div className="p-6 lg:p-8 rounded-2xl">
                    <p className="text-base lg:text-lg text-warm-200 leading-relaxed">
                      {t('about.description')}
                    </p>
                  </div>
                </GlowCard>
              </div>

              {/* Profile Image — shows first on mobile, center on desktop */}
              <div className="about-image-container order-1 lg:order-2 flex justify-center">
                <div className="relative group">
                  <div
                    className="w-52 h-52 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full p-[3px]"
                    style={{ background: 'linear-gradient(135deg, #c9a44e, #7a6428, #c9a44e)' }}
                  >
                    <div
                      className="w-full h-full bg-warm-900 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ boxShadow: '0 0 50px rgba(201,164,78,0.18), 0 0 100px rgba(201,164,78,0.06)' }}
                    >
                      <img 
                        src={getAssetPath('/icons/draw.png')} 
                        alt="Arnau Sala Araujo" 
                        className="w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 object-contain rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Card */}
              <div className="about-education-card order-3 flex justify-center w-full">
                <GlowCard customSize className="w-full max-w-[380px] rounded-2xl">
                  <div className="p-6 lg:p-8 rounded-2xl relative group">
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="font-semibold text-warm-100">{t('about.degree')}</h4>
                      <span className="text-gold-400 text-xs font-medium tracking-wide uppercase">
                        {t('about.current')}
                      </span>
                    </div>
                    <p className="text-warm-300">{t('about.university')}</p>
                    <div className="text-sm text-warm-300 space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-warm-200">{t('about.exchange')}</span>
                        <span className="text-xs text-warm-400">{t('about.exchangePeriod')}</span>
                      </div>
                      <p className="text-warm-300">{t('about.exchangeUniversity')}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gold-400">
                      <div className="w-2 h-2 bg-gold-400 rounded-full" />
                      <span>{t('about.graduation')}</span>
                    </div>
                  </div>
                  </div>
                </GlowCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills Section ─────────────────────────────────── */}
      <section id="skills" className="py-12 md:py-20 bg-warm-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="skills-title text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-warm-50">
              {t('skills.title')}
            </h2>

            <div className="skills-main-section">
              <div className="skills-bento">
                {BENTO_SKILLS.map(skill => {
                  const s = SIZE_STYLES[skill.size as SkillSize];
                  return (
                    <SkillClipCard
                      key={skill.name}
                      id={skill.name}
                      name={skill.name}
                      iconSrc={getAssetPath(`${skill.iconPath}?v=${SKILL_ICONS_VERSION}`)}
                      iconAlt={skill.name}
                      isActive={activeMobileSkill === skill.name}
                      onToggle={(id) => setActiveMobileSkill(prev => (prev === id ? null : id))}
                      className={`bento-card bento-${skill.area} bento-size-${skill.size} ${s.span} bg-warm-800/45 border ${s.border} rounded-2xl backdrop-blur-sm flex items-center justify-center transition-all duration-300 p-1 relative overflow-hidden`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects Section ───────────────────────────────── */}
      <section id="projects" className="py-12 md:py-20 bg-warm-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="projects-title text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-warm-50">{t('projects.title')}</h2>
              <p className="projects-description text-base md:text-xl text-warm-400 max-w-2xl mx-auto">
                {t('projects.description')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {[
                {
                  title: t('projects.passSide.title'),
                  description: t('projects.passSide.description'),
                  tech: t('projects.passSide.tags'),
                  github: 'https://github.com/arnau-sala/pass-side.git',
                  icon: getAssetPath('/icons/pass-side.png'),
                  launchUrl: 'https://arnau-sala.github.io/pass-side/'
                },
                {
                  title: t('projects.movieMatch.title'),
                  description: t('projects.movieMatch.description'),
                  tech: t('projects.movieMatch.tags'),
                  github: 'https://github.com/arnau-sala/MovieMatch.git',
                  icon: getAssetPath('/icons/moviematch.png'),
                  launchUrl: 'https://movie-matchr.streamlit.app/'
                },
                {
                  title: t('projects.examGrader.title'),
                  description: t('projects.examGrader.description'),
                  tech: t('projects.examGrader.tags'),
                  github: 'https://github.com/arnau-sala/exam-grader.git',
                  icon: getAssetPath('/icons/exam.png')
                },
                {
                  title: t('projects.vladijoc.title'),
                  description: t('projects.vladijoc.description'),
                  tech: t('projects.vladijoc.tags'),
                  github: 'https://github.com/arnau-sala/study-spark.git',
                  icon: getAssetPath('/icons/studyspark.png')
                }
              ].map((project, index) => (
                <GlowCard key={index} customSize className={`project-card project-${index} rounded-2xl`}>
                  <div
                    role="link"
                    tabIndex={0}
                    onClick={() => window.open(project.github, '_blank', 'noopener,noreferrer')}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open(project.github, '_blank', 'noopener,noreferrer'); } }}
                    className="block rounded-2xl p-6 transition-all duration-300 cursor-pointer relative"
                  >
                  <div className="project-icon w-14 h-14 mb-4 flex items-center justify-center">
                    <img src={project.icon} alt={project.title} className="w-11 h-11" />
                  </div>
                  <h3 className="project-title text-lg font-bold text-warm-100 mb-3">{project.title}</h3>
                  <p className="project-description text-warm-300 mb-4 leading-relaxed text-sm">{project.description}</p>
                  
                  <div className={`project-tags flex flex-wrap gap-2 ${project.launchUrl ? 'pr-16 sm:pr-24' : ''}`}>
                    {Array.isArray(project.tech) ? project.tech.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 bg-warm-700/50 text-gold-400 rounded-full text-xs font-medium border border-warm-600/30">
                        {tech}
                      </span>
                    )) : null}
                  </div>

                  {(index === 0 || index === 1) && project.launchUrl && (
                    <a
                      href={project.launchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-6 right-6 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gold-500 text-warm-950 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/60 focus:ring-offset-0 transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      {currentLanguage === 'es' ? 'Iniciar' : currentLanguage === 'ca' ? 'Inicia' : 'Launch'}
                    </a>
                  )}
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Section ────────────────────────────────── */}
      <section id="contact" className="py-12 md:py-20 bg-warm-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="contact-title text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-warm-50">{t('contact.title')}</h2>
            <p className="contact-description text-base md:text-xl text-warm-400 mb-8 md:mb-12 max-w-4xl mx-auto">
              {t('contact.description')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
              <GlowCard customSize className="contact-card contact-email rounded-2xl">
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=arnausalaaraujo@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-8 rounded-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className="contact-icon w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <img 
                      src={getAssetPath('/icons/email.png')} 
                      alt="Email"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <span className="contact-text text-gold-400 font-medium text-sm">
                    {t('contact.email')}
                  </span>
                </a>
              </GlowCard>

              <GlowCard customSize className="contact-card contact-linkedin rounded-2xl">
                <a 
                  href="https://www.linkedin.com/in/arnau-sala-araujo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-8 rounded-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className="contact-icon w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <img 
                      src={getAssetPath('/icons/linkedin.png')} 
                      alt="LinkedIn"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <span className="contact-text text-gold-400 font-medium text-sm">
                    {t('contact.linkedin')}
                  </span>
                </a>
              </GlowCard>

              <GlowCard customSize className="contact-card contact-github rounded-2xl">
                <a 
                  href="https://github.com/arnau-sala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-8 rounded-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className="contact-icon w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="contact-text text-gold-400 font-medium text-sm">
                    {t('contact.github')}
                  </span>
                </a>
              </GlowCard>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
