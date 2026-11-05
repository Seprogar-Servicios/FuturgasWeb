import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FireIcon, PhoneIcon, ChevronRightIcon, MapPinIcon } from '@heroicons/react/24/solid';
import type { HeroContent } from '../../types/content';
import { useSiteData } from '../../contexts/SiteDataContext';
import { useTheme } from '../../contexts/ThemeContext';

const ROTATING_WORDS = ['obra', 'vivienda', 'local', 'edificio', 'comercio'];

type Props = { content: HeroContent };

function headlineWithHighlight(
  headline: string,
  highlight: string | undefined,
  baseClass: string
): ReactNode {
  if (!highlight?.trim()) {
    return <span className={baseClass}>{headline}</span>;
  }

  const needle = highlight.trim();
  const index = headline.toLowerCase().indexOf(needle.toLowerCase());
  if (index === -1) {
    return <span className={baseClass}>{headline}</span>;
  }

  const before = headline.slice(0, index);
  const match = headline.slice(index, index + needle.length);
  const after = headline.slice(index + needle.length);

  return (
    <span className={baseClass}>
      {before}
      <span className="text-gradient-brand">{match}</span>
      {after}
    </span>
  );
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href) || href.includes('wa.me');
}

export default function Hero({ content }: Props) {
  const { data } = useSiteData();
  const { isDark } = useTheme();
  const [wordIndex, setWordIndex] = useState(0);
  const brand = data.settings.site_name || 'Futurgas';
  const logo = data.settings.logo_url || '/futurgas.png';
  const whatsapp = data.settings.whatsapp || '5491136250298';

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  const currentWord = ROTATING_WORDS[wordIndex];
  const titleClass = isDark ? 'text-white' : 'text-navy';

  const secondaryHref = useMemo(() => {
    const href = content.secondary_cta?.href?.trim();
    if (!href) return `https://wa.me/${whatsapp}`;
    if (href.toLowerCase() === 'whatsapp') return `https://wa.me/${whatsapp}`;
    return href;
  }, [content.secondary_cta?.href, whatsapp]);

  const secondaryExternal = isExternalHref(secondaryHref);

  return (
    <section
      id="inicio"
      className={`relative flex min-h-[92svh] items-center justify-center overflow-hidden pb-12 pt-24 transition-colors duration-500 md:min-h-[100svh] md:pb-14 ${
        isDark ? 'text-white' : 'text-navy'
      }`}
    >
      <div className="absolute inset-0 transition-opacity duration-500">
        {isDark ? (
          <>
            {content.image_url ? (
              <div
                className="absolute inset-0 scale-105 bg-cover bg-center"
                style={{ backgroundImage: `url('${content.image_url}')` }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-br from-[#070b14]/96 via-[#0b1220]/92 to-[#1e3a5f]/88" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.3),transparent_52%)]" />
            <div className="absolute -bottom-24 left-1/2 h-48 w-[80%] -translate-x-1/2 rounded-full bg-brand/25 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#f0f7ff] via-[#f3f7fc] to-[#e7eef8]" />
            {content.image_url ? (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.22]"
                style={{ backgroundImage: `url('${content.image_url}')` }}
              />
            ) : null}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.18),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(30,58,95,0.12),transparent_45%)]" />
            <div className="absolute right-[12%] top-24 h-40 w-40 rounded-full bg-brand/15 blur-3xl" />
            <div className="absolute bottom-16 left-[8%] h-52 w-52 rounded-full bg-navy-mid/12 blur-3xl" />
            <div className="absolute inset-0 mesh-grid opacity-40" />
          </>
        )}
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <motion.img
              src={logo}
              alt={brand}
              className="mx-auto mb-8 h-14 w-auto drop-shadow-lg md:h-16"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            />

            <motion.div
              className={`mb-7 inline-flex items-center justify-center rounded-full border px-5 py-2 backdrop-blur-md ${
                isDark
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-brand/20 bg-white/80 text-navy shadow-sm'
              }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.45 }}
            >
              <FireIcon className="mr-2 h-4 w-4 text-brand" />
              <span className="text-sm font-semibold tracking-wide">
                {content.eyebrow || 'Instalaciones de gas para la construcción'}
              </span>
            </motion.div>

            <motion.h1
              className="font-display mb-4 text-4xl font-extrabold leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.55 }}
            >
              {headlineWithHighlight(content.headline, content.highlight, titleClass)}
            </motion.h1>

            <motion.p
              className={`mb-6 flex flex-wrap items-baseline justify-center gap-x-2 text-xl font-semibold md:text-2xl ${
                isDark ? 'text-white/90' : 'text-navy/85'
              }`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              aria-live="polite"
            >
              <span>Para tu</span>
              <span className="relative inline-flex min-w-[7.5ch] justify-center pb-[0.22em] md:min-w-[9ch]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWord}
                    initial={{ y: '40%', opacity: 0, filter: 'blur(4px)' }}
                    animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: '-35%', opacity: 0, filter: 'blur(4px)' }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 inline-block pb-[0.08em] text-gradient-brand"
                  >
                    {currentWord}
                  </motion.span>
                </AnimatePresence>
                <span
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-[0.12em] rounded-full bg-gradient-to-r from-brand to-brand-light opacity-90"
                  aria-hidden
                />
              </span>
            </motion.p>

            <motion.p
              className={`mx-auto mb-10 max-w-2xl text-lg leading-relaxed md:text-xl ${
                isDark ? 'text-slate-200/90' : 'text-slate-600'
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.55 }}
            >
              {content.subheadline}
            </motion.p>

            <motion.div
              className="flex flex-col justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
            >
              <a href={content.primary_cta.href} className="btn-brand group">
                <span className="relative z-10 flex items-center">
                  {content.primary_cta.label}
                  <ChevronRightIcon className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
              {content.secondary_cta ? (
                <a
                  href={secondaryHref}
                  {...(secondaryExternal
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className={`btn-ghost group ${
                    isDark
                      ? 'border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/18'
                      : 'border-navy/12 bg-white text-navy shadow-md hover:bg-[#f0f7ff]'
                  }`}
                >
                  {secondaryExternal ? <PhoneIcon className="h-4 w-4" /> : null}
                  {content.secondary_cta.label}
                </a>
              ) : null}
            </motion.div>
          </motion.div>

          {!!content.badges?.length && (
            <motion.div
              className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 md:mt-14"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              {content.badges.map((badge) => (
                <motion.div
                  key={badge.label}
                  className={`rounded-2xl border p-5 text-center backdrop-blur-md transition-colors ${
                    isDark
                      ? 'border-white/10 bg-white/5 hover:bg-white/10'
                      : 'border-white/80 bg-white/70 shadow-sm hover:bg-white'
                  }`}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                >
                  <MapPinIcon className="mx-auto mb-2 h-5 w-5 text-brand" />
                  <div className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
                    {badge.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
