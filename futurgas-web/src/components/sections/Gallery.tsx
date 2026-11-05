import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { GallerySectionContent, ProjectItem } from '../../types/content';

type GalleryCard = {
  id: string;
  image_url: string;
  title: string;
  subtitle?: string;
  is_demo?: boolean;
};

type Props = {
  content: GallerySectionContent;
  projects: ProjectItem[];
};

function cardsFromProjects(projects: ProjectItem[]): GalleryCard[] {
  const cards: GalleryCard[] = [];

  for (const project of projects) {
    const list =
      project.images?.length
        ? project.images
        : project.cover_image
          ? [
              {
                id: `${project.id}-cover`,
                image_url: project.cover_image,
                alt_text: project.title,
              },
            ]
          : [];

    for (const image of list) {
      cards.push({
        id: image.id,
        image_url: image.image_url,
        title: project.title,
        subtitle: [project.location, project.category].filter(Boolean).join(' · ') || undefined,
        is_demo: project.is_demo,
      });
    }
  }

  return cards;
}

function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setCount(4);
      else if (w >= 1024) setCount(3);
      else if (w >= 640) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return count;
}

export default function Gallery({ content, projects }: Props) {
  const cards = useMemo(() => cardsFromProjects(projects), [projects]);
  const visible = useVisibleCount();
  const maxIndex = Math.max(0, cards.length - visible);
  const pageCount = maxIndex + 1;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (!cards.length) return;
      setIndex((prev) => {
        const next = prev + delta;
        if (next < 0) return maxIndex;
        if (next > maxIndex) return 0;
        return next;
      });
    },
    [cards.length, maxIndex]
  );

  useEffect(() => {
    setIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (pageCount < 2 || paused || lightboxIndex !== null) return;
    const id = window.setInterval(() => go(1), 5000);
    return () => window.clearInterval(id);
  }, [pageCount, paused, lightboxIndex, go]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? prev : (prev + 1) % cards.length
        );
      }
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? prev : (prev - 1 + cards.length) % cards.length
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, cards.length]);

  const showDemoBadge = cards.some((card) => card.is_demo);

  return (
    <section id="galeria" className="relative overflow-hidden py-14 md:py-16">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-8 max-w-2xl md:mb-10">
          {content.eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              {content.eyebrow}
            </p>
          )}
          <h2 className="font-display mb-2 text-3xl font-extrabold text-foreground md:text-4xl">
            {content.headline}
          </h2>
          {content.subheadline && (
            <p className="text-sm leading-relaxed text-muted md:text-base">{content.subheadline}</p>
          )}
          {showDemoBadge && (
            <p className="mt-3 inline-flex rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              Vista de ejemplo · contenido demostrativo
            </p>
          )}
        </div>

        {!cards.length ? (
          <div className="rounded-2xl border border-theme bg-surface px-6 py-10 text-center text-muted">
            {content.empty_message || 'Pronto vas a ver aquí fotos de nuestros trabajos.'}
          </div>
        ) : (
          <div
            className="relative px-8 md:px-12"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setPaused(false);
              }
            }}
          >
            {pageCount > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-0 top-[38%] z-20 -translate-y-1/2 rounded-full border border-theme bg-surface p-1.5 text-foreground/70 shadow-sm transition hover:border-brand/35 hover:text-brand md:top-[42%]"
                  aria-label="Anterior"
                >
                  <ChevronLeftIcon className="h-7 w-7 stroke-[2]" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-0 top-[38%] z-20 -translate-y-1/2 rounded-full border border-theme bg-surface p-1.5 text-foreground/70 shadow-sm transition hover:border-brand/35 hover:text-brand md:top-[42%]"
                  aria-label="Siguiente"
                >
                  <ChevronRightIcon className="h-7 w-7 stroke-[2]" />
                </button>
              </>
            ) : null}

            <div className="overflow-hidden">
              <motion.div
                className="flex"
                style={{ width: `${(cards.length * 100) / visible}%` }}
                animate={{ x: `-${cards.length ? (index * 100) / cards.length : 0}%` }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              >
                {cards.map((card, cardIndex) => (
                  <div
                    key={card.id}
                    className="shrink-0 px-2 sm:px-3"
                    style={{ width: `${100 / cards.length}%` }}
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(cardIndex)}
                      className="group flex w-full flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    >
                      <div className="aspect-square overflow-hidden rounded-[1.35rem] border border-theme bg-surface shadow-[0_18px_40px_-28px_rgba(15,23,42,0.4)]">
                        <img
                          src={card.image_url}
                          alt={card.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-3 px-0.5">
                        <p className="font-display line-clamp-2 text-sm font-bold text-foreground md:text-base">
                          {card.title}
                        </p>
                        {card.subtitle ? (
                          <p className="mt-1 line-clamp-1 text-xs text-muted md:text-sm">
                            {card.subtitle}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  </div>
                ))}
              </motion.div>
            </div>

            {pageCount > 1 ? (
              <div className="mt-7 flex items-center justify-center gap-2.5">
                {Array.from({ length: pageCount }).map((_, page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setIndex(page)}
                    aria-label={`Ir a página ${page + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      page === index
                        ? 'w-2.5 bg-brand'
                        : 'w-2.5 bg-brand/25 hover:bg-brand/45'
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {lightboxIndex !== null && cards[lightboxIndex] ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/10"
            onClick={() => setLightboxIndex(null)}
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          {cards.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-3 rounded-full p-2 text-white hover:bg-white/10 md:left-6"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null ? prev : (prev - 1 + cards.length) % cards.length
                  )
                }
                aria-label="Anterior"
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </button>
              <button
                type="button"
                className="absolute right-3 rounded-full p-2 text-white hover:bg-white/10 md:right-6"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null ? prev : (prev + 1) % cards.length
                  )
                }
                aria-label="Siguiente"
              >
                <ChevronRightIcon className="h-8 w-8" />
              </button>
            </>
          ) : null}
          <div className="max-w-4xl text-center">
            <img
              src={cards[lightboxIndex].image_url}
              alt={cards[lightboxIndex].title}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
            <p className="mt-3 text-sm font-medium text-white">{cards[lightboxIndex].title}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
