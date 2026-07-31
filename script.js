(function () {
  "use strict";

  document.documentElement.classList.add("js-enabled");

  const CLEAN_PHONE = "5491128074105";
  const WHATSAPP_BASE = `https://wa.me/${CLEAN_PHONE}?text=`;
  const header = document.getElementById("site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("main-navigation");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const backToTop = document.querySelector(".back-to-top");
  let activeLayer = null;
  let lastFocused = null;
  let lastPetSummary = "";

  const stageData = {
    young: {
      number: "01",
      goal: "Construir una base de salud solida",
      cards: [
        ["Controles", "Mensuales durante el esquema inicial"],
        ["Vacunas", "Plan segun edad y antecedentes"],
        ["Estudios", "Evaluacion clinica y parasitologica"],
        ["Cuidados", "Nutricion, adaptacion y socializacion"]
      ]
    },
    adult: {
      number: "02",
      goal: "Sostener prevencion y bienestar diario",
      cards: [
        ["Controles", "Chequeo general cada 6 a 12 meses"],
        ["Vacunas", "Refuerzos y desparasitacion programada"],
        ["Estudios", "Analisis preventivos segun estilo de vida"],
        ["Cuidados", "Peso, salud dental y actividad fisica"]
      ]
    },
    senior: {
      number: "03",
      goal: "Detectar cambios antes de que avancen",
      cards: [
        ["Controles", "Evaluacion cada 4 a 6 meses"],
        ["Vacunas", "Refuerzos segun criterio profesional"],
        ["Estudios", "Laboratorio, corazon y movilidad"],
        ["Cuidados", "Dolor, nutricion y calidad de vida"]
      ]
    }
  };

  const reminderData = {
    young: [
      ["01", "Proxima vacuna", "Revisa el esquema inicial y las fechas indicadas por el profesional."],
      ["02", "Desparasitacion", "La frecuencia depende de edad, peso, entorno y estilo de vida."],
      ["03", "Control general", "Durante el primer ano suelen ser necesarios controles mas frecuentes."],
      ["04", "Salud dental", "Incorpora habitos de higiene desde una edad temprana."],
      ["05", "Nutricion y crecimiento", "Controla peso, condicion corporal y desarrollo."]
    ],
    adult: [
      ["01", "Chequeo anual", "Permite revisar peso, piel, boca, oidos y condicion corporal."],
      ["02", "Refuerzos", "Manten vacunas y desparasitacion segun indicacion profesional."],
      ["03", "Actividad", "Ajusta paseos, juego y alimentacion para prevenir sobrepeso."],
      ["04", "Boca y piel", "Consulta ante mal aliento, picazon, caida de pelo o lesiones."],
      ["05", "Antecedentes", "Guarda estudios y tratamientos para mejorar cada seguimiento."]
    ],
    senior: [
      ["01", "Controles frecuentes", "La evaluacion periodica ayuda a detectar cambios sutiles."],
      ["02", "Analisis", "Laboratorio y orina orientan decisiones preventivas."],
      ["03", "Corazon", "Tos, fatiga o intolerancia al ejercicio requieren consulta."],
      ["04", "Movilidad", "Dolor, rigidez o caidas pueden mejorar con abordaje temprano."],
      ["05", "Calidad de vida", "Nutricion, descanso y confort se ajustan a cada paciente."]
    ]
  };

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 650);
  };

  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("is-open");
  };

  const openMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    mainNav.classList.add("is-open");
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.contains("is-open") ? closeMenu() : openMenu();
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("click", (event) => {
      if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  if (backToTop) {
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const navTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && navTargets.length) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const activeId = `#${visible.target.id}`;
      navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === activeId));
    }, { threshold: [0.2, 0.45], rootMargin: "-28% 0px -55% 0px" });
    navTargets.forEach((section) => navObserver.observe(section));
  }

  const animateCounter = (counter) => {
    if (counter.dataset.counted === "true") return;
    counter.dataset.counted = "true";
    const target = Number(counter.dataset.counter);
    const decimals = Number.isInteger(target) ? 0 : 1;
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target.toFixed(decimals);
    };

    requestAnimationFrame(tick);
  };

  const counters = Array.from(document.querySelectorAll("[data-counter]"));
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  const renderStage = (stageKey) => {
    const content = document.getElementById("stage-content");
    const stage = stageData[stageKey];
    if (!content || !stage) return;
    content.innerHTML = `
      <div class="stage-summary">
        <span class="stage-summary__number">${stage.number}</span>
        <div><small>Objetivo principal</small><strong>${stage.goal}</strong></div>
      </div>
      <div class="stage-grid">
        ${stage.cards.map(([label, value]) => `<article><small>${label}</small><strong>${value}</strong></article>`).join("")}
      </div>
    `;
  };

  document.querySelectorAll("[data-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-stage]").forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });
      renderStage(button.dataset.stage);
    });
  });

  const renderReminders = (ageKey) => {
    const grid = document.getElementById("reminder-grid");
    const items = reminderData[ageKey];
    if (!grid || !items) return;
    grid.innerHTML = items
      .map(([number, title, copy]) => `<article><span>${number}</span><h3>${title}</h3><p>${copy}</p></article>`)
      .join("");
  };

  document.querySelectorAll("[data-reminder-age]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-reminder-age]").forEach((item) => item.classList.toggle("is-active", item === button));
      renderReminders(button.dataset.reminderAge);
    });
  });

  const slider = document.querySelector(".testimonial-slider");
  if (slider) {
    const track = slider.querySelector(".testimonial-slider__track");
    const slides = Array.from(slider.querySelectorAll(".testimonial"));
    const prev = slider.querySelector("[data-slider-prev]");
    const next = slider.querySelector("[data-slider-next]");
    const dots = slider.querySelector(".slider-dots");
    let current = 0;
    let timer = null;

    const goToSlide = (index) => {
      if (!track || !slides.length) return;
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === current));
      dots?.querySelectorAll("button").forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === current);
        dot.setAttribute("aria-selected", String(dotIndex === current));
      });
    };

    const restartTimer = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => goToSlide(current + 1), 7000);
    };

    if (dots) {
      slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Ver testimonio ${index + 1}`);
        dot.addEventListener("click", () => {
          goToSlide(index);
          restartTimer();
        });
        dots.appendChild(dot);
      });
    }

    prev?.addEventListener("click", () => {
      goToSlide(current - 1);
      restartTimer();
    });
    next?.addEventListener("click", () => {
      goToSlide(current + 1);
      restartTimer();
    });
    slider.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") goToSlide(current - 1);
      if (event.key === "ArrowRight") goToSlide(current + 1);
    });
    slider.addEventListener("mouseenter", () => window.clearInterval(timer));
    slider.addEventListener("mouseleave", restartTimer);
    goToSlide(0);
    restartTimer();
  }

  document.querySelectorAll(".accordion-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  });

  const getFocusable = (container) => Array.from(container.querySelectorAll(
    "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
  )).filter((element) => element.offsetParent !== null || element === document.activeElement);

  const trapFocus = (event) => {
    if (!activeLayer || event.key !== "Tab") return;
    const focusable = getFocusable(activeLayer);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const closeLayer = () => {
    if (!activeLayer) return;
    activeLayer.hidden = true;
    document.body.classList.remove("is-locked");
    activeLayer = null;
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  const prefillModalService = (service) => {
    const select = document.getElementById("modal-service");
    const message = document.getElementById("modal-message");
    if (!service) return;
    if (select) {
      const option = Array.from(select.options).find((item) => item.textContent.trim().toLowerCase() === service.toLowerCase());
      if (option) select.value = option.value;
    }
    if (message && !message.value) message.value = `Quiero consultar por ${service}.`;
  };

  const openModal = (modal, trigger) => {
    if (!modal) return;
    lastFocused = trigger || document.activeElement;
    modal.hidden = false;
    activeLayer = modal;
    document.body.classList.add("is-locked");
    prefillModalService(trigger?.dataset.service);
    const first = getFocusable(modal)[0] || modal.querySelector(".modal__dialog");
    requestAnimationFrame(() => first?.focus());
  };

  document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => openModal(document.getElementById(trigger.dataset.openModal), trigger));
  });

  document.querySelectorAll("[data-professional]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const name = trigger.closest(".team-card")?.querySelector("h3")?.textContent?.trim() || "un profesional";
      const message = document.getElementById("modal-message");
      if (message) message.value = `Quiero solicitar un turno con ${name}.`;
      openModal(document.getElementById("appointment-modal"), trigger);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((trigger) => trigger.addEventListener("click", closeLayer));

  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  let galleryIndex = 0;

  const showGalleryImage = (index) => {
    if (!galleryItems.length || !lightboxImage || !lightboxCaption) return;
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[galleryIndex];
    const img = item.querySelector("img");
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = item.querySelector("span")?.textContent || img.alt;
  };

  const openLightbox = (index, trigger) => {
    if (!lightbox) return;
    lastFocused = trigger || document.activeElement;
    showGalleryImage(index);
    lightbox.hidden = false;
    activeLayer = lightbox;
    document.body.classList.add("is-locked");
    requestAnimationFrame(() => lightbox.querySelector(".lightbox__close")?.focus());
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(Number(item.dataset.galleryIndex ?? index), item));
  });
  document.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLayer);
  document.querySelectorAll("[data-lightbox-close]").forEach((button) => button.addEventListener("click", closeLayer));
  document.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => showGalleryImage(galleryIndex - 1));
  document.querySelector("[data-lightbox-next]")?.addEventListener("click", () => showGalleryImage(galleryIndex + 1));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeLayer();
    }
    if (activeLayer && lightbox && activeLayer === lightbox) {
      if (event.key === "ArrowLeft") showGalleryImage(galleryIndex - 1);
      if (event.key === "ArrowRight") showGalleryImage(galleryIndex + 1);
    }
    trapFocus(event);
  });

  const fieldLabel = (field) => {
    const id = field.id ? `label[for="${field.id}"]` : "";
    return (id && document.querySelector(id)?.textContent.trim()) || field.name || "Campo";
  };

  const fieldWrapper = (field) => field.closest(".field") || field.closest(".checkbox");

  const setFieldError = (field, message) => {
    const wrapper = fieldWrapper(field);
    if (!wrapper) return;
    wrapper.classList.toggle("is-invalid", Boolean(message));
    let error = wrapper.querySelector(".field-error");
    if (!error && message) {
      error = document.createElement("small");
      error.className = "field-error";
      wrapper.appendChild(error);
    }
    if (error) error.textContent = message || "";
  };

  const validateForm = (form) => {
    let isValid = true;
    Array.from(form.elements).forEach((field) => {
      if (!field.name || field.type === "submit" || field.type === "button") return;
      setFieldError(field, "");
      if (field.required) {
        const empty = field.type === "checkbox" ? !field.checked : !String(field.value || "").trim();
        if (empty) {
          setFieldError(field, `${fieldLabel(field)} es obligatorio.`);
          isValid = false;
          return;
        }
      }
      if (field.type === "email" && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
        setFieldError(field, "Ingresa un email valido.");
        isValid = false;
      }
      if (field.type === "tel" && field.value && field.value.replace(/\D/g, "").length < 8) {
        setFieldError(field, "Ingresa un telefono valido.");
        isValid = false;
      }
    });
    return isValid;
  };

  const buildFormMessage = (form, title) => {
    const lines = [title];
    Array.from(form.elements).forEach((field) => {
      if (!field.name || field.type === "submit" || field.type === "button" || field.type === "checkbox") return;
      const value = String(field.value || "").trim();
      if (!value) return;
      lines.push(`${fieldLabel(field)}: ${value}`);
    });
    return lines.join("\n");
  };

  const handleContactForm = (form, title) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      if (!validateForm(form)) {
        if (status) status.textContent = "Revisa los campos marcados para continuar.";
        return;
      }
      const message = buildFormMessage(form, title);
      const href = WHATSAPP_BASE + encodeURIComponent(message);
      if (status) {
        status.innerHTML = `Solicitud lista. <a href="${href}" target="_blank" rel="noopener noreferrer">Enviar por WhatsApp</a>`;
      }
      form.classList.add("is-sent");
    });
  };

  ["appointment-form", "contact-form", "modal-appointment-form"].forEach((id) => {
    const form = document.getElementById(id);
    if (form) handleContactForm(form, id === "contact-form" ? "Consulta desde VitaVet" : "Solicitud de turno VitaVet");
  });

  const petForm = document.getElementById("pet-profile-form");
  const petSummary = document.getElementById("pet-summary");
  const petSummaryList = document.getElementById("pet-summary-list");
  const petWhatsapp = document.getElementById("send-pet-whatsapp");
  const copyPetSummary = document.getElementById("copy-pet-summary");

  if (petForm && petSummary && petSummaryList) {
    petForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateForm(petForm)) return;

      const data = new FormData(petForm);
      const fields = [
        ["Nombre", data.get("name")],
        ["Especie", data.get("species")],
        ["Raza", data.get("breed")],
        ["Edad", data.get("age")],
        ["Peso", data.get("weight")],
        ["Sexo", data.get("sex")],
        ["Castracion", data.get("neutered")],
        ["Vacunas al dia", data.get("vaccines")],
        ["Observaciones", data.get("notes")]
      ].filter(([, value]) => String(value || "").trim());

      petSummaryList.innerHTML = fields
        .map(([label, value]) => `<div><dt>${label}</dt><dd>${String(value).trim()}</dd></div>`)
        .join("");
      lastPetSummary = ["Ficha inicial VitaVet", ...fields.map(([label, value]) => `${label}: ${String(value).trim()}`)].join("\n");
      if (petWhatsapp) petWhatsapp.href = WHATSAPP_BASE + encodeURIComponent(lastPetSummary);
      petSummary.hidden = false;
      petSummary.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  if (copyPetSummary) {
    copyPetSummary.addEventListener("click", async () => {
      if (!lastPetSummary) return;
      try {
        await navigator.clipboard.writeText(lastPetSummary);
        copyPetSummary.textContent = "Datos copiados";
      } catch (error) {
        copyPetSummary.textContent = "Selecciona y copia el resumen";
      }
      window.setTimeout(() => { copyPetSummary.textContent = "Copiar datos"; }, 1800);
    });
  }

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
