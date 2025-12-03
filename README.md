# PECC

Portal de Experiencia del Cliente y Calidad (PECC) - MVP.

## Estructura de carpetas (Clean Architecture)
```
backend/
  src/
    domain/        # Entidades y contratos
    application/   # Casos de uso y servicios (auth)
    infrastructure/# Implementaciones concretas (repositorios)
    presentation/  # Capas de entrada (HTTP API)
frontend/
  src/
    components/    # Componentes clave de UI
_db/schema.sql_
```

## Autenticación
- JWT para clientes externos con expiración corta. La carga útil incluye `sub`, `email` y `name` para integrarse en el futuro con Azure AD B2C (objectId se puede agregar como claim).
- Middleware que valida el token en cada endpoint protegido.
- Para producción: rotar secretos, validar contraseña con hash seguro (bcrypt/argon2) y permitir emisores externos (B2C) mediante validación de JWKs.

## Endpoints principales
- `POST /api/auth/login` (entrega JWT tras validar credenciales del cliente).
- `POST /api/tickets` (crea RMA con carga de evidencias; deja comentada la integración a Dynamics 365/Dataverse).
- `GET /api/tickets/:id` (detalle y tracker de estatus).
- `POST /api/surveys` (encuesta NPS/CSAT inteligente ligada al ticket y cierre).

## Frontend
Componentes de UI listos para integrar con la API:
codex/create-mvp-for-pecc-portal-si7q5q
- `CreateTicketForm.tsx` con drag & drop para evidencias y validación básica de 8D/IATF.
- `StatusTracker.tsx` con timeline horizontal.
- `SmartSurvey.tsx` (renderiza solo en estatus "Cerrado", escala visual y pregunta condicional si la nota < 3).

## Cómo visualizar el MVP

### Backend (API)
1. `cd backend`
2. `npm install`
3. `npm run dev`
   - La API quedará en `http://localhost:3000`. Incluye CORS habilitado para el frontend.

### Frontend (demo Vite + Tailwind)
1. `cd frontend`
2. `npm install`
3. `npm run dev`
   - Abre `http://localhost:5173` y verás:
     - Formulario para crear RMA con drag & drop.
     - Tracker visual de estatus (puedes avanzar con el botón y, si la API está arriba, usará datos reales).
     - Encuesta inteligente que aparece cuando el estatus llega a "Cerrado".

> El frontend intenta autenticarse automáticamente con `/api/auth/login` usando `demo@cliente.com`. Si la API no está corriendo, opera en modo demo local.
- `CreateTicketForm.jsx` con drag & drop para evidencias y validación básica de 8D/IATF.
- `StatusTracker.jsx` con timeline horizontal.
- `SmartSurvey.tsx` (renderiza solo en estatus "Cerrado", escala visual y pregunta condicional si la nota < 3).

