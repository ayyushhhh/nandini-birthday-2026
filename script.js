const photoFiles = [
  "photo-01.jpg",
  "photo-02.jpg",
  "photo-03.jpg",
  "photo-04.jpg",
  "photo-05.jpg",
  "photo-06.jpg",
  "photo-07.jpeg",
  "photo-08.jpeg",
  "photo-09.jpg",
  "photo-10.jpg",
  "photo-11.jpg",
  "photo-12.jpg",
  "photo-13.jpg",
  "photo-14.jpg",
  "photo-15.jpg",
  "photo-16.jpg",
  "photo-17.jpg",
  "photo-18.jpg",
  "photo-19.jpg",
  "photo-20.jpg",
  "photo-21.jpg",
  "photo-22.jpg",
  "photo-23.jpg",
  "photo-24.jpg",
  "photo-25.jpg",
  "photo-26.jpg",
  "photo-27.jpg",
  "photo-28.jpg",
  "photo-29.jpg",
  "photo-30.jpg",
  "photo-31.jpg",
  "photo-32.jpg",
  "photo-33.jpg",
  "photo-34.jpg",
  "photo-35.jpg",
  "photo-36.jpg",
  "photo-37.jpg",
  "photo-38.jpg",
  "photo-39.webp",
  "photo-40.webp",
  "photo-41.jpg"
];

const photoPaths = photoFiles.map((file) => `./assets/photos/${file}`);
const heroPhotos = photoPaths.slice(0, 12);
const birthday = new Date("2026-06-20T00:00:00+05:30").getTime();

const $ = (selector) => document.querySelector(selector);
const body = document.body;
const audio = $("#birthdayAudio");
const intro = $("#intro");
const beginBtn = $("#beginBtn");
const musicToggle = $("#musicToggle");
const nicknameBtn = $("#nicknameBtn");
const toast = $("#toast");
const galleryGrid = $("#galleryGrid");
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const closeLightbox = $("#closeLightbox");
const giftBtn = $("#giftBtn");
const letterDialog = $("#letterDialog");
const closeLetter = $("#closeLetter");
const canvas = $("#celebrationCanvas");
const ctx = canvas.getContext("2d");

let bgIndex = 0;
let activeLayer = 0;
let particles = [];
let toastTimer;

function setCanvasSize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function toggleMusic(forcePlay = false) {
  if (forcePlay || audio.paused) {
    audio
      .play()
      .then(() => {
        musicToggle.classList.add("is-playing");
        showToast("Music on. Birthday vibe set, Paisaab.");
      })
      .catch(() => {
        showToast("Tap the music button once to start the song.");
      });
  } else {
    audio.pause();
    musicToggle.classList.remove("is-playing");
    showToast("Music paused.");
  }
}

function updateCountdown() {
  const now = Date.now();
  const distance = birthday - now;

  if (distance <= 0) {
    $("#days").textContent = "00";
    $("#hours").textContent = "00";
    $("#minutes").textContent = "00";
    $("#seconds").textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  $("#days").textContent = String(days).padStart(2, "0");
  $("#hours").textContent = String(hours).padStart(2, "0");
  $("#minutes").textContent = String(minutes).padStart(2, "0");
  $("#seconds").textContent = String(seconds).padStart(2, "0");
}

function setBackgroundPhoto(path) {
  const layers = [$(".photo-layer-a"), $(".photo-layer-b")];
  const nextLayer = layers[activeLayer];
  const otherLayer = layers[1 - activeLayer];

  nextLayer.style.backgroundImage = `url("${path}")`;
  nextLayer.classList.add("is-active");
  otherLayer.classList.remove("is-active");
  activeLayer = 1 - activeLayer;
}

function cycleBackground() {
  setBackgroundPhoto(heroPhotos[bgIndex % heroPhotos.length]);
  bgIndex += 1;
}

function buildGallery() {
  const fragment = document.createDocumentFragment();

  photoPaths.forEach((path, index) => {
    const button = document.createElement("button");
    button.className = "photo-tile";
    button.type = "button";
    button.setAttribute("aria-label", `Open photo ${index + 1}`);

    const img = document.createElement("img");
    img.src = path;
    img.alt = `Nandini memory ${index + 1}`;
    img.loading = index < 8 ? "eager" : "lazy";

    button.appendChild(img);
    button.addEventListener("click", () => openLightbox(path));
    fragment.appendChild(button);
  });

  galleryGrid.appendChild(fragment);
}

function openLightbox(path) {
  lightboxImage.src = path;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightboxView() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

function makeParticle(x, y, burst = false) {
  const colors = ["#f0c777", "#ff8fb3", "#8df0dc", "#ffffff"];
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * (burst ? 10 : 4),
    vy: (Math.random() - 0.75) * (burst ? 10 : 5),
    gravity: 0.06 + Math.random() * 0.04,
    size: 3 + Math.random() * 5,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.25,
    life: 80 + Math.random() * 80,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}

function celebrate(amount = 120) {
  for (let i = 0; i < amount; i += 1) {
    particles.push(
      makeParticle(
        window.innerWidth * (0.15 + Math.random() * 0.7),
        window.innerHeight * (0.18 + Math.random() * 0.25),
        true
      )
    );
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles = particles.filter((particle) => particle.life > 0);
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.gravity;
    particle.rotation += particle.spin;
    particle.life -= 1;

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = Math.max(particle.life / 120, 0);
    ctx.fillStyle = particle.color;
    ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.58);
    ctx.restore();
  });

  requestAnimationFrame(animateParticles);
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function nicknameSurprise() {
  const lines = [
    "Dikki unlocked: caring, funny, and slightly dangerous in roast mode.",
    "Moti unlocked: only love, no offence. Paisaab protocol active.",
    "Butki unlocked: small height, big main-character energy.",
    "Paisaab unlocked: see you soon, Paisaab."
  ];
  const line = lines[Math.floor(Math.random() * lines.length)];
  showToast(line);
  celebrate(38);
}

function bindEvents() {
  beginBtn.addEventListener("click", () => {
    intro.classList.add("is-hidden");
    body.classList.remove("is-locked");
    toggleMusic(true);
    celebrate(140);
  });

  musicToggle.addEventListener("click", () => toggleMusic());
  nicknameBtn.addEventListener("click", nicknameSurprise);
  closeLightbox.addEventListener("click", closeLightboxView);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightboxView();
  });

  giftBtn.addEventListener("click", () => {
    if (typeof letterDialog.showModal === "function") {
      letterDialog.showModal();
    } else {
      letterDialog.setAttribute("open", "");
    }
    celebrate(180);
  });

  closeLetter.addEventListener("click", () => letterDialog.close());

  document.querySelectorAll(".wish-pill").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(button.textContent);
      celebrate(30);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "p") nicknameSurprise();
    if (event.key === "Escape") {
      closeLightboxView();
      if (letterDialog.open) letterDialog.close();
    }
  });

  window.addEventListener("resize", setCanvasSize);
}

function init() {
  body.classList.add("is-locked");
  setCanvasSize();
  buildGallery();
  cycleBackground();
  setInterval(cycleBackground, 6200);
  updateCountdown();
  setInterval(updateCountdown, 1000);
  initReveal();
  bindEvents();
  animateParticles();
}

init();
