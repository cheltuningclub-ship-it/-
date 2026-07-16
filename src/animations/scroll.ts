const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initScrollParallax(): () => void {
  const elements = document.querySelectorAll<HTMLElement>('[data-scroll-parallax]');
  if (!elements.length || reducedMotion) return () => {};

  const configs = Array.from(elements).map((el) => ({
    el,
    speed: parseFloat(el.dataset.scrollParallax ?? '0.3'),
  }));

  let rafId: number | null = null;

  const update = () => {
    rafId = null;
    const viewportH = window.innerHeight;

    for (const { el, speed } of configs) {
      const rect = el.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - viewportH / 2;
      const translateY = centerOffset * speed * -1;
      el.style.transform = `translate3d(0, ${translateY}px, 0)`;
    }
  };

  const onScroll = () => {
    if (rafId === null) rafId = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();

  return () => {
    window.removeEventListener('scroll', onScroll);
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}

export function initScrollProgress(): () => void {
  const bar = document.querySelector<HTMLElement>('.scroll-progress-bar');
  if (!bar || reducedMotion) return () => {};

  let rafId: number | null = null;

  const update = () => {
    rafId = null;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleX(${progress})`;
  };

  const onScroll = () => {
    if (rafId === null) rafId = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();

  return () => {
    window.removeEventListener('scroll', onScroll);
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}
