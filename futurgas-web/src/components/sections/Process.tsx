import { motion } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  WrenchScrewdriverIcon,
  HandThumbUpIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import type { ProcessSectionContent } from '../../types/content';

const iconMap: Record<string, typeof ChatBubbleLeftRightIcon> = {
  chat: ChatBubbleLeftRightIcon,
  calendar: CalendarDaysIcon,
  wrench: WrenchScrewdriverIcon,
  check: HandThumbUpIcon,
};

const defaultIcons = ['chat', 'calendar', 'wrench', 'check'] as const;

type Props = {
  content: ProcessSectionContent;
};

export default function Process({ content }: Props) {
  return (
    <section id="proceso" className="section-soft relative overflow-hidden py-14 md:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.12)_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center rounded-full bg-gradient-to-r from-brand to-brand-light px-3 py-1 text-xs font-semibold text-white">
              <ListBulletIcon className="mr-1.5 h-3.5 w-3.5" />
              {content.eyebrow || 'Del contacto al trabajo listo'}
            </div>
            <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
              {content.headline}
            </h2>
          </div>
          {content.subheadline && (
            <p className="max-w-md text-sm leading-relaxed text-muted md:text-base lg:text-right">
              {content.subheadline}
            </p>
          )}
        </div>

        <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent xl:block" />
          {content.steps.map((step, index) => {
            const iconKey = step.icon_key || defaultIcons[index % defaultIcons.length];
            const Icon = iconMap[iconKey] || ChatBubbleLeftRightIcon;
            return (
              <motion.article
                key={`${step.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="card-lift relative rounded-2xl border border-theme bg-surface px-4 py-5 md:px-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-light text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold tracking-wide text-brand">
                    PASO {index + 1}
                  </span>
                </div>
                <h3 className="font-display mb-1.5 text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{step.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
