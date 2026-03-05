## Integration: lovable + MeetingMind AI

This document describes how the `meetingmind-ai-final` project is integrated into the `meeting-mind-ai-uk` repository and how to run the combined stack.

### Folder layout

- `./` — lovable landing page (Vite React app)
- `./meetingmind-ai-final/meetingmind-frontend` — MeetingMind full-stack app (Vite React client + Express/tRPC backend)
- `./infra/nginx` — NGINX reverse proxy and static hosting
- `./scripts` — helper scripts for build, dev, and verification

### Routing

- `http://localhost:8080/lovable/` → lovable landing page (root app build)
- `http://localhost:8080/meetingmind/` → MeetingMind landing page (static build from `meetingmind-frontend`)
- `http://localhost:8080/api/` → proxied to MeetingMind backend (`meetingmind-backend` container on port 3000)

### Local runbook

1. Copy env file:

   ```bash
   cp .env.example .env
   # Edit .env to set real secrets
   ```

2. Build all artifacts:

   ```bash
   ./scripts/build-all.sh
   ```

3. Start Docker stack:

   ```bash
   ./scripts/dev-up.sh
   ```

4. Verify:

   ```bash
   ./scripts/verify-deploy.sh
   # Then open:
   # - http://localhost:8080/lovable/
   # - http://localhost:8080/meetingmind/
   ```

### Mermaid network diagram

```mermaid
graph LR
  subgraph Browser
    A[User]
  end

  subgraph Docker
    NGINX[nginx reverse proxy]
    MMFE[meetingmind-frontend (backend)]
    DB[(MySQL)]
  end

  A -->|/lovable/| NGINX
  A -->|/meetingmind/| NGINX
  A -->|/api/..| NGINX

  NGINX -->|/api/*| MMFE
  MMFE -->|DATABASE_URL| DB
```

