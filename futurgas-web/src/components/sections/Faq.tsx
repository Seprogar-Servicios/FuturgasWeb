import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import type { FaqSectionContent } from '../../types/content';

type Props = {
  content: FaqSectionContent;
  whatsapp?: string | null;
};

export default function Faq({ content, whatsapp }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const ctaHref =
    content.cta?.href ||
    (whatsapp
      ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
          'Hola Futurgas, tengo una consulta sobre instalaciones de gas.'
        )}`
      : '#contacto');

  return (
    <section id="faq" className="relative overflow-hidden py-14 md:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28"
          >
            <div className="mb-3 inline-flex items-center rounded-full bg-gradient-to-r from-brand to-brand-light px-3 py-1 text-xs font-semibold text-white">
              <QuestionMarkCircleIcon className="mr-1.5 h-3.5 w-3.5" />
              {content.eyebrow || 'Antes de escribirnos'}
            </div>
            <h2 className="font-display mb-3 text-3xl font-extrabold text-foreground md:text-4xl">
              {content.headline}
            </h2>
            {content.subheadline && (
              <p className="mb-5 text-sm leading-relaxed text-muted md:text-base">
                {content.subheadline}
              </p>
            )}
            <div className="rounded-2xl border border-theme bg-surface p-5">
              <p className="font-display mb-1 font-bold text-foreground">
                {content.cta_title || '¿No encontrás tu duda?'}
              </p>
              <p className="mb-4 text-sm leading-relaxed text-muted">
                {content.cta_body ||
                  'Mandanos un mensaje con tu zona y el tipo de trabajo. Te respondemos con la próxima acción concreta.'}
              </p>
              <a
                href={ctaHref}
                target={ctaHref.startsWith('http') ? '_blank' : undefined}
                rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="btn-brand !px-5 !py-2.5 text-sm"
              >
                {content.cta?.label || 'Escribinos por WhatsApp'}
              </a>
            </div>
          </motion.div>

          <div className="space-y-2.5">
            {content.items.map((item, index) => {
              const open = openIndex === index;
              return (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.04, 0.2) }}
                  className="overflow-hidden rounded-2xl border border-theme bg-surface"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left md:px-5"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-button-${index}`}
                  >
                    <span className="font-display text-sm font-bold text-foreground md:text-base">
                      {item.question}
                    </span>
                    <ChevronDownIcon
                      className={`h-5 w-5 shrink-0 text-brand transition-transform ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-button-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-4 pb-4 text-sm leading-relaxed text-muted md:px-5">
                          {item.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
