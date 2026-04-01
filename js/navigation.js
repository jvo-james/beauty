document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = mainNav ? mainNav.querySelectorAll("a") : [];
  const quickBookingForm = document.getElementById("quickBookingForm");

  const handleHeaderScroll = () => {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  const openMenu = () => {
    if (!menuToggle || !mainNav) return;

    menuToggle.classList.add("active");
    mainNav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    body.classList.add("menu-open");
  };

  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;

    menuToggle.classList.remove("active");
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  const toggleMenu = () => {
    if (!mainNav) return;

    const isOpen = mainNav.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const setActiveNavLink = () => {
    if (!navLinks.length) return;

    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach((link) => {
      const linkPath = link.getAttribute("href");

      if (!linkPath) return;

      const isHashLink = linkPath.startsWith("#");
      const isCurrentPage =
        linkPath === currentPath ||
        (currentPath === "" && linkPath === "index.html") ||
        (currentPath === "index.html" && linkPath === "index.html");

      link.classList.remove("active");

      if (!isHashLink && isCurrentPage) {
        link.classList.add("active");
      }
    });
  };

  const handleHashHighlight = () => {
    if (!navLinks.length) return;

    const hash = window.location.hash;

    if (!hash) {
      setActiveNavLink();
      return;
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        link.classList.toggle("active", href === hash);
      }
    });
  };

  const closeMenuOnOutsideClick = (event) => {
    if (!mainNav || !menuToggle) return;
    if (window.innerWidth > 860) return;

    const clickedInsideNav = mainNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle && mainNav.classList.contains("open")) {
      closeMenu();
    }
  };

  const closeMenuOnResize = () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  };

  const scrollToHashTarget = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return;

    const headerHeight = header ? header.offsetHeight : 0;
    const extraOffset = 14;
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  };

  const handleNavLinkClick = (event) => {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    if (!href) return;

    if (href.startsWith("#")) {
      event.preventDefault();
      closeMenu();
      history.replaceState(null, "", href);
      handleHashHighlight();
      scrollToHashTarget(href);
      return;
    }

    closeMenu();
  };

  const handleQuickBookingRedirect = (event) => {
    event.preventDefault();

    if (!quickBookingForm) return;

    const service = quickBookingForm.querySelector("#quickService")?.value || "";
    const occasion = quickBookingForm.querySelector("#quickOccasion")?.value || "";

    const params = new URLSearchParams();

    if (service) params.set("service", service);
    if (occasion) params.set("occasion", occasion);

    const bookingUrl = `booking.html${params.toString() ? `?${params.toString()}` : ""}`;
    window.location.href = bookingUrl;
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  if (navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavLinkClick);
    });
  }

  if (quickBookingForm) {
    quickBookingForm.addEventListener("submit", handleQuickBookingRedirect);
  }

  document.addEventListener("click", closeMenuOnOutsideClick);
  window.addEventListener("resize", closeMenuOnResize);
  window.addEventListener("scroll", handleHeaderScroll);
  window.addEventListener("hashchange", handleHashHighlight);

  handleHeaderScroll();
  setActiveNavLink();
  handleHashHighlight();

  if (window.location.hash) {
    setTimeout(() => {
      scrollToHashTarget(window.location.hash);
    }, 80);
  }
});
