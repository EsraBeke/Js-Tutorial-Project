let bird;
let pipes = [];
let score = 0;
let gameState;
let birdImage;

function preload() {
  birdImage = loadImage("https://media.licdn.com/dms/image/D4D03AQG6_c3Onkd5jw/profile-displayphoto-shrink_800_800/0/1676231510337?e=2147483647&v=beta&t=48JxORHrkIcm6NLVfz7hI_SrAe-3m_V-CaEPK-0Nhg4"); // Kullanmak istediğiniz fotoğrafın dosya adını doğru şekilde ayarlayın
}

function setup() {
  createCanvas(400, 600);
  bird = new Bird();
  pipes.push(new Pipe());
  gameState = "PLAY";
}

function draw() {
  background(0);

  if (gameState === "PLAY") {
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].display();

      if (pipes[i].hits(bird)) {
        gameOver();
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    bird.update();
    bird.display();

    if (frameCount % 100 === 0) {
      pipes.push(new Pipe());
    }

    if (bird.offscreen() || bird.hitsEdge()) { // Kenarlara çarpma kontrolü eklendi
      gameOver();
    }

    score++;
  } else if (gameState === "GAMEOVER") {
    textSize(32);
    textAlign(CENTER);
    fill(255, 0, 0);
    text("Game Over", width / 2, height / 2);
    text("Press ENTER to restart", width / 2, height / 2 + 40);

    if (keyIsPressed && keyCode === 13) {
      resetGame();
    }
  }

  displayScore();
}

function keyPressed() {
  if (keyCode === 32 && gameState === "PLAY") {
    bird.jump();
  }
}

function gameOver() {
  gameState = "GAMEOVER";
}

function resetGame() {
  score = 0;
  pipes = [];
  bird.reset();
  gameState = "PLAY";
  loop();
}

function displayScore() {
  textSize(24);
  textAlign(RIGHT);
  fill(255);
  text("Score: " + score, width - 20, 30);
}

class Bird {
  constructor() {
    this.x = 50;
    this.y = height / 2;
    this.gravity = 0.7;
    this.lift = -12;
    this.velocity = 0;
    this.radius = 16; // Yarım çapı tanımladık
  }

  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
  }

  display() {
    image(birdImage, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  }

  jump() {
    this.velocity += this.lift;
  }

  offscreen() {
    return (this.y > height || this.y < 0);
  }

  hitsEdge() {
    return (this.y + this.radius > height || this.y - this.radius < 0); // Kenarlara çarpma kontrolü
  }

  reset() {
    this.y = height / 2;
    this.velocity = 0;
  }
}

class Pipe {
  constructor() {
    this.spacing = 175;
    this.top = random(height / 6, (3 / 4) * height);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 80;
    this.speed = 2;
    this.highlight = false;
  }

  update() {
    this.x -= this.speed;
  }

  display() {
    fill(0, 255, 0);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }

  hits(bird) {
    if (
      bird.y - bird.radius < this.top || // Üst boruya çarpma kontrolü
      bird.y + bird.radius > height - this.bottom // Alt boruya çarpma kontrolü
    ) {
      if (bird.x + bird.radius > this.x && bird.x - bird.radius < this.x + this.w) {
        this.highlight = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }

  offscreen() {
    return this.x < -this.w;
  }
}
