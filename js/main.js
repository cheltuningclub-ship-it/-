(function () {
  'use strict';

  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-mobile');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  function injectFooterLegal() {
    const cfg = window.SITE_CONFIG?.company;
    const el = document.getElementById('footer-legal-text');
    if (!cfg || !el) return;

    el.innerHTML = `
      <p><strong>${cfg.legalName}</strong></p>
      <p>ИНН: ${cfg.inn} | ОГРН: ${cfg.ogrn}${cfg.kpp ? ' | КПП: ' + cfg.kpp : ''}</p>
      <p>Юридический адрес: ${cfg.legalAddress}</p>
      <p>Фактический адрес: ${cfg.actualAddress}</p>
      <p>Телефон: <a href="${cfg.phoneHref}">${cfg.phone}</a> | E-mail: <a href="mailto:${cfg.email}">${cfg.email}</a></p>
      <p>Режим работы: ${cfg.workHours}</p>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    setActiveNav();
    injectFooterLegal();
  });
})();
