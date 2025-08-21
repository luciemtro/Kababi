//Burger menu navbar
const toggle = document.querySelector(".navbar_toggle");
const menu = document.querySelector(".navbar_menu");
const icon = toggle.querySelector("i");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
  toggle.classList.toggle("open");

  if (icon.classList.contains("fa-bars")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-xmark");
  } else {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  }
});

//CARROUSSEL section latest
(function () {
  const viewport = document.querySelector(".brand-carousel");
  const track = document.querySelector(".brand-track");
  if (!viewport || !track) return;
  if (track.dataset.inited === "1") return; // anti double-init
  track.dataset.inited = "1";

  const originals = Array.from(track.children);

  // Attendre que les images soient mesurables
  function waitImagesLoaded(root) {
    const imgs = Array.from(root.querySelectorAll("img"));
    if (!imgs.length) return Promise.resolve();
    return Promise.all(
      imgs.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((res) =>
              img.addEventListener("load", res, { once: true })
            )
      )
    );
  }

  // Valeur de gap (en px) lue depuis le CSS
  function getGapPx(el) {
    const cs = getComputedStyle(el);
    const g = parseFloat(cs.gap || cs.columnGap || "0");
    return isNaN(g) ? 0 : g;
  }

  let x = 0,
    rafId;
  const baseSpeed = 0.6; // px/frame

  async function build() {
    // Remet une seule série
    track.replaceChildren(...originals.map((n) => n.cloneNode(true)));
    await waitImagesLoaded(track);

    // Duplique jusqu'à couvrir AU MOINS ~2 fois la largeur du viewport ➜ jamais de vide
    const target = viewport.clientWidth * 2 + 1;
    let guard = 0,
      MAX = 20;
    while (track.scrollWidth < target && guard < MAX) {
      originals.forEach((n) => track.appendChild(n.cloneNode(true)));
      guard++;
    }

    // Position de départ
    x = 0;
    track.style.transform = "translate3d(0,0,0)";
  }

  function loop() {
    const speed = window.matchMedia("(max-width:768px)").matches
      ? baseSpeed * 0.6
      : baseSpeed;
    x -= speed;

    // Si le premier élément est entièrement sorti, on le déplace à la fin
    const first = track.firstElementChild;
    if (first) {
      const gap = getGapPx(track);
      const w = first.getBoundingClientRect().width;
      const threshold = w + gap;
      if (-x >= threshold) {
        x += threshold; // on compense le déplacement
        track.appendChild(first); // recycle l'élément en fin de file
      }
    }

    track.style.transform = `translate3d(${x}px,0,0)`;
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }
  function stop() {
    cancelAnimationFrame(rafId);
  }

  (async () => {
    await build();
    start();
  })();

  // pause au survol
  viewport.addEventListener("mouseenter", stop);
  viewport.addEventListener("mouseleave", start);

  // Rebuild au resize pour garder le “sans vide”
  let t;
  window.addEventListener("resize", () => {
    stop();
    clearTimeout(t);
    t = setTimeout(async () => {
      await build();
      start();
    }, 150);
  });

  // Pause quand l’onglet est caché
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
})();
