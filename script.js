// Resolve generated links and assets from the folder that contains this shared
// script. This works both on the live domain and when pages are opened locally.
const OVI_SITE_ROOT = new URL(".", document.currentScript?.src || document.baseURI);
const oviSiteUrl = (path) => new URL(String(path || "").replace(/^\/+/, ""), OVI_SITE_ROOT).href;
const normalizeOviPath = (pathname) => {
  const decoded = decodeURIComponent(pathname || "/").toLowerCase().replace(/\/{2,}/g, "/");
  if (decoded === "/index.html") return "/";
  if (decoded.endsWith("/index.html")) return decoded.slice(0, -"index.html".length);
  if (decoded === "/" || decoded.endsWith(".html")) return decoded;
  return decoded.endsWith("/") ? decoded : `${decoded}/`;
};
const OVI_SITE_BASE_PATH = normalizeOviPath(OVI_SITE_ROOT.pathname);
const toOviSitePath = (pathname) => {
  const normalized = normalizeOviPath(pathname);
  if (OVI_SITE_BASE_PATH !== "/" && normalized.startsWith(OVI_SITE_BASE_PATH)) {
    return normalized.slice(OVI_SITE_BASE_PATH.length - 1) || "/";
  }
  return normalized;
};

// ---------- Data ----------
const prefersReducedMotion = typeof window.matchMedia === "function"
  ? window.matchMedia("(prefers-reduced-motion: reduce)")
  : { matches: false };
const runWhenIdle = (fn, timeout = 1200) => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => fn(), { timeout });
    return;
  }
  setTimeout(fn, Math.min(timeout, 600));
};

document.querySelectorAll('img[loading="lazy"]:not([decoding])').forEach((img) => {
  img.decoding = "async";
});

function ensureAccessibleShell() {
  const main = document.querySelector("main");
  if (main && !main.id) {
    main.id = "main-content";
  }

  if (document.body && main && !document.querySelector(".skip-link")) {
    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = `#${main.id}`;
    skipLink.textContent = "Skip to main content";
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}

function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter((element) => {
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    if (element.hidden || element.getAttribute("aria-hidden") === "true" || element.hasAttribute("inert")) {
      return false;
    }
    return element.offsetParent !== null || element === document.activeElement;
  });
}

function trapFocusInContainer(event, container) {
  if (event.key !== "Tab") {
    return;
  }

  const focusable = getFocusableElements(container);
  if (!focusable.length) {
    event.preventDefault();
    if (container instanceof HTMLElement) {
      container.focus();
    }
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener("DOMContentLoaded", ensureAccessibleShell);

const SLIDES = [
  { t1: "Upscale your career", t2: "Graphic to UX + Ai", body: "Learn UX/UI Design, AI-powered workflows and Vibe Coding to turn your ideas into functional mobile and web applications." },
  { t1: "AI-Powered UX/UI &", t2: "Vibe Prototyping", body: "Join Chennai’s industry-focused UX/UI program and learn AI, Figma, research, prototyping, and design systems." },
  {
    t1: "Don't Just Design,.",
    t2: "Build them with AI.",
    body: "Learn UX/UI Design, AI Tools & Vibe Coding to turn your ideas into functional mobile and web apps — without traditional coding.",
    primaryCta: "Book Free Demo Class",
    secondaryCta: {
      text: "Talk to Mentor",
      href: "https://wa.me/919444074941?text=" + encodeURIComponent("Hi Ovi Design Academy, I'd like to talk to a mentor about the AI-Powered UX/UI + Vibe Coding course."),
      external: true
    }
  }
];
const HERO_PRIMARY_CTA = "Start Your Free Demo";
const HERO_SECONDARY_CTA = "Explore Courses";
const HERO_SLIDE_INTERVAL = 5000;
// ---------- Next batch / early-bird cycle ----------
// Cohorts start on the 10th of every month. The early-bird discount
// closes on the 5th of that same month. Both dates below always resolve
// to the next upcoming cycle — never a date that has already passed.
const BATCH_START_DAY = 10;
const EARLY_BIRD_END_DAY = 5;
const EARLY_BIRD_DISCOUNT = "₹4,999";
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getNextBatchCycle(reference) {
  // Batch (10th) and early-bird (5th) always travel together as one cycle.
  // Once the early-bird window for the current month has closed (i.e. we're
  // past the 5th), both dates roll forward to next month — so the early-bird
  // date shown is never a date that has already passed, and it always pairs
  // with the batch it actually applies to.
  const now = reference || new Date();
  let cycleMonth = now.getMonth();
  const cycleYear = now.getFullYear();
  if (now.getDate() > EARLY_BIRD_END_DAY) {
    cycleMonth += 1;
  }
  const batchDate = new Date(cycleYear, cycleMonth, BATCH_START_DAY);
  const earlyBirdDate = new Date(cycleYear, cycleMonth, EARLY_BIRD_END_DAY, 23, 59, 59);
  return { batchDate, earlyBirdDate };
}

function formatBatchDate(date, style) {
  const day = String(date.getDate()).padStart(2, "0");
  const months = style === "long" ? LONG_MONTHS : SHORT_MONTHS;
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function toISTDeadline(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T23:59:59+05:30`;
}

const NEXT_BATCH_CYCLE = getNextBatchCycle();
const NEXT_BATCH_LABEL_SHORT = formatBatchDate(NEXT_BATCH_CYCLE.batchDate);
const NEXT_BATCH_LABEL_LONG = formatBatchDate(NEXT_BATCH_CYCLE.batchDate, "long");
const EARLY_BIRD_LABEL_SHORT = formatBatchDate(NEXT_BATCH_CYCLE.earlyBirdDate);
const EARLY_BIRD_DAY_MONTH = `${String(NEXT_BATCH_CYCLE.earlyBirdDate.getDate()).padStart(2, "0")} ${SHORT_MONTHS[NEXT_BATCH_CYCLE.earlyBirdDate.getMonth()]}`;

function applyNextBatchDates() {
  document.querySelectorAll("[data-next-batch-short]").forEach((el) => {
    el.textContent = NEXT_BATCH_LABEL_SHORT;
  });
  document.querySelectorAll("[data-next-batch-long]").forEach((el) => {
    el.textContent = NEXT_BATCH_LABEL_LONG;
  });
  document.querySelectorAll("[data-early-bird]").forEach((el) => {
    const discount = el.dataset.earlyBirdDiscount || EARLY_BIRD_DISCOUNT;
    el.textContent = `${discount} off · ends ${EARLY_BIRD_LABEL_SHORT}`;
  });
}
document.addEventListener("DOMContentLoaded", applyNextBatchDates);

// ---------- Live Google reviews ----------
// Configure the deployed Apps Script URL on #reviews[data-google-reviews-endpoint].
function createGoogleSvg(className, paths) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("aria-hidden", "true");
  if (className) svg.setAttribute("class", className);

  paths.forEach(({ fill, d }) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", fill);
    path.setAttribute("d", d);
    svg.appendChild(path);
  });
  return svg;
}

function createGoogleMark() {
  return createGoogleSvg("g-mark", [
    { fill: "#FFC107", d: "M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" },
    { fill: "#FF3D00", d: "M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" },
    { fill: "#4CAF50", d: "M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" },
    { fill: "#1976D2", d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C41.4 35.6 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z" }
  ]);
}

function createReviewStar() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  svg.setAttribute("viewBox", "0 0 24 24");
  polygon.setAttribute("points", "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2");
  svg.appendChild(polygon);
  return svg;
}

function createGoogleReviewCard(review, index) {
  const card = document.createElement("figure");
  card.className = "gr-card";

  const header = document.createElement("header");
  const author = review.author || "Google reviewer";
  if (review.profilePhotoUrl) {
    const photo = document.createElement("img");
    photo.src = review.profilePhotoUrl;
    photo.alt = "";
    photo.loading = "lazy";
    photo.decoding = "async";
    photo.referrerPolicy = "no-referrer";
    header.appendChild(photo);
  } else {
    const avatar = document.createElement("span");
    const initials = author.split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
    const colors = ["#7c3bd9", "#3b54d9", "#00866a", "#d14f70", "#1a1830"];
    avatar.className = "avatar";
    avatar.style.background = colors[index % colors.length];
    avatar.textContent = initials || "G";
    header.appendChild(avatar);
  }

  const meta = document.createElement("div");
  const name = document.createElement("div");
  meta.className = "meta";
  name.className = "nm";
  name.textContent = author;
  meta.appendChild(name);
  header.append(meta, createGoogleMark());

  const stars = document.createElement("div");
  const rating = Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5)));
  stars.className = "rstars";
  stars.setAttribute("aria-label", `${rating} out of 5 stars`);
  for (let star = 0; star < rating; star += 1) stars.appendChild(createReviewStar());
  const when = document.createElement("span");
  when.className = "when";
  when.textContent = review.relativeTime ? `· ${review.relativeTime}` : "";
  stars.appendChild(when);

  const quote = document.createElement("p");
  quote.textContent = review.text;
  card.append(header, stars, quote);
  return card;
}

function renderGoogleReviewTrack(track, reviews) {
  const fragment = document.createDocumentFragment();
  [reviews, reviews].forEach((set) => {
    set.forEach((review, index) => fragment.appendChild(createGoogleReviewCard(review, index)));
  });
  track.replaceChildren(fragment);
}

function loadGoogleReviewsJsonp(endpoint) {
  return new Promise((resolve, reject) => {
    const callbackName = `oviGoogleReviews_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => finish(new Error("Google reviews request timed out.")), 12000);
    const finish = (error, payload) => {
      window.clearTimeout(timeout);
      script.remove();
      delete window[callbackName];
      if (error) reject(error);
      else resolve(payload);
    };

    try {
      const url = new URL(endpoint, document.baseURI);
      url.searchParams.set("callback", callbackName);
      url.searchParams.set("_", Date.now().toString());
      window[callbackName] = (payload) => finish(null, payload);
      script.src = url.toString();
      script.async = true;
      script.onerror = () => finish(new Error("Google reviews request failed."));
      document.head.appendChild(script);
    } catch (error) {
      finish(error);
    }
  });
}

async function initGoogleReviews() {
  const section = document.querySelector("#reviews[data-google-reviews-endpoint]");
  if (!section) return;

  const endpoint = section.dataset.googleReviewsEndpoint.trim() || window.OVI_GOOGLE_REVIEWS_URL || "";
  if (!endpoint) return;

  const status = section.querySelector("[data-google-reviews-status]");
  const description = section.querySelector("[data-google-reviews-description]");
  if (status) status.textContent = "Loading live Google reviews…";

  try {
    const payload = await loadGoogleReviewsJsonp(endpoint);
    const reviews = Array.isArray(payload?.reviews)
      ? payload.reviews.filter((review) => review && review.text && review.author)
      : [];
    if (payload?.ok === false || !reviews.length) throw new Error(payload?.error || "No Google reviews returned.");

    const reviewUrl = payload.reviewUrl || section.querySelector(".gr-link")?.href || "https://www.google.com/maps";
    const firstTrack = section.querySelector("#gr-track-1");
    const secondTrack = section.querySelector("#gr-track-2");
    if (!firstTrack || !secondTrack) return;
    renderGoogleReviewTrack(firstTrack, reviews);
    renderGoogleReviewTrack(secondTrack, [...reviews].reverse());

    const rating = Number(payload.rating);
    const total = Number(payload.totalReviews);
    const ratingNode = section.querySelector(".gr-score .num");
    const starsNode = section.querySelector(".gr-score .stars");
    const countNode = section.querySelector(".gr-score .count");
    const allReviewsLink = section.querySelector(".gr-link");
    if (Number.isFinite(rating) && ratingNode) ratingNode.textContent = rating.toFixed(1);
    if (Number.isFinite(rating) && starsNode) starsNode.setAttribute("aria-label", `${rating.toFixed(1)} of 5`);
    if (Number.isFinite(total) && countNode) {
      countNode.textContent = "based on ";
      const strong = document.createElement("strong");
      strong.textContent = `${total.toLocaleString("en-IN")} Google reviews`;
      countNode.appendChild(strong);
    }
    if (allReviewsLink) allReviewsLink.href = reviewUrl;
    if (status) status.textContent = "Live from Google Business Profile";
    if (description) description.textContent = "Loaded live from our public Google Business profile. Review text and ratings are displayed as published on Google.";
    section.dataset.googleReviewsLive = "true";
  } catch (error) {
    if (status) status.textContent = "Google Business profile reviews";
    console.warn("Live Google reviews unavailable; showing saved reviews.", error);
  }
}
document.addEventListener("DOMContentLoaded", initGoogleReviews);

function sortStudentWorkByBatch() {
  document.querySelectorAll(".student-work-grid--flow").forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(":scope > .student-work-card"));
    const rankedCards = cards.map((card, index) => {
      const batchRow = Array.from(card.querySelectorAll("dl > div")).find((row) => row.querySelector("dt")?.textContent.trim() === "Batch No");
      const batch = batchRow?.querySelector("dd")?.textContent.trim() || "";
      const match = batch.match(/^B(\d+)\s+(\d{4})/i);
      const rank = match ? (Number(match[2]) * 100) + Number(match[1]) : -1;
      return { card, index, rank };
    });

    rankedCards
      .sort((a, b) => (b.rank - a.rank) || (a.index - b.index))
      .forEach(({ card }) => grid.appendChild(card));
  });
}
document.addEventListener("DOMContentLoaded", sortStudentWorkByBatch);

const PROMO_BANNER = {
  enabled: true,
  id: "next-batch-demo-offer-2026",
  image: "/image/ux-ui-masterclass-visual-poster.jpg",
  imageAlt: "Students learning UX UI design on a laptop interface.",
  eyebrow: "Limited-time offer",
  title: "Next UX UI + Ai Vibe Design batch starts soon",
  body: `Attend a free demo class before the offer closes and save ${EARLY_BIRD_DISCOUNT} on your enrollment. Seats are limited for the next batch.`,
  deadline: toISTDeadline(NEXT_BATCH_CYCLE.earlyBirdDate),
  deadlineLabel: `Offer closes ${EARLY_BIRD_DAY_MONTH}`,
  seatsLabel: "Limited seats available",
  formCtaLabel: "Open enquiry form",
  whatsappCtaLabel: "Chat on WhatsApp",
  whatsappUrl: "https://wa.me/919444074941?text=Hi%20Ovi%20Design%20Academy%2C%20I%20want%20to%20attend%20the%20free%20demo%20class%20for%20the%20next%20UX%2FUI%20design%20batch.",
  showDelay: 6000
};

// ---------- Hero slider ----------
var cur = 0;
var heroSlideTimer = null;

const HERO_SECONDARY_ICON_PLAY = { html: '<polygon points="5 3 19 12 5 21 5 3"/>', fill: "currentColor", stroke: "none" };
const HERO_SECONDARY_ICON_CHAT = { html: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>', fill: "none", stroke: "currentColor" };

function renderSlide(i) {
  const t1 = document.getElementById("h-t1");
  const t2 = document.getElementById("h-t2");
  const body = document.getElementById("h-body");
  const primary = document.getElementById("h-primary");
  const secondary = document.getElementById("h-secondary");
  const secondaryIcon = document.getElementById("h-secondary-icon");
  const secondaryText = document.getElementById("h-secondary-text");
  const dots = document.querySelectorAll(".slide-dots button");

  if (!t1 || !t2 || !body || !primary || !secondary || !dots.length) {
    return;
  }

  const slide = SLIDES[i];
  [t1, t2, body].forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(10px)";
  });

  setTimeout(() => {
    t1.textContent = slide.t1;
    t2.textContent = slide.t2;
    body.textContent = slide.body;
    [t1, t2, body].forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
  }, 220);

  primary.textContent = slide.primaryCta || HERO_PRIMARY_CTA;

  const sec = slide.secondaryCta;
  secondary.href = sec ? sec.href : "#courses";
  if (sec && sec.external) {
    secondary.setAttribute("target", "_blank");
    secondary.setAttribute("rel", "noopener");
  } else {
    secondary.removeAttribute("target");
    secondary.removeAttribute("rel");
  }
  if (secondaryText) {
    secondaryText.textContent = sec ? sec.text : HERO_SECONDARY_CTA;
  }
  if (secondaryIcon) {
    const icon = sec && sec.external ? HERO_SECONDARY_ICON_CHAT : HERO_SECONDARY_ICON_PLAY;
    secondaryIcon.innerHTML = icon.html;
    secondaryIcon.setAttribute("fill", icon.fill);
    secondaryIcon.setAttribute("stroke", icon.stroke);
    secondaryIcon.setAttribute("stroke-width", "2");
    secondaryIcon.setAttribute("stroke-linecap", "round");
    secondaryIcon.setAttribute("stroke-linejoin", "round");
  }

  dots.forEach((dot, idx) => dot.classList.toggle("active", idx === i));
}

const heroSlideRoot = document.getElementById("h-t1");
if (heroSlideRoot) {
  const heroTextArea = document.querySelector(".hero-content h1, .hero-content");
  const startHeroSlider = () => {
    if (heroSlideTimer) {
      return;
    }
    heroSlideTimer = setInterval(() => {
      cur = (cur + 1) % SLIDES.length;
      renderSlide(cur);
    }, HERO_SLIDE_INTERVAL);
  };

  const stopHeroSlider = () => {
    if (!heroSlideTimer) {
      return;
    }
    clearInterval(heroSlideTimer);
    heroSlideTimer = null;
  };

  const restartHeroSlider = () => {
    stopHeroSlider();
    if (!prefersReducedMotion.matches) {
      startHeroSlider();
    }
  };

  const setHeroSlide = (index) => {
    cur = (index + SLIDES.length) % SLIDES.length;
    renderSlide(cur);
    restartHeroSlider();
  };

  const prevHeroSlide = () => {
    setHeroSlide(cur - 1);
  };

  const nextHeroSlide = () => {
    setHeroSlide(cur + 1);
  };

  renderSlide(0);
  if (!prefersReducedMotion.matches) {
    startHeroSlider();
  }

  document.querySelectorAll(".slide-dots button").forEach((dot) => {
    dot.addEventListener("click", () => {
      const slideIndex = Number(dot.dataset.slideIndex);
      if (!Number.isNaN(slideIndex)) {
        setHeroSlide(slideIndex);
      }
    });
  });

  const heroPrev = document.querySelector("[data-hero-prev]");
  const heroNext = document.querySelector("[data-hero-next]");
  if (heroPrev) {
    heroPrev.addEventListener("click", prevHeroSlide);
  }
  if (heroNext) {
    heroNext.addEventListener("click", nextHeroSlide);
  }

  if (heroTextArea && !prefersReducedMotion.matches) {
    heroTextArea.addEventListener("mouseenter", stopHeroSlider);
    heroTextArea.addEventListener("mouseleave", startHeroSlider);
  }

  [document.getElementById("h-t1"), document.getElementById("h-t2"), document.getElementById("h-body")].forEach((el) => {
    if (el) {
      el.style.transition = "opacity .4s, transform .4s";
    }
  });
}

// ---------- Shared chrome ----------
const nav = document.querySelector("header.nav");
const progress = document.getElementById("scroll-progress");
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const topbarInner = document.querySelector(".topbar-inner");
const navDropdown = document.querySelector(".nav-dropdown");
const navDropdownToggle = document.querySelector(".nav-dropdown-toggle");
const navDropdownMenu = document.querySelector(".nav-dropdown-menu");

if (navDropdownMenu && !navDropdownMenu.id) {
  navDropdownMenu.id = "nav-courses-menu";
}

if (navDropdownToggle) {
  navDropdownToggle.setAttribute("aria-controls", navDropdownMenu?.id || "nav-courses-menu");
}

const primaryNav = document.querySelector("header.nav .nav-links");
if (primaryNav && !primaryNav.getAttribute("aria-label")) {
  primaryNav.setAttribute("aria-label", "Primary");
}

function initTopbarTicker() {
  if (!topbarInner || prefersReducedMotion.matches) {
    if (topbarInner) {
      topbarInner.style.opacity = "1";
    }
    return;
  }

  const group = topbarInner.querySelector(".topbar-group");
  if (!group) {
    topbarInner.style.opacity = "1";
    return;
  }

  const ensureClones = () => {
    const width = group.getBoundingClientRect().width || 1;
    const viewport = window.innerWidth || document.documentElement.clientWidth || 1;
    const clonesNeeded = Math.max(3, Math.ceil((viewport * 2) / width) + 1);
    while (topbarInner.querySelectorAll(".topbar-group").length < clonesNeeded) {
      const clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      topbarInner.appendChild(clone);
    }
  };

  ensureClones();

  let groupWidth = group.getBoundingClientRect().width;
  let x = 0;
  let lastTime = null;
  let rafId = 0;
  const speed = 24; // px per second

  const measure = () => {
    ensureClones();
    groupWidth = group.getBoundingClientRect().width;
    if (!groupWidth) {
      groupWidth = 1;
    }
  };

  const tick = (time) => {
    if (document.hidden) {
      lastTime = time;
      rafId = requestAnimationFrame(tick);
      return;
    }
    if (lastTime == null) {
      lastTime = time;
    }
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    x -= speed * dt;
    if (x <= -groupWidth) {
      x += groupWidth;
    }
    topbarInner.style.transform = `translate3d(${x}px,0,0)`;
    rafId = requestAnimationFrame(tick);
  };

  const resume = () => {
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const pause = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
      lastTime = null;
    }
  };

  measure();
  topbarInner.style.opacity = "1";
  resume();

  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => {
      measure();
      if (x <= -groupWidth) {
        x = 0;
      }
    });
    ro.observe(topbarInner);
    ro.observe(group);
  } else {
    window.addEventListener("resize", measure, { passive: true });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pause();
      return;
    }
    resume();
  });
}

function updateChrome() {
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }

  if (progress) {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? scrollTop / docHeight : 0;
    progress.style.transform = `scaleX(${pct})`;
  }
}

if (nav || progress) {
  window.addEventListener("scroll", updateChrome, { passive: true });
  updateChrome();
}

runWhenIdle(initTopbarTicker, 900);

if (menuBtn && mobileMenu) {
  const setMobileMenuState = (isOpen) => {
    mobileMenu.classList.toggle("open", isOpen);
    mobileMenu.hidden = !isOpen;
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  };

  menuBtn.setAttribute("aria-controls", mobileMenu.id || "mobile-menu");
  if (!menuBtn.hasAttribute("aria-expanded")) {
    menuBtn.setAttribute("aria-expanded", "false");
  }
  setMobileMenuState(mobileMenu.classList.contains("open"));

  menuBtn.addEventListener("click", () => {
    setMobileMenuState(!mobileMenu.classList.contains("open"));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMobileMenuState(false);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      setMobileMenuState(false);
      menuBtn.focus();
    }
  });
}

if (navDropdown && navDropdownToggle) {
  const closeNavDropdown = () => {
    navDropdown.classList.remove("open");
    navDropdownToggle.setAttribute("aria-expanded", "false");
  };

  navDropdownToggle.addEventListener("click", (e) => {
    if (navDropdownToggle.tagName.toLowerCase() === "a") {
      return;
    }
    e.preventDefault();
    const isOpen = navDropdown.classList.toggle("open");
    navDropdownToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navDropdown.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavDropdown);
  });

  document.addEventListener("click", (e) => {
    if (!navDropdown.contains(e.target)) {
      closeNavDropdown();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeNavDropdown();
    }
  });
}

// ---------- Hero parallax ----------
const heroImg = document.getElementById("hero-img");
const heroBlob = document.getElementById("hero-blob");
if (heroImg || heroBlob) {
  window.addEventListener("scroll", () => {
    const y = Math.min(window.scrollY, 700);
    if (heroImg) {
      heroImg.style.transform = `translateY(${y * 0.18}px)`;
    }
    if (heroBlob) {
      heroBlob.style.transform = `rotate(${y * 0.06}deg)`;
    }
  }, { passive: true });
}

// Duplicate each gallery row once so the two directions loop seamlessly.
document.querySelectorAll(".life-strip").forEach((strip) => {
  const set = strip.querySelector(".life-strip-set");
  if (!set || strip.children.length > 1) return;

  const duplicate = set.cloneNode(true);
  duplicate.setAttribute("aria-hidden", "true");
  duplicate.querySelectorAll("img").forEach((img) => img.setAttribute("alt", ""));
  strip.appendChild(duplicate);
});

// ---------- Reveal on scroll ----------
runWhenIdle(() => {
  const revealTargets = document.querySelectorAll(".reveal,.feature,.course,.testi-card,.port-card,.student-work-card,.why-cell,.demo-list li,.about-card,.story-card,.learn-card");
  if (revealTargets.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "-50px" });

    revealTargets.forEach((el) => io.observe(el));
  }

  const footerMega = document.querySelectorAll(".footer-mega");
  if (footerMega.length) {
    if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
      const footerMegaObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("footer-mega-in");
            footerMegaObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.28, rootMargin: "0px 0px -8% 0px" });

      footerMega.forEach((el) => footerMegaObserver.observe(el));
    } else {
      footerMega.forEach((el) => el.classList.add("footer-mega-in"));
    }
  }

  document.querySelectorAll(".feature").forEach((el, i) => (el.style.transitionDelay = `${i * 80}ms`));
  document.querySelectorAll(".course").forEach((el, i) => (el.style.transitionDelay = `${i * 100}ms`));
  document.querySelectorAll(".port-card,.student-work-card").forEach((el, i) => (el.style.transitionDelay = `${i * 60}ms`));
  document.querySelectorAll(".why-cell").forEach((el, i) => (el.style.transitionDelay = `${i * 60}ms`));
  document.querySelectorAll(".testi-card").forEach((el, i) => (el.style.transitionDelay = `${i * 100}ms`));
  document.querySelectorAll(".demo-list li").forEach((el, i) => (el.style.transitionDelay = `${i * 70}ms`));
}, 1200);

// ---------- Shared year ----------
const yearEl = document.getElementById("yr");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function bindGoogleFormSubmission(form, options) {
  if (!form) {
    return;
  }

  const submitButton = form.querySelector(options.submitButtonSelector);
  const status = form.querySelector(options.statusSelector);
  const originalButtonText = submitButton ? submitButton.textContent : "";
  const allowedAction = /^https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]+\/formResponse$/;
  let lastSubmittedAt = 0;

  const honeypot = document.createElement("div");
  honeypot.className = "form-honeypot";
  honeypot.setAttribute("aria-hidden", "true");
  honeypot.innerHTML = '<label>Leave this field empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>';
  form.insertBefore(honeypot, form.firstChild);
  form.dataset.formReadyAt = String(Date.now());

  const setStatus = (message, type) => {
    if (!status) {
      return;
    }
    while (status.firstChild) {
      status.removeChild(status.firstChild);
    }
    if (!message) {
      return;
    }
    const messageElement = document.createElement("div");
    messageElement.className = type;
    messageElement.textContent = message;
    status.appendChild(messageElement);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const action = form.getAttribute("action") || "";
    const trapField = form.elements.website;
    const trapValue = trapField ? trapField.value.trim() : "";
    const readyAt = Number(form.dataset.formReadyAt || 0);
    const now = Date.now();

    if (trapValue || now - readyAt < 800) {
      return;
    }

    if (!allowedAction.test(action)) {
      setStatus("The enquiry service is temporarily unavailable. Please call or email us.", "error");
      return;
    }

    if (now - lastSubmittedAt < 10000) {
      setStatus("Your request was already sent. Please wait a moment before trying again.", "error");
      return;
    }

    form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach((field) => {
      field.value = field.value.trim();
    });

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-disabled", "true");
      submitButton.textContent = options.submittingText;
    }

    setStatus("", "");
    lastSubmittedAt = now;

    const abortController = "AbortController" in window ? new AbortController() : null;
    const requestTimeout = abortController
      ? setTimeout(() => abortController.abort(), 15000)
      : 0;
    const formData = new FormData(form);
    formData.delete("website");

    const requestOptions = {
      method: "POST",
      mode: "no-cors",
      referrerPolicy: "no-referrer",
      body: formData
    };
    if (abortController) {
      requestOptions.signal = abortController.signal;
    }

    const restoreSubmitButton = () => {
      clearTimeout(requestTimeout);
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-disabled");
        submitButton.textContent = originalButtonText || options.defaultButtonText;
      }
    };

    fetch(action, requestOptions)
      .then(() => {
        setStatus("Thank you! Your enquiry has been sent.", "success");
        form.reset();

        if (typeof options.onSuccess === "function") {
          options.onSuccess();
        }
      })
      .catch(() => {
        lastSubmittedAt = 0;
        if (status) {
          setStatus("Something went wrong. Please try again or call us.", "error");
        } else {
          alert("Something went wrong. Please try again.");
        }
      })
      .then(restoreSubmitButton, restoreSubmitButton);
  });
}

// ---------- Contact form ----------
const contactForm = document.getElementById("contact-form");
bindGoogleFormSubmission(contactForm, {
  submitButtonSelector: ".contact-submit",
  statusSelector: "#contact-status",
  submittingText: "Submitting...",
  defaultButtonText: "Submit Enquiry"
});

// ---------- Newsletter forms (Mailchimp) ----------
// Submits natively to Mailchimp's hosted list endpoint (action/method/target
// set in the HTML) — no fetch/AJAX needed since Mailchimp's classic embed
// endpoint doesn't allow cross-origin requests. The confirmation page opens
// in a new tab so visitors stay on the site.
document.querySelectorAll(".news-form").forEach((form) => {
  if (!form.querySelector(".news-consent")) {
    const consent = document.createElement("label");
    consent.className = "form-consent news-consent";
    consent.innerHTML = '<input type="checkbox" required /> <span>I agree to receive design tips, batch dates and student updates by email.</span>';
    form.appendChild(consent);
  }

  form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();
      form.reportValidity();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Subscribing…";
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "Subscribe by email";
      }, 4000);
    }
    // Let the form submit normally to Mailchimp from here.
  });
});

// ---------- Reusable promotional banner popup ----------
document.addEventListener("DOMContentLoaded", () => {
  const campaign = window.oviPromoBanner || PROMO_BANNER;
  if (document.body.classList.contains("demo-landing-page") || !campaign || !campaign.enabled || !campaign.image) {
    return;
  }

  const modalHost = document.createElement("div");
  modalHost.innerHTML = `
    <div class="promo-modal" id="promo-modal" aria-hidden="true" inert>
      <div class="promo-modal__backdrop" data-promo-close></div>
      <div class="promo-modal__panel" role="dialog" aria-modal="true" aria-labelledby="promo-modal-title" aria-describedby="promo-modal-desc">
        <button type="button" class="promo-modal__close" aria-label="Close promotion" data-promo-close>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="promo-modal__media">
          <img class="promo-modal__image" src="${oviSiteUrl(campaign.image)}" alt="${campaign.imageAlt || campaign.title || "Ovi Design Academy promotion"}" fetchpriority="high" />
        </div>
        <div class="promo-modal__content">
          <span class="promo-modal__eyebrow">${campaign.eyebrow || "Limited-time offer"}</span>
          <div class="promo-modal__copy">
            <h2 id="promo-modal-title">${campaign.title || "Ovi Design Academy admission offer"}</h2>
            <p id="promo-modal-desc">${campaign.body || ""}</p>
          </div>
          <div class="promo-modal__timer" data-promo-countdown>
            <div class="promo-modal__time"><strong data-promo-days>00</strong><span>Days</span></div>
            <div class="promo-modal__time"><strong data-promo-hours>00</strong><span>Hours</span></div>
            <div class="promo-modal__time"><strong data-promo-minutes>00</strong><span>Mins</span></div>
            <div class="promo-modal__time"><strong data-promo-seconds>00</strong><span>Secs</span></div>
          </div>
          <div class="promo-modal__meta">
            <span>${campaign.deadlineLabel || "Offer closes soon"}</span>
            <span>${campaign.seatsLabel || "Limited seats available"}</span>
            <span>Online & offline learning</span>
          </div>
          <div class="promo-modal__actions">
            <a class="promo-modal__cta promo-modal__cta--primary" href="#demo-modal" data-demo-open data-promo-action>${campaign.formCtaLabel || "Open enquiry form"}</a>
            <a class="promo-modal__cta promo-modal__cta--whatsapp" href="${campaign.whatsappUrl || "https://wa.me/919444074941"}" target="_blank" rel="noopener" data-promo-action>${campaign.whatsappCtaLabel || "Chat on WhatsApp"}</a>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modalHost.firstElementChild);

  const modal = document.getElementById("promo-modal");
  if (!modal) {
    return;
  }

  let previousFocus = null;
  let countdownTimer = null;
  const modalPanel = modal.querySelector(".promo-modal__panel");
  const deadlineTime = campaign.deadline ? new Date(campaign.deadline).getTime() : 0;
  const countdown = {
    root: modal.querySelector("[data-promo-countdown]"),
    days: modal.querySelector("[data-promo-days]"),
    hours: modal.querySelector("[data-promo-hours]"),
    minutes: modal.querySelector("[data-promo-minutes]"),
    seconds: modal.querySelector("[data-promo-seconds]")
  };

  const setCountdownValue = (el, value) => {
    if (el) {
      el.textContent = String(Math.max(0, value)).padStart(2, "0");
    }
  };

  const updateCountdown = () => {
    if (!deadlineTime || Number.isNaN(deadlineTime)) {
      if (countdown.root) {
        countdown.root.hidden = true;
      }
      return;
    }

    const remaining = Math.max(0, deadlineTime - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    setCountdownValue(countdown.days, Math.floor(totalSeconds / 86400));
    setCountdownValue(countdown.hours, Math.floor((totalSeconds % 86400) / 3600));
    setCountdownValue(countdown.minutes, Math.floor((totalSeconds % 3600) / 60));
    setCountdownValue(countdown.seconds, totalSeconds % 60);

    if (remaining <= 0 && countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  };

  const openPromo = () => {
    previousFocus = document.activeElement;
    updateCountdown();
    if (!countdownTimer && deadlineTime && !Number.isNaN(deadlineTime)) {
      countdownTimer = window.setInterval(updateCountdown, 1000);
    }
    modal.removeAttribute("inert");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    const closeButton = modal.querySelector(".promo-modal__close");
    if (closeButton) {
      closeButton.focus();
    } else if (modalPanel instanceof HTMLElement) {
      modalPanel.focus();
    }
  };

  const closePromo = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("inert", "");
    document.body.classList.remove("modal-open");
    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus();
    }
  };

  modal.querySelectorAll("[data-promo-close]").forEach((control) => {
    control.addEventListener("click", closePromo);
  });

  modal.querySelectorAll("[data-promo-action]").forEach((control) => {
    control.addEventListener("click", closePromo);
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("open")) {
      return;
    }
    if (event.key === "Escape") {
      closePromo();
      return;
    }
    trapFocusInContainer(event, modalPanel);
  });

  if (modalPanel instanceof HTMLElement && !modalPanel.hasAttribute("tabindex")) {
    modalPanel.setAttribute("tabindex", "-1");
  }

  window.setTimeout(openPromo, Number(campaign.showDelay) || 0);
});

function initInstagramEmbeds() {
  const embeds = document.querySelectorAll(".instagram-media");
  if (!embeds.length || window.instgrm) {
    return;
  }

  const loadInstagramEmbeds = () => {
    if (window.__oviInstagramEmbedLoading || window.instgrm) {
      return;
    }
    window.__oviInstagramEmbedLoading = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = () => {
      if (window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) {
        window.instgrm.Embeds.process();
      }
    };
    document.body.appendChild(script);
  };

  const anchor = embeds[0].closest(".instagram-embed-row,.section-pad") || embeds[0];
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        io.disconnect();
        loadInstagramEmbeds();
      }
    }, { rootMargin: "240px 0px" });
    io.observe(anchor);
    return;
  }

  runWhenIdle(loadInstagramEmbeds, 1800);
}

// ---------- Free demo popup ----------
document.addEventListener("DOMContentLoaded", () => {
  runWhenIdle(() => {
    let modal = document.getElementById("demo-modal");

    if (!modal) {
      const modalHost = document.createElement("div");
      modalHost.innerHTML = `
        <div class="demo-modal" id="demo-modal" aria-hidden="true" inert>
          <div class="demo-modal__backdrop" data-demo-close></div>
          <div class="demo-modal__panel" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title" aria-describedby="demo-modal-desc">
            <button type="button" class="demo-modal__close" aria-label="Close demo form" data-demo-close>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div class="">
              <div class="form-container">
                <div class="demo-modal__topline">
                  <span class="demo-modal__eyebrow">Free Demo Class</span>
                  <span class="demo-modal__chip">Live this week</span>
                </div>
                <h2 id="demo-modal-title">Book your free demo</h2>
                <p id="demo-modal-desc">Choose your preferred course and we’ll share the batch timing, mentor details, and next steps.</p>

                <form id="demo-form" action="https://docs.google.com/forms/d/e/1FAIpQLSe-HnVltY_M0mU0ULojI-HW_uQzhaoQHH2RswICpBKHojmRag/formResponse" method="POST" novalidate accept-charset="UTF-8">
                  <div class="input-group">
                    <label class="sr-only" for="name">Full name</label>
                    <input type="text" id="name" name="entry.2006584646" placeholder="Full Name" aria-label="Full name" autocomplete="name" minlength="2" maxlength="80" required />
                  </div>

                  <div class="input-group">
                    <label class="sr-only" for="email">Email address</label>
                    <input type="email" id="email" name="entry.1227599783" placeholder="Email Address" aria-label="Email address" autocomplete="email" maxlength="254" required />
                  </div>

                  <div class="input-group">
                    <label class="sr-only" for="phone">10-digit phone number</label>
                    <input type="tel" id="phone" name="entry.489954529" placeholder="10-digit Phone Number" aria-label="10-digit phone number" autocomplete="tel" inputmode="numeric" pattern="[0-9]{10}" minlength="10" maxlength="10" required />
                  </div>

                  <div class="input-group">
                    <label class="sr-only" for="preferred-course">Preferred course</label>
                    <select id="preferred-course" name="entry.376165871" aria-label="Preferred course" autocomplete="off" required>
                      <option value="">Preferred course</option>
                      <option>UX UI + Ai Vibe Design</option>
                      <option>Advanced UX/UI + AI Leadership Program</option>
                    </select>
                  </div>

                  <div class="input-group">
                    <label class="sr-only" for="message">Your goals or background</label>
                    <textarea id="message" name="entry.1824922767" placeholder="Tell us about your goals or background..." aria-label="Your goals or background" minlength="10" maxlength="1000" required></textarea>
                  </div>

                  <label class="form-consent"><input type="checkbox" required /> <span>I agree that Ovi Design Academy may contact me about this enquiry.</span></label>
                  <button id="submitBtn" type="submit">Submit Enquiry</button>

                  <div id="status" class="form-status" role="status" aria-live="polite"></div>
                </form>
              </div>
            </div>
          </div>
        </div>`;
      document.body.appendChild(modalHost.firstElementChild);
      modal = document.getElementById("demo-modal");
    }

    const form = document.getElementById("demo-form");
    const status = document.getElementById("status");
    const modalPanel = modal.querySelector(".demo-modal__panel");

    if (!form || !modal) {
      return;
    }

    let modalTrigger = null;

    const ensureFieldLabel = (fieldId, text) => {
      if (form.querySelector(`label[for="${fieldId}"]`)) {
        return;
      }
      const field = form.querySelector(`#${fieldId}`);
      if (!(field instanceof HTMLElement) || !(field.parentElement instanceof HTMLElement)) {
        return;
      }
      const label = document.createElement("label");
      label.className = "sr-only";
      label.htmlFor = fieldId;
      label.textContent = text;
      field.parentElement.insertBefore(label, field);
    };

    ensureFieldLabel("name", "Full name");
    ensureFieldLabel("email", "Email address");
    ensureFieldLabel("phone", "10-digit phone number");
    ensureFieldLabel("preferred-course", "Preferred course");
    ensureFieldLabel("message", "Your goals or background");

    const openModal = (trigger) => {
      modalTrigger = trigger || document.activeElement;
      form.dataset.formReadyAt = String(Date.now());
      modal.removeAttribute("inert");
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      const firstField = form.querySelector("input, select, textarea, button");
      if (firstField) {
        firstField.focus();
      } else if (modalPanel instanceof HTMLElement) {
        modalPanel.focus();
      }
    };

    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      modal.setAttribute("inert", "");
      document.body.classList.remove("modal-open");
      if (modalTrigger instanceof HTMLElement) {
        modalTrigger.focus();
      }
    };

    document.querySelectorAll("[data-demo-open]").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(trigger);
      });
    });

    modal.querySelectorAll("[data-demo-close]").forEach((control) => {
      control.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("open")) {
        return;
      }
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      trapFocusInContainer(e, modalPanel);
    });

    if (modalPanel instanceof HTMLElement && !modalPanel.hasAttribute("tabindex")) {
      modalPanel.setAttribute("tabindex", "-1");
    }

    bindGoogleFormSubmission(form, {
      submitButtonSelector: "#submitBtn",
      statusSelector: "#status",
      submittingText: "Submitting...",
      defaultButtonText: "Submit Enquiry",
      onSuccess: () => {
        setTimeout(() => {
          if (status) {
            while (status.firstChild) {
              status.removeChild(status.firstChild);
            }
          }
          closeModal();
        }, 2500);
      }
    });
  }, 1500);

  initInstagramEmbeds();
});

// ---------- Course pages ----------
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("course-page")) {
    return;
  }

  const Icon = {
    arrow: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`,
    check: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    star: (fill) => `<svg viewBox="0 0 24 24" style="fill:${fill};color:${fill}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    clock: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    bolt: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    users: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    cert: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5"/></svg>`,
    sparkle: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/></svg>`,
  };

  const courseData = window.courseData || {};
  const coursePhases = courseData.phases || globalThis.phases || [];
  const courseTools = courseData.aiTools || globalThis.aiTools || [];
  const courseRoles = courseData.roles || globalThis.roles || [];
  const courseTestimonials = courseData.testimonials || globalThis.testimonials || [];
  const coursePortfolio = courseData.portfolio || globalThis.portfolio || [];
  const courseWhyItems = courseData.whyItems || globalThis.whyItems || [];
  const courseFaqs = courseData.faqs || globalThis.faqs || [];
  const courseCrossSell = courseData.crossSell || globalThis.crossSell || [];
  const courseMarqueeWords = courseData.marqueeWords || globalThis.marqueeWords || [];
  const coursePersonas = (courseData.personas || globalThis.personas || [])
    .map((item) => typeof item === "string" ? item.trim() : "")
    .filter(Boolean);
  const courseToolsSummaryCard = courseData.toolsSummaryCard || globalThis.toolsSummaryCard || null;
  const courseCompanies = courseData.companies || globalThis.companies || [];

  function initials(name) {
    return name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  }

  function revealInserted(root) {
    if (!root) return;
    const nodes = root.querySelectorAll(".reveal");
    nodes.forEach((node) => node.classList.add("in"));
  }

  function renderPersonas() {
    const el = document.getElementById("personaRow");
    if (!el) return;
    if (!coursePersonas.length) {
      el.innerHTML = "";
      el.style.display = "none";
      return;
    }
    el.style.display = "";
    el.innerHTML = coursePersonas.map((p) => `<span class="chip">${Icon.check()}${p}</span>`).join("");
    revealInserted(el);
  }

  function renderMarquee() {
    const el = document.getElementById("marquee");
    if (!el) return;
    let html = "";
    for (let k = 0; k < 2; k++) {
      courseMarqueeWords.forEach((word) => {
        html += `<span>${word} <span class="sparkle">✦</span></span>`;
      });
    }
    el.innerHTML = html;
    revealInserted(el);
  }

  function renderRoles() {
    const el = document.getElementById("rolesGrid");
    if (!el) return;
    el.innerHTML = courseRoles.map((role) => `
      <div class="role">
        <div class="rn">${role.rn}</div>
        <div class="rs">${role.rs}</div>
      </div>`).join("");
    revealInserted(el);
  }

  function renderPhases() {
    const el = document.getElementById("phaseGrid");
    if (!el) return;
    el.innerHTML = coursePhases.map((phase) => `
      <article class="phase p${phase.n} reveal">
        <div class="head">
          <div class="pnum">0${phase.n}</div>
          <span class="weeks">${phase.weeks}</span>
        </div>
        <h3>${phase.h}</h3>
        <p class="sub">${phase.sub}</p>
        <ul>
          ${phase.items.map((item) => `<li>${Icon.check()} <span>${item}</span></li>`).join("")}
        </ul>
      </article>`).join("");
    revealInserted(el);
  }

  function renderTools() {
    const el = document.getElementById("toolsCarousel");
    if (!el) return;
    const toolLogo = (tool) => {
      const name = tool.nm || "";
      const key = name.toLowerCase();
      const mono = initials(name).slice(0, 2);
      const fill = tool.bg || "#1a1830";
      if (key.includes("figma")) {
        return `<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="13" cy="9" r="5" fill="#f24e1e"/><circle cx="23" cy="9" r="5" fill="#ff7262"/><circle cx="13" cy="18" r="5" fill="#a259ff"/><circle cx="23" cy="18" r="5" fill="#1abcfe"/><circle cx="13" cy="27" r="5" fill="#0acf83"/></svg>`;
      }
      if (key.includes("chatgpt")) {
        return `<svg viewBox="0 0 36 36" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 7.2a7 7 0 0 1 6.7 5.1 7 7 0 0 1-1.8 13.2 7 7 0 0 1-11.7 2.6 7 7 0 0 1-3.9-11.6 7 7 0 0 1 10.7-9.3Z"/><path d="M12.6 13.6 18 10.5l5.4 3.1v6.2L18 22.9l-5.4-3.1v-6.2Z"/><path d="m18 10.5 5.4 9.3M12.6 19.8h10.8M18 22.9l-5.4-9.3"/></g></svg>`;
      }
      if (key.includes("midjourney")) {
        return `<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M8 24.5c4-7.7 8.2-11.5 12.5-11.5 3.7 0 6.1 2.4 7.5 7.2-2.1-2-4.2-2.9-6.3-2.9-3.1 0-6.1 2.4-9 7.2H8Z" fill="#fff"/><path d="M7.5 26.8h21" stroke="#ffa45d" stroke-width="2.3" stroke-linecap="round"/></svg>`;
      }
      if (key.includes("webflow")) {
        return `<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M29.5 12 24 24h-5l2.3-5.1h-.1A11 11 0 0 1 12.8 24H7l5.4-12h5.3l-2.2 5.2h.1A10.6 10.6 0 0 1 23.8 12h5.7Z" fill="#fff"/></svg>`;
      }
      if (key.includes("framer")) {
        return `<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M11 7h14v7h-7l7 7H11v-7h7l-7-7Zm0 14h7v8l-7-8Z" fill="#fff"/></svg>`;
      }
      if (key.includes("illustrator") || key.includes("photoshop") || key.includes("indesign")) {
        return `<svg viewBox="0 0 36 36" aria-hidden="true"><rect x="7" y="7" width="22" height="22" rx="5" fill="none" stroke="#fff" stroke-width="2.4"/><text x="18" y="22.8" text-anchor="middle" fill="#fff" font-size="10" font-weight="800" font-family="Inter, Arial">${mono}</text></svg>`;
      }
      if (key.includes("canva")) {
        return `<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M25.5 21.5c-1.6 3.3-4.4 5.1-8 5.1-5 0-8.2-3.4-8.2-8.5s3.5-8.7 8.5-8.7c3.3 0 6 1.6 7.5 4.5l-4.1 2.2c-.7-1.3-1.8-2-3.2-2-2.1 0-3.6 1.6-3.6 4s1.4 4 3.6 4c1.5 0 2.7-.8 3.4-2.4l4.1 1.8Z" fill="#fff"/></svg>`;
      }
      return `<svg viewBox="0 0 36 36" aria-hidden="true"><rect x="7" y="7" width="22" height="22" rx="8" fill="${fill}"/><text x="18" y="22.5" text-anchor="middle" fill="#fff" font-size="9.5" font-weight="800" font-family="Inter, Arial">${mono}</text></svg>`;
    };
    const visibleTools = courseToolsSummaryCard ? courseTools.slice(0, 5) : courseTools;
    const toolCards = visibleTools.map((tool) => `
      <div class="tool-card">
        <div class="icon" style="background:${tool.bg}">${toolLogo(tool)}</div>
        <div class="nm">${tool.nm}</div>
        <div class="use">${tool.use}</div>
      </div>`);
    const summaryCard = courseToolsSummaryCard ? `
      <div class="tool-card tool-card-summary">
        <div class="icon"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M18 11v14M11 18h14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></div>
        <div class="nm">${courseToolsSummaryCard.nm}</div>
        <div class="use">${courseToolsSummaryCard.use}</div>
      </div>` : "";
    el.innerHTML = `${toolCards.join("")}${summaryCard}`;
    revealInserted(el);
  }

  function renderWhy() {
    const el = document.getElementById("whyGrid");
    if (!el) return;
    el.innerHTML = courseWhyItems.map((item, index) => `
      <div class="why-card reveal">
        <span class="num">0${index + 1}</span>
        <div class="ico">${typeof item.ico === "string" && Icon[item.ico] ? Icon[item.ico]() : item.ico}</div>
        <h3>${item.h}</h3>
        <p>${item.p}</p>
      </div>`).join("");
    revealInserted(el);
  }

  function renderPortfolio() {
    const el = document.getElementById("portfolioGrid");
    if (!el) return;
    el.innerHTML = coursePortfolio.map((project, index) => {
      const studentParts = project.ps.replace(/^By\s+/i, "").split("·").map((part) => part.trim()).filter(Boolean);
      const studentName = studentParts[0] || "Student";
      const batchNo = studentParts.find((part) => /batch/i.test(part)) || `Batch ${String(index + 1).padStart(2, "0")}`;
      const courseLabel = Array.isArray(project.tags) && project.tags.length ? project.tags.join(" · ") : "Student Portfolio";

      return `
      <article class="student-work-card reveal">
        <div class="work-thumb">
          <img src="${oviSiteUrl(project.img)}" alt="${project.pt} case study thumbnail by ${studentName}" loading="lazy" />
        </div>
        <div class="work-card-top">
          <span class="work-course">${courseLabel}</span>
          <div class="work-avatar">${initials(studentName)}</div>
        </div>
        <dl>
          <div><dt>Student Name</dt><dd>${studentName}</dd></div>
          <div><dt>Project Name</dt><dd>${project.pt}</dd></div>
          <div><dt>Batch No</dt><dd>${batchNo}</dd></div>
        </dl>
        <a href="https://www.behance.net/" class="work-behance-btn" target="_blank" rel="noopener" aria-label="View ${project.pt} on Behance">View on Behance</a>
      </article>`;
    }).join("");
    revealInserted(el);
  }

  function renderLogos() {
    const el = document.getElementById("logosRow");
    if (!el) return;
    const placementLogoMap = {
      zoho: "image/placements-logo/Zoho 1.png",
      verizon: "image/placements-logo/Verizon-Logo 1.png",
      freshworks: "image/placements-logo/Appydesign-logo-new 1.png",
      zerodha: "image/placements-logo/aspire-logo-violet 1.png",
      razorpay: "image/placements-logo/claimitlogo 1.png",
      infosys: "image/placements-logo/Wongdoody 1.png",
      accenture: "image/placements-logo/Lamynaals_Tech_Logo-01-1 1.png",
      pega: "image/placements-logo/Secura 1.png"
    };
    const fallbackLogos = [
      { name: "Appy Design", src: "image/placements-logo/Appydesign-logo-new 1.png" },
      { name: "Aspire", src: "image/placements-logo/aspire-logo-violet 1.png" },
      { name: "Claimit", src: "image/placements-logo/claimitlogo 1.png" },
      { name: "Lamynaals Tech", src: "image/placements-logo/Lamynaals_Tech_Logo-01-1 1.png" },
      { name: "Secura", src: "image/placements-logo/Secura 1.png" },
      { name: "Wongdoody", src: "image/placements-logo/Wongdoody 1.png" },
      { name: "Zoho", src: "image/placements-logo/Zoho 1.png" },
      { name: "Verizon", src: "image/placements-logo/Verizon-Logo 1.png" }
    ];
    const logoItems = courseCompanies.length
      ? courseCompanies.map((company, index) => {
          const fallback = fallbackLogos[index % fallbackLogos.length];
          return {
            name: company,
            src: placementLogoMap[String(company).toLowerCase()] || fallback.src
          };
        })
      : fallbackLogos;
    const logos = logoItems.map((company) => `
      <span class="logo-name">
        <img src="${oviSiteUrl(company.src)}" alt="${company.name} placement logo" loading="lazy" />
      </span>`).join("");
    el.innerHTML = `
      <div class="logos-track">${logos}</div>
      <div class="logos-track" aria-hidden="true">${logos}</div>`;
    revealInserted(el);
  }

  function renderTestimonials() {
    const el = document.getElementById("testiGrid");
    if (!el) return;
    el.innerHTML = courseTestimonials.map((testi) => `
      <figure class="testi ${testi.dark ? "dark" : ""} reveal">
        <div class="stars">${Array.from({ length: 5 }).map(() => Icon.star(testi.dark ? "var(--lime)" : "#fbbc04")).join("")}</div>
        <blockquote>"${testi.q}"</blockquote>
        <div class="ba-mini">
          <span class="ba-pill before">${testi.before}</span>
          ${Icon.arrow()}
          <span class="ba-pill after">${testi.after}</span>
        </div>
        <figcaption>
          <div class="avatar">${initials(testi.nm)}</div>
          <div>
            <div class="nm">${testi.nm}</div>
            <div class="rl">${testi.rl}</div>
          </div>
        </figcaption>
      </figure>`).join("");
    revealInserted(el);
  }

  function renderFaqs() {
    const el = document.getElementById("faqList");
    if (!el) return;
    el.innerHTML = courseFaqs.map((faq, index) => `
      <details class="faq-item reveal" ${index === 0 ? "open" : ""}>
        <summary>${faq.q}<span class="plus">+</span></summary>
        <div class="ans">${faq.a}</div>
      </details>`).join("");
    revealInserted(el);
  }

  function renderRelated() {
    const el = document.getElementById("relatedCourses");
    if (!el) return;
    const getCourseHref = (course) => {
      const key = `${course.tag || ""} ${course.h || ""}`.toLowerCase();
      if (course.url) return course.url;
      if (key.includes("advanced")) return "/courses/advanced-ui-ux-ai-design-course-chennai/advanced-ui-ux-ai-course-chennai.html";
      if (key.includes("ux")) return "/courses/ux-ui-ai-vibe-design-course-chennai/ux-ui-ai-vibe-design-program-chennai.html";
      return "/courses/ui-ux-design-course-fees-chennai/ui-ux-design-course-fees-comparison.html";
    };
    el.innerHTML = courseCrossSell.map((course) => `
      <a href="${oviSiteUrl(getCourseHref(course))}" class="rel-card rel-${course.cls}">
        <div class="rel-top">
          <span class="rel-tag">${course.tag}</span>
          ${Icon.arrow()}
        </div>
        <h4>${course.h}</h4>
        <p>${course.p}</p>
        <div class="rel-meta">
          <span>${Icon.clock()} ${course.dur}</span>
          <span>${Icon.users()} ${course.mode}</span>
          <span>${Icon.sparkle()} ${course.lang}</span>
        </div>
        <div class="rel-emi">0% EMI available</div>
      </a>`).join("");
    revealInserted(el);
  }

  function initToolsCarousel() {
    const el = document.getElementById("toolsCarousel");
    if (!el) return;

    const scroll = (dir) => {
      const distance = dir * (el.clientWidth * 0.8);
      try {
        el.scrollBy({ left: distance, behavior: "smooth" });
      } catch (error) {
        el.scrollLeft += distance;
      }
    };
    const prev = document.getElementById("toolsPrev");
    const next = document.getElementById("toolsNext");

    if (prev) prev.addEventListener("click", () => scroll(-1));
    if (next) next.addEventListener("click", () => scroll(1));
  }

  function initForms() {
    const midForm = document.getElementById("midForm");
    const enquiryForm = document.getElementById("enquiryForm");
    if (midForm) midForm.addEventListener("submit", (event) => event.preventDefault());
    if (enquiryForm) enquiryForm.addEventListener("submit", (event) => event.preventDefault());
  }

  renderPersonas();
  renderMarquee();
  renderRoles();
  renderPhases();
  renderTools();
  renderWhy();
  renderPortfolio();
  renderLogos();
  renderTestimonials();
  renderFaqs();
  renderRelated();

  initToolsCarousel();
  initForms();
});

// Index page hero slider.
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector("[data-index-hero]");
  if (!hero) return;

  const slides = [
    {
      titleOne: "Upscale your career",
      titleTwo: "Graphic to UX + Ai",
      description: "Learn UX/UI Design, AI-powered workflows and Vibe Coding to turn your ideas into functional mobile and web applications."
    },
    {
      titleOne: "AI-Powered UX/UI &",
      titleTwo: "Vibe Prototyping",
      description: "Join Chennai's industry-focused UX/UI program and learn AI, Figma, research, prototyping, and design systems."
    },
    {
      titleOne: "Don't Just Design,",
      titleTwo: "Build them with AI.",
      description: "Learn UX/UI Design, AI Tools and Vibe Coding to turn your ideas into functional mobile and web apps without traditional coding.",
      primaryText: "Book Free Demo Class",
      secondaryText: "Talk to Mentor",
      secondaryHref: "https://wa.me/919444074941?text=Hi%20Ovi%20Design%20Academy%2C%20I%27d%20like%20to%20talk%20to%20a%20mentor%20about%20the%20AI-Powered%20UX%2FUI%20%2B%20Vibe%20Coding%20course.",
      secondaryExternal: true
    }
  ];

  const titleOne = hero.querySelector("[data-index-title-one]");
  const titleTwo = hero.querySelector("[data-index-title-two]");
  const description = hero.querySelector("[data-index-description]");
  const primaryText = hero.querySelector("[data-index-primary-text]");
  const secondary = hero.querySelector("[data-index-secondary]");
  const secondaryText = hero.querySelector("[data-index-secondary-text]");
  const secondaryIcon = hero.querySelector("[data-index-secondary-icon]");
  const dots = Array.from(hero.querySelectorAll("[data-index-slide]"));
  const backgrounds = Array.from(hero.querySelectorAll("[data-index-background]"));
  const previous = hero.querySelector("[data-index-prev]");
  const next = hero.querySelector("[data-index-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;
  let timer = null;
  let touchStartX = 0;
  let transitionFrame = null;
  let parallaxFrame = null;
  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let currentParallaxX = 0;
  let currentParallaxY = 0;

  const drawParallax = () => {
    currentParallaxX += (targetParallaxX - currentParallaxX) * 0.14;
    currentParallaxY += (targetParallaxY - currentParallaxY) * 0.14;
    hero.style.setProperty("--hero-bg-x", `${(-currentParallaxX * 13).toFixed(2)}px`);
    hero.style.setProperty("--hero-bg-y", `${(-currentParallaxY * 9).toFixed(2)}px`);
    if (Math.abs(targetParallaxX - currentParallaxX) > 0.002 || Math.abs(targetParallaxY - currentParallaxY) > 0.002) {
      parallaxFrame = window.requestAnimationFrame(drawParallax);
    } else {
      parallaxFrame = null;
    }
  };

  const scheduleParallax = () => {
    if (parallaxFrame === null) parallaxFrame = window.requestAnimationFrame(drawParallax);
  };

  const resetParallax = () => {
    targetParallaxX = 0;
    targetParallaxY = 0;
    hero.classList.remove("is-parallax-active");
    scheduleParallax();
  };

  const render = (index) => {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    hero.dataset.activeSlide = String(current);
    titleOne.textContent = slide.titleOne;
    titleTwo.textContent = slide.titleTwo;
    description.textContent = slide.description;
    primaryText.textContent = slide.primaryText || "Start Your Free Demo";
    secondaryText.textContent = slide.secondaryText || "Explore Courses";
    secondary.href = slide.secondaryHref || oviSiteUrl("courses/index.html");

    if (slide.secondaryExternal) {
      secondary.target = "_blank";
      secondary.rel = "noopener";
      secondaryIcon.setAttribute("fill", "none");
      secondaryIcon.setAttribute("stroke", "currentColor");
      secondaryIcon.innerHTML = '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>';
    } else {
      secondary.removeAttribute("target");
      secondary.removeAttribute("rel");
      secondaryIcon.setAttribute("fill", "currentColor");
      secondaryIcon.setAttribute("stroke", "none");
      secondaryIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
    }

    backgrounds.forEach((background, itemIndex) => background.classList.toggle("is-active", itemIndex === current));
    dots.forEach((dot, itemIndex) => {
      const active = itemIndex === current;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-current", String(active));
    });

    if (!reducedMotion.matches) {
      if (transitionFrame !== null) window.cancelAnimationFrame(transitionFrame);
      hero.classList.add("is-preparing-slide");
      void hero.offsetWidth;
      transitionFrame = window.requestAnimationFrame(() => {
        hero.classList.remove("is-preparing-slide");
        transitionFrame = null;
      });
    }
  };

  const stopAutoplay = () => {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
  const startAutoplay = () => {
    stopAutoplay();
    if (!reducedMotion.matches) timer = window.setInterval(() => render(current + 1), 5000);
  };
  const select = (index) => {
    render(index);
    startAutoplay();
  };

  dots.forEach((dot) => dot.addEventListener("click", () => select(Number(dot.dataset.indexSlide))));
  previous.addEventListener("click", () => select(current - 1));
  next.addEventListener("click", () => select(current + 1));
  hero.addEventListener("mouseenter", stopAutoplay);
  hero.addEventListener("mouseleave", startAutoplay);
  hero.addEventListener("mousemove", (event) => {
    if (reducedMotion.matches) return;
    const bounds = hero.getBoundingClientRect();
    targetParallaxX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
    targetParallaxY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
    hero.classList.add("is-parallax-active");
    scheduleParallax();
  });
  hero.addEventListener("mouseleave", resetParallax);
  hero.addEventListener("focusin", stopAutoplay);
  hero.addEventListener("focusout", (event) => {
    if (!hero.contains(event.relatedTarget)) startAutoplay();
  });
  hero.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  hero.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) select(distance < 0 ? current + 1 : current - 1);
  }, { passive: true });
  document.addEventListener("keydown", (event) => {
    const bounds = hero.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
    if (event.key === "ArrowLeft") select(current - 1);
    if (event.key === "ArrowRight") select(current + 1);
  });
  reducedMotion.addEventListener("change", () => {
    resetParallax();
    startAutoplay();
  });

  render(0);
  startAutoplay();
});
