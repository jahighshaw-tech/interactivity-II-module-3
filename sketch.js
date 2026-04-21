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

let buttonImages = [];
let currentImageIndex = 0;

let buttonX, buttonY;
let buttonSize = 100;

let finalImage;
let sequenceComplete = false;
let clickableIcon;

let stars = [];
let starMode = false;
let starStartTime = 0;
let STAR_DURATION = 6000;

let starBurst = false;

/* FINAL HEARTBEAT */
let heartbeat = false;

/* ---------------- LOAD SAFE ---------------- */

function safeLoad(path) {
  return loadImage(path,
    () => {},
    () => console.warn("missing:", path)
  );
}

/* ---------------- PRELOAD ---------------- */

function preload() {
  let files = [
    "image1.jpg","image2.png","image3.png","image4.png","image5.png",
    "image6.png","image8.png","image9.png","image10.jpg","image11.jpg",
    "image12.png","image13.png","image14.jpg","image15.jpg","image16.png"
  ];

  for (let f of files) {
    buttonImages.push(safeLoad(f));
  }

  finalImage = safeLoad("final.jpg");
  clickableIcon = safeLoad("endless.png");
}

/* ---------------- SETUP ---------------- */

function setup() {
  createCanvas(windowWidth, windowHeight);

  createElement("style", `
    body {
      margin: 0;
      overflow: hidden;
      font-family: Arial;
      background: rgb(245, 238, 225);
    }

    .poemLine {
      position: absolute;
      font-size: 18px;
      max-width: 280px;
      pointer-events: none;
      color: black;
    }
  `);

  buttonX = width / 2;
  buttonY = height - 120;

  initStars();
}

/* ---------------- STARS ---------------- */

function initStars() {
  stars = [];
  for (let i = 0; i < 350; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      r: random(1, 2.5),
      tw: random(TWO_PI),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5)
    });
  }
}

/* ---------------- DRAW ---------------- */

function draw() {

  /* STAR MODE */
  if (starMode) {
    background(0);

    let elapsed = millis() - starStartTime;

    /* AUTO EXIT AFTER 6 SECONDS */
    if (elapsed > STAR_DURATION) {
      starMode = false;
      starBurst = false;
    }

    /* IMAGE 6 BURST */
    if (starBurst) {
      for (let s of stars) {
        s.x += random(-6, 6);
        s.y += random(-6, 6);
      }
      if (elapsed > 900) starBurst = false;
    }

    noStroke();
    fill(255);

    for (let s of stars) {
      let tw = sin(frameCount * 0.05 + s.tw) * 1.5;
      circle(s.x, s.y, s.r + tw);
    }

  } else {
    background(245, 238, 225);
  }

  /* MAIN IMAGE FLOW */
  if (sequenceComplete) {

    image(finalImage, 0, 0, width, height);

    drawHeartbeatIcon();

  } else {

    let img = buttonImages[currentImageIndex];

    if (img) {
      image(img, buttonX, buttonY, buttonSize, buttonSize);
    }
  }

  /* POEM FLOATING */
  for (let l of activeLines) {
    l.x += l.dx;
    l.y += l.dy;
    if (l.div) l.div.position(l.x, l.y);
  }
}

/* ---------------- HEARTBEAT ---------------- */

function drawHeartbeatIcon() {
  let scale = 1;

  if (heartbeat) {
    let t = frameCount % 60;
    scale = (t < 10 || (t > 20 && t < 30)) ? 1.3 : 1;
  }

  let w = 120 * scale;
  let h = 80 * scale;

  image(clickableIcon, width - 200, 100, w, h);
}

/* ---------------- POEM ---------------- */

function revealLine() {
  if (lineIndex >= poem.length) return;

  let text = poem[lineIndex];

// override floating behavior text
if (text.includes("constellations")) {
  text = "I am endless, but never full";
}

  let div = createDiv(text);
  div.class("poemLine");

  div.position(random(100, width - 300), random(100, height - 200));

  activeLines.push({
    div,
    x: random(width),
    y: random(height),
    dx: random(-0.3, 0.3),
    dy: random(-0.3, 0.3)
  });

  if (text.includes("constellations")) {
    starMode = true;
    starStartTime = millis();
  }

  lineIndex++;
}

/* ---------------- CLICK ---------------- */

function mousePressed() {

  if (
    mouseX > buttonX &&
    mouseX < buttonX + buttonSize &&
    mouseY > buttonY &&
    mouseY < buttonY + buttonSize
  ) {

    revealLine();

    currentImageIndex++;

    /* IMAGE 6 STAR RUPTURE */
    if (currentImageIndex === 5) {
      starMode = true;
      starStartTime = millis();
      starBurst = true;
    }

    /* FINAL SEQUENCE */
    if (currentImageIndex >= buttonImages.length) {
      sequenceComplete = true;
      heartbeat = true;   // 🔥 THIS FIXES YOUR MISSING HEARTBEAT
    }

    buttonX = random(50, width - 150);
    buttonY = random(50, height - 150);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}