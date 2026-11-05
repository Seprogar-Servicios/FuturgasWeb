import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPinIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { ProjectItem, ProjectsSectionContent } from '../../types/content';

type Props = {
  content: ProjectsSectionContent;
  projects: ProjectItem[];
};

export default function Projects({ content, projects }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const selected = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [projects, selectedId]
  );

  const gallery = useMemo(() => {
    if (!selected) return [];
    if (selected.images?.length) return selected.images;
    if (selected.cover_image) {
      return [
        {
          id: `${selected.id}-cover`,
          project_id: selected.id,
          image_url: selected.cover_image,
          alt_text: selected.title,
          display_order: 0,
        },
      ];
    }
    return [];
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null);
      if (event.key === 'ArrowRight' && gallery.length > 1) {
        setLightboxIndex((prev) => (prev + 1) % gallery.length);
      }
      if (event.key === 'ArrowLeft' && gallery.length > 1) {
        setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, gallery.length]);

  function openProject(project: ProjectItem) {
    setSelectedId(project.id);
    setLightboxIndex(0);
  }

  return (
    <section id="obras" className="relative py-14 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-7 max-w-2xl md:mb-8">
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
          {projects.some((p) => p.is_demo) && (
            <p className="mt-3 inline-flex rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              Vista de ejemplo · estas obras son demostrativas
            </p>
          )}
        </div>

        {!projects.length ? (
          <div className="rounded-2xl border border-theme bg-surface px-6 py-10 text-center text-muted">
            {content.empty_message || 'Pronto vas a poder ver aquí nuestras obras publicadas.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.map((project, index) => {
              const previewImages =
                project.images?.slice(0, 3) ||
                (project.cover_image
                  ? [
                      {
                        id: `${project.id}-c`,
                        project_id: project.id,
                        image_url: project.cover_image,
                        alt_text: project.title,
                        display_order: 0,
                      },
                    ]
                  : []);

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.05, 0.2) }}
                  className="overflow-hidden rounded-2xl border border-theme bg-surface transition-colors hover:border-brand/35"
                >
                  <button
                    type="button"
                    onClick={() => openProject(project)}
                    className="block w-full text-left"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {project.cover_image ? (
                        <img
                          src={project.cover_image}
                          alt={project.title}
                          className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted">
                          Sin imagen
                        </div>
                      )}
                      {project.is_demo && (
                        <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                          Ejemplo
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      {project.category && (
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand">
                          {project.category}
                        </p>
                      )}
                      <h3 className="font-display mb-2 text-xl font-bold text-foreground">
                        {project.title}
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-muted">{project.description}</p>

                      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted">
                        {project.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5" />
                            {project.location}
                          </span>
                        )}
                        {project.completion_date && (
                          <span>
                            {new Date(project.completion_date).toLocaleDateString('es-AR', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>

                      {previewImages.length > 0 && (
                        <div className="flex items-center gap-2">
                          {previewImages.map((image) => (
                            <img
                              key={image.id}
                              src={image.image_url}
                              alt={image.alt_text || project.title}
                              className="h-14 w-14 rounded-xl border border-theme object-cover"
                            />
                          ))}
                          <span className="ml-auto text-xs font-semibold text-brand">
                            Ver obra y galería →
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-theme bg-surface shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-theme bg-surface/95 px-5 py-4 backdrop-blur">
                <div>
                  {selected.category && (
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand">
                      {selected.category}
                    </p>
                  )}
                  <h3 className="font-display text-xl font-bold text-foreground md:text-2xl">
                    {selected.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-full border border-theme p-2 text-foreground transition hover:border-brand/40 hover:text-brand"
                  aria-label="Cerrar"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <p className="text-sm leading-relaxed text-muted md:text-base">{selected.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted">
                  {selected.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPinIcon className="h-4 w-4 text-brand" />
                      {selected.location}
                    </span>
                  )}
                  {selected.completion_date && (
                    <span>
                      {new Date(selected.completion_date).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>

                {gallery.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                      Galería de la obra
                    </p>

                    <div className="relative overflow-hidden rounded-2xl border border-theme bg-slate-100 dark:bg-slate-900">
                      <img
                        src={gallery[lightboxIndex]?.image_url}
                        alt={gallery[lightboxIndex]?.alt_text || selected.title}
                        className="max-h-[420px] w-full object-cover"
                      />
                      {gallery.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/70"
                            onClick={() =>
                              setLightboxIndex(
                                (prev) => (prev - 1 + gallery.length) % gallery.length
                              )
                            }
                            aria-label="Imagen anterior"
                          >
                            <ChevronLeftIcon className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/70"
                            onClick={() =>
                              setLightboxIndex((prev) => (prev + 1) % gallery.length)
                            }
                            aria-label="Imagen siguiente"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                      {gallery.map((image, index) => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => setLightboxIndex(index)}
                          className={`overflow-hidden rounded-xl border transition ${
                            index === lightboxIndex
                              ? 'border-brand ring-2 ring-brand/30'
                              : 'border-theme hover:border-brand/40'
                          }`}
                        >
                          <img
                            src={image.image_url}
                            alt={image.alt_text || selected.title}
                            className="aspect-square w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
