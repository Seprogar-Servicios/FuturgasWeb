# Configuración Supabase + Vercel (Futurgas CMS)

Los cambios publicados desde `/gestion` se ven en la web **sin redeploy**. Vercel solo sirve la app; el contenido vive en Supabase.

## 1. Crear proyecto en Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. En **Authentication → Providers → Email**: dejá email/password activo.
3. En **Authentication → Providers**: desactivá el registro público si está disponible, o no publiques una pantalla de registro (este CMS no tiene signup).
4. En **Project Settings → API** copiá:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`
5. **Nunca** uses la `service_role` en el frontend ni en Vercel como variable `VITE_*`.

## 2. Ejecutar SQL

En el SQL Editor de Supabase, en este orden:

1. `supabase/migrations/001_schema.sql`
2. `supabase/migrations/002_rls.sql`
3. `supabase/migrations/003_storage.sql`
4. `supabase/seed.sql`

Si el insert del bucket falla, creá manualmente un bucket público llamado `media` (límite 5 MB, imágenes) y volvé a correr las policies de `003_storage.sql`.

## 3. Crear el primer administrador

1. **Authentication → Users → Add user** (email + password).
2. Copiá el UUID del usuario.
3. Ejecutá:

```sql
insert into public.admin_users (user_id, role)
values ('UUID-DEL-USUARIO', 'admin');
```

Sin esa fila en `admin_users`, el login del panel rechaza la sesión.

## 4. Variables locales

```bash
cp .env.example .env
```

Completá URL y anon key. Luego:

```bash
npm install
npm run dev
```

- Web pública: `http://localhost:5173/`
- Panel: `http://localhost:5173/gestion/login`

Sin `.env`, la web igual arranca con contenido local de respaldo (solo gas). El panel requiere Supabase.

## 5. Vercel

1. Conectá el repo / carpeta `futurgas-web`.
2. Definí las mismas variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Redeploy una vez para que Vite embeba las variables.
4. `vercel.json` ya reescribe todas las rutas a `index.html` para que `/gestion` no dé 404 al refrescar.

Después de ese deploy, **publicar contenido en el CMS no requiere un nuevo deploy**.

## Flujo de publicación

1. Entrás a `/gestion` con el usuario admin.
2. Editás secciones / servicios / obras / config.
3. Guardás borrador (la web pública no cambia).
4. Publicás → la web lee las vistas `v_public_*` y muestra el contenido nuevo al recargar.
