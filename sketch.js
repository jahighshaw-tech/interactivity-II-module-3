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
let buttonWidth = 100;
let buttonHeight = 100;

function preload() {
  buttonImages.push(loadImage('image1.png'));
  buttonImages.push(loadImage('image2.png'));
  buttonImages.push(loadImage('image3.png'));
  buttonImages.push(loadImage('image4.png'));
  buttonImages.push(loadImage('image5.png'));
  buttonImages.push(loadImage('https://picsum.photos/100/100?random=5'));
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  createElement("style", `
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      font-family: Arial, sans-serif;
      background-color: white;
    }

    canvas {
      display: block;
      width: 100px;
      height: 100px;
      background-color: white;
    }

    .poemLine {
      color: black;
      font-size: 18px;
      max-width: 280px;
      line-height: 1.5;
      letter-spacing: 0px;
      font-family: Arial, sans-serif;
      pointer-events: none;
    }
  `);

  buttonX = width / 2 - buttonWidth / 2;
  buttonY = height - 100;
}

function draw() {
  background(255);

  if (buttonImages.length > 0) {
    image(buttonImages[currentImageIndex], buttonX, buttonY, buttonWidth, buttonHeight);
  }

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
  }
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

function mousePressed() {
  if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
      mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    
    if (random() < 0.35) return;
    
    revealLine();
    currentImageIndex = (currentImageIndex + 1) % buttonImages.length;
    
    buttonX = random(50, width - buttonWidth - 50);
    buttonY = random(50, height - buttonHeight - 50);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buttonX = width / 2 - buttonWidth / 2;
  buttonY = height - 100;
}