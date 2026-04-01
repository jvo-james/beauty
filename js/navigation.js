/* =========================
   CISCA MAKEOVERS - NAVIGATION
   File: js/navigation.js
========================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
});

/* =========================
   MOBILE MENU
========================= */
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileMenuInner = mobileMenu?.querySelector(".mobile-menu-inner");
  const mobileLinks = document.querySelectorAll(".mobile-nav-links a");
  const body = document.body;

  if (!menuToggle || !mobileMenu || !mobileMenuClose || !mobileMenuInner) return;

  function openMenu() {
    mobileMenu.classList.add("active");
    body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    mobileMenu.classList.remove("active");
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");

  menuToggle.addEventListener("click", openMenu);
  mobileMenuClose.addEventListener("click", closeMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  mobileMenu.addEventListener("click", (event) => {
    const clickedInsidePanel = mobileMenuInner.contains(event.target);
    if (!clickedInsidePanel) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  });
}
