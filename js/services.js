/* =========================
   CISCA MAKEOVERS - SERVICES JS
   File: js/services.js
========================= */

document.addEventListener("DOMContentLoaded", () => {
  initServiceCategoryScroll();
  initActiveServiceCategory();
  initServiceBookingLinks();
  initAddonReveal();
});

/* =========================
   SMOOTH CATEGORY SCROLL
========================= */
function initServiceCategoryScroll() {
  const categoryLinks = document.querySelectorAll(".category-card[href^='#']");

  if (!categoryLinks.length) return;

  categoryLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const targetEl = document.querySelector(targetId);

      if (!targetEl) return;

      event.preventDefault();

      const header = document.getElementById("siteHeader");
      const headerHeight = header ? header.offsetHeight : 0;
      const extraOffset = 18;
      const targetPosition =
        window.pageYOffset +
        targetEl.getBoundingClientRect().top -
        headerHeight -
        extraOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });
}

/* =========================
   ACTIVE CATEGORY HIGHLIGHT
========================= */
function initActiveServiceCategory() {
  const categoryLinks = Array.from(document.querySelectorAll(".category-card[href^='#']"));

  if (!categoryLinks.length) return;

  const sections = categoryLinks
    .map((link) => {
      const id = link.getAttribute("href");
      const section = document.querySelector(id);

      if (!section) return null;

      return {
        link,
        section,
        id
      };
    })
    .filter(Boolean);

  if (!sections.length) return;

  function setActiveLink(activeId) {
    categoryLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === activeId;
      link.classList.toggle("active-category", isActive);
      link.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function detectActiveSection() {
    const header = document.getElementById("siteHeader");
    const headerHeight = header ? header.offsetHeight : 0;
    const triggerLine = headerHeight + 120;

    let currentActiveId = sections[0].id;

    sections.forEach(({ section, id }) => {
      const rect = section.getBoundingClientRect();

      if (rect.top <= triggerLine && rect.bottom >= triggerLine) {
        currentActiveId = id;
      }
    });

    setActiveLink(currentActiveId);
  }

  detectActiveSection();
  window.addEventListener("scroll", detectActiveSection, { passive: true });
  window.addEventListener("resize", detectActiveSection);
}

/* =========================
   SERVICE BOOKING LINK SUPPORT
========================= */
function initServiceBookingLinks() {
  const bookingButtons = document.querySelectorAll(".service-menu-cta .btn, .package-card .text-link");

  if (!bookingButtons.length) return;

  bookingButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const card =
        button.closest(".service-menu-section") ||
        button.closest(".package-card");

      if (!card) return;

      let serviceName = "";

      if (card.classList.contains("package-card")) {
        const title = card.querySelector("h3");
        serviceName = title ? title.textContent.trim() : "";
      } else {
        const sectionTag = card.querySelector(".section-tag");
        serviceName = sectionTag ? sectionTag.textContent.trim() : "";
      }

      if (!serviceName) return;

      const currentHref = button.getAttribute("href");
      if (!currentHref || !currentHref.includes("booking.html")) return;

      event.preventDefault();

      const bookingUrl = new URL("booking.html", window.location.href);
      bookingUrl.searchParams.set("service", serviceName);

      window.location.href = bookingUrl.toString();
    });
  });
}

/* =========================
   ADDON REVEAL
========================= */
function initAddonReveal() {
  const addonTags = document.querySelectorAll(".addon-tags span");

  if (!addonTags.length) return;

  addonTags.forEach((tag, index) => {
    tag.classList.add("reveal-up");
    tag.style.transitionDelay = `${Math.min(index * 0.06, 0.42)}s`;
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  addonTags.forEach((tag) => observer.observe(tag));
}
