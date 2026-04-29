# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability [SECURITY]

**Do NOT open a public GitHub issue for security vulnerabilities.**

Report vulnerabilities privately to: **security@votesmart-ai.example.com**

Please include:
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (optional)

We will acknowledge your report within **48 hours** and aim to release a fix within **14 days** for critical issues.

## Security Measures Implemented

### API Key Protection
- `GEMINI_API_KEY` is stored **only** on the Cloud Functions backend — never in frontend code or build artifacts
- The key is injected via Cloud Run environment variable, sourced from Secret Manager

### Input Validation
- All user inputs are length-capped at the source (`maxLength` on `<input>` elements)
- Backend Cloud Functions validate request body structure before forwarding to Gemini API
- All claim/myth inputs are capped at 500 characters server-side

### XSS Prevention
- **No `dangerouslySetInnerHTML`** used anywhere in the application
- All dynamic text is rendered through React's JSX escaping
- Markdown rendering uses a custom safe parser (no `innerHTML`)

### HTTP Security Headers (nginx)
The production nginx configuration enforces:
- `Content-Security-Policy` — restricts `script-src`, `connect-src`, no `unsafe-eval`
- `Strict-Transport-Security` — HSTS with 1-year max-age
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — disables camera, microphone, geolocation

### CORS Policy
- Backend Cloud Functions whitelist **only** the deployed Cloud Run origin
- Development allows `localhost:5173` only
- Wildcard `*` origins are never permitted

### Rate Limiting
- Cloud Functions enforce per-IP rate limiting on `/api/chat` and `/api/myth`
- Frontend debounces myth-checker submissions

### Dependency Vulnerabilities
- Development-only vulnerability: `esbuild` (via Vite dev server) — does **not** affect production builds or end users
- Production image contains only the static build artifact + nginx — no Node.js runtime exposed
