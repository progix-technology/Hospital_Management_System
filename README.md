# HMS (Hospital Management System)

Short overview
- Fullstack hospital management system with an Express + MongoDB backend and a Vite + React frontend.

Repository layout
- `backend/` — Node (Express) API server (MongoDB, JWT auth).
- `frontend/` — Vite + React single-page app.

Quick local setup

Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB connection (Atlas or local)

Backend

1. Copy and edit env file:

   - Create `backend/.env` from `backend/.env.example` and set `MONGO_URI`, `JWT_SECRET`, and other keys.

2. Install and run:

```bash
cd backend
npm install
# development
npm run dev
# production
npm start
```

Frontend

1. Copy env file:

   - Create `frontend/.env` from `frontend/.env.example` and set `VITE_API_BASE_URL` if needed.

2. Install and run:

```bash
cd frontend
npm install
npm run dev
# build
npm run build
```

Environment variables

- `backend/.env.example` lists the backend vars the app expects (MONGO_URI, JWT_SECRET, CLOUDINARY_* if used).
- `frontend/.env.example` shows frontend vars (VITE_API_BASE_URL).

.gitignore

- A sensible `.gitignore` is included to exclude `node_modules`, `.env`, build outputs and OS files.

Deploying

Vercel (Frontend)
- Recommended for the frontend SPA.
- Create a new Vercel project and point it to the repository. Set the project root to `frontend/`.
- Build command: `npm run build` and Output directory: `dist`.
- Add any environment variables under Project Settings → Environment Variables (e.g. `VITE_API_BASE_URL`).

Render (Backend & Frontend)
- You can deploy backend and frontend as separate services in Render.
- A `render.yaml` template is included — update `repo` and `service` names and environment values.

Notes & tips
- Keep secrets out of Git. Use the hosting provider's environment variable UI.
- When deploying the backend, make sure `MONGO_URI` and `JWT_SECRET` are set.
- For Vercel, if you prefer a monorepo setup, create two projects: one for `frontend/` and one for `backend/` (or host backend elsewhere).

Files added
- `README.md` — this file
- `.gitignore` — common ignores
- `backend/.env.example` — example env for backend
- `frontend/.env.example` — example env for frontend
- `render.yaml` — Render template (update placeholders)
- `vercel.json` — optional Vercel config template

If you want, I can also:
- add GitHub Actions CI to run lint/tests on push,
- create a `Dockerfile` and `docker-compose.yml` for local containerized development,
- or finish Render/Vercel templates with your repository details.

---
Feel free to tell me which provider you prefer and I can fill in the repo-specific values.
