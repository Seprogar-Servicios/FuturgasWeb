# Configuración Supabase + Vercel (Futurgas CMS)

Los cambios publicados desde `/gestion` se ven en la web **sin redeploy**. Vercel solo sirve la app; el contenido vive en Supabase.

## 1. Crear proyecto en Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. En **Authentication → Providers → Email**: dejá email/password activo.
3. Para pruebas locales, en **Authentication → Providers → Email** desactivá **Confirm email** (si no, el login responde 400 hasta confirmar el usuario).
4. En **Authentication → Providers**: no publiques registro (este CMS no tiene signup).
5. En **Project Settings → API** copiá:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`
6. **Nunca** uses la `service_role` en el frontend ni en Vercel como variable `VITE_*`.

## 2. Ejecutar SQL (en este orden)

En el SQL Editor de Supabase:

1. `supabase/migrations/001_schema.sql`
2. `supabase/migrations/002_rls.sql`
3. `supabase/migrations/003_storage.sql`
4. `supabase/migrations/003_project_service_slug.sql`
5. `supabase/migrations/004_team_members.sql`
6. `supabase/migrations/005_section_types.sql`
7. `supabase/migrations/006_table_grants.sql` ← **obligatorio** (sin esto el CMS da 403)
8. `supabase/seed.sql`

Si el insert del bucket falla, creá manualmente un bucket público llamado `media` (límite 5 MB, imágenes) y volvé a correr las policies de `003_storage.sql`.

## 3. Crear el primer administrador

1. **Authentication → Users → Add user** (email + password). Marcá “Auto Confirm User” si está disponible.
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

Sin `.env`, la web igual arranca con contenido local de respaldo. El panel requiere Supabase.

## 5. Vercel

1. Conectá el repo / carpeta `futurgas-web`.
2. Definí las mismas variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Redeploy una vez para que Vite embeba las variables.
4. `vercel.json` ya reescribe todas las rutas a `index.html` para que `/gestion` no dé 404 al refrescar.

## Errores frecuentes

| Síntoma | Causa | Qué hacer |
| --- | --- | --- |
| `auth/v1/token` **400** | Contraseña mal, email no confirmado, o usuario inexistente | Revisá usuario en Auth; confirmá email o desactivá Confirm email |
| REST **403** en `admin_users`, `services`, etc. | Faltan `GRANT` de tabla (RLS solo no alcanza) | Ejecutá `006_table_grants.sql` |
| Login OK pero paneles vacíos / “en blanco” | Sesión JWT sin permisos de tabla o sin fila admin | Grants + `insert into admin_users` |
| `Uncaught SyntaxError: Unexpected token '<'` | El navegador pidió un `.js` y recibió `index.html` (rewrite SPA / caché vieja) | Hard refresh (Ctrl+F5). Redeploy limpio si pasó en Vercel tras un build |

## Flujo de publicación

1. Entrás a `/gestion` con el usuario admin.
2. Editás secciones / servicios / obras / config.
3. Guardás borrador (la web pública no cambia).
4. Publicás → la web lee las vistas `v_public_*` y muestra el contenido nuevo al recargar.
