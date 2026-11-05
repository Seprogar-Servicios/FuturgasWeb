import { useEffect, useMemo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Services from '../components/sections/Services';
import Process from '../components/sections/Process';
import Gallery from '../components/sections/Gallery';
import Coverage from '../components/sections/Coverage';
import Team from '../components/sections/Team';
import Faq from '../components/sections/Faq';
import Contact from '../components/sections/Contact';
import JsonLd from '../components/seo/JsonLd';
import { useSiteData } from '../contexts/SiteDataContext';
import type {
  AboutContent,
  ContactContent,
  CoverageSectionContent,
  FaqSectionContent,
  GallerySectionContent,
  HeroContent,
  ProcessSectionContent,
  SectionType,
  ServicesSectionContent,
  TeamSectionContent,
} from '../types/content';

export default function HomePage() {
  const { data, loading } = useSiteData();
  const location = useLocation();

  useEffect(() => {
    if (data.settings.primary_color) {
      document.documentElement.style.setProperty('--fg-primary', data.settings.primary_color);
      document.documentElement.style.setProperty('--color-brand', data.settings.primary_color);
    }
  }, [data.settings.primary_color]);

  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, [location.hash, location.key]);

  const orderedSections = useMemo(
    () => [...data.sections].sort((a, b) => a.display_order - b.display_order),
    [data.sections]
  );

  const faqContent = useMemo(() => {
    const section = orderedSections.find((item) => item.section_type === 'faq');
    return (section?.content as FaqSectionContent | undefined) ?? null;
  }, [orderedSections]);

  const sectionNodes = useMemo(() => {
    const nodes: ReactNode[] = [];

    for (const section of orderedSections) {
      const type = section.section_type as SectionType;
      const content = section.content;

      switch (type) {
        case 'hero':
          nodes.push(<Hero key={section.id} content={content as HeroContent} />);
          break;
        case 'about':
          nodes.push(<About key={section.id} content={content as AboutContent} />);
          break;
        case 'services':
          nodes.push(
            <Services
              key={section.id}
              content={content as ServicesSectionContent}
              services={data.services}
            />
          );
          break;
        case 'process':
          nodes.push(
            <Process key={section.id} content={content as ProcessSectionContent} />
          );
          break;
        case 'gallery':
          nodes.push(
            <Gallery
              key={section.id}
              content={content as GallerySectionContent}
              projects={data.projects}
            />
          );
          break;
        case 'coverage':
          nodes.push(
            <Coverage
              key={section.id}
              content={content as CoverageSectionContent}
              whatsapp={data.settings.whatsapp}
            />
          );
          break;
        case 'team':
          nodes.push(
            <Team
              key={section.id}
              content={content as TeamSectionContent}
              members={data.team}
            />
          );
          break;
        case 'faq':
          nodes.push(
            <Faq
              key={section.id}
              content={content as FaqSectionContent}
              whatsapp={data.settings.whatsapp}
            />
          );
          break;
        case 'contact':
          nodes.push(
            <Contact
              key={section.id}
              content={content as ContactContent}
              settings={data.settings}
            />
          );
          break;
        default:
          break;
      }
    }

    return nodes;
  }, [orderedSections, data.services, data.projects, data.team, data.settings]);

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd settings={data.settings} faq={faqContent} />
      <Header />
      <main className="flex-grow">
        {loading && (
          <div className="fixed inset-x-0 top-0 z-[60] bg-brand/90 px-4 py-1.5 text-center text-xs font-medium text-white backdrop-blur">
            Actualizando contenido…
          </div>
        )}
        {sectionNodes}
      </main>
      <Footer />
    </div>
  );
}
