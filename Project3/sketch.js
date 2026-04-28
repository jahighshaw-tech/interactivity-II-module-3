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

let titleWords = ["a", "queer", "translates", "the", "night", "sky", "by", "ChenChen"];

let bgAudio;
let audioStarted = false;

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

let iconX, iconY;

let imgX = 0;
let imgY = 0;
let imgW, imgH;

function preload() {
  soundFormats('mp3');
  bgAudio = loadSound("audio.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  document.body.style.overflow = "hidden";

  buttonX = width / 2;
  buttonY = height - 120;

  imgW = width;
  imgH = height;

  initStars();
  loadAssets(); // load everything in background
}

function loadAssets() {
  let files = [
    "image1.jpg","image2.png","image3.png","image4.png","image5.png",
    "image6.png","image8.png","image9.png","image10.jpg","image11.jpg",
    "image12.png","image13.png","image14.jpg","image15.jpg","image16.png"
  ];

  for (let f of files) {
    loadImage(f, img => {
      buttonImages.push(img);
    }, () => console.warn("missing:", f));
  }

  loadImage("final.jpg", img => finalImage = img);
  loadImage("endless.png", img => clickableIcon = img);
}

function initStars() {
  stars = [];
  for (let i = 0; i < 550; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      r: random(.5, 2.5),
      tw: random(TWO_PI)
    });
  }
}

function draw() {
  if (starMode) {
    background(0);

    let elapsed = millis() - starStartTime;
    if (elapsed > STAR_DURATION) {
      starMode = false;
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

  if (sequenceComplete) {
    if (finalImage) {
      image(finalImage, imgX, imgY, imgW, imgH);
    }
    drawHeartbeatIcon();
  } else {
    let buttonSizeOptions = [60, 100, 140, 180];
    buttonSize = buttonSizeOptions[currentImageIndex % buttonSizeOptions.length];

    let img = buttonImages[currentImageIndex];
    if (img) {
      image(img, buttonX, buttonY, buttonSize, buttonSize);
    }
  }

  for (let l of activeLines) {
    l.x += l.dx;
    l.y += l.dy;
    if (l.div) l.div.position(l.x, l.y);
  }

  if (!sequenceComplete) {
    drawTitle();
  }
}

function drawTitle() {
  let idx = floor(frameCount / 40) % titleWords.length;
  let t = titleWords[idx];

  let flicker = map(sin(frameCount * 0.2), -1, 1, 80, 200);

  textAlign(CENTER, CENTER);
  textSize(42);
  fill(0, flicker);
  text(t, width / 2, height / 3);
}

function drawHeartbeatIcon() {
  if (!clickableIcon) return;

  iconX = width / 2 - 40;
  iconY = height / 2 - 40;

  image(clickableIcon, iconX, iconY, 80, 80);
}

function mousePressed() {

  if (!audioStarted) {
    userStartAudio();

    if (bgAudio && !bgAudio.isPlaying()) {
      bgAudio.loop();
      bgAudio.setVolume(0.4);
    }

    audioStarted = true;
  }

  if (sequenceComplete) return;

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
  window.location.href = "final.html";
}

    buttonX = random(50, width - 150);
    buttonY = random(50, height - 150);
  }
}

function revealLine() {
  let text = poem[lineIndex];
  if (!text) return;

  let x = random(100, width - 300);
  let y = random(100, height - 200);

  let div = createDiv(text);
  div.class("poemLine");
  div.position(x, y);

  activeLines.push({
    div,
    x,
    y,
    dx: random(-0.3, 0.3),
    dy: random(-0.3, 0.3)
  });

  lineIndex++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}