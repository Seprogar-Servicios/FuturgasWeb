import { useEffect } from 'react';
import type { FaqSectionContent, SiteSettingsPayload } from '../../types/content';

type Props = {
  settings: SiteSettingsPayload;
  faq?: FaqSectionContent | null;
};

export default function JsonLd({ settings, faq }: Props) {
  useEffect(() => {
    const scripts: HTMLScriptElement[] = [];

    const localBusiness = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: settings.site_name || 'Futurgas',
      description:
        settings.seo_settings.description ||
        'Instalaciones de gas para la construcción en todo Buenos Aires.',
      url: settings.seo_settings.canonical || window.location.origin,
      image: settings.logo_url || '/futurgas.png',
      email: settings.contact_email || undefined,
      telephone: settings.phones[0]?.tel || undefined,
      areaServed: 'Buenos Aires, Argentina',
      sameAs: [
        settings.social_links.facebook,
        settings.social_links.instagram,
        settings.social_links.whatsapp,
      ].filter(Boolean),
    };

    scripts.push(upsertJsonLd('futurgas-ld-local', localBusiness));

    if (faq?.items?.length) {
      const faqPage = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };
      scripts.push(upsertJsonLd('futurgas-ld-faq', faqPage));
    }

    return () => {
      scripts.forEach((el) => el.remove());
    };
  }, [settings, faq]);

  return null;
}

function upsertJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.text = JSON.stringify(data);
  return el;
}
