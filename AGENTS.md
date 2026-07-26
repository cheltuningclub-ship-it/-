# Chel Tuning Club

A static, single-page animated marketing website built with Vite + TypeScript (vanilla, no UI framework, zero runtime dependencies). See `README.md` for the feature overview and standard commands.

## Cursor Cloud specific instructions

- Requires Node 22 (matches `.github/workflows/deploy.yml`). npm is the package manager (`package-lock.json`).
- Run the app in dev with `npm run dev` (Vite dev server on http://localhost:5173). This is the only service.
- `npm run build` runs `tsc` (typecheck, no emit) then `vite build`; it is the closest thing to a lint/typecheck gate. There are no separate lint or test scripts.
- The page is animation-driven: sections start hidden/dark and fade in via scroll-reveal (IntersectionObserver), and images are lazy-loaded. Large dark gaps and initially-empty cards while scrolling are expected design, not rendering bugs.
