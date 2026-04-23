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

let bgAudio;
let audioStarted = false;

/* 🫀 HEARTBEAT AUDIO */
let heartbeatAudio;
let heartbeatStarted = false;

let lineIndex = 0;
let activeLines = [];

let endlessMode = false;
let savedLines = [];
let savedIndex = 0;

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

/* ICON */
let iconX, iconY;

/* IMAGE BOUNDS */
let imgX = 0;
let imgY = 0;
let imgW, imgH;

/* 🦋 BUTTERFLIES */
let butterflies = [];
let butterfliesActive = false;
let butterflyImgs = [];

/* ---------------- LOAD SAFE ---------------- */

function safeLoad(path) {
  return loadImage(
    path,
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

  for (let f of files) buttonImages.push(safeLoad(f));

  finalImage = safeLoad("final.jpg");
  clickableIcon = safeLoad("endless.png");

  butterflyImgs = [
    safeLoad("butterfly1.png"),
    safeLoad("butterfly2.png"),
    safeLoad("butterfly3.png")
  ];

  bgAudio = loadSound("audio.wav");
  heartbeatAudio = loadSound("heartbeat.wav");
}

/* ---------------- SETUP ---------------- */

function setup() {
  createCanvas(windowWidth, windowHeight);
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  buttonX = width / 2;
  buttonY = height - 120;

  imgW = width;
  imgH = height;

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
      tw: random(TWO_PI)
    });
  }
}

/* ---------------- BUTTERFLIES ---------------- */

function spawnButterflies() {
  butterfliesActive = true;
  butterflies = [];

  for (let i = 0; i < 18; i++) {
    butterflies.push({
      angle: random(TWO_PI),
      radius: random(30, 140),
      speed: random(0.01, 0.03),
      offsetX: random(-500, 70),
      offsetY: random(-300, 30),
      img: random(butterflyImgs),
      size: random(10, 45)
    });
  }
}

/* ---------------- DRAW ---------------- */

function draw() {
  background(starMode ? 0 : color(245, 238, 225));

  if (starMode) {
    let elapsed = millis() - starStartTime;
    if (elapsed > STAR_DURATION) starMode = false;

    noStroke();
    fill(255);

    for (let s of stars) {
      let tw = sin(frameCount * 0.05 + s.tw) * 1.5;
      circle(s.x, s.y, s.r + tw);
    }
  }

  if (sequenceComplete) {
    image(finalImage, imgX, imgY, imgW, imgH);
    drawHeartbeatIcon();
  } else {
    let img = buttonImages[currentImageIndex];
    if (img) image(img, buttonX, buttonY, buttonSize, buttonSize);

    let buttonSizeOptions = [60, 100, 140, 180];
    buttonSize = buttonSizeOptions[currentImageIndex % buttonSizeOptions.length];
  }

  for (let l of activeLines) {
    l.x += l.dx;
    l.y += l.dy;
    if (l.div) l.div.position(l.x, l.y);
  }

  if (butterfliesActive) {
    let cx = width / 2;
    let cy = height / 2;

    for (let b of butterflies) {
      b.angle += b.speed;

      let x = cx + cos(b.angle) * b.radius + b.offsetX;
      let y = cy + sin(b.angle) * b.radius + b.offsetY;

      image(b.img, x, y, b.size, b.size);
    }
  }
}

/* ---------------- HEART ICON ---------------- */

function drawHeartbeatIcon() {
  let scale = sin(frameCount * 0.2) * 0.15 + 1.1;

  let w = 420 * scale;
  let h = 300 * scale;

  let anchorX = 0.58;
  let anchorY = 0.2;

  iconX = imgX + imgW * anchorX;
  iconY = imgY + imgH * anchorY;

  image(clickableIcon, iconX, iconY, w, h);
}

/* ---------------- CLICK ---------------- */

function mousePressed() {

  if (!audioStarted) {
    userStartAudio();
    bgAudio.loop();
    bgAudio.setVolume(0.4);
    audioStarted = true;
  }

  if (sequenceComplete) {

    let t = frameCount % 60;
    let scale = (t < 10 || (t > 20 && t < 30)) ? 1.3 : 1;

    let w = 420 * scale;
    let h = 300 * scale;

    if (
      mouseX > iconX &&
      mouseX < iconX + w &&
      mouseY > iconY &&
      mouseY < iconY + h
    ) {

      if (!endlessMode) {

        savedLines = activeLines;
        savedIndex = lineIndex;

        for (let l of activeLines) if (l.div) l.div.remove();
        activeLines = [];

        let endlessDiv = createDiv("I am endless, but never full");
        endlessDiv.class("poemLine");
        endlessDiv.position(width / 2 - 140, height / 2 - 20);

        activeLines.push({
          div: endlessDiv,
          x: width / 2 - 140,
          y: height / 2 - 20,
          dx: 0,
          dy: 0
        });

        spawnButterflies();
        endlessMode = true;

        if (!heartbeatStarted) {
          heartbeatAudio.loop();
          heartbeatAudio.setVolume(5);
          heartbeatStarted = true;
        }

      } else {

        for (let l of activeLines) if (l.div) l.div.remove();

        activeLines = [];
        butterfliesActive = false;
        butterflies = [];

        lineIndex = savedIndex;

        heartbeatAudio.stop();
        heartbeatStarted = false;

        endlessMode = false;
      }

      return;
    }
  }

  if (
    mouseX > buttonX &&
    mouseX < buttonX + buttonSize &&
    mouseY > buttonY &&
    mouseY < buttonY + buttonSize
  ) {

    if (lineIndex < poem.length) revealLine();
    currentImageIndex++;

    if (currentImageIndex === 5) {
      starMode = true;
      starStartTime = millis();
    }

    if (currentImageIndex >= buttonImages.length) {
      sequenceComplete = true;
    }

    buttonX = random(50, width - 150);
    buttonY = random(50, height - 150);
  }
}

/* ---------------- POEM ---------------- */

function revealLine() {
  let text = poem[lineIndex];
  if (!text) return;

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

  lineIndex++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}