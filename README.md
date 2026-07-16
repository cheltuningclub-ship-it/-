# Chel Tuning Club

A visually rich, performance-first website for Chel Tuning Club with scroll and mouse-driven animations.

## Features

- **Mouse parallax** — Hero background layers follow cursor movement
- **Scroll parallax** — Images shift at different speeds while scrolling
- **Spotlight reveal** — Gallery details appear through a cursor-following mask
- **3D tilt cards** — Service cards tilt and glare on hover
- **Scroll reveals** — Staggered fade-in animations via Intersection Observer
- **Magnetic buttons** — CTAs subtly follow the cursor
- **Cursor glow** — Ambient light effect tracking mouse position

## Performance

- GPU-accelerated transforms only (`translate3d`, `scale`, `rotate`)
- `requestAnimationFrame` throttling for all scroll/mouse handlers
- Lazy-loaded images with explicit dimensions
- `prefers-reduced-motion` support
- Minimal JS bundle (~3KB gzipped)
- No animation libraries — zero runtime dependencies

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
