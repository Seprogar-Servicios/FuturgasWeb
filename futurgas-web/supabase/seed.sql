-- Contenido inicial enfocado exclusivamente en instalaciones de gas para la construcción.
-- No inventa certificaciones, matrículas ni cifras no confirmadas.
-- Ejecutar después de las migraciones.
-- IMPORTANTE: crear el usuario admin manualmente en Auth y luego:
--   insert into public.admin_users (user_id, role) values ('<uuid-del-usuario>', 'admin');

-- Limpiar en orden seguro (idempotente para re-seed de desarrollo)
truncate table public.project_images restart identity cascade;
truncate table public.projects restart identity cascade;
truncate table public.services restart identity cascade;
truncate table public.page_sections restart identity cascade;
truncate table public.pages restart identity cascade;
truncate table public.navigation_items restart identity cascade;
truncate table public.site_settings restart identity cascade;
truncate table public.media_library restart identity cascade;

-- Settings
insert into public.site_settings (
  site_name,
  logo_url,
  favicon_url,
  primary_color,
  secondary_color,
  contact_email,
  phones,
  whatsapp,
  address,
  social_links,
  seo_settings,
  published_payload,
  draft_payload,
  has_unpublished_changes
) values (
  'Futurgas',
  '/futurgas.png',
  '/futurgas.png',
  '#3b82f6',
  '#0f172a',
  'futurgas30@gmail.com',
  '[
    {"label":"Técnico jefe","number":"+54 9 11 3625-0298","tel":"+5491136250298"},
    {"label":"Contabilidad / Presupuestos","number":"+54 9 11 6304-6138","tel":"+5491163046138"}
  ]'::jsonb,
  '5491136250298',
  null,
  '{
    "facebook":"https://www.facebook.com/profile.php?id=61577943730582",
    "instagram":"https://www.instagram.com/futur.gas/",
    "whatsapp":"https://wa.me/5491136250298"
  }'::jsonb,
  '{
    "title":"Futurgas | Instalaciones de gas para la construcción",
    "description":"Instalaciones de gas para obras nuevas, redes de distribución, tendido de cañerías y adecuaciones en todo Buenos Aires. Pedí tu presupuesto.",
    "keywords":"instalaciones de gas, gas para construcción, redes de gas, tendido de cañerías, Buenos Aires, CABA, GBA, Futurgas",
    "og_image":"/futurgas.png",
    "canonical":"https://futurgas.vercel.app/"
  }'::jsonb,
  null,
  null,
  false
);

update public.site_settings
set
  published_payload = jsonb_build_object(
    'site_name', site_name,
    'logo_url', logo_url,
    'favicon_url', favicon_url,
    'primary_color', primary_color,
    'secondary_color', secondary_color,
    'contact_email', contact_email,
    'phones', phones,
    'whatsapp', whatsapp,
    'address', address,
    'social_links', social_links,
    'seo_settings', seo_settings
  ),
  draft_payload = jsonb_build_object(
    'site_name', site_name,
    'logo_url', logo_url,
    'favicon_url', favicon_url,
    'primary_color', primary_color,
    'secondary_color', secondary_color,
    'contact_email', contact_email,
    'phones', phones,
    'whatsapp', whatsapp,
    'address', address,
    'social_links', social_links,
    'seo_settings', seo_settings
  );

-- Página inicio
insert into public.pages (title, slug, description, is_published)
values (
  'Inicio',
  'inicio',
  'Página principal de Futurgas',
  true
);

-- Navegación
insert into public.navigation_items (label, url, display_order, is_visible) values
  ('Inicio', '#inicio', 1, true),
  ('Nosotros', '#nosotros', 2, true),
  ('Servicios', '#servicios', 3, true),
  ('Equipo', '#equipo', 4, true),
  ('Trabajos', '#galeria', 5, true),
  ('Contacto', '#contacto', 6, true);

-- Secciones
with home as (
  select id from public.pages where slug = 'inicio' limit 1
)
insert into public.page_sections (
  page_id, section_type, title, draft_content, published_content, display_order, is_visible, has_unpublished_changes
)
select home.id, s.section_type, s.title, s.content, s.content, s.display_order, true, false
from home,
(values
  (
    'hero',
    'Hero',
    1,
    '{
      "eyebrow":"",
      "headline":"Instalaciones de gas para la construcción",
      "highlight":"gas",
      "subheadline":"Proyectos de instalaciones de gas en obras nuevas, redes de distribución, tendido de cañerías y adecuaciones para usos domiciliarios y comerciales.",
      "primary_cta":{"label":"Solicitar presupuesto","href":"#contacto"},
      "secondary_cta":{"label":"Ver trabajos","href":"#galeria"},
      "image_url":"/futurgas-03.jpg",
      "image_alt":"Trabajo técnico en instalación de gas",
      "badges":[
        {"label":"Enfoque en instalaciones de gas"},
        {"label":"Atención en todo Buenos Aires"}
      ],
      "stats":[]
    }'::jsonb
  ),
  (
    'about',
    'Nosotros',
    2,
    '{
      "eyebrow":"Sobre nosotros",
      "headline":"Especialistas en instalaciones de gas para obra",
      "body":"En Futurgas nos enfocamos en instalaciones de gas vinculadas a la construcción: obras nuevas, redes de distribución, tendidos de cañería y adecuaciones para usos domiciliarios y comerciales. Trabajamos con un enfoque técnico y comercial, acompañando cada etapa del proyecto.",
      "image_url":"/Futurgas-01.jpeg",
      "image_alt":"Equipo de Futurgas",
      "highlights":[
        {"title":"Obras nuevas","description":"Planificación y ejecución de instalaciones de gas en proyectos de construcción."},
        {"title":"Redes y tendidos","description":"Diseño e instalación de redes de distribución y tendido de cañerías."},
        {"title":"Adecuaciones","description":"Ampliaciones y modificaciones de instalaciones existentes según el alcance del trabajo."},
        {"title":"Documentación","description":"Gestión de la documentación correspondiente a las habilitaciones de la empresa."}
      ],
      "cta":{"label":"Contactanos","href":"#contacto"}
    }'::jsonb
  ),
  (
    'services',
    'Servicios',
    3,
    '{
      "eyebrow":"Lo que ofrecemos",
      "headline":"Servicios de gas",
      "subheadline":"Instalaciones y trabajos de gas para obra, con un alcance claro y profesional."
    }'::jsonb
  ),
  (
    'process',
    'Proceso',
    4,
    '{
      "eyebrow":"Del contacto al trabajo listo",
      "headline":"Cómo trabajamos",
      "subheadline":"Un proceso corto y concreto: menos vueltas, más claridad en cada paso.",
      "steps":[
        {"title":"Nos contactás","description":"WhatsApp o formulario: contanos el tipo de instalación, la zona y el estado de la obra.","icon_key":"chat"},
        {"title":"Coordinamos","description":"Definimos visita o intervención según el avance de obra y la disponibilidad.","icon_key":"calendar"},
        {"title":"Ejecutamos","description":"Realizamos la instalación o adecuación de gas con criterio técnico y orden en obra.","icon_key":"wrench"},
        {"title":"Cerramos el trabajo","description":"Te explicamos lo realizado y dejamos el alcance acordado en condiciones de uso.","icon_key":"check"}
      ]
    }'::jsonb
  ),
  (
    'gallery',
    'Trabajos',
    5,
    '{
      "eyebrow":"Trabajos realizados",
      "headline":"Galería de obras",
      "subheadline":"Fotos de instalaciones y trabajos de gas en obra.",
      "empty_message":"Pronto vas a ver aquí fotos de nuestros trabajos."
    }'::jsonb
  ),
  (
    'coverage',
    'Zonas',
    6,
    '{
      "eyebrow":"Cobertura",
      "headline":"Zonas de atención",
      "subheadline":"Atendemos en todo Buenos Aires: CABA y Gran Buenos Aires. Si querés confirmar tu zona, escribinos y coordinamos según disponibilidad.",
      "zones":["CABA","Zona Norte","Zona Oeste","Zona Sur","GBA","Consultá tu zona"],
      "note":"La coordinación puede variar según el tipo de trabajo y la demanda del día."
    }'::jsonb
  ),
  (
    'team',
    'Equipo',
    7,
    '{
      "eyebrow":"Quiénes somos",
      "headline":"Nuestro equipo",
      "subheadline":"Las personas detrás de cada instalación. Cargá fotos reales desde el panel de gestión."
    }'::jsonb
  ),
  (
    'faq',
    'FAQ',
    8,
    '{
      "eyebrow":"Antes de escribirnos",
      "headline":"Preguntas frecuentes",
      "subheadline":"Lo que más consultan sobre instalaciones de gas, presupuestos y zonas de atención.",
      "items":[
        {"question":"¿Qué tipo de trabajos de gas hacen?","answer":"Instalaciones en obras nuevas, redes de distribución, tendido de cañerías, adecuaciones y ampliaciones para usos domiciliarios y comerciales."},
        {"question":"¿Cómo pido un presupuesto?","answer":"Por WhatsApp o desde el formulario de contacto. Con una breve descripción del trabajo, la zona y —si tenés— fotos o planos, podemos orientarte mejor."},
        {"question":"¿En qué zonas atienden?","answer":"En todo Buenos Aires: CABA y Gran Buenos Aires (norte, oeste y sur). Si estás en el límite u otra localidad, consultá igual: coordinamos según distancia y agenda."},
        {"question":"¿Pueden trabajar en obra en curso?","answer":"Sí. Coordinamos con el avance de obra para el tendido, la instalación y las adecuaciones según el alcance acordado."},
        {"question":"¿Qué información conviene tener lista?","answer":"Ubicación, tipo de proyecto (obra nueva, adecuación, local, etc.), plazos aproximados y cualquier plano o detalle técnico disponible."},
        {"question":"¿La orientación inicial tiene costo?","answer":"La consulta inicial por mensaje es sin cargo. Si el caso requiere relevamiento en el lugar, te confirmamos condiciones antes de agendar."}
      ],
      "cta_title":"¿No encontrás tu duda?",
      "cta_body":"Mandanos un mensaje con tu zona y el tipo de trabajo. Te respondemos con la próxima acción concreta.",
      "cta":{"label":"Escribinos por WhatsApp","href":""}
    }'::jsonb
  ),
  (
    'contact',
    'Contacto',
    9,
    '{
      "eyebrow":"Contacto",
      "headline":"¿En qué podemos ayudarte?",
      "subheadline":"Escribinos por WhatsApp o llamá a nuestros números de atención. Respondemos consultas técnicas, presupuestos y coordinación de trabajos.",
      "whatsapp_placeholder":"Escribí tu mensaje para WhatsApp...",
      "whatsapp_default_message":"Hola, quiero hacer una consulta sobre instalaciones de gas desde la web de Futurgas.",
      "whatsapp_button_label":"Enviar por WhatsApp",
      "hours_note":"Lun-Vie: 8:00 - 20:00"
    }'::jsonb
  )
) as s(section_type, title, display_order, content);

-- Servicios (solo gas)
insert into public.services (
  title, slug, description, features, image_url, icon_key, color_from, color_to, is_visible, display_order, has_unpublished_changes
) values
(
  'Instalaciones de gas en obras nuevas',
  'instalaciones-obras-nuevas',
  'Ejecución de instalaciones de gas para proyectos de construcción residencial y comercial.',
  '["Relevamiento y planificación","Instalación en obra nueva","Coordinación con el avance de obra","Entrega según alcance acordado"]'::jsonb,
  null,
  'fire',
  '#f59e0b',
  '#d97706',
  true,
  1,
  false
),
(
  'Redes de distribución',
  'redes-distribucion',
  'Montaje y adecuación de redes de distribución de gas según las necesidades del proyecto.',
  '["Diseño de recorrido","Montaje de red","Pruebas según alcance","Documentación de obra"]'::jsonb,
  null,
  'network',
  '#3b82f6',
  '#1d4ed8',
  true,
  2,
  false
),
(
  'Tendido de cañerías',
  'tendido-canerias',
  'Tendido de cañerías de gas para instalaciones domiciliarias, comerciales y de obra.',
  '["Tendido en obra","Adecuación de recorridos","Materiales según especificación","Control de ejecución"]'::jsonb,
  null,
  'pipe',
  '#06b6d4',
  '#0891b2',
  true,
  3,
  false
),
(
  'Adecuaciones y ampliaciones',
  'adecuaciones-ampliaciones',
  'Modificaciones, ampliaciones y actualizaciones de instalaciones de gas existentes.',
  '["Evaluación del estado actual","Ampliaciones de consumo","Reubicación de tramos","Trabajos técnicos asociados"]'::jsonb,
  null,
  'wrench',
  '#8b5cf6',
  '#6d28d9',
  true,
  4,
  false
),
(
  'Instalaciones domiciliarias y comerciales',
  'domiciliarias-comerciales',
  'Instalaciones de gas para viviendas, locales y edificios con enfoque en seguridad y calidad de ejecución.',
  '["Instalaciones domiciliarias","Locales comerciales","Edificios y consorcios","Asesoramiento técnico"]'::jsonb,
  null,
  'building',
  '#10b981',
  '#047857',
  true,
  5,
  false
);
