(() => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector("[data-lead-form]");
  const status = document.querySelector("[data-form-status]");
  const cookie = document.querySelector("[data-cookie]");
  const cookieKey = "im_cookie_consent_v1";

  if (year) year.textContent = String(new Date().getFullYear());

  /* Header scroll state */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  if (toggle && header && menu) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("is-nav-open", open);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("is-nav-open");
      });
    });
  }

  /* Lead form (client-side stub) */
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const consent = form.querySelector('input[name="pd_consent"]');

      if (!name || !phone) {
        if (status) {
          status.textContent = "Укажите имя и телефон.";
          status.classList.add("is-error");
        }
        return;
      }

      if (consent && !consent.checked) {
        if (status) {
          status.textContent = "Нужно согласие на обработку персональных данных.";
          status.classList.add("is-error");
        }
        return;
      }

      if (status) {
        status.classList.remove("is-error");
        status.textContent = "Заявка принята. Мы свяжемся с вами в рабочее время.";
      }
      form.reset();
    });
  }

  /* Cookie banner */
  if (cookie) {
    const saved = localStorage.getItem(cookieKey);
    if (!saved) cookie.hidden = false;

    const setConsent = (value) => {
      localStorage.setItem(cookieKey, value);
      cookie.hidden = true;
    };

    cookie.querySelector("[data-cookie-accept]")?.addEventListener("click", () => setConsent("all"));
    cookie.querySelector("[data-cookie-reject]")?.addEventListener("click", () => setConsent("necessary"));
  }
})();
