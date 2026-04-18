# Opportunity Inbox Copilot

FastAPI + Vue.js hackathon starter for parsing student opportunity emails, extracting structured opportunity data, and ranking results with deterministic scoring.

## Stack

- Backend: FastAPI (Python)
- Frontend: Vue 3 + Vite

## Quick start

```bash
# backend
cd backend && uv sync && uv run fastapi dev app/main.py --host 0.0.0.0 --port 3002

# frontend (new terminal)
cd frontend && pnpm install && pnpm dev
```

Frontend: http://localhost:8078  
API docs: http://localhost:3002/docs
