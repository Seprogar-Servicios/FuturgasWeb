import { motion } from 'framer-motion';
import { MapPinIcon, MapIcon } from '@heroicons/react/24/outline';
import type { CoverageSectionContent } from '../../types/content';

type Props = {
  content: CoverageSectionContent;
  whatsapp?: string | null;
};

export default function Coverage({ content, whatsapp }: Props) {
  const ctaHref =
    content.cta?.href ||
    (whatsapp
      ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
          'Hola Futurgas, quiero consultar si atienden en mi zona.'
        )}`
      : '#contacto');

  return (
    <section id="zonas" className="relative overflow-hidden py-14 md:py-16">
      <div className="absolute inset-0 bg-surface/55" />
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-brand-light/15 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand to-brand-light px-4 py-1.5 text-sm font-semibold text-white">
              <MapIcon className="mr-2 h-4 w-4" />
              {content.eyebrow || 'Cobertura'}
            </div>
            <h2 className="font-display mb-5 text-4xl font-extrabold text-foreground md:text-5xl">
              {content.headline}
            </h2>
            <div className="mb-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-brand to-brand-light" />
            {content.subheadline && (
              <p className="mb-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                {content.subheadline}
              </p>
            )}
            <a
              href={ctaHref}
              target={ctaHref.startsWith('http') ? '_blank' : undefined}
              rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="btn-brand"
            >
              {content.cta?.label || 'Consultar mi zona'}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="rounded-3xl border border-theme bg-surface p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] md:p-8"
          >
            <div className="mb-5 flex items-center gap-2 text-foreground">
              <MapPinIcon className="h-5 w-5 text-brand" />
              <h3 className="font-display text-lg font-bold">Principales áreas</h3>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {content.zones.map((zone, index) => (
                <motion.li
                  key={zone}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 rounded-2xl border border-theme bg-surface-elevated px-4 py-3"
                >
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-brand to-brand-light" />
                  <span className="text-sm font-semibold text-foreground">{zone}</span>
                </motion.li>
              ))}
            </ul>
            {content.note && (
              <p className="mt-5 text-xs leading-relaxed text-muted">{content.note}</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
