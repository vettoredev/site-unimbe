const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const heroTitle = document.querySelector("[data-hero-title]");

if (heroTitle) {
  const titleText = heroTitle.textContent.trim();
  const words = titleText.split(/\s+/);
  let characterIndex = 0;

  heroTitle.textContent = "";
  heroTitle.setAttribute("aria-label", titleText);

  words.forEach((word, wordIndex) => {
    const wordElement = document.createElement("span");
    wordElement.className = "hero-word";
    wordElement.setAttribute("aria-hidden", "true");

    Array.from(word).forEach((character) => {
      const letter = document.createElement("span");
      letter.className = "hero-letter";
      letter.textContent = character;
      letter.style.setProperty("--char-index", characterIndex);
      wordElement.appendChild(letter);
      characterIndex += 1;
    });

    heroTitle.appendChild(wordElement);
    if (wordIndex < words.length - 1) heroTitle.appendChild(document.createTextNode(" "));
  });

  const descriptionDelay = 180 + characterIndex * 38 + 430;
  heroTitle.parentElement.style.setProperty("--hero-text-delay", `${descriptionDelay}ms`);
  heroTitle.parentElement.style.setProperty("--hero-actions-delay", `${descriptionDelay + 360}ms`);
}

if (nav) {
  const pageName = window.location.pathname.split("/").pop() || "index.html";
  const activePage = pageName === "curso-enfermagem.html" ? "cursos.html" : pageName;
  const isInstitutionalPage = pageName === "sobre.html" || pageName === "cpa.html" || pageName === "nap.html";

  nav.querySelectorAll("a").forEach((link) => {
    const isCurrent = link.getAttribute("href") === activePage;
    link.classList.toggle("current-page", isCurrent);

    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const institutionalTrigger = nav.querySelector(".institutional-menu .nav-trigger");
  if (institutionalTrigger) {
    institutionalTrigger.classList.toggle("current-page", isInstitutionalPage);
    if (isInstitutionalPage) institutionalTrigger.setAttribute("aria-current", "page");
  }
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const filterButtons = document.querySelectorAll("[data-filter]");
const courseCards = document.querySelectorAll("[data-area]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const area = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    courseCards.forEach((card) => {
      card.hidden = area !== "todos" && card.dataset.area !== area;
    });
  });
});

const form = document.querySelector(".contact-form");
const note = document.querySelector("[data-form-note]");

if (form && note) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    note.textContent = "Mensagem registrada nesta demonstração. Este formulário pode ser integrado ao CRM.";
  });
}

const discountRange = document.querySelector("[data-discount-range]");
const discountValue = document.querySelector("[data-discount-value]");

if (discountRange && discountValue) {
  discountRange.addEventListener("input", () => {
    discountValue.textContent = `${discountRange.value}%`;
  });
}

const cpaPage = document.querySelector(".cpa-page");

if (cpaPage) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealSections = cpaPage.querySelectorAll(":scope > section:not(.cpa-hero)");
  const jumpLinks = document.querySelectorAll(".cpa-jump-nav a[href^='#']");
  const backTopButton = document.querySelector("[data-back-top]");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealSections.forEach((section) => section.classList.add("is-visible"));
  } else {
    revealSections.forEach((section) => section.classList.add("cpa-reveal"));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealSections.forEach((section) => revealObserver.observe(section));
  }

  const observedSections = Array.from(jumpLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const navigationObserver = new IntersectionObserver((entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visibleEntry) return;

      jumpLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visibleEntry.target.id}`);
      });
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.25, 0.6] });
    observedSections.forEach((section) => navigationObserver.observe(section));
  }

  if (backTopButton) {
    const updateBackTop = () => backTopButton.classList.toggle("is-visible", window.scrollY > 650);
    updateBackTop();
    window.addEventListener("scroll", updateBackTop, { passive: true });
    backTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
  }
}

const napPage = document.querySelector(".nap-page");

if (napPage) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sections = napPage.querySelectorAll(":scope > section:not(.nap-hero)");
  const jumpLinks = document.querySelectorAll(".nap-jump-nav a[href^='#']");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
  } else {
    sections.forEach((section) => section.classList.add("nap-reveal"));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    sections.forEach((section) => revealObserver.observe(section));
  }

  if ("IntersectionObserver" in window) {
    const targets = Array.from(jumpLinks).map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const navigationObserver = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      jumpLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${current.target.id}`));
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.25, 0.6] });
    targets.forEach((target) => navigationObserver.observe(target));
  }
}
