let gameLoopId;
//CLASSES

// event emitter class for the key presses, to publish and subscribe messages
class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }

  emit(message, payload = null) {
    if (this.listeners[message]) {
      this.listeners[message].forEach((l) => l(message, payload));
    }
  }
  clear() {
    this.listeners = {};
  }
}

// parent object for hero and enemy classes
class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false;
    this.type = "";
    this.width = 0;
    this.height = 0;
    this.img = undefined;
  }
  
  // draw the image to canvas with these properties
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  // rectangle representation for collision detection
  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height,
      right: this.x + this.width,
    };
  }
}

// hero derivation class, gets x, y from 'createHero()'
class Hero extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 99), (this.height = 75);
    this.type = 'Hero';
    this.speed = { x: 0, y: 0 };
    this.cooldown = 0;
    this.life = 3;
    this.points = 0;
  }

  fire() {
    gameObjects.push(new Laser(this.x + 45, this.y - 10));
    this.cooldown = 500;

    let id = setInterval(() => {
      if (this.cooldown > 0) {
        this.cooldown -= 100;
        if (this.cooldown === 0) {
        clearInterval(id);
      }
  }}, 200);
  }
  
  // laser cooldown
  canFire() {
    return this.cooldown === 0;
  }

  // life deduction
  decrementLife() {
    this.life--;
  
    if (this.life === 0) {
      this.dead = true;
    }
  }

  // add points
  incrementPoints() {
    this.points += 100;
  }
}

// enemy derivation class, gets x, y from 'createEnemy()'
class Enemy extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 98), (this.height = 50);
    this.type = "Enemy";
    // loop to progressively move the object down
    let id = setInterval(() => { 
      if (this.y < canvas.height - this.height) {
        this.y += 5;
      } else {
        console.log('Stopped at', this.y);
        clearInterval(id);
      }
    }, 300);
  }
}

// laser derivation class
class Laser extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 9), (this.height = 33);
    this.type = 'Laser';
    this.img = laserImg;

    let id = setInterval(() => {
      if (this.y > 0) {
        this.y -= 15;
      } else {
        this.dead = true;
        clearInterval(id);
      }
    }, 100);
  }
}

//base FUNCTIONS

// function to load textures when window opens
function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = path
    img.onload = () => {
      resolve(img)
    };
  });
}

// COLLISION between the game object rectangles
function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

// KEYDOWNS/EMMITTER

// messages for the emitter
const Messages = {

  // moving hero
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",

  // laser firing
  KEY_EVENT_SPACE: "KEY_EVENT_SPACE",

  // collision detection
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",

  // win, loss, restart messages
  GAME_END_LOSS: "GAME_END_LOSS",
  GAME_END_WIN: "GAME_END_WIN",
  KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
};

// constants definition
let heroImg, 
    enemyImg, 
    laserImg,
    lifeImg,
    canvas, ctx, 
    gameObjects = [], 
    hero, 
    eventEmitter = new EventEmitter();

// to stop the default function of arrow keys and spacebar
let onKeyDown = function (e) {
  switch (e.keyCode) {
    case 37:
    case 39:
    case 38:
    case 40:  // Arrow keys
    case 32:  // space key
      e.preventDefault();
      break;  // Space
    default:
      break;  // do not block other keys  
  
  }
};

// event listener for function above
window.addEventListener("keydown", onKeyDown);

window.addEventListener("keyup", (evt) => {
  if (evt.key === "ArrowUp") {
    eventEmitter.emit(Messages.KEY_EVENT_UP);
  } else if (evt.key === "ArrowDown") {
    eventEmitter.emit(Messages.KEY_EVENT_DOWN);
  } else if (evt.key === "ArrowLeft") {
    eventEmitter.emit(Messages.KEY_EVENT_LEFT);
  } else if (evt.key === "ArrowRight") {
    eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
  } else if (evt.keyCode === 32) {
    eventEmitter.emit(Messages.KEY_EVENT_SPACE);
  } else if (evt.key === "Enter") {
    eventEmitter.emit(Messages.KEY_EVENT_ENTER);
  }
  console.log(evt.key);
});

// enemy creation function with parameters for no., width, image, and start/stop locations
function createEnemies() {
  const MONSTER_TOTAL = 5;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;
  
  // this is to move the enemy
  for (let x = START_X; x < STOP_X; x += 98) {
    for (let y = 0; y < 50 * 5; y += 50) {
      const enemy = new Enemy(x, y);
      enemy.img = enemyImg;
      gameObjects.push(enemy);
    }
  }
}

// hero creation function, pushes x,y to hero class, and defines image.
function createHero() {
  hero = new Hero(
    canvas.width / 2 - 45,
    canvas.height - canvas.height / 4
  );
  hero.img = heroImg;
  gameObjects.push(hero);
}

// star pattern i created. at first used for loop to randomize position until there were 50 stars, but the game loop would countinually loop that as well, therefore creating a strobe effect, which was uncomfortable. I grabbed some of the random coordinates and made just 10 stars with no loop involved.
function createStars(ctx, canvas, starImg) {
  const STAR_SIZE = 30;

  ctx.drawImage(starImg, 882.0011424564473, 104.26213302746788, STAR_SIZE, STAR_SIZE);
  ctx.drawImage(starImg, 193.7354389421189, 387.0910048388076, STAR_SIZE, STAR_SIZE);
  ctx.drawImage(starImg, 548.1848770206964, 478.8116672872074, STAR_SIZE, STAR_SIZE);
  ctx.drawImage(starImg, 600.4861364689413, 700.9461316548753, STAR_SIZE, STAR_SIZE);
  ctx.drawImage(starImg, 601.3694831533664, 327.3215485431542, STAR_SIZE, STAR_SIZE);
  ctx.drawImage(starImg, 128.4775641315413, 674.6865413187646, STAR_SIZE, STAR_SIZE);
  ctx.drawImage(starImg, 12.4775641315413, 80.6865413187646, STAR_SIZE, STAR_SIZE);
  ctx.drawImage(starImg, 428.4775641315413, 60.6865413187646, STAR_SIZE, STAR_SIZE);
  ctx.drawImage(starImg, 900.4775641315413, 560.6865413187646, STAR_SIZE, STAR_SIZE);
  ctx.drawImage(starImg, 900.4775641315413, 312.6865413187646, STAR_SIZE, STAR_SIZE);
  
}

// update game objects function to handle collision
function updateGameObjects() {
  const enemies = gameObjects.filter((go) => go.type === 'Enemy');
  const lasers = gameObjects.filter((go) => go.type === 'Laser'); // laser hit something
  lasers.forEach((l) => {
    enemies.forEach((m) => {
      // laser colliding with monster check
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
          first: l,
          second: m,
        });
      }
    });
  });
  enemies.forEach((enemy) => {
    const heroRect = hero.rectFromGameObject();
    if (intersectRect(heroRect, enemy.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
    }
  });

  gameObjects = gameObjects.filter((go) => !go.dead);
}

// death checks

function isHeroDead() {
  return hero.life <= 0;
}

function isEnemiesDead() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
  return enemies.length === 0;
}

// win/reset stuff

function displayMessage(message, color = "red") {
  ctx.font = "30px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function endGame(win) {
  clearInterval(gameLoopId);

  // set a delay so we are sure any paints have finished
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (win) {
      displayMessage(
        "Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew",
        "green"
      );
    } else {
      displayMessage(
        "You died !!! Press [Enter] to start a new game Captain Pew Pew"
      );
    }
  }, 200);
}

function resetGame() {
  if (gameLoopId) {
    clearInterval(gameLoopId);
    eventEmitter.clear();
    initGame();

    gameLoopId = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      createStars(ctx, canvas, starImg);
      drawPoints();
      drawLife();
      updateGameObjects();
      drawGameObjects(ctx);
    }, 100);
  }
}

//DRAWING FUNCTIONS

// a function to draw the objects under the parent class 'gameObjects'
function drawGameObjects(ctx) {
  gameObjects.forEach((go) => go.draw(ctx));

}

function drawLife() {
  // TODO, 35, 27
  const START_POS = canvas.width - 180;

  for (let i = 0; i < hero.life; i++) {
    ctx.drawImage(
      lifeImg, 
      START_POS + (45 * (i + 1)), 
      canvas.height - 37);
  }
}

function drawPoints() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  drawText("Points: " + hero.points, 10, canvas.height - 20);
}

function drawText(message, x, y) {
  ctx.fillText(message, x, y);
}

//GAME INIT

// game initialize function. initializes gameObjects class, createHero & createEnemies functions, as well as the event emitter for key up, down, left, and right
function initGame() {
  gameObjects = [];
  createEnemies();
  createHero();

  eventEmitter.on(Messages.KEY_EVENT_UP, () => {
    hero.y -= 5;
  });

  eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
    hero.y += 5;
  });

  eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
    hero.x -= 20;
  });

  eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
    hero.x += 20;
  });

  eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
  if (hero.canFire()) {
    hero.fire();
  }
  // cooldown message
  console.log('cant fire - cooling down')
  });

  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true;
    second.dead = true;
    hero.incrementPoints();
  
    if (isEnemiesDead()) {
      eventEmitter.emit(Messages.GAME_END_WIN);
    }
  });
  
  eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
    enemy.dead = true;
    hero.decrementLife();
  
    if (isHeroDead())  {
      eventEmitter.emit(Messages.GAME_END_LOSS);
      return;  // loss before victory
    }
  
    if (isEnemiesDead()) {
      eventEmitter.emit(Messages.GAME_END_WIN);
    }
  });
  
  eventEmitter.on(Messages.GAME_END_WIN, () => {
    endGame(true);
  });
    
  eventEmitter.on(Messages.GAME_END_LOSS, () => {
    endGame(false);
  });

  eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
    resetGame();
  });

}

// on load constant definition
window.onload = async () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  heroImg = await loadTexture("assets/player.png");
  enemyImg = await loadTexture("assets/enemyShip.png");
  laserImg = await loadTexture("assets/laserRed.png");
  // star image too
  starImg = await loadTexture('assets/star.png');
  lifeImg = await loadTexture("assets/life.png");

  // initialize game, and then loop drawing the canvas every 100ms to show the updated positions of hero, enemy. also create the stars
  initGame();
  gameLoopId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    createStars(ctx, canvas, starImg);
    updateGameObjects();
    drawPoints();
    drawLife();
    drawGameObjects(ctx);
  }, 100);

};