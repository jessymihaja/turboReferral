# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TurboReferral is a referral link/code sharing platform with community validation, moderation, and reputation systems. Users share referral links for services (Shopping, Mobility, Games, Finance, etc.), vote on their validity, and earn reputation. Admins validate services and moderate reported content.

## Architecture

### Monorepo Structure
- `/client` - React frontend (Vite)
- `/server` - Node.js/Express backend (CommonJS)

The codebase uses a traditional monorepo with separate client and server directories, each with their own package.json.

### Backend Architecture (Express/MongoDB)

**Core Models** (all in `/server/models/`):
- `User` - Authentication with bcrypt, role-based access (user/admin), tracks deletedReferralsCount
- `Service` - Services that can have referrals (requires admin validation, auto-extracts websiteDomain)
- `Referral` - Either a link OR code (never both), belongs to a Service and User
- `PromReferral` - Time-limited promotions for referrals (dateDebut/dateFin validation)
- `Category` - Service categories (Shopping, Mobility, Games, etc.)
- `ReferralVote` - Binary voting (good/bad) on referral validity
- `Report` - User reports with reasons (Brisé, Trompeur, Abusif, Autre)
- `Notification` - In-app notification system
- `ServiceRequest` - User requests for new services (pending admin approval)

**Authentication Flow**:
- JWT-based auth stored in localStorage on client
- Middleware: `authenticateToken` verifies JWT and attaches user to req
- Role middleware: `requireRole(...)` and `requireAdmin` for protected routes
- UserContext (React) manages login/logout and persists to localStorage

**Routes Pattern** (`/server/routes/`):
All routes follow pattern: `/api/{resource}` except admin routes use `/api/admin/*`
- authRoute, serviceRoute, referralRoute, categoryRoute
- referralVoteRoutes, reportRoute, notificationRoute
- promReferralRoute, serviceRequestRoute, adminRoute

**Key Validation Rules** (`/server/config/constants.js`):
- Referral: Must have link XOR code, never both (validated in pre-save hook)
- Service: Website domain auto-extracted and must be unique
- PromReferral: dateFin must be after dateDebut
- Comments: Max 300 chars, Descriptions: Max 100 chars
- File uploads: 5MB max, images only (jpeg/jpg/png/gif/webp)

**i18n System**:
- Backend uses custom i18n utility (`/server/utils/i18n.js`)
- French locale: `/server/locales/fr.json` contains all translations
- Import with `const { t } = require('../utils/i18n')`
- Usage: `t('validation.emailRequired')` or `t('validation.usernameMinLength', { min: 3 })`

**Error Handling**:
- asyncHandler wraps all async route handlers
- ResponseHandler utility provides consistent API responses
- errorHandler middleware catches all errors

### Frontend Architecture (React)

**Routing** (`/client/src/App.jsx`):
- Public: `/`, `/services/:id`, `/login`, `/register`, `/notifications`, `/politique-confidentialite`
- Protected (ProtectedRoute): `/dashboard`
- Admin-only (AdminRoute): `/admin`, `/admin/referrals`, `/categories`, `/pending-reports`

**Context**:
- UserContext provides global user state, token, login/logout functions
- Persists user + token to localStorage

**Component Patterns**:
- ProtectedRoute/AdminRoute wrap routes requiring authentication
- Modal components for forms (ModalAddService, ModalUpdateService, ModalValidateService, etc.)
- Table component for data display
- TimeAgo for relative timestamps
- CustomToast for notifications

**Key Pages**:
- Home: Search services, browse by category
- ServiceDetail: View referrals for a service, vote, comment, report
- Dashboard: User's referrals, stats, reputation
- AdminDashboard: Validate services, view stats
- PendingReports: Moderate reported referrals

## Development Commands

### Client (from `/client`)
```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
```

### Server (from `/server`)
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Production start
npm run seed     # Seed database (runs /server/seeds/seed.js)
```

### Running Both
Typically run two terminals:
1. `cd client && npm run dev` (usually http://localhost:5173)
2. `cd server && npm run dev` (check `/server/config/env.js` for port, typically 5000)

## Important Patterns

### Adding a New Model
1. Create schema in `/server/models/` with i18n validation messages
2. Add pre-save/pre-validate hooks if needed
3. Create controller in `/server/controllers/`
4. Create route in `/server/routes/`
5. Register route in `/server/server.js`
6. Add translations to `/server/locales/fr.json`

### Referral Validation
Referrals MUST have either `link` OR `code`, enforced by pre-validate hook in Referral model. Always check this constraint when creating/updating referrals.

### Service Validation
Services require admin approval (`isValidated: true`) before users can add referrals to them. Check `isValidated` status when allowing referral creation.

### Authentication in API Calls
Always include JWT token in Authorization header:
```javascript
headers: { 'Authorization': `Bearer ${token}` }
```

### Constants Usage
Import from `/server/config/constants.js` for:
- ROLES (USER, ADMIN)
- VOTE_TYPES (GOOD, BAD)
- REPORT_REASONS, REPORT_STATUS
- SERVICE_REQUEST_STATUS (PENDING, APPROVED, REJECTED)
- FILE_UPLOAD constraints
- VALIDATION rules (MAX_COMMENT_LENGTH, MAX_DESCRIPTION_LENGTH, URL_REGEX)

## Database

MongoDB via Mongoose. Connection configured in `/server/config/database.js`.

**Seeding**: `npm run seed` from `/server` directory runs `/server/seeds/seed.js`

## Configuration

Server environment variables in `/server/config/env.js`:
- Database URL
- JWT secret
- Port
- Other env-specific settings

Client uses Vite's env system (prefix with `VITE_`).

## Key Business Logic

**Reputation System**: Users earn reputation from:
- Ratio of valid/invalid referrals (based on votes)
- Vote volume
- Account age
- Badges: Fiable (green), Neutre (yellow), Risqué (red)

**Referral Lifecycle**:
1. User submits referral for validated service
2. Community votes (good/bad)
3. If highly negative votes → auto-flagged/hidden
4. Reports trigger "À vérifier" status
5. Admin can delete, warn user, or restore

**Service Request Flow**:
1. User requests new service with category
2. Status: "pending"
3. Admin approves/rejects in admin panel
4. If approved → becomes available for referrals

**Promotional Referrals**:
- Time-limited boost (dateDebut to dateFin)
- Featured in lists/carousels
- Managed by PromReferral model


# !!! IMPORTANT
- Don't add unecessary code and comments
- Always consider clean code and reusability, security, make it simple, focused on the task, human-like
- Always cleanup unused/old files and codes
- Don't add README.md or any docs unless asked specifically
- Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.
- All text should be in French, including errors