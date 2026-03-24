# raffles_remake-frontend

## Descripcion
Frontend remake del sistema de rifas. React 19 con TypeScript.

## Stack
- **Framework:** React 19
- **Lenguaje:** TypeScript
- **Build:** Vite 8
- **UI:** Material UI (MUI) v7 + Bootstrap 5
- **Formularios:** React Hook Form + Zod (validacion)
- **HTTP:** Axios
- **Router:** React Router DOM v7
- **Linting:** ESLint 9 + typescript-eslint

## Estructura src/
- `app/` - Estructura principal de la app (probablemente layouts/pages)
- `components/` - Componentes reutilizables
- `hooks/` - Custom hooks
- `interfaces/` - Tipos TypeScript (interfaces)
- `types/` - Tipos adicionales
- `schemas/` - Schemas de validacion Zod
- `services/` - Llamadas a la API (axios)
- `constants/` - Constantes globales
- `utils/` - Utilidades generales
- `plugin/` - Configuracion de plugins
- `AppRoutes.tsx` - Definicion de rutas

## Comandos
```bash
npm run dev     # Servidor de desarrollo
npm run build   # Build produccion (tsc + vite build)
npm run lint    # ESLint
npm run preview # Preview del build
```

## Notas
- Usa TypeScript estricto (tsconfig.app.json + tsconfig.node.json)
- Proyecto remake/en desarrollo activo
- Validacion de formularios con Zod + react-hook-form + @hookform/resolvers
- Paginacion async en selects: react-select-async-paginate
