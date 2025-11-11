# Todo List Web App (ProyectoPequeñoQA)

Aplicación de ejemplo hecha con React + TypeScript y Supabase (Postgres). Permite crear, editar, completar y eliminar tareas.

## Tecnologías
- React 18 + TypeScript (.tsx)
- Vite (dev server / bundler)
- Supabase (`@supabase/supabase-js`) como backend (Postgres)
- Tailwind CSS + PostCSS
- lucide-react (iconos)
- ESLint + TypeScript para lint/chequeo
- pnpm (recomendado) como gestor de paquetes

Archivos relevantes:
- `src/` - código fuente React
- `src/lib/supabase.ts` - cliente Supabase (usa variables VITE_*)
- `supabase/migrations/20251111021511_create_todos_table.sql` - migración para la tabla `todos`
- `.env` - variables de entorno locales (no commitear claves reales)

## Requisitos
- Node.js (recomendado >= 16, ideal 18+)
- pnpm instalado (o npm/yarn)

## Configuración rápida (desarrollo)

1. Clona y entra en la carpeta del proyecto:

```powershell
Set-Location -LiteralPath 'C:\Users\daril\Downloads\project-bolt-sb1-qpfkyun7\ProyectoPequeñoQA'
```

2. Instala dependencias (pnpm):

```powershell
pnpm install
```

3. Crea un archivo `.env` en la raíz con tus credenciales de Supabase (no subir a git):

```
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

4. Crea la tabla `todos` en Supabase (solo para pruebas):

- Entra al Dashboard de Supabase → SQL Editor → pega y ejecuta el contenido de `supabase/migrations/20251111021511_create_todos_table.sql`.
- Alternativa: usa `supabase` CLI y aplica la migración.

5. Inicia el servidor de desarrollo:

```powershell
pnpm run dev
```

Abre la URL que Vite muestra (por defecto `http://localhost:5173/`).

## Scripts útiles (en `package.json`)
- `pnpm dev` — arranca Vite en modo desarrollo
- `pnpm build` — genera build de producción
- `pnpm preview` — sirve el build localmente
- `pnpm lint` — ejecuta ESLint
- `pnpm typecheck` — corre `tsc --noEmit` para chequeo de tipos

## Uso de la app
- Añadir tarea: Escribe en el input superior y pulsa `Add`.
- Completar tarea: clic en el checkbox a la izquierda.
- Eliminar: clic en el icono de basura.
- Editar tarea: Haz doble clic sobre el título o pulsa `Edit` (aparece al pasar el ratón). Edita en el input y pulsa el check para guardar o `X` para cancelar.

La edición valida el título (no vacío, máximo 500 caracteres) y actualiza la fila en Supabase.

## Depuración / Problemas comunes
- Pantalla en blanco al cargar: revisa la consola del navegador. Si ves `Missing Supabase environment variables`, asegúrate de que `.env` contiene `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` y reinicia Vite.
- `pnpm` no encontrado: instala pnpm con `corepack enable && corepack prepare pnpm@latest --activate` o `npm i -g pnpm`.
- Errores 401/403 en llamadas a Supabase: usa la ANON key (no la service_role) y revisa las políticas RLS en la tabla `todos`.

## Siguientes pasos / mejoras sugeridas
- Proteger la API con Auth (usar `auth.users` y políticas RLS por usuario).
- Añadir tests unitarios/e2e.
- Añadir CI (GitHub Actions) que use `corepack` y `pnpm install --frozen-lockfile`.

---

Si quieres, puedo:
- Añadir un `.env.example` al repo con las variables VITE_
- Añadir un snippet de GitHub Actions para CI usando pnpm
- Implementar autenticación de usuarios y políticas RLS por usuario

Dime qué prefieres y lo hago.