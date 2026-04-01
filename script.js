/* =========================
   CISCA MAKEOVERS - script.js
   Shared interactions for:
   - mobile navigation
   - reveal animations
   - showcase slider
   - active booking/service cards
   - smooth section helpers
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initRevealAnimations();
  initShowcaseSlider();
  initInteractiveChoiceCards();
  initDateAndTimeChips();
  initQuickFilterState();
  initSmoothHashOffset();
});

/* =========================
   MOBILE MENU
   ========================= */
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });

  const navAnchors = navLinks.querySelectorAll("a");
  navAnchors.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("active");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = navLinks.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("active");
    }
  });
}

/* =========================
   REVEAL ANIMATIONS
   ========================= */
function initRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  revealItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(24px)";
    item.style.transition =
      "opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

/* =========================
   SHOWCASE SLIDER
   ========================= */
function initShowcaseSlider() {
  const track = document.getElementById("slidesTrack");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const dotsContainer = document.getElementById("sliderDots");

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = Array.from(track.querySelectorAll(".slide"));
  const dots = Array.from(dotsContainer.querySelectorAll(".dot"));

  if (!slides.length) return;

  let currentIndex = 0;
  let autoPlayInterval = null;
  const totalSlides = slides.length;

  function updateSlider(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function nextSlide() {
    updateSlider(currentIndex + 1);
  }

  function prevSlide() {
    updateSlider(currentIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, 5000);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  prevBtn.addEventListener("click", () => {
    prevSlide();
    startAutoPlay();
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      updateSlider(index);
      startAutoPlay();
    });
  });

  const sliderSection = track.closest(".showcase-slider");
  if (sliderSection) {
    sliderSection.addEventListener("mouseenter", stopAutoPlay);
    sliderSection.addEventListener("mouseleave", startAutoPlay);

    sliderSection.addEventListener("touchstart", stopAutoPlay, {
      passive: true,
    });
    sliderSection.addEventListener("touchend", startAutoPlay, {
      passive: true,
    });
  }

  // Basic swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (event) => {
      touchEndX = event.changedTouches[0].screenX;
      const distance = touchEndX - touchStartX;

      if (Math.abs(distance) > 50) {
        if (distance < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }

      startAutoPlay();
    },
    { passive: true }
  );

  updateSlider(0);
  startAutoPlay();
}

/* =========================
   BOOKING / INTERACTIVE CHOICE CARDS
   ========================= */
function initInteractiveChoiceCards() {
  // Booking category cards
  const choiceCards = document.querySelectorAll(".booking-choice-card");
  if (choiceCards.length) {
    choiceCards.forEach((card) => {
      const input = card.querySelector('input[type="radio"]');
      if (!input) return;

      card.addEventListener("click", () => {
        const name = input.getAttribute("name");
        const group = document.querySelectorAll(
          `.booking-choice-card input[name="${name}"]`
        );

        group.forEach((radio) => {
          const parentCard = radio.closest(".booking-choice-card");
          if (parentCard) parentCard.classList.remove("active");
        });

        input.checked = true;
        card.classList.add("active");
      });
    });
  }

  // Filter pill active state
  const filterPills = document.querySelectorAll(".filter-pill");
  if (filterPills.length) {
    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        filterPills.forEach((item) => item.classList.remove("active"));
        pill.classList.add("active");
      });
    });
  }
}

/* =========================
   DATE + TIME CHIP STATES
   ========================= */
function initDateAndTimeChips() {
  const dateChips = document.querySelectorAll(".date-chip");
  const timeChips = document.querySelectorAll(".time-chip");

  if (dateChips.length) {
    dateChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        if (chip.classList.contains("muted")) return;

        dateChips.forEach((item) => item.classList.remove("active"));
        chip.classList.add("active");

        updateBookingSummary("date", chip.textContent.trim());
      });
    });
  }

  if (timeChips.length) {
    timeChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        if (chip.classList.contains("muted")) return;

        timeChips.forEach((item) => item.classList.remove("active"));
        chip.classList.add("active");

        updateBookingSummary("time", chip.textContent.trim());
      });
    });
  }

  // Service/category selectors can also update summary live
  const serviceSelect = document.getElementById("serviceSelect");
  const appointmentType = document.getElementById("appointmentType");
  const categoryInputs = document.querySelectorAll('input[name="category"]');

  if (serviceSelect) {
    serviceSelect.addEventListener("change", () => {
      updateBookingSummary("service", serviceSelect.value);
      updatePaymentPreview(serviceSelect.value);
    });
  }

  if (appointmentType) {
    appointmentType.addEventListener("change", () => {
      const cleanValue = appointmentType.value.replace(" Appointment", "");
      updateBookingSummary("type", cleanValue);
    });
  }

  if (categoryInputs.length) {
    categoryInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const value =
          input.value.charAt(0).toUpperCase() + input.value.slice(1);
        updateBookingSummary("category", value);
      });
    });
  }
}

/* =========================
   QUICK FILTER HASH ACTIVE STATE
   ========================= */
function initQuickFilterState() {
  const filterPills = document.querySelectorAll(".filter-pill");
  if (!filterPills.length) return;

  const setActiveFromHash = () => {
    const currentHash = window.location.hash;
    if (!currentHash) return;

    filterPills.forEach((pill) => {
      const href = pill.getAttribute("href");
      pill.classList.toggle("active", href === currentHash);
    });
  };

  window.addEventListener("hashchange", setActiveFromHash);
  setActiveFromHash();
}

/* =========================
   SMOOTH HASH OFFSET
   Prevent sticky header overlap
   ========================= */
function initSmoothHashOffset() {
  const header = document.querySelector(".site-header");
  const links = document.querySelectorAll('a[href^="#"]');

  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const extraOffset = 18;
      const targetTop =
        targetElement.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight -
        extraOffset;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });

      if (history.pushState) {
        history.pushState(null, "", targetId);
      } else {
        window.location.hash = targetId;
      }
    });
  });
}

/* =========================
   BOOKING SUMMARY HELPERS
   ========================= */
function updateBookingSummary(field, value) {
  const summaryRows = document.querySelectorAll(".summary-row");

  if (!summaryRows.length) return;

  const fieldMap = {
    category: "Category",
    service: "Service",
    type: "Type",
    date: "Date",
    time: "Time",
  };

  const fieldLabel = fieldMap[field];
  if (!fieldLabel) return;

  summaryRows.forEach((row) => {
    const label = row.querySelector("span");
    const strong = row.querySelector("strong");
    if (!label || !strong) return;

    if (label.textContent.trim() === fieldLabel) {
      strong.textContent = value;
    }
  });
}

/* =========================
   PAYMENT PREVIEW
   Demo mapping for UI only
   ========================= */
function updatePaymentPreview(serviceName) {
  const selectedServiceHeading = document.querySelector(
    ".payment-preview-card h4"
  );
  const paymentCards = document.querySelectorAll(".payment-preview-card strong");
  const totalRow = document.querySelector(".summary-row.total strong");

  if (!selectedServiceHeading || !paymentCards.length) return;

  const servicePrices = {
    "Natural Glam": "¢220",
    "Soft Glam": "¢250",
    "Bold Glam": "¢300",
    "Graduation Glam": "¢250",
    "Bridesmaid Glam": "¢300",
    "Classic Set": "¢100",
    "Classic Cat Eye Set": "¢120",
    "Hybrid Set": "¢140",
    "Hybrid Cat Eye Set": "¢160",
    "Volume Set": "¢180",
    "Volume Cat Eye Set": "¢200",
    "Mega Volume Set": "¢240",
    "Mega Volume Cat Eye Set": "¢260",
    "Acrylic Short": "¢150",
    "Acrylic Medium": "¢170",
    "Acrylic Long": "¢200",
    "Acrylic Extra Long": "¢240",
    "Stick Ons Extra": "¢90",
    "Stick Ons Simple": "¢60",
    "Gel Polish": "¢50",
    "Cleaning": "¢50",
    "Dissolving": "¢70",
    "Brow Lamination": "¢150",
    "Microblading": "¢200",
    "Microshading / Ombre": "¢350",
    "Microblading + Shading": "¢300",
    "Brow Tint": "¢100",
    "Lamination + Tint": "¢220",
    "Blading + Shaping": "¢50",
    "Frontal Install": "¢150",
    "Closure Install": "¢100",
    "Frontal Styling": "¢100",
    "Closure Styling": "¢100",
    Straightening: "¢80",
    Curling: "¢80",
    "Heatless Curls": "¢70",
    "Bouncy Curls": "¢100",
    "Hollywood Wave Curls": "¢100",
  };

  const price = servicePrices[serviceName] || "¢250";

  selectedServiceHeading.textContent = serviceName;

  // First strong in payment preview is selected service price
  if (paymentCards[0]) paymentCards[0].textContent = price;

  // Last strong in payment preview is total
  if (paymentCards[paymentCards.length - 1]) {
    paymentCards[paymentCards.length - 1].textContent = price;
  }

  if (totalRow) {
    totalRow.textContent = price;
  }
}
