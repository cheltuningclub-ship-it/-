import { initMouseParallax, initTiltCards } from './animations/parallax';
import { initScrollParallax, initScrollProgress } from './animations/scroll';
import { initScrollReveal, initStaggerReveal } from './animations/reveal';
import { initMouseSpotlight, initCursorGlow, initMagneticButtons } from './animations/spotlight';
import './styles/main.css';

function initNav(): () => void {
  const nav = document.querySelector<HTMLElement>('.site-nav');
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
  const links = document.querySelectorAll<HTMLElement>('.nav-links a');

  let scrolled = false;
  let rafId: number | null = null;

  const onScroll = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const isScrolled = window.scrollY > 60;
      if (isScrolled !== scrolled) {
        scrolled = isScrolled;
        nav?.classList.toggle('is-scrolled', isScrolled);
      }
    });
  };

  const closeMenu = () => nav?.classList.remove('is-open');

  toggle?.addEventListener('click', () => nav?.classList.toggle('is-open'));
  links.forEach((link) => link.addEventListener('click', closeMenu));

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  return () => {
    window.removeEventListener('scroll', onScroll);
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}

function initCounterAnimation(): () => void {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (!counters.length) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const target = parseInt(el.dataset.counter ?? '0', 10);
        const suffix = el.dataset.counterSuffix ?? '';
        const duration = 1800;
        const start = performance.now();

        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = `${Math.round(target * eased)}${suffix}`;
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
  return () => observer.disconnect();
}

function init(): void {
  const cleanups = [
    initNav(),
    initMouseParallax(document.body),
    initTiltCards(),
    initScrollParallax(),
    initScrollProgress(),
    initScrollReveal(),
    initStaggerReveal(),
    initMouseSpotlight(),
    initCursorGlow(),
    initMagneticButtons(),
    initCounterAnimation(),
  ];

  document.documentElement.classList.add('is-ready');

  window.addEventListener('beforeunload', () => {
    cleanups.forEach((fn) => fn());
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
