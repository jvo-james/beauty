/* =========================
   CISCA MAKEOVERS - MAIN JS
   File: js/main.js
========================= */

document.addEventListener("DOMContentLoaded", () => {
  initPageLoader();
  initStickyHeader();
  initHomepageSlideshow();
  initRevealOnScroll();
  initActiveNavState();
  initButtonEffects();
});

/* =========================
   PAGE LOADER
========================= */
function initPageLoader() {
  const loader = document.getElementById("pageLoader");

  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add("hidden");

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  };

  if (document.readyState === "complete") {
    setTimeout(hideLoader, 500);
  } else {
    window.addEventListener("load", () => {
      setTimeout(hideLoader, 500);
    });
  }
}

/* =========================
   STICKY HEADER
========================= */
function initStickyHeader() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
}

/* =========================
   HOMEPAGE SLIDESHOW
========================= */
function initHomepageSlideshow() {
  const slideshow = document.getElementById("homepageSlideshow");
  if (!slideshow) return;

  const slides = Array.from(slideshow.querySelectorAll(".slide"));
  const dots = Array.from(slideshow.querySelectorAll(".dot"));
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");

  if (!slides.length) return;

  let currentIndex = 0;
  let autoPlay = null;
  const intervalTime = 5500;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      slide.setAttribute("aria-hidden", i === index ? "false" : "true");
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });

    currentIndex = index;
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlay = setInterval(nextSlide, intervalTime);
  }

  function stopAutoPlay() {
    if (autoPlay) {
      clearInterval(autoPlay);
      autoPlay = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startAutoPlay();
    });
  });

  slideshow.addEventListener("mouseenter", stopAutoPlay);
  slideshow.addEventListener("mouseleave", startAutoPlay);
  slideshow.addEventListener("focusin", stopAutoPlay);
  slideshow.addEventListener("focusout", startAutoPlay);

  document.addEventListener("keydown", (event) => {
    const isSlideshowVisible = slideshow.getBoundingClientRect().top < window.innerHeight &&
      slideshow.getBoundingClientRect().bottom > 0;

    if (!isSlideshowVisible) return;

    if (event.key === "ArrowRight") {
      nextSlide();
      startAutoPlay();
    }

    if (event.key === "ArrowLeft") {
      prevSlide();
      startAutoPlay();
    }
  });

  showSlide(currentIndex);
  startAutoPlay();
}

/* =========================
   REVEAL ON SCROLL
========================= */
function initRevealOnScroll() {
  const selectors = [
    ".section-heading",
    ".service-preview-card",
    ".intro-image-wrap",
    ".intro-content",
    ".how-step",
    ".slide-content",
    ".occasion-card",
    ".update-card",
    ".contact-card",
    ".social-showcase-card",
    ".quick-book-banner-inner"
  ];

  const elements = document.querySelectorAll(selectors.join(", "));
  if (!elements.length) return;

  elements.forEach((el, index) => {
    if (!el.classList.contains("reveal-up") && !el.classList.contains("reveal-fade")) {
      el.classList.add("reveal-up");
      el.style.transitionDelay = `${Math.min(index * 0.05, 0.35)}s`;
    }
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
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/* =========================
   ACTIVE NAV STATE
========================= */
function initActiveNavState() {
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav-links a");
  if (!navLinks.length) return;

  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const normalizedHref = href.split("/").pop();

    if (normalizedHref === currentPath) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* =========================
   BUTTON EFFECTS
========================= */
function initButtonEffects() {
  const buttons = document.querySelectorAll(".btn, .floating-book-btn, .text-link");

  buttons.forEach((button) => {
    button.addEventListener("mousedown", () => {
      button.style.transform = "scale(0.98)";
    });

    button.addEventListener("mouseup", () => {
      button.style.transform = "";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });

    button.addEventListener("touchstart", () => {
      button.style.transform = "scale(0.98)";
    }, { passive: true });

    button.addEventListener("touchend", () => {
      button.style.transform = "";
    });
  });
}
