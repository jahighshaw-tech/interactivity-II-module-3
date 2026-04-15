let poem = [
  "The darkness, a velvet suit",
  "only Cate Blanchett could pull off.",
  "The moon, a Midwest kid",
  "in a borrowed crop top",
  "of gleam. & the constellations",
  "are a filthy god's",
  "manifesto, demanding",
  "an exponential increase of butt",
  "stuff in fields, dilapidated",
  "barns. It's true.",
  "The quiet is",
  "strange, once you consider",
  "how much up there",
  "is burning.",
];

let lineIndex = 0;
let activeLines = [];
let btn;

// 🌙 evolving button text
let buttonTexts = [
  "invade me",
  "touch me",
  "just click",
  "divulge yourself",
  "take from me",
  "take more",
  "assume my purpose",
  "don't stop",
  "take the rest"
];

// ⭐ stars
let stars = [];
let starCount = 400;

// 🌫 particles
let particles = [];
let particleCount = 800;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 🌙 font
  createElement("link")
    .attribute("rel", "stylesheet")
    .attribute("href", "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500&display=swap");

  createElement("style", `
    body {
      margin: 0;
      overflow: hidden;
      font-family: "EB Garamond", serif;
    }

    button {
      font-family: "Helvetica Neue", sans-serif;
      letter-spacing: 1px;
      font-size: 13px;

      background: rgba(255,255,255,0.05);
      color: white;
      border: 1px solid rgba(255,255,255,0.2);
      padding: 10px 18px;
      border-radius: 20px;
      backdrop-filter: blur(6px);
      cursor: pointer;

      box-shadow:
        0 0 10px rgba(255,255,255,0.2),
        0 0 25px rgba(200,150,255,0.15);

      transition: all 0.25s ease;

      /* 🌫 breathing */
      animation: breathe 4s ease-in-out infinite;
    }

    button:hover {
      transform: scale(1.05);
      box-shadow:
        0 0 16px rgba(255,255,255,0.35),
        0 0 30px rgba(180,120,255,0.25);
    }

    .poemLine {
      color: white;
      font-size: 21px;
      max-width: 280px;
      line-height: 1.55;
      letter-spacing: 0.4px;

      animation: fadeIn 1.2s ease forwards, glowShift 6s infinite alternate;
      opacity: 0;
    }

    @keyframes fadeIn {
      0% { opacity: 0; filter: blur(6px); transform: translateY(8px); }
      100% { opacity: 1; filter: blur(0); transform: translateY(0); }
    }

    @keyframes glowShift {
      0% { text-shadow: 0 0 10px rgba(180,120,255,0.4); }
      50% { text-shadow: 0 0 16px rgba(120,200,255,0.4); }
      100% { text-shadow: 0 0 22px rgba(255,120,180,0.4); }
    }

    /* 🌫 breathing animation */
    @keyframes breathe {
      0%, 100% {
        transform: scale(1);
        opacity: 0.9;
      }
      50% {
        transform: scale(1.06);
        opacity: 1;
      }
    }

    /* ⚡ glitch */
    .glitch {
      animation: glitch 0.15s steps(2) 2;
    }

    @keyframes glitch {
      0% { transform: translate(0,0); }
      25% { transform: translate(2px,-2px); }
      50% { transform: translate(-2px,2px); }
      75% { transform: translate(2px,2px); }
      100% { transform: translate(0,0); }
    }
  `);

  // stars
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      alpha: random(120, 255),
      speed: random(0.01, 0.03)
    });
  }

  // particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      dx: random(-0.15, 0.15),
      dy: random(-0.15, 0.15),
      alpha: random(40, 80)
    });
  }

  btn = createPoemButton(width / 2, height - 60);
}

function draw() {
  drawGradientSky();
  drawStars();
  drawParticles();

  for (let l of activeLines) {
    l.x += l.dx;
    l.y += l.dy;

    let d = dist(mouseX, mouseY, l.x, l.y);
    if (d < 120) {
      let angle = atan2(l.y - mouseY, l.x - mouseX);
      l.x += cos(angle) * 1.5;
      l.y += sin(angle) * 1.5;
    }

    l.div.position(l.x, l.y);

    if (random() < 0.002) {
      l.div.addClass("glitch");
      setTimeout(() => l.div.removeClass("glitch"), 150);
    }
  }
}

// 🌌 background
function drawGradientSky() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 1, height, 0, 1);
    let c = lerpColor(color(7,40,35), color(40,50,110), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// ✨ stars
function drawStars() {
  noStroke();
  for (let s of stars) {
    let twinkle = sin(frameCount * s.speed) * 6;
    fill(300, s.alpha + twinkle);
    circle(s.x, s.y, s.size);
  }
}

// 🌫 particles
function drawParticles() {
  noStroke();
  for (let p of particles) {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    fill(150, p.alpha);
    circle(p.x, p.y, p.size);
  }
}

function createPoemButton(x, y) {
  let b = createButton("invade me");
  constrainButton(b, x, y);

  b.mousePressed(() => {
    if (random() < 0.35) return;

    revealLine();

    // 🌙 change text
    b.html(random(buttonTexts));

    // ⚡ glitch
    b.addClass("glitch");
    setTimeout(() => b.removeClass("glitch"), 150);
  });

  return b;
}

function constrainButton(b, x, y) {
  let bw = b.size().width;
  let bh = b.size().height;

  let bx = constrain(x - bw / 2, 20, width - bw - 20);
  let by = constrain(y - bh / 2, 20, height - bh - 20);

  b.position(bx, by);
}

function revealLine() {
  if (lineIndex >= poem.length) {
    showEndMessage();
    return;
  }

  let div = createDiv("");
  div.class("poemLine");

  let x = random(100, width - 300);
  let y = random(100, height - 100);
  div.position(x, y);

  typeLine(div, poem[lineIndex]);

  let dx = random(-0.3, 0.3);
  let dy = random(-0.3, 0.3);

  activeLines.push({ div, x, y, dx, dy });

  lineIndex++;
}

function typeLine(div, text) {
  let i = 0;
  let typer = setInterval(() => {
    div.html(text.substring(0, i));
    i++;
    if (i > text.length) clearInterval(typer);
  }, 35);
}

function showEndMessage() {
  let end = createDiv("…Written by Chen Chen…");
  end.class("poemLine");
  end.position(width / 2 - 100, height / 2);
}