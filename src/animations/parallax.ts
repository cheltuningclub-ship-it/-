import { mouseTracker } from './mouse-tracker';

interface ParallaxLayerConfig {
  depth: number;
  axis?: 'both' | 'x' | 'y';
}

export function initMouseParallax(container: HTMLElement): () => void {
  const layers = container.querySelectorAll<HTMLElement>('[data-parallax-depth]');
  if (!layers.length || mouseTracker.isReducedMotion) return () => {};

  const configs = new Map<HTMLElement, ParallaxLayerConfig>();

  layers.forEach((layer) => {
    const depth = parseFloat(layer.dataset.parallaxDepth ?? '0.05');
    const axis = (layer.dataset.parallaxAxis as ParallaxLayerConfig['axis']) ?? 'both';
    configs.set(layer, { depth, axis });
  });

  return mouseTracker.subscribe(({ normalizedX, normalizedY }) => {
    for (const [layer, { depth, axis }] of configs) {
      const tx = axis !== 'y' ? normalizedX * depth * 100 : 0;
      const ty = axis !== 'x' ? normalizedY * depth * 100 : 0;
      layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    }
  });
}

export function initTiltCards(): () => void {
  const cards = document.querySelectorAll<HTMLElement>('[data-tilt]');
  if (!cards.length || mouseTracker.isReducedMotion) return () => {};

  const cleanups: (() => void)[] = [];

  cards.forEach((card) => {
    const maxTilt = parseFloat(card.dataset.tilt ?? '8');
    const glare = card.querySelector<HTMLElement>('.tilt-glare');

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * maxTilt;
      const rotateY = (x - 0.5) * maxTilt;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
        glare.style.opacity = '1';
      }
    };

    const onLeave = () => {
      card.style.transform = '';
      if (glare) glare.style.opacity = '0';
    };

    card.addEventListener('mousemove', onMove, { passive: true });
    card.addEventListener('mouseleave', onLeave);
    cleanups.push(() => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
