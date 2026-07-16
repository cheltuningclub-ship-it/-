export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

type MouseListener = (pos: MousePosition) => void;

class MouseTracker {
  private listeners = new Set<MouseListener>();
  private rafId: number | null = null;
  private pendingX = 0;
  private pendingY = 0;
  private width = window.innerWidth;
  private height = window.innerHeight;
  private reducedMotion = false;

  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.addEventListener('mousemove', this.onMove, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
  }

  private onResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  };

  private onMove = (e: MouseEvent) => {
    this.pendingX = e.clientX;
    this.pendingY = e.clientY;
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  private tick = () => {
    this.rafId = null;
    const pos = this.getPosition(this.pendingX, this.pendingY);
    for (const listener of this.listeners) {
      listener(pos);
    }
  };

  private getPosition(x: number, y: number): MousePosition {
    return {
      x,
      y,
      normalizedX: (x / this.width) * 2 - 1,
      normalizedY: (y / this.height) * 2 - 1,
    };
  }

  subscribe(listener: MouseListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  get isReducedMotion(): boolean {
    return this.reducedMotion;
  }
}

export const mouseTracker = new MouseTracker();
