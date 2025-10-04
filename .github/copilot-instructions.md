# Copilot Instructions for TurboReferral

Monorepo overview
- client: React + Vite (ESM)
- server: Node.js + Express + MongoDB (CommonJS)
- Start dev: client `npm run dev` (http://localhost:5173), server `npm run dev` (http://localhost:5000). Seed test data: `cd server && npm run seed` (destructive).

Architecture and cross-cutting patterns
- Server layering: config → utils → middlewares → models → controllers → routes. Wire routes in `server/server.js` under `/api/*`.
- Config/env: `server/config/env.js` requires MONGO_URI and JWT_SECRET. DB connect in `server/config/database.js`.
- Constants: use `server/config/constants.js` (ROLES, VOTE_TYPES, VALIDATION, FILE_UPLOAD, etc.). Mirror client constants in `client/src/config/constants.js` for endpoints and enums.
- Error/response: throw `AppError(message, statusCode)` or let Mongoose errors bubble; centralized `errorHandler` shapes JSON. For success, use `ResponseHandler.success/created`.
- Auth: `authenticateToken` reads Bearer token, attaches `req.user`; `requireAdmin` enforces RBAC. Serve static uploads at `/uploads`.
- File upload: `middlewares/uploadLogo.js` via multer → saves to `server/uploads/logos`, max 5MB, jpeg/jpg/png/gif/webp only.

Server code conventions
- Controllers: wrap with `utils/asyncHandler`; never call `res.json` directly without the handler.
- Routes: always validate first using `utils/validators` (e.g., `idValidator`, `serviceValidators.create`).
- Models: Referral enforces XOR link/code (pre-validate). ReferralVote has unique (referral,user) index. Use constants for enums and limits.

Client code conventions
- All HTTP goes through `client/src/services/api.js` (ApiService). It auto-attaches `Authorization: Bearer <token>` from `STORAGE_KEYS.TOKEN`. Use `postFormData` for uploads.
- Define endpoints in `client/src/config/constants.js` and consume via `client/src/services/*`. Don’t call fetch directly from components.
- Auth state lives in `contexts/UserContext.jsx` (localStorage keys in `STORAGE_KEYS`). Routing uses React Router v7.

End-to-end flow when adding a feature
1) Backend: add model (if needed) → validators → controller (asyncHandler + ResponseHandler/AppError) → route → mount in `server/server.js`.
2) Client: add endpoint in constants → add service method → call from pages/components/hooks → handle errors surfaced by ApiService.

Minimal examples
- Route + controller pattern:
```js
// routes/exampleRoute.js
const router = require('express').Router();
const { idValidator } = require('../utils/validators');
const ctrl = require('../controllers/exampleController');
router.get('/:id', idValidator, ctrl.getById);
module.exports = router;

// controllers/exampleController.js
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { AppError } = require('../utils/errorHandler');
exports.getById = asyncHandler(async (req, res) => {
  const data = await Model.findById(req.params.id);
  if (!data) throw new AppError('Resource not found', 404);
  return ResponseHandler.success(res, data, 'Fetched');
});
```

AI agent ops
- Keep changes small and in-pattern; don’t introduce new frameworks.
- Don’t add docs/README unless asked; minimize comments.
- When you need library/setup docs, use Context7 MCP to resolve the library and fetch docs automatically.
