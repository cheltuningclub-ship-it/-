(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (prefersReduced) document.body.classList.add("reduced-motion");
  if (hasFinePointer) document.body.classList.add("has-pointer");

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  const state = {
    mx: window.innerWidth * 0.5,
    my: window.innerHeight * 0.5,
    tx: window.innerWidth * 0.5,
    ty: window.innerHeight * 0.5,
    scrollY: window.scrollY,
    targetScroll: window.scrollY,
    ticking: false,
  };

  const glow = document.querySelector("[data-cursor-glow]");
  const progressBar = document.querySelector("[data-scroll-progress]");

  const mouseLayers = [...document.querySelectorAll("[data-mouse-depth]")].map((el) => ({
    el,
    depth: parseFloat(el.getAttribute("data-mouse-depth") || "0.05"),
  }));

  const scrollLayers = [...document.querySelectorAll("[data-scroll-speed]")].map((el) => ({
    el,
    speed: parseFloat(el.getAttribute("data-scroll-speed") || "0.3"),
    hasMouse: el.hasAttribute("data-mouse-depth"),
  }));

  /* Spotlight */
  const spotlight = document.querySelector("[data-spotlight]");
  const lens = document.querySelector("[data-spotlight-lens]");
  const revealImgs = spotlight ? [...spotlight.querySelectorAll("[data-reveal-img]")] : [];
  let spotlightActive = false;
  let spotlightRect = null;

  const updateSpotlightRect = () => {
    if (spotlight) spotlightRect = spotlight.getBoundingClientRect();
  };

  if (spotlight && hasFinePointer && !prefersReduced) {
    spotlight.addEventListener("pointerenter", () => {
      spotlightActive = true;
      spotlight.classList.add("is-active");
      updateSpotlightRect();
    });
    spotlight.addEventListener("pointerleave", () => {
      spotlightActive = false;
      spotlight.classList.remove("is-active");
    });
    window.addEventListener("resize", updateSpotlightRect, { passive: true });
    updateSpotlightRect();
  }

  function updateSpotlightMask(x, y) {
    if (!spotlight || !spotlightActive || !spotlightRect) return;
    const localX = x - spotlightRect.left;
    const localY = y - spotlightRect.top;
    revealImgs.forEach((img) => {
      const panel = img.closest(".spotlight__panel");
      if (!panel) return;
      const r = panel.getBoundingClientRect();
      const px = ((x - r.left) / Math.max(r.width, 1)) * 100;
      const py = ((y - r.top) / Math.max(r.height, 1)) * 100;
      const mask = `radial-gradient(circle 170px at ${px}% ${py}%, #000 0%, #000 38%, transparent 72%)`;
      img.style.webkitMaskImage = mask;
      img.style.maskImage = mask;
    });
    if (lens) {
      lens.style.transform = `translate3d(${localX}px, ${localY}px, 0) translate(-50%, -50%)`;
    }
  }

  /* Tilt */
  if (hasFinePointer && !prefersReduced) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener(
        "pointermove",
        (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 8}deg)`;
        },
        { passive: true }
      );
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });

    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener(
        "pointermove",
        (e) => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2);
          const y = e.clientY - (r.top + r.height / 2);
          btn.style.transform = `translate3d(${x * 0.22}px, ${y * 0.28}px, 0)`;
        },
        { passive: true }
      );
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* Reveals */
  const reveals = document.querySelectorAll("[data-reveal]");
  reveals.forEach((el) => {
    const delay = el.getAttribute("data-reveal-delay");
    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  document.querySelectorAll("[data-stagger]").forEach((group) => {
    [...group.children].forEach((child, i) => {
      if (child.hasAttribute("data-reveal")) {
        child.style.setProperty("--reveal-delay", `${i * 90}ms`);
      }
    });
  });

  if (prefersReduced) {
    reveals.forEach((el) => el.classList.add("is-inview"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* Counters */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const run = () => {
      const target = parseInt(el.getAttribute("data-count") || "0", 10);
      const suffix = el.getAttribute("data-count-suffix") || "";
      if (prefersReduced) {
        el.textContent = `${target}${suffix}`;
        return;
      }
      const start = performance.now();
      const duration = 1400;
      const step = (now) => {
        const t = clamp((now - start) / duration, 0, 1);
        const eased = 1 - (1 - t) ** 3;
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            run();
            cio.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      cio.observe(el);
    } else {
      run();
    }
  });

  function requestTick() {
    if (state.ticking) return;
    state.ticking = true;
    requestAnimationFrame(frame);
  }

  function frame() {
    state.ticking = false;
    state.mx = lerp(state.mx, state.tx, 0.14);
    state.my = lerp(state.my, state.ty, 0.14);
    state.scrollY = lerp(state.scrollY, state.targetScroll, 0.16);

    const nx = state.mx / window.innerWidth - 0.5;
    const ny = state.my / window.innerHeight - 0.5;

    if (glow && hasFinePointer && !prefersReduced) {
      glow.style.transform = `translate3d(${state.mx}px, ${state.my}px, 0)`;
    }

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? state.targetScroll / max : 0;
      progressBar.style.transform = `scaleX(${clamp(p, 0, 1)})`;
    }

    if (!prefersReduced) {
      mouseLayers.forEach(({ el, depth }) => {
        const x = nx * depth * -90;
        const y = ny * depth * -70;
        const speed = el.hasAttribute("data-scroll-speed")
          ? parseFloat(el.getAttribute("data-scroll-speed") || "0")
          : 0;
        const scrollY = state.scrollY * speed * 0.18;
        el.style.transform = `translate3d(${x}px, ${y + scrollY}px, 0)`;
      });

      scrollLayers.forEach(({ el, speed, hasMouse }) => {
        if (hasMouse) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5 - window.innerHeight * 0.5;
        el.style.transform = `translate3d(0, ${center * speed * -0.35}px, 0)`;
      });
    }

    if (spotlightActive) updateSpotlightMask(state.mx, state.my);

    if (
      Math.abs(state.mx - state.tx) > 0.15 ||
      Math.abs(state.my - state.ty) > 0.15 ||
      Math.abs(state.scrollY - state.targetScroll) > 0.15
    ) {
      requestTick();
    }
  }

  window.addEventListener(
    "pointermove",
    (e) => {
      state.tx = e.clientX;
      state.ty = e.clientY;
      requestTick();
    },
    { passive: true }
  );

  window.addEventListener(
    "scroll",
    () => {
      state.targetScroll = window.scrollY || window.pageYOffset;
      requestTick();
    },
    { passive: true }
  );

  requestTick();
})();
