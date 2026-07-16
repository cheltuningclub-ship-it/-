(function () {
  'use strict';

  function logConsent(formId, consentTypes) {
    const entry = {
      formId,
      consents: consentTypes,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
    };

    const key = 'im_form_consents';
    const log = JSON.parse(localStorage.getItem(key) || '[]');
    log.push(entry);
    localStorage.setItem(key, JSON.stringify(log.slice(-100)));
  }

  function validateForm(form) {
    let valid = true;

    form.querySelectorAll('[required]').forEach((field) => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    const pdConsent = form.querySelector('[name="consent_pd"]');
    if (pdConsent && !pdConsent.checked) {
      pdConsent.closest('.checkbox-group')?.classList.add('error');
      valid = false;
    } else {
      pdConsent?.closest('.checkbox-group')?.classList.remove('error');
    }

    const phone = form.querySelector('[name="phone"]');
    if (phone?.value) {
      const phoneRe = /^[\d\s\-+()]{10,18}$/;
      if (!phoneRe.test(phone.value.trim())) {
        phone.classList.add('error');
        valid = false;
      }
    }

    const email = form.querySelector('[name="email"]');
    if (email?.value) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email.value.trim())) {
        email.classList.add('error');
        valid = false;
      }
    }

    return valid;
  }

  function initForms() {
    document.querySelectorAll('.contact-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm(form)) return;

        const consents = ['personal_data'];
        if (form.querySelector('[name="consent_marketing"]')?.checked) {
          consents.push('marketing');
        }

        logConsent(form.id || 'contact', consents);

        const success = form.querySelector('.form-success');
        if (success) {
          success.classList.add('visible');
          form.reset();
          setTimeout(() => success.classList.remove('visible'), 8000);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initForms);
})();
