const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observerOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px 0px -8% 0px',
  threshold: [0, 0.15, 0.5],
};

export function initScrollReveal(): () => void {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!elements.length) return () => {};

  if (reducedMotion) {
    elements.forEach((el) => el.classList.add('is-revealed'));
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const delay = el.dataset.revealDelay ?? '0';
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-revealed');
        observer.unobserve(el);
      }
    }
  }, observerOptions);

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}

export function initStaggerReveal(): () => void {
  const groups = document.querySelectorAll<HTMLElement>('[data-stagger]');
  if (!groups.length) return () => {};

  if (reducedMotion) {
    groups.forEach((group) => {
      group.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-revealed'));
    });
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const group = entry.target as HTMLElement;
      const stagger = parseInt(group.dataset.stagger ?? '100', 10);
      const children = group.querySelectorAll<HTMLElement>('[data-reveal]');

      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * stagger}ms`;
        child.classList.add('is-revealed');
      });

      observer.unobserve(group);
    }
  }, observerOptions);

  groups.forEach((group) => observer.observe(group));

  return () => observer.disconnect();
}
