# Checklist de migración — Futurgas

Guía sencilla de todo lo que tenés que crear o configurar cuando pases el proyecto a otras cuentas.

Usá este orden:

1. Supabase  
2. Código / variables  
3. Vercel  
4. Google  
5. Prueba final  

---

## 1. Supabase (nueva cuenta)

### Crear
- [ ] Cuenta en [supabase.com](https://supabase.com)
- [ ] Proyecto nuevo (anotá región, idealmente cercana a Argentina)

### Copiar de Project Settings → API
- [ ] `Project URL`
- [ ] `anon public` key  

**Importante:** no uses ni compartas la `service_role` key en el frontend ni en Vercel como `VITE_*`.

### Ejecutar SQL (SQL Editor), en este orden
1. `supabase/migrations/001_schema.sql`
2. `supabase/migrations/002_rls.sql`
3. `supabase/migrations/003_storage.sql`
4. `supabase/seed.sql`

### Storage
- [ ] Bucket `media` (público)
- [ ] Si el SQL del bucket falla, crealo a mano y volvé a correr las policies de `003_storage.sql`

### Auth
- [ ] Authentication → Providers → Email activo
- [ ] Sin registro público (el CMS no tiene signup)
- [ ] Crear usuario admin (email + contraseña)
- [ ] Copiar el UUID del usuario
- [ ] Ejecutar:

```sql
insert into public.admin_users (user_id, role)
values ('UUID-DEL-USUARIO', 'admin');
```

### Resultado esperado
- [ ] Login en `/gestion/login` funciona
- [ ] La web pública carga contenido desde Supabase

Más detalle técnico: `docs/SETUP_SUPABASE.md`

---

## 2. Código del proyecto

### Repo
- [ ] Código en GitHub / GitLab / Bitbucket (o el git que uses con Vercel)
- [ ] Carpeta del app: `futurgas-web`

### Archivo local `.env` (no se sube a git)
Crear `futurgas-web/.env` desde `.env.example`:

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_publica
```

### Probar en local
```powershell
cd futurgas-web
npm install
npm run dev
```

- Web: `http://localhost:5173/`
- Panel: `http://localhost:5173/gestion/login`

---

## 3. Vercel (nueva cuenta)

### Crear
- [ ] Cuenta en [vercel.com](https://vercel.com)
- [ ] Importar el repositorio
- [ ] Root Directory: `futurgas-web` (si el repo tiene esa carpeta)
- [ ] Framework: Vite (lo detecta solo)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Variables de entorno (Project → Settings → Environment Variables)
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`

Marcar Production (y Preview si querés).

### Deploy
- [ ] Deploy / Redeploy después de cargar las variables
- [ ] Confirmar que abre la home
- [ ] Confirmar que `/gestion/login` no da 404 al refrescar  
  (`vercel.json` ya reescribe las rutas a `index.html`)

### Dominio (opcional pero recomendado)
- [ ] Dominio propio (ej. `futurgas.com.ar`)
- [ ] Conectarlo en Vercel → Domains
- [ ] Esperar DNS / SSL en verde

### Analytics de Vercel
- [ ] Ya está el paquete en el código (`@vercel/analytics`)
- [ ] En el dashboard de Vercel, activar Analytics si hace falta según el plan

---

## 4. Google

### A) Search Console (gratis) — indexación
- [ ] Entrar a [Google Search Console](https://search.google.com/search-console)
- [ ] Agregar propiedad (dominio o URL del sitio)
- [ ] Verificar propiedad  
  Ya existe el archivo: `public/google4117477c6523d872.html`  
  Si la nueva cuenta pide otro código, reemplazalo o usá verificación por DNS/meta
- [ ] Enviar sitemap: `https://TU-DOMINIO/sitemap.xml`

### B) Google Analytics 4 (gratis) — visitas
- [ ] Crear cuenta/propiedad en [analytics.google.com](https://analytics.google.com)
- [ ] Crear flujo Web con la URL del sitio
- [ ] Guardar el Measurement ID (`G-XXXXXXXX`)
- [ ] Instalarlo después en la web (hoy todavía no está cableado; Vercel Analytics sí)

### C) Google Business Profile (gratis) — SEO local / Maps
- [ ] Crear o reclamar ficha en [Google Business Profile](https://business.google.com)
- [ ] Nombre: Futurgas
- [ ] Categoría: la más cercana a instalaciones de gas / construcción
- [ ] Teléfonos (los mismos de la web)
- [ ] Zona: todo Buenos Aires / CABA y GBA (o dirección física si hay)
- [ ] Horario, fotos, WhatsApp si se puede
- [ ] Pedir reseñas reales a clientes

### D) Tag Manager (opcional, gratis)
- [ ] Solo si querés centralizar GA4 y otros tags
- [ ] Si solo usás GA4, no es obligatorio

### E) Herramientas útiles (gratis)
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) — rendimiento
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) — cuando haya Schema
- [ ] Bing Webmaster Tools (opcional)

---

## 5. Datos de la empresa para cargar

Tenelos a mano al migrar:

| Dato | Valor actual |
|------|--------------|
| Nombre | Futurgas |
| Email | futurgas30@gmail.com |
| WhatsApp / Técnico | +54 9 11 3625-0298 |
| Contabilidad / Presupuestos | +54 9 11 6304-6138 |
| Instagram | https://www.instagram.com/futur.gas/ |
| Facebook | https://www.facebook.com/profile.php?id=61577943730582 |
| Zona | Todo Buenos Aires (CABA y GBA) |
| Dirección física | Completar si existe |
| Dominio web | Completar (hoy: futurgas.vercel.app) |

---

## 6. Redes y accesos a transferir

- [ ] Instagram `@futur.gas`
- [ ] Facebook de la empresa
- [ ] Correo `futurgas30@gmail.com` (o el que use la empresa)
- [ ] Cuenta de dominio / DNS (si hay dominio propio)
- [ ] Acceso al repo Git
- [ ] Acceso a Vercel
- [ ] Acceso a Supabase
- [ ] Acceso a Google (Search Console, Analytics, Business Profile)

---

## 7. Qué NO hace falta crear

- No hace falta otra base de datos aparte de Supabase
- No hace falta backend propio
- No hace falta Next.js para que el CMS funcione
- No hace falta pagar por SEO básico (GSC, GA4, GBP son gratis)
- No uses `service_role` en el frontend

---

## 8. Prueba final (después de migrar)

- [ ] Home carga en el dominio nuevo
- [ ] Textos, teléfonos y WhatsApp se ven bien
- [ ] `/gestion/login` abre
- [ ] Login admin funciona
- [ ] Editar y publicar un texto → al refrescar la home se ve el cambio
- [ ] Subir una imagen en Multimedia funciona
- [ ] Search Console verifica el sitio
- [ ] Sitemap enviado
- [ ] Business Profile creado o reclamado
- [ ] Celular: la web se ve bien

---

## 9. Orden rápido de un día

1. Crear proyecto Supabase + SQL + admin  
2. Crear `.env` local y probar  
3. Conectar repo a Vercel + variables + deploy  
4. Verificar Search Console  
5. Crear Business Profile  
6. (Opcional) GA4  
7. Checklist de prueba final  

---

## 10. Archivos del repo que importan

| Archivo | Para qué |
|---------|----------|
| `.env.example` | Modelo de variables |
| `vercel.json` | Evita 404 en `/gestion` |
| `docs/SETUP_SUPABASE.md` | Detalle de Supabase |
| `supabase/migrations/*.sql` | Base de datos y seguridad |
| `supabase/seed.sql` | Contenido inicial (solo gas) |
| `public/robots.txt` | Rastreo de Google |
| `public/sitemap.xml` | Mapa del sitio |
| `public/google*.html` | Verificación Search Console |

---

Si migrás a cuentas nuevas, lo esencial es: **Supabase (datos + login)**, **Vercel (hosting + variables)** y **Google (Search Console + Business Profile)**. Con eso la web y el panel quedan operativos.
