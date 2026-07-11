const loader = document.querySelector("#loader");
const progress = document.querySelector("#progress");
const cursorGlow = document.querySelector("#cursorGlow");
const letterText = document.querySelector("#letterText");
const musicButton = document.querySelector("#musicButton");
const musicText = document.querySelector("#musicText");
const answerButton = document.querySelector("#answerButton");
const reply = document.querySelector("#reply");

const letter = `Arij,

Na3ref elli hkina fel mawdhou3 hedha 9bal.

Ama fama haja ma 9olt'halech kif ma yelzem.

Kol mara nhawel nkhabi eli n7ess bih...
nal9a rou7i nrja3 nfaker fik.

W ba3d wa9t fhemt haja wa7da...

Enti heya elli kont nestanna fiha.

Mouch khater enti kamla.

Mouch khater fama ensena parfaite.

Ama khater m3ak n7ess rou7i مرتاح.

N7ess rou7i nheb n7ki m3ak.

Nethak m3ak.

W nkoun ana bdon ma netmaskher.

Ma nhebch ndhaghtek.

Ma nhebch nkhalli ay kelma t7essik majboura.

Habbit bark ta3refi eli fama wa7ed fi Tounes...

ychouf fik haja ma tla9ahach kol nhar.

W ken fama nhar t7essi eli tnajm ta3tini forsa...

Wallahi ma ndaya3hech.

W ken ma kench...

Be9i bch na7tarmik kif ma kont dima.

-Amin`;

let typed = false;
let audioContext;
let pianoTimer;
let isPlaying = false;

document.body.classList.add("is-loading");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
  }, 900);
});

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percentage}%`;
}

function updateParallax() {
  const y = window.scrollY * 0.08;
  document.documentElement.style.setProperty("--parallax", `${y}px`);
}

window.addEventListener("scroll", () => {
  updateProgress();
  updateParallax();
}, { passive: true });

document.addEventListener("pointermove", (event) => {
  cursorGlow.style.opacity = "1";
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

document.addEventListener("pointerleave", () => {
  cursorGlow.style.opacity = "0";
});

function createHeart(x, y) {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = "❤️";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${14 + Math.random() * 10}px`;
  document.body.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove());
}

document.addEventListener("click", (event) => {
  if (event.target.closest("button, a")) {
    return;
  }

  createHeart(event.clientX, event.clientY);
});

function typeLetter() {
  if (typed) {
    return;
  }

  typed = true;
  let index = 0;
  const speed = 18;

  const tick = () => {
    letterText.textContent = letter.slice(0, index);
    index += 1;

    if (index <= letter.length) {
      window.setTimeout(tick, letter[index - 1] === "\n" ? 70 : speed);
    }
  };

  tick();
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const letterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      typeLetter();
      letterObserver.disconnect();
    }
  });
}, { threshold: 0.28 });

letterObserver.observe(document.querySelector("#letter"));

document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

function playNote(frequency, start, duration, gainValue) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(gainValue, start + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

function schedulePianoLoop() {
  if (!isPlaying) {
    return;
  }

  const now = audioContext.currentTime;
  const notes = [261.63, 329.63, 392.0, 493.88, 440.0, 392.0, 329.63, 293.66];

  notes.forEach((note, index) => {
    const start = now + index * 0.52;
    playNote(note, start, 1.15, 0.035);
    playNote(note / 2, start, 1.25, 0.018);
  });

  pianoTimer = window.setTimeout(schedulePianoLoop, 4200);
}

musicButton.addEventListener("click", async () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  isPlaying = !isPlaying;
  musicButton.setAttribute("aria-pressed", String(isPlaying));
  musicText.textContent = isPlaying ? "Pause piano" : "Play piano";

  if (isPlaying) {
    schedulePianoLoop();
  } else {
    window.clearTimeout(pianoTimer);
  }

  createHeart(window.innerWidth - 64, 56);
});

answerButton.addEventListener("click", () => {
  reply.textContent = "Eli yhemni akther men ay jawb, howa ennk tkouni مرتاحة w sadi9a m3a rou7ek.";
  const rect = answerButton.getBoundingClientRect();
  createHeart(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

updateProgress();
