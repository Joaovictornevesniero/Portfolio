// Menu lateral, atalhos de teclado, comparador antes/depois,
// galerias de imagens e lightbox.

const SECTION_IDS = ["home", "projetos", "habilidades", "contato"];

const KEY_TO_SECTION = {
  s: "home",
  p: "projetos",
  h: "habilidades",
  c: "contato",
  e: "contato",
};

const KEY_TO_LINK = {
  g: "https://github.com/Joaovictornevesniero",
  l: "https://linkedin.com/in/joaoniero",
};

/* ---------- Menu lateral: destaca a seção que está na tela ---------- */

function initNavHighlight() {
  const links = document.querySelectorAll(".sidebar__link:not(.sidebar__link--sub)");

  function update() {
    let current = SECTION_IDS[0];

    for (const id of SECTION_IDS) {
      const top = document.getElementById(id).getBoundingClientRect().top;
      if (top < window.innerHeight * 0.4) current = id;
    }

    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ---------- Comparador antes/depois ---------- */

function initCompare() {
  document.querySelectorAll(".compare").forEach((compare) => {
    function moveDivider(clientX) {
      const { left, width } = compare.getBoundingClientRect();
      const percent = ((clientX - left) / width) * 100;
      const clamped = Math.min(100, Math.max(0, percent));
      compare.style.setProperty("--split", `${clamped}%`);
    }

    compare.addEventListener("pointermove", (e) => moveDivider(e.clientX));
    compare.addEventListener("pointerdown", (e) => moveDivider(e.clientX));
  });
}

/* ---------- Galerias dos cards ---------- */

function initGalleries() {
  document.querySelectorAll(".gallery").forEach((gallery) => {
    const track = gallery.querySelector(".gallery__track");
    const counter = gallery.querySelector(".gallery__counter");
    const total = track.children.length;

    function updateCounter() {
      const current = Math.round(track.scrollLeft / track.clientWidth) + 1;
      counter.textContent = `${current} / ${total}`;
    }

    gallery.querySelector(".gallery__arrow--prev").addEventListener("click", () => {
      track.scrollBy(-track.clientWidth, 0);
    });

    gallery.querySelector(".gallery__arrow--next").addEventListener("click", () => {
      track.scrollBy(track.clientWidth, 0);
    });

    track.addEventListener("scroll", updateCounter, { passive: true });
    updateCounter();
  });
}

/* ---------- Lightbox ---------- */

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const image = lightbox.querySelector("img");
  const counter = document.getElementById("lightbox-counter");

  let sources = [];
  let index = 0;
  let dragStartX = null;

  function render() {
    image.src = sources[index];
    counter.textContent = `${index + 1} / ${sources.length}`;
    lightbox.classList.toggle("is-single", sources.length < 2);
  }

  function open(track, startIndex) {
    sources = [...track.querySelectorAll("img")].map((img) => img.src);
    index = startIndex;
    render();
    lightbox.classList.add("is-open");
  }

  function close() {
    lightbox.classList.remove("is-open");
  }

  function step(direction) {
    index = (index + direction + sources.length) % sources.length;
    render();
  }

  // abre ao clicar numa imagem da galeria
  document.querySelectorAll(".gallery__track").forEach((track) => {
    track.querySelectorAll("img").forEach((img, i) => {
      img.addEventListener("click", () => open(track, i));
    });
  });

  lightbox.querySelector(".lightbox__button--prev").addEventListener("click", (e) => {
    e.stopPropagation();
    step(-1);
  });

  lightbox.querySelector(".lightbox__button--next").addEventListener("click", (e) => {
    e.stopPropagation();
    step(1);
  });

  lightbox.querySelector(".lightbox__button--close").addEventListener("click", close);

  // clicar no fundo escuro também fecha
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  // arrastar para o lado troca de imagem (celular)
  lightbox.addEventListener("pointerdown", (e) => {
    dragStartX = e.clientX;
  });

  lightbox.addEventListener("pointerup", (e) => {
    if (dragStartX !== null && sources.length > 1) {
      const distance = e.clientX - dragStartX;
      if (Math.abs(distance) > 50) step(distance < 0 ? 1 : -1);
    }
    dragStartX = null;
  });

  return {
    isOpen: () => lightbox.classList.contains("is-open"),
    close,
    step,
  };
}

/* ---------- Atalhos de teclado ---------- */

function initShortcuts(lightbox) {
  window.addEventListener("keydown", (e) => {
    // com o lightbox aberto, o teclado só controla ele
    if (lightbox.isOpen()) {
      if (e.key === "Escape") lightbox.close();
      if (e.key === "ArrowRight") lightbox.step(1);
      if (e.key === "ArrowLeft") lightbox.step(-1);
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key.toLowerCase();

    if (KEY_TO_SECTION[key]) {
      document.getElementById(KEY_TO_SECTION[key]).scrollIntoView({ behavior: "smooth" });
    } else if (KEY_TO_LINK[key]) {
      window.open(KEY_TO_LINK[key], "_blank", "noopener");
    }
  });
}

/* ---------- Inicialização ---------- */

initNavHighlight();
initCompare();
initGalleries();
initShortcuts(initLightbox());
