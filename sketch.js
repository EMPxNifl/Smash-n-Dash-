let screen = 0;
// Pumpkins //
let pumpkins = [];
// Pumpkin Holes //
let COUNT = 5;
let WIDTH = 100;
let HEIGHT = 100;
let HOLES = [
  // Dictionary
  { x: 300, y: 290 },
  { x: 600, y: 290 },
  { x: 600, y: 450 },
  { x: 300, y: 450 },
  { x: 450, y: 370 },
];

// Farmer //
let PlayerHP = 3;
let MovementX = 0;
let MovementY = 0;

// Score //
let score = 0;

// Boss //
let BossHP = 1;
//Change number to see Win Text (OG is 150)//
let MaxBossHP = 150;
let Begin = true;
let Seeds = [];

//Ending The Game//
let EndGame = false;
function preload() {
  ////////////////// REPLACE IMAGE ///////////////
  PumpkinImg = loadImage("Spookpumkin.png");
  WalkingImg = loadImage("Hammer.png");
  SmackingImg = loadImage("HammerD.png");
  BossImg = loadImage("boss.gif");
  FullImg = loadImage("Full.gif");
  HalfImg = loadImage("Half.gif");
  LowImg = loadImage("Low.gif");
  DeadImg = loadImage("Dead.gif");
  PumpkinChangeImg = loadImage("PumpkinSeed.png");
  SeedImg = loadImage("seed.png");
  GutsImg = loadImage("Guts.png");
  Sidebar = loadImage("sidbar.png");
  Sidebar2 = loadImage("sidbar2.png");
  BG = loadImage("BG.png");
  BGFloor = loadImage("BGFloor.png");
  Title = loadImage("Title.png");
  StageD = loadSound("SmashD.mp3");
}

function setup() {
  createCanvas(900, 530);
  //Pumpkin Holes//
  for (let i = COUNT - 1; i >= 0; i--) {
    //pumpkins[i] = new Pumpkin(HOLES[i].x, HOLES[i].y, WIDTH, HEIGHT);
    pumpkins[i] = null;
  }
  frameRate(45);
  noCursor();
}
function draw(){
  if (screen == 0){
    menu();
  } else if (screen == 1){
     game();
    stagesong();
  } else if (screen == 2){
    GameOver();
  }

}

function menu(){
  background(Title);
  
  if(keyIsPressed == true){
    if (keyCode == 32){
      screen = 1;
    }
  }
}
//music
function stagesong() {
  if (StageD.isPlaying() == false){
    StageD.play();
  } 
}
// Collision //
function checkCollisions() {
  /// Get Seed Info //
  for (let i = Seeds.length - 1; i >= 0; i--) {
    x = Seeds[i].check()[0];
    y = Seeds[i].check()[1];
    s = Seeds[i].check()[2];
    if (
      ////////// CHANGE NUMBERS SIZE FOR HAMMER///////////
      MovementX + 25 >= x &&
      MovementY + 25 >= y &&
      MovementX - 25 <= x &&
      MovementY - 25 <= y
    ) {
      // Overlaps //
      Seeds.splice(i, 1);
      return true;
    }
  }
  return false;
}

// BossHP //
function updateHealth(BossHP, MaxBossHP) {
  strokeWeight(4);
  rectMode(CORNER);
  fill(255, 143, 143);
  rect(0, 500, 900, 40);
  fill(201, 0, 37);
  //rect (450, 520, 900, 40);
  rect(0, 500, map(BossHP, 0, MaxBossHP, 0, 900), 40);
  if (BossHP == 0) {
    Win();
  }
}

function Win() {
  //Text//
  EndGame = true;
   tint(255, 100, 0, 100);
  textAlign(CENTER, CENTER);
  fill("white");
  textSize(70);
  text("Winner Winner\nPumpkin Dinner", 450, 265);
  //Stops functions//
    pumpkins = [];
    Seeds = [];

textSize(20);
  text("Re-challenge The King?\nPress R", 450, 400);
  if(keyIsPressed == true){
    if (keyCode == 82){
      Reset();
    }
  }
}

function Projectile() {
  //Every Seed Movement//
  for (let Seed of Seeds) {
    Seed.up();
    Seed.move();
  }
  if (!EndGame && random(1) < 0.1) {
    Seeds.push(new Seed(450, 200, random(-1, 1), random(2, 5), random(30, 60)));
  }
  for (let i = Seeds.length - 1; i >= 0; i--)
    if (Seeds[i].out()) {
      Seeds.splice(i, 1);
    }
}

function game() {
  background(101, 158, 151);

  // Boss Health Start //
  if (Begin) {
    BossHP = min(MaxBossHP, ++BossHP);
    if (BossHP == MaxBossHP) {
      Begin = false;
    }
  }

  updateHealth(BossHP, MaxBossHP);

  Arena();

  if (!Begin) {
    ///////////// REPLACE IMAGE //////////////////
    image(BossImg, 450, 220, 400, 430);
    Spawn();
    Projectile();
  }

  GetHit();

  Score();
}

function Score() {
  // Score Text//
  updateHealth(BossHP, MaxBossHP);
  textAlign(LEFT, CENTER);
  fill("white");
  textSize(40);
  text("Score: " + score, 10, 450);

  Farmer();
}

// Farmer Logic
function Farmer() {
  MovementX = mouseX;
  MovementY = mouseY;
  // Player Boarder //
  let hiX = 675;
  let lwX = 225;
  let hiY = 530;
  let lwY = 1;
  let cx = constrain(mouseX, lwX, hiX);
  let cy = constrain(mouseY, lwY, hiY);

  //Mouse Interaction//
  if (mouseIsPressed) {
    imageMode(CENTER);
    ///////////// REPLACE IMAGE //////////////////
    image(SmackingImg, cx, cy, 80, 80);
  } else {
    imageMode(CENTER);
    /////////////// REPLACE IMAGE //////////////////
    image(WalkingImg, cx, cy, 80, 80);
  }
}

function GetHit() {
  //When Seed and Player overlaps, lose Health//
  if (checkCollisions()) {
    PlayerHP--;
  }
  if (PlayerHP == 3) {
    imageMode(CENTER);
    ///////////// REPLACE IMAGE //////////////////
    image(FullImg, 800, 265, 200, 530);
  }
  if (PlayerHP == 2) {
    imageMode(CENTER);
    ///////////// REPLACE IMAGE //////////////////
    image(HalfImg, 800, 265, 200, 530);
  }
  if (PlayerHP == 1) {
    imageMode(CENTER);
    ///////////// REPLACE IMAGE //////////////////
    image(LowImg, 800, 265, 200, 530);
  }
  if (PlayerHP <= 0) {
    imageMode(CENTER);
    ///////////// REPLACE IMAGE //////////////////
    image(DeadImg, 800, 265, 200, 530);
    GameOver();
  }
}

function GameOver() {
  //GameOver text//
  EndGame = true;
  // rectMode(CENTER);
  tint(255, 0, 0, 100);
  // rect(500, 500, 1000, 1000);
  textAlign(CENTER, CENTER);
  fill("white");
  textSize(70);
  text("Git Gud Scrub", 450, 265);
  ///Replay Button///
textSize(20);
  text("Re-challenge The King?\nPress R", 450, 350);
  if(keyIsPressed == true){
    if (keyCode == 82){
      Reset();
    }
  }
  //Stops functions//
   pumpkins = [];
    Seeds = [];
}

function Reset() {
screen = 1;
pumpkins = [];
PlayerHP = 3;
score = 0;
BossHP = 1;
MaxBossHP = 150;
Begin = true;
Seeds = [];
EndGame = false;
noTint();
}


// Field Creation is REPLACE with images//
function Arena() {
  // Ground (Not Needed)//
  strokeWeight(4);
  fill(110, 73, 36);
  imageMode(CENTER);
  image(BG, 450, 265, 500, 530);
  image(BGFloor, 450, 265, 500, 530);
  // Side Bar //
  strokeWeight(4);
  fill(255);
  imageMode(CENTER);
  image(Sidebar2, 800, 265, 200, 530);
  image(Sidebar, 100, 265, 200, 530);

  // Holes //
  strokeWeight(0);
  fill(0);
  ellipse(300, 300, 80, 30);
  ellipse(300, 460, 80, 30);
  ellipse(600, 300, 80, 30);
  ellipse(600, 460, 80, 30);
  ellipse(450, 380, 80, 30);
}

function Spawn() {
  // Spawn //
  for (let i = COUNT - 1; i >= 0; i--) {
    if (pumpkins[i]) {
      pumpkins[i].up();
    }
  }
  // Stay //
  for (let i = COUNT - 1; i >= 0; i--) {
    if (pumpkins[i] == null && random(1) < 0.01) {
      pumpkins[i] = new Pumpkin(HOLES[i].x, HOLES[i].y, WIDTH, HEIGHT);
    }
  }
  // Despawn //
  for (let i = COUNT - 1; i >= 0; i--) {
    if (pumpkins[i] && random(1) < 0.005) {
      pumpkins[i] = null;
    }
  }
}

// Smack //
function mousePressed() {
  for (let i = pumpkins.length - 1; i >= 0; i--) {
    if (pumpkins[i])
    if (!pumpkins[i].isSmashed()) {
      if (pumpkins[i].contains(mouseX, mouseY)) {
        pumpkins[i].smash();
        setTimeout(() => {
          pumpkins[i] = null;
        }, 800);

        // Score //
        ++score;
        // Boss Health //
        --BossHP;
      }
    }
  }
}

class Pumpkin {
  constructor(tempX, tempY, tempW, tempH) {
    this.x = tempX;
    this.y = tempY;
    this.w = tempW;
    this.h = tempH;
    this.s = false;
  }

  up() {
    if (this.s == false) {
      imageMode(CENTER);
      //////////// REPLACE IMAGE //////////////////
      image(PumpkinImg, this.x, this.y, this.w, this.h);
    } else {
      imageMode(CENTER);
      //////////// REPLACE IMAGE //////////////////
      image(GutsImg, this.x, this.y, this.w, this.h);
    }
  }
  smash() {
    this.s = true;
  }

isSmashed() {
  return this.s;
}
  
  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < 30) {
      return true;
    } else {
      return false;
    }
  }
}

class Seed {
  constructor(X, Y, Rotation, Acceleration, Size) {
    this.x = X;
    this.y = Y;
    this.r = Rotation;
    this.a = Acceleration;
    this.s = Size;
  }

  move() {
    if (this.r == -1) this.x = this.x - this.a;
    if (this.r > -1 && this.r < 0) {
      this.x = this.x - this.a * -this.r;
      this.y = this.y + this.a * (1 + this.r);
    }
    if (this.r == 0) this.y = this.y + this.a;
    if (this.r > 0 && this.r < 1) {
      this.x = this.x + this.a * this.r;
      this.y = this.y + this.a * (1 - this.r);
    }
    if (this.r == 1) this.x = this.x + this.a;
    // console.log(random(-3,3));
  }

  up() {
    imageMode(CENTER);
    //////////// REPLACE IMAGE //////////////////
    image(SeedImg, this.x, this.y, this.s, this.s);
  }

  out() {
    if (this.x > 700 || this.x < 200 || this.y > 530) {
      return true;
    }
    return false;
  }

  check() {
    return [this.x, this.y, this.s];
  }
}
