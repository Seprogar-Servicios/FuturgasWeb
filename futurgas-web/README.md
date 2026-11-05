# Futurgas Web + CMS

Sitio público de Futurgas (instalaciones de gas para la construcción) con panel administrativo en `/gestion`, respaldado por Supabase.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Supabase (Auth, Postgres, Storage)
- Vercel (hosting estático + rewrites SPA)

## Desarrollo local

```bash
npm install
cp .env.example .env
npm run dev
```

Sin variables de Supabase, la web pública usa contenido local de respaldo. El panel requiere Supabase configurado.

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm run preview` — previsualizar build
- `npm run lint` — ESLint

## Documentación

Guía completa de Supabase, admin y Vercel: [docs/SETUP_SUPABASE.md](docs/SETUP_SUPABASE.md)

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Web pública |
| `/gestion/login` | Login admin |
| `/gestion` | Dashboard CMS |
