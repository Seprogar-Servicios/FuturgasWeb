import type { PublicSiteData } from '../types/content';

/** Contenido local de respaldo si Supabase no está configurado o falla. Solo gas. */
export const fallbackSiteData: PublicSiteData = {
  settings: {
    site_name: 'Futurgas',
    logo_url: '/futurgas.png',
    favicon_url: '/futurgas.png',
    primary_color: '#3b82f6',
    secondary_color: '#0f172a',
    contact_email: 'futurgas30@gmail.com',
    phones: [
      { label: 'Técnico jefe', number: '+54 9 11 3625-0298', tel: '+5491136250298' },
      {
        label: 'Contabilidad / Presupuestos',
        number: '+54 9 11 6304-6138',
        tel: '+5491163046138',
      },
    ],
    whatsapp: '5491136250298',
    address: null,
    social_links: {
      facebook: 'https://www.facebook.com/profile.php?id=61577943730582',
      instagram: 'https://www.instagram.com/futur.gas/',
      whatsapp: 'https://wa.me/5491136250298',
    },
    seo_settings: {
      title: 'Futurgas | Instalaciones de gas para la construcción',
      description:
        'Instalaciones de gas para obras nuevas, redes de distribución, tendido de cañerías y adecuaciones en todo Buenos Aires.',
      keywords:
        'instalaciones de gas, gas para construcción, redes de gas, tendido de cañerías, Buenos Aires, CABA, GBA, Futurgas',
      og_image: '/futurgas.png',
      canonical: 'https://futurgas.vercel.app/',
    },
  },
  navigation: [
    { id: 'n1', label: 'Inicio', url: '#inicio', display_order: 1, is_visible: true },
    { id: 'n2', label: 'Nosotros', url: '#nosotros', display_order: 2, is_visible: true },
    { id: 'n3', label: 'Servicios', url: '#servicios', display_order: 3, is_visible: true },
    { id: 'n4', label: 'Equipo', url: '#equipo', display_order: 4, is_visible: true },
    { id: 'n5', label: 'Trabajos', url: '#galeria', display_order: 5, is_visible: true },
    { id: 'n6', label: 'Contacto', url: '#contacto', display_order: 6, is_visible: true },
  ],
  // Proceso / Zonas / FAQ están en el home por scroll; Equipo sí va al nav.
  sections: [
    {
      id: 's-hero',
      section_type: 'hero',
      title: 'Hero',
      display_order: 1,
      content: {
        headline: 'Instalaciones de gas para la construcción',
        highlight: 'gas',
        subheadline:
          'Proyectos de instalaciones de gas en obras nuevas, redes de distribución, tendido de cañerías y adecuaciones para usos domiciliarios y comerciales.',
        primary_cta: { label: 'Solicitar presupuesto', href: '#contacto' },
        secondary_cta: { label: 'Ver trabajos', href: '#galeria' },
        image_url: '/futurgas-03.jpg',
        image_alt: 'Trabajo técnico en instalación de gas',
        badges: [
          { label: 'Enfoque en instalaciones de gas' },
          { label: 'Atención en todo Buenos Aires' },
        ],
        stats: [],
      },
    },
    {
      id: 's-about',
      section_type: 'about',
      title: 'Nosotros',
      display_order: 2,
      content: {
        eyebrow: 'Sobre nosotros',
        headline: 'Especialistas en instalaciones de gas para obra',
        body: 'En Futurgas nos enfocamos en instalaciones de gas vinculadas a la construcción: obras nuevas, redes de distribución, tendidos de cañería y adecuaciones para usos domiciliarios y comerciales.',
        image_url: '/Futurgas-01.jpeg',
        image_alt: 'Equipo de Futurgas',
        highlights: [
          {
            title: 'Obras nuevas',
            description: 'Planificación y ejecución de instalaciones de gas en proyectos de construcción.',
          },
          {
            title: 'Redes y tendidos',
            description: 'Diseño e instalación de redes de distribución y tendido de cañerías.',
          },
          {
            title: 'Adecuaciones',
            description: 'Ampliaciones y modificaciones de instalaciones existentes según el alcance del trabajo.',
          },
          {
            title: 'Documentación',
            description: 'Gestión de la documentación correspondiente a las habilitaciones de la empresa.',
          },
        ],
        cta: { label: 'Contactanos', href: '#contacto' },
      },
    },
    {
      id: 's-services',
      section_type: 'services',
      title: 'Servicios',
      display_order: 3,
      content: {
        eyebrow: 'Lo que ofrecemos',
        headline: 'Servicios de gas',
        subheadline:
          'Instalaciones y trabajos de gas para obra, con un alcance claro y profesional.',
      },
    },
    {
      id: 's-process',
      section_type: 'process',
      title: 'Proceso',
      display_order: 4,
      content: {
        eyebrow: 'Del contacto al trabajo listo',
        headline: 'Cómo trabajamos',
        subheadline: 'Un proceso corto y concreto: menos vueltas, más claridad en cada paso.',
        steps: [
          {
            title: 'Nos contactás',
            description:
              'WhatsApp o formulario: contanos el tipo de instalación, la zona y el estado de la obra.',
            icon_key: 'chat',
          },
          {
            title: 'Coordinamos',
            description:
              'Definimos visita o intervención según el avance de obra y la disponibilidad.',
            icon_key: 'calendar',
          },
          {
            title: 'Ejecutamos',
            description:
              'Realizamos la instalación o adecuación de gas con criterio técnico y orden en obra.',
            icon_key: 'wrench',
          },
          {
            title: 'Cerramos el trabajo',
            description:
              'Te explicamos lo realizado y dejamos el alcance acordado en condiciones de uso.',
            icon_key: 'check',
          },
        ],
      },
    },
    {
      id: 's-gallery',
      section_type: 'gallery',
      title: 'Trabajos',
      display_order: 5,
      content: {
        eyebrow: 'Trabajos realizados',
        headline: 'Galería de obras',
        subheadline: 'Fotos de instalaciones y trabajos de gas en obra.',
        empty_message: 'Pronto vas a ver aquí fotos de nuestros trabajos.',
      },
    },
    {
      id: 's-coverage',
      section_type: 'coverage',
      title: 'Zonas',
      display_order: 6,
      content: {
        eyebrow: 'Cobertura',
        headline: 'Zonas de atención',
        subheadline:
          'Atendemos en todo Buenos Aires: CABA y Gran Buenos Aires. Si querés confirmar tu zona, escribinos y coordinamos según disponibilidad.',
        zones: ['CABA', 'Zona Norte', 'Zona Oeste', 'Zona Sur', 'GBA', 'Consultá tu zona'],
        cta: { label: 'Consultar mi zona', href: '' },
        note: 'La coordinación puede variar según el tipo de trabajo y la demanda del día.',
      },
    },
    {
      id: 's-team',
      section_type: 'team',
      title: 'Equipo',
      display_order: 7,
      content: {
        eyebrow: 'Quiénes somos',
        headline: 'Nuestro equipo',
        subheadline:
          'Las personas detrás de cada instalación. Cargá fotos reales desde el panel de gestión.',
      },
    },
    {
      id: 's-faq',
      section_type: 'faq',
      title: 'FAQ',
      display_order: 8,
      content: {
        eyebrow: 'Antes de escribirnos',
        headline: 'Preguntas frecuentes',
        subheadline:
          'Lo que más consultan sobre instalaciones de gas, presupuestos y zonas de atención.',
        items: [
          {
            question: '¿Qué tipo de trabajos de gas hacen?',
            answer:
              'Instalaciones en obras nuevas, redes de distribución, tendido de cañerías, adecuaciones y ampliaciones para usos domiciliarios y comerciales.',
          },
          {
            question: '¿Cómo pido un presupuesto?',
            answer:
              'Por WhatsApp o desde el formulario de contacto. Con una breve descripción del trabajo, la zona y —si tenés— fotos o planos, podemos orientarte mejor.',
          },
          {
            question: '¿En qué zonas atienden?',
            answer:
              'En todo Buenos Aires: CABA y Gran Buenos Aires (norte, oeste y sur). Si estás en el límite u otra localidad, consultá igual: coordinamos según distancia y agenda.',
          },
          {
            question: '¿Pueden trabajar en obra en curso?',
            answer:
              'Sí. Coordinamos con el avance de obra para el tendido, la instalación y las adecuaciones según el alcance acordado.',
          },
          {
            question: '¿Qué información conviene tener lista?',
            answer:
              'Ubicación, tipo de proyecto (obra nueva, adecuación, local, etc.), plazos aproximados y cualquier plano o detalle técnico disponible.',
          },
          {
            question: '¿La orientación inicial tiene costo?',
            answer:
              'La consulta inicial por mensaje es sin cargo. Si el caso requiere relevamiento en el lugar, te confirmamos condiciones antes de agendar.',
          },
        ],
        cta_title: '¿No encontrás tu duda?',
        cta_body:
          'Mandanos un mensaje con tu zona y el tipo de trabajo. Te respondemos con la próxima acción concreta.',
        cta: { label: 'Escribinos por WhatsApp', href: '' },
      },
    },
    {
      id: 's-contact',
      section_type: 'contact',
      title: 'Contacto',
      display_order: 9,
      content: {
        eyebrow: 'Contacto',
        headline: '¿En qué podemos ayudarte?',
        subheadline:
          'Completá el formulario o usá nuestros canales directos. Respondemos consultas técnicas, presupuestos y coordinación de trabajos.',
        whatsapp_placeholder:
          'Contanos el tipo de trabajo, la zona y cualquier detalle útil…',
        whatsapp_default_message:
          'Hola, quiero hacer una consulta sobre instalaciones de gas desde la web de Futurgas.',
        whatsapp_button_label: 'Enviar por WhatsApp',
        hours_note: 'Lun-Vie: 8:00 - 20:00',
      },
    },
  ],
  services: [
    {
      id: 'svc1',
      title: 'Instalaciones de gas en obras nuevas',
      slug: 'instalaciones-obras-nuevas',
      description:
        'Ejecución de instalaciones de gas para proyectos de construcción residencial y comercial.',
      features: [
        'Relevamiento y planificación',
        'Instalación en obra nueva',
        'Coordinación con el avance de obra',
        'Entrega según alcance acordado',
      ],
      image_url: null,
      icon_key: 'fire',
      color_from: '#f59e0b',
      color_to: '#d97706',
      is_visible: true,
      display_order: 1,
      has_unpublished_changes: false,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'svc2',
      title: 'Redes de distribución',
      slug: 'redes-distribucion',
      description:
        'Montaje y adecuación de redes de distribución de gas según las necesidades del proyecto.',
      features: [
        'Diseño de recorrido',
        'Montaje de red',
        'Pruebas según alcance',
        'Documentación de obra',
      ],
      image_url: null,
      icon_key: 'network',
      color_from: '#3b82f6',
      color_to: '#1d4ed8',
      is_visible: true,
      display_order: 2,
      has_unpublished_changes: false,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'svc3',
      title: 'Tendido de cañerías',
      slug: 'tendido-canerias',
      description:
        'Tendido de cañerías de gas para instalaciones domiciliarias, comerciales y de obra.',
      features: [
        'Tendido en obra',
        'Adecuación de recorridos',
        'Materiales según especificación',
        'Control de ejecución',
      ],
      image_url: null,
      icon_key: 'pipe',
      color_from: '#06b6d4',
      color_to: '#0891b2',
      is_visible: true,
      display_order: 3,
      has_unpublished_changes: false,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'svc4',
      title: 'Adecuaciones y ampliaciones',
      slug: 'adecuaciones-ampliaciones',
      description:
        'Modificaciones, ampliaciones y actualizaciones de instalaciones de gas existentes.',
      features: [
        'Evaluación del estado actual',
        'Ampliaciones de consumo',
        'Reubicación de tramos',
        'Trabajos técnicos asociados',
      ],
      image_url: null,
      icon_key: 'wrench',
      color_from: '#8b5cf6',
      color_to: '#6d28d9',
      is_visible: true,
      display_order: 4,
      has_unpublished_changes: false,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'svc5',
      title: 'Instalaciones domiciliarias y comerciales',
      slug: 'domiciliarias-comerciales',
      description:
        'Instalaciones de gas para viviendas, locales y edificios con enfoque en seguridad y calidad de ejecución.',
      features: [
        'Instalaciones domiciliarias',
        'Locales comerciales',
        'Edificios y consorcios',
        'Asesoramiento técnico',
      ],
      image_url: null,
      icon_key: 'building',
      color_from: '#10b981',
      color_to: '#047857',
      is_visible: true,
      display_order: 5,
      has_unpublished_changes: false,
      created_at: '',
      updated_at: '',
    },
  ],
  projects: [
    {
      id: 'demo-obra-1',
      title: 'Instalación de gas en obra nueva residencial',
      slug: 'instalacion-obra-nueva-residencial',
      description:
        'Ejemplo de instalación de gas en una obra nueva: tendido de cañerías, coordinación con el avance de obra y puesta en servicio según el alcance acordado.',
      cover_image: '/futurgas-03.jpg',
      category: 'Obra nueva',
      location: 'Zona Norte',
      completion_date: '2025-09-15',
      is_published: true,
      display_order: 1,
      has_unpublished_changes: false,
      created_at: '',
      updated_at: '',
      is_demo: true,
      service_slug: 'instalaciones-obras-nuevas',
      images: [
        {
          id: 'demo-img-1a',
          project_id: 'demo-obra-1',
          image_url: '/futurgas-03.jpg',
          alt_text: 'Trabajo técnico en instalación de gas',
          display_order: 1,
        },
        {
          id: 'demo-img-1b',
          project_id: 'demo-obra-1',
          image_url: '/Futurgas-01.jpeg',
          alt_text: 'Detalle de obra e instalación',
          display_order: 2,
        },
        {
          id: 'demo-img-1c',
          project_id: 'demo-obra-1',
          image_url: '/Futurgas-02.jpeg',
          alt_text: 'Avance de instalación en obra',
          display_order: 3,
        },
      ],
    },
    {
      id: 'demo-obra-2',
      title: 'Adecuación de red de gas en local comercial',
      slug: 'adecuacion-red-local-comercial',
      description:
        'Ejemplo de adecuación y ampliación de instalación existente para un local comercial, con reubicación de tramos y actualización del recorrido.',
      cover_image: '/Futurgas-01.jpeg',
      category: 'Adecuación',
      location: 'CABA',
      completion_date: '2025-11-02',
      is_published: true,
      display_order: 2,
      has_unpublished_changes: false,
      created_at: '',
      updated_at: '',
      is_demo: true,
      service_slug: 'adecuaciones-ampliaciones',
      images: [
        {
          id: 'demo-img-2a',
          project_id: 'demo-obra-2',
          image_url: '/Futurgas-01.jpeg',
          alt_text: 'Vista general del trabajo',
          display_order: 1,
        },
        {
          id: 'demo-img-2b',
          project_id: 'demo-obra-2',
          image_url: '/Futurgas-02.jpeg',
          alt_text: 'Detalle de adecuación',
          display_order: 2,
        },
        {
          id: 'demo-img-2c',
          project_id: 'demo-obra-2',
          image_url: '/futurgas-03.jpg',
          alt_text: 'Instalación finalizada',
          display_order: 3,
        },
      ],
    },
  ],
  team: [
    {
      id: 'demo-team-1',
      name: 'Coordinación técnica',
      role: 'Instalaciones y obra',
      photo_url: '/Futurgas-01.jpeg',
      display_order: 1,
      is_visible: true,
      is_demo: true,
    },
    {
      id: 'demo-team-2',
      name: 'Equipo de tendidos',
      role: 'Cañerías y redes',
      photo_url: '/futurgas-03.jpg',
      display_order: 2,
      is_visible: true,
      is_demo: true,
    },
    {
      id: 'demo-team-3',
      name: 'Administración',
      role: 'Presupuestos y consultas',
      photo_url: '/Futurgas-02.jpeg',
      display_order: 3,
      is_visible: true,
      is_demo: true,
    },
  ],
  media: [],
};
