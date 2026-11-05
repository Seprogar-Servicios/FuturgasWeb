import { useEffect, useState, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useSiteData } from '../../contexts/SiteDataContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ThemeToggle';
import { scrollToSection } from '../../lib/scroll';

const iconByHref: Record<string, typeof HomeIcon> = {
  '#inicio': HomeIcon,
  '#nosotros': UsersIcon,
  '#servicios': WrenchScrewdriverIcon,
  '#equipo': UserGroupIcon,
  '#galeria': PhotoIcon,
  '#contacto': ChatBubbleLeftRightIcon,
};

function sectionHref(hash: string, pathname: string) {
  return pathname === '/' ? hash : `/${hash}`;
}

export default function Header() {
  const { data } = useSiteData();
  const { isDark } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#inicio');
  const navigation = data.navigation.filter((item) => item.is_visible);
  const logo = data.settings.logo_url || '/futurgas.png';
  const siteName = data.settings.site_name || 'Futurgas';
  const onHome = location.pathname === '/';
  const overDarkHero = onHome && !scrolled && isDark;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (!onHome) return;

      const sections = document.querySelectorAll('section[id]');
      let current = '#inicio';
      sections.forEach((section) => {
        const el = section as HTMLElement;
        const top = el.offsetTop - 120;
        const id = el.getAttribute('id');
        if (id && window.scrollY >= top && window.scrollY < top + el.offsetHeight) {
          current = `#${id}`;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [onHome]);

  function handleSectionClick(event: MouseEvent<HTMLAnchorElement>, hash: string) {
    if (location.pathname !== '/') return;
    event.preventDefault();
    scrollToSection(hash);
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', `/${hash}`);
    }
    setMenuOpen(false);
  }

  const linkIdle = overDarkHero
    ? 'text-white/90 hover:text-white'
    : 'text-foreground/80 hover:text-brand';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-theme bg-surface/90 py-2 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl'
          : overDarkHero
            ? 'bg-gradient-to-b from-black/35 to-transparent py-4'
            : 'bg-gradient-to-b from-white/70 to-transparent py-4 backdrop-blur-[2px]'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link
          to="/#inicio"
          className="flex items-center gap-3"
          onClick={(e) => handleSectionClick(e, '#inicio')}
        >
          <img src={logo} alt={`${siteName} logo`} className="h-10 w-auto" />
          <span
            className={`font-display hidden text-lg font-bold tracking-tight sm:inline ${
              overDarkHero ? 'text-white' : 'text-foreground'
            }`}
          >
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
          {navigation.map((item) => {
            const Icon = iconByHref[item.url] || HomeIcon;
            const active = onHome && activeSection === item.url;
            return (
              <div key={item.id} className="relative">
                <Link
                  to={sectionHref(item.url, location.pathname)}
                  onClick={(e) => handleSectionClick(e, item.url)}
                  className={`flex items-center px-2.5 py-2 text-sm font-semibold transition-colors ${
                    active ? 'text-brand' : linkIdle
                  }`}
                >
                  <Icon className="mr-1.5 hidden h-4 w-4 opacity-80 xl:inline" />
                  {item.label}
                </Link>
                {active ? (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-brand"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                ) : null}
              </div>
            );
          })}
          <ThemeToggle lightOnDark={overDarkHero} />
          <Link
            to={sectionHref('#contacto', location.pathname)}
            onClick={(e) => handleSectionClick(e, '#contacto')}
            className="btn-brand ml-1 !px-5 !py-2.5 text-sm"
          >
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle lightOnDark={overDarkHero} />
          <button
            type="button"
            className={`rounded-full p-2 transition ${
              overDarkHero ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-black/5'
            }`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Menú de navegación"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden lg:hidden"
          >
            <div className="container mx-auto px-4 pb-3">
              <div className="mt-3 space-y-1 rounded-2xl border border-theme bg-surface/95 p-3 shadow-xl backdrop-blur-xl">
                {navigation.map((item) => {
                  const Icon = iconByHref[item.url] || HomeIcon;
                  const active = onHome && activeSection === item.url;
                  return (
                    <Link
                      key={item.id}
                      to={sectionHref(item.url, location.pathname)}
                      onClick={(e) => handleSectionClick(e, item.url)}
                      className={`flex items-center rounded-xl px-4 py-3 transition ${
                        active
                          ? 'bg-brand/12 font-semibold text-brand'
                          : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  to={sectionHref('#contacto', location.pathname)}
                  onClick={(e) => handleSectionClick(e, '#contacto')}
                  className="btn-brand mt-2 w-full"
                >
                  Solicitar presupuesto
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
