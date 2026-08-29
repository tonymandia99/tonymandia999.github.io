const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const header = document.querySelector(".header");
const year = document.getElementById("year");
const progress = document.getElementById("scrollProgress");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* Reveal each subject/section as the user scrolls */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -45px 0px",
  }
);

/* Stagger cards/items inside each group */
document.querySelectorAll(".stagger-group").forEach((group) => {
  const items = group.querySelectorAll(".reveal");
  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  });
});

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* Scroll progress line */
function updateProgress() {
  if (!progress) return;
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progress.style.width = `${percent}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* Hide navigation while scrolling down and reveal it while scrolling up */
let lastScrollY = Math.max(window.scrollY, 0);
let headerScrollTicking = false;

function updateHeaderVisibility() {
  if (!header) return;

  const currentScrollY = Math.max(window.scrollY, 0);
  const isScrollingDown = currentScrollY > lastScrollY;
  const isMobileMenuOpen = nav?.classList.contains("open");

  if (currentScrollY <= 80 || !isScrollingDown || isMobileMenuOpen) {
    header.classList.remove("header-hidden");
  } else if (currentScrollY > 140) {
    header.classList.add("header-hidden");
  }

  lastScrollY = currentScrollY;
  headerScrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (headerScrollTicking) return;
    headerScrollTicking = true;
    window.requestAnimationFrame(updateHeaderVisibility);
  },
  { passive: true }
);

header?.addEventListener("focusin", () => {
  header.classList.remove("header-hidden");
});

/* Active navigation link per visible section */
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll('.nav a[href^="#"]:not(.nav-cta)');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const id = visible.target.id;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  },
  {
    threshold: [0.25, 0.45, 0.65],
    rootMargin: "-15% 0px -55% 0px",
  }
);

sections.forEach((section) => sectionObserver.observe(section));

/* Open a pre-filled email from the contact form */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href =
      `mailto:tonymandia99@gmail.com?subject=${subject}&body=${body}`;
  });
}
