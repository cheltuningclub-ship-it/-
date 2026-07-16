import { mouseTracker } from './mouse-tracker';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initMouseSpotlight(): () => void {
  const containers = document.querySelectorAll<HTMLElement>('[data-spotlight]');
  if (!containers.length || reducedMotion) return () => {};

  const cleanups: (() => void)[] = [];

  containers.forEach((container) => {
    const overlay = container.querySelector<HTMLElement>('.spotlight-overlay');
    const detail = container.querySelector<HTMLElement>('.spotlight-detail');
    if (!overlay) return;

    const radius = parseInt(container.dataset.spotlightRadius ?? '180', 10);

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      overlay.style.setProperty('--spot-x', `${x}px`);
      overlay.style.setProperty('--spot-y', `${y}px`);
      overlay.style.setProperty('--spot-radius', `${radius}px`);

      if (detail) {
        const relX = x / rect.width;
        const relY = y / rect.height;
        detail.style.transform = `translate(${(relX - 0.5) * 20}px, ${(relY - 0.5) * 20}px)`;
        detail.style.opacity = '1';
      }
    };

    const onLeave = () => {
      if (detail) {
        detail.style.opacity = '0';
        detail.style.transform = '';
      }
    };

    container.addEventListener('mousemove', onMove, { passive: true });
    container.addEventListener('mouseleave', onLeave);
    cleanups.push(() => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

export function initCursorGlow(): () => void {
  const glow = document.querySelector<HTMLElement>('.cursor-glow');
  if (!glow || reducedMotion) return () => {};

  return mouseTracker.subscribe(({ x, y }) => {
    glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}

export function initMagneticButtons(): () => void {
  const buttons = document.querySelectorAll<HTMLElement>('[data-magnetic]');
  if (!buttons.length || reducedMotion) return () => {};

  const cleanups: (() => void)[] = [];

  buttons.forEach((btn) => {
    const strength = parseFloat(btn.dataset.magnetic ?? '0.35');

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const onLeave = () => {
      btn.style.transform = '';
    };

    btn.addEventListener('mousemove', onMove, { passive: true });
    btn.addEventListener('mouseleave', onLeave);
    cleanups.push(() => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
