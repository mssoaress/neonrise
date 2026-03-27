// ── PRELOAD IMAGENS DO PORTFÓLIO (evita delay ao revelar)
document.querySelectorAll(".port-img").forEach(img => {
  img.setAttribute("loading", "eager");
  if (img.dataset.src) img.src = img.dataset.src;
});

// ── PROGRESS BAR
const progressBar = document.getElementById("progress-bar");
window.addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / total * 100) + "%";
}, { passive: true });

// ── NAVBAR SCROLL
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

// ── HAMBURGER MENU
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");
const spans     = hamburger.querySelectorAll("span");

hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  spans[0].style.transform = open ? "rotate(45deg) translate(5px,5px)"   : "";
  spans[1].style.opacity   = open ? "0"                                   : "1";
  spans[2].style.transform = open ? "rotate(-45deg) translate(5px,-5px)" : "";
  document.body.style.overflow = open ? "hidden" : "";
});

navLinks.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    spans.forEach(s => { s.style.transform = ""; s.style.opacity = "1"; });
    document.body.style.overflow = "";
  });
});

// ── SCROLL REVEAL com stagger por seção
const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
const revealOb  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay) || 0;
    setTimeout(() => entry.target.classList.add("visible"), delay);
    revealOb.unobserve(entry.target);
  });
}, { threshold: 0.04, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll("section").forEach(sec => {
  sec.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el, i) => {
    el.dataset.delay = i * 45;
  });
});
revealEls.forEach(el => revealOb.observe(el));

// ── STEP REVEAL
const steps  = document.querySelectorAll(".step");
const stepOb = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    setTimeout(() => entry.target.classList.add("visible"),
               parseInt(entry.target.dataset.idx) * 80);
    stepOb.unobserve(entry.target);
  });
}, { threshold: 0.06, rootMargin: "0px 0px -30px 0px" });
steps.forEach((el, i) => { el.dataset.idx = i; stepOb.observe(el); });

// ── FLOAT WA some no CTA final
const ctaFinal = document.getElementById("cta-final");
const floatWa  = document.getElementById("floatWa");
if (ctaFinal && floatWa) {
  const ctaOb = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      floatWa.style.opacity       = e.isIntersecting ? "0" : "1";
      floatWa.style.pointerEvents = e.isIntersecting ? "none" : "auto";
      floatWa.style.transform     = e.isIntersecting ? "translateY(20px)" : "";
    });
  }, { threshold: 0.2 });
  ctaOb.observe(ctaFinal);
}

// ── COUNTER ANIMATION nos stats
function animateCounter(el) {
  const target = el.textContent.trim();
  const num    = parseFloat(target.replace(/[^0-9.]/g, ""));
  const suffix = target.replace(/[0-9.]/g, "");
  if (isNaN(num)) return;
  let start = 0;
  const duration = 1400;
  const startTime = performance.now();
  const step = (now) => {
    const p    = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = (num < 10 ? (ease * num).toFixed(0) : Math.round(ease * num)) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsOb = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll("strong").forEach(animateCounter);
    statsOb.unobserve(e.target);
  });
}, { threshold: 0.4 });
const heroStats = document.querySelector(".hero-stats");
if (heroStats) statsOb.observe(heroStats);

// ── LIGHTBOX
const lightbox     = document.getElementById("lightbox");
const lightImg     = document.getElementById("lightbox-img");
const lightClose   = document.getElementById("lightbox-close");
const lightCaption = document.getElementById("lightbox-caption");
const lightPrev    = document.getElementById("lightbox-prev");
const lightNext    = document.getElementById("lightbox-next");

const portItems = Array.from(document.querySelectorAll(".port-item"));
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const item = portItems[index];
  const img  = item.querySelector(".port-img");
  const name = item.querySelector(".port-name");
  const tag  = item.querySelector(".port-tag");
  lightImg.src = img ? img.src : "";
  lightImg.alt = img ? img.alt : "";
  lightCaption.textContent = (tag ? tag.textContent + " — " : "") + (name ? name.textContent : "");
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + portItems.length) % portItems.length;
  const item = portItems[currentIndex];
  const img  = item.querySelector(".port-img");
  const name = item.querySelector(".port-name");
  const tag  = item.querySelector(".port-tag");
  lightImg.style.opacity   = "0";
  lightImg.style.transform = "scale(.94) translateX(" + (dir > 0 ? "30px" : "-30px") + ")";
  setTimeout(() => {
    lightImg.src = img ? img.src : "";
    lightCaption.textContent = (tag ? tag.textContent + " — " : "") + (name ? name.textContent : "");
    lightImg.style.opacity   = "1";
    lightImg.style.transform = "scale(1) translateX(0)";
  }, 220);
}

lightImg.style.transition = "opacity .22s ease, transform .22s ease";

portItems.forEach((item, i) => item.addEventListener("click", () => openLightbox(i)));
lightClose.addEventListener("click", closeLightbox);
lightPrev.addEventListener("click",  e => { e.stopPropagation(); navigate(-1); });
lightNext.addEventListener("click",  e => { e.stopPropagation(); navigate(1);  });
lightbox.addEventListener("click",   e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape")     closeLightbox();
  if (e.key === "ArrowLeft")  navigate(-1);
  if (e.key === "ArrowRight") navigate(1);
});

let touchStartX = 0;
lightbox.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].screenX; });
lightbox.addEventListener("touchend",   e => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
});

// ── MAGNETIC HOVER nos botões
document.querySelectorAll(".btn-final, .btn-ghost, .social-btn").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * .16;
    const y = (e.clientY - rect.top  - rect.height / 2) * .16;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
});

// ── PARALLAX SUAVE no hero
const heroContent = document.querySelector(".hero-content");
const heroVisual  = document.querySelector(".hero-visual");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (heroContent) heroContent.style.transform = `translateY(${y * .055}px)`;
  if (heroVisual)  heroVisual.style.transform  = `translateY(${y * .085}px)`;
}, { passive: true });

// ── CURSOR PERSONALIZADO (desktop only)
if (window.matchMedia("(pointer: fine)").matches) {
  const cursor     = document.createElement("div");
  const cursorDot  = document.createElement("div");
  cursor.id    = "cursor-ring";
  cursorDot.id = "cursor-dot";
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  const style = document.createElement("style");
  style.textContent = `
    * { cursor: none !important; }
    #cursor-ring {
      position: fixed; top: 0; left: 0; z-index: 99999;
      width: 36px; height: 36px; border-radius: 50%;
      border: 1.5px solid rgba(174,177,240,.55);
      pointer-events: none;
      transform: translate(-50%,-50%);
      transition: width .28s ease, height .28s ease, border-color .28s ease, background .28s ease, opacity .3s;
      will-change: transform;
    }
    #cursor-dot {
      position: fixed; top: 0; left: 0; z-index: 99999;
      width: 5px; height: 5px; border-radius: 50%;
      background: var(--lav-deep);
      pointer-events: none;
      transform: translate(-50%,-50%);
      transition: opacity .3s;
      will-change: transform;
    }
    #cursor-ring.hover {
      width: 56px; height: 56px;
      border-color: rgba(174,177,240,.8);
      background: rgba(174,177,240,.06);
    }
    #cursor-ring.click {
      width: 28px; height: 28px;
      background: rgba(174,177,240,.18);
    }
  `;
  document.head.appendChild(style);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  (function animate() {
    rx += (mx - rx) * .14;
    ry += (my - ry) * .14;
    cursor.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(animate);
  })();

  document.querySelectorAll("a, button, .port-item, .service-card, .step").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

  document.addEventListener("mousedown", () => cursor.classList.add("click"));
  document.addEventListener("mouseup",   () => cursor.classList.remove("click"));

  document.addEventListener("mouseleave", () => { cursor.style.opacity = "0"; cursorDot.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { cursor.style.opacity = "1"; cursorDot.style.opacity = "1"; });
}
// ── PORTFOLIO FILTER
(function() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const grid       = document.getElementById("portfolioGrid");
  if (!filterBtns.length || !grid) return;

  function applyFilter(cat) {
    const items = grid.querySelectorAll(".port-item");

    items.forEach(item => {
      const itemCat = item.dataset.category || "outros";
      const show    = cat === "all" || itemCat === cat;

      if (show) {
        item.classList.remove("hidden");
        item.classList.add("filter-show");
        // remove animation class após terminar
        item.addEventListener("animationend", () => {
          item.classList.remove("filter-show");
        }, { once: true });
      } else {
        item.classList.add("hidden");
        item.classList.remove("filter-show");
      }
    });

    // Conta visíveis e mostra empty state
    const visible = grid.querySelectorAll(".port-item:not(.hidden)").length;
    let empty = grid.querySelector(".port-empty");
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement("div");
        empty.className = "port-empty";
        empty.innerHTML = "<p>Projetos desta categoria em breve ✨</p>";
        grid.appendChild(empty);
      }
    } else {
      if (empty) empty.remove();
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    });
  });

  // inicia com "Todos"
  applyFilter("all");
})();
