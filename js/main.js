(() => {
  const COOKIE_KEY = "im_cookie_consent_v1";

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  const banner = document.querySelector("[data-cookie-banner]");
  const acceptBtn = document.querySelector("[data-cookie-accept]");
  const necessaryBtn = document.querySelector("[data-cookie-necessary]");

  const saveConsent = (value) => {
    try {
      localStorage.setItem(
        COOKIE_KEY,
        JSON.stringify({ value, at: new Date().toISOString() })
      );
    } catch (_) {
      /* ignore */
    }
    if (banner) banner.classList.remove("is-visible");
  };

  if (banner) {
    let existing = null;
    try {
      existing = localStorage.getItem(COOKIE_KEY);
    } catch (_) {
      existing = null;
    }
    if (!existing) {
      banner.classList.add("is-visible");
    }
  }

  acceptBtn?.addEventListener("click", () => saveConsent("all"));
  necessaryBtn?.addEventListener("click", () => saveConsent("necessary"));

  document.querySelectorAll("[data-lead-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector("[data-form-status]");
      const consent = form.querySelector("[name='consent']");
      const name = form.querySelector("[name='name']");
      const phone = form.querySelector("[name='phone']");

      if (!name?.value.trim() || !phone?.value.trim()) {
        if (status) {
          status.textContent = "Укажите имя и телефон.";
          status.className = "form-status err";
        }
        return;
      }

      if (consent && !consent.checked) {
        if (status) {
          status.textContent =
            "Нужно согласие на обработку персональных данных.";
          status.className = "form-status err";
        }
        return;
      }

      const email = form.querySelector("[name='email']")?.value.trim() || "";
      const message =
        form.querySelector("[name='message']")?.value.trim() || "";
      const subject = encodeURIComponent("Заявка с сайта intellect-media.ru");
      const body = encodeURIComponent(
        [
          `Имя: ${name.value.trim()}`,
          `Телефон: ${phone.value.trim()}`,
          email ? `E-mail: ${email}` : "",
          message ? `Сообщение: ${message}` : "",
          "",
          "Согласие на обработку ПДн: да",
        ]
          .filter(Boolean)
          .join("\n")
      );

      if (status) {
        status.textContent =
          "Заявка подготовлена. Откроется почтовая программа для отправки.";
        status.className = "form-status ok";
      }

      window.location.href = `mailto:info@intellect-media.ru?subject=${subject}&body=${body}`;
      form.reset();
    });
  });

  const yearNodes = document.querySelectorAll("[data-year]");
  yearNodes.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
