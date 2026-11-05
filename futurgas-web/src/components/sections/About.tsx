import { motion } from 'framer-motion';
import type { AboutContent } from '../../types/content';

type Props = { content: AboutContent };

export default function About({ content }: Props) {
  return (
    <section id="nosotros" className="section-soft relative overflow-hidden py-14 md:py-20">
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            {content.image_url && (
              <div className="card-lift overflow-hidden rounded-3xl border border-theme bg-surface">
                <img
                  src={content.image_url}
                  alt={content.image_alt || 'Futurgas'}
                  className="w-full object-cover"
                />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="lg:col-span-7"
          >
            {content.eyebrow && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                {content.eyebrow}
              </p>
            )}
            <h2 className="font-display mb-4 text-3xl font-extrabold text-foreground md:text-4xl">
              {content.headline}
            </h2>
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              {content.body}
            </p>

            {!!content.highlights?.length && (
              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {content.highlights.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * index }}
                    className="card-lift rounded-2xl border border-theme bg-surface p-4 hover:border-brand/35"
                  >
                    <div className="mb-2 h-1 w-8 rounded-full bg-gradient-to-r from-brand to-brand-light" />
                    <h3 className="font-display mb-1 text-base font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {content.cta && (
              <a href={content.cta.href} className="btn-brand">
                {content.cta.label}
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
