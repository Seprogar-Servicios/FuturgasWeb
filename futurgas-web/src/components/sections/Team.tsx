import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { TeamMember, TeamSectionContent } from '../../types/content';

type Props = {
  content: TeamSectionContent;
  members: TeamMember[];
};

export default function Team({ content, members }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const visible = members.filter((member) => member.is_visible !== false);

  if (!visible.length) return null;

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(280, el.clientWidth * 0.7) * direction;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }

  const showDemoBadge = visible.some((member) => member.is_demo);

  return (
    <section id="equipo" className="section-band relative overflow-hidden py-14 md:py-16">
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-brand-light/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center rounded-full bg-gradient-to-r from-brand to-brand-light px-3 py-1 text-xs font-semibold text-white shadow-brand">
              <UserGroupIcon className="mr-1.5 h-3.5 w-3.5" />
              {content.eyebrow || 'Quiénes somos'}
            </div>
            <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
              {content.headline.includes(' ') ? (
                <>
                  {content.headline.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="text-gradient-brand">
                    {content.headline.split(' ').slice(-1)}
                  </span>
                </>
              ) : (
                content.headline
              )}
            </h2>
            {content.subheadline && (
              <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                {content.subheadline}
              </p>
            )}
            {showDemoBadge && (
              <p className="mt-3 inline-flex rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                Vista de ejemplo · reemplazá por fotos reales desde el panel
              </p>
            )}
          </div>

          {visible.length > 3 ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-theme bg-surface text-foreground transition hover:border-brand/40 hover:text-brand"
                aria-label="Anterior"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-theme bg-surface text-foreground transition hover:border-brand/40 hover:text-brand"
                aria-label="Siguiente"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          ) : null}
        </div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {visible.map((persona, index) => (
            <motion.article
              key={persona.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index * 0.04, 0.24) }}
              className="w-[148px] shrink-0 snap-start text-center sm:w-[168px]"
            >
              <div className="card-lift mx-auto mb-3 h-28 w-28 overflow-hidden rounded-full border-2 border-brand/25 bg-slate-200 shadow-sm dark:bg-slate-800 sm:h-32 sm:w-32">
                {persona.photo_url ? (
                  <img
                    src={persona.photo_url}
                    alt={persona.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-deep to-brand text-2xl font-bold text-white">
                    {persona.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="font-display text-sm font-bold leading-snug text-foreground sm:text-base">
                {persona.name}
              </h3>
              {persona.role ? (
                <p className="mt-1 text-xs leading-snug text-muted">{persona.role}</p>
              ) : null}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
