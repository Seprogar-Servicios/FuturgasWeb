import { motion } from 'framer-motion';
import {
  FireIcon,
  WrenchScrewdriverIcon,
  BuildingOffice2Icon,
  ShareIcon,
  BoltIcon,
} from '@heroicons/react/24/solid';
import type { ServiceItem, ServicesSectionContent } from '../../types/content';

const iconMap: Record<string, typeof FireIcon> = {
  fire: FireIcon,
  wrench: WrenchScrewdriverIcon,
  building: BuildingOffice2Icon,
  network: ShareIcon,
  pipe: BoltIcon,
};

type Props = {
  content: ServicesSectionContent;
  services: ServiceItem[];
};

export default function Services({ content, services }: Props) {
  return (
    <section id="servicios" className="section-band relative overflow-hidden py-14 md:py-16">
      <div className="pointer-events-none absolute -left-10 top-0 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
      <div className="container relative z-10 mx-auto px-4">
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
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon_key] || FireIcon;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
                className="card-lift overflow-hidden rounded-2xl border border-theme bg-surface"
              >
                <div className="flex items-start gap-3.5 p-4 md:p-5">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{
                      background: `linear-gradient(135deg, ${service.color_from}, ${service.color_to})`,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold text-foreground md:text-lg">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{service.description}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
