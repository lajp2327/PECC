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
- `CreateTicketForm.jsx` con drag & drop para evidencias y validación básica de 8D/IATF.
- `StatusTracker.jsx` con timeline horizontal.
- `SmartSurvey.tsx` (renderiza solo en estatus "Cerrado", escala visual y pregunta condicional si la nota < 3).
