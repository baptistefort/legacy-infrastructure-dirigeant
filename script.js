document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal sections only when JavaScript is available.
const reveals = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );
  reveals.forEach((element) => revealObserver.observe(element));
}

// Interactive value mosaic.
const bentoCards = [...document.querySelectorAll("[data-bento-card]")];
const bento = document.querySelector("[data-bento]");
const defaultBentoCard = bentoCards[0] ?? null;

function activateBento(card) {
  bentoCards.forEach((item) => {
    const active = item === card;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
}

bentoCards.forEach((card) => {
  card.addEventListener("mouseenter", () => activateBento(card));
  card.addEventListener("focus", () => activateBento(card));
  card.addEventListener("click", () => activateBento(card));
  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activateBento(card);
  });
});

bento?.addEventListener("mouseleave", () => {
  if (defaultBentoCard) activateBento(defaultBentoCard);
});

bento?.addEventListener("focusout", (event) => {
  if (bento.contains(event.relatedTarget)) return;
  if (defaultBentoCard) activateBento(defaultBentoCard);
});

// Accessible, measured accordions. Several items may remain open.
function setAccordionState(item, open, instant = false) {
  const button = item.querySelector(":scope > button");
  const panel = item.querySelector(":scope > .accordion-panel");
  if (!button || !panel) return;

  item.classList.toggle("is-open", open);
  button.setAttribute("aria-expanded", String(open));

  if (instant) panel.style.transition = "none";
  panel.style.height = open ? `${panel.scrollHeight}px` : "0px";
  if (instant) {
    panel.offsetHeight;
    panel.style.transition = "";
  }
}

document.querySelectorAll("[data-accordion] .accordion-item").forEach((item) => {
  const button = item.querySelector(":scope > button");
  setAccordionState(item, item.classList.contains("is-open"), true);
  button?.addEventListener("click", () => setAccordionState(item, !item.classList.contains("is-open")));
});

window.addEventListener("resize", () => {
  document.querySelectorAll(".accordion-item.is-open").forEach((item) => {
    const panel = item.querySelector(":scope > .accordion-panel");
    if (panel) panel.style.height = `${panel.scrollHeight}px`;
  });
});

// Contact modal with focus restoration and keyboard handling.
const modal = document.querySelector(".contact-modal");
const modalCard = modal?.querySelector(".modal-card");
const openButtons = document.querySelectorAll(".open-contact");
const closeButtons = modal?.querySelectorAll(".close-contact") ?? [];
let previousFocus = null;

function openModal(trigger) {
  if (!modal || !modalCard) return;
  previousFocus = trigger;
  modal.inert = false;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.setTimeout(() => modalCard.focus(), 20);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modal.inert = true;
  document.body.classList.remove("modal-open");
  previousFocus?.focus?.();
}

openButtons.forEach((button) => button.addEventListener("click", () => openModal(button)));
closeButtons.forEach((button) => button.addEventListener("click", closeModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
  if (event.key !== "Tab" || !modal?.classList.contains("is-open")) return;

  const focusable = [...modal.querySelectorAll("button:not([disabled]), a[href]")].filter((element) => element.offsetParent !== null);
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
});

// Keep placeholder product actions honest.
document.querySelectorAll(".chat-input").forEach((button) => {
  button.addEventListener("click", () => openModal(button));
});
