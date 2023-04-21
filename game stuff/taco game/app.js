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
  
  // Taco derivation class, gets x, y from 'createTaco()'
  class Taco extends GameObject {
    constructor(x, y) {
      super(x, y);
      (this.width = 99), (this.height = 75);
      this.type = 'Taco';
      this.speed = { x: 0, y: 0 };
      this.cooldown = 0;
    }
  
    fire() {
      gameObjects.push(new Bean(this.x + 45, this.y - 10));
      this.cooldown = 300;
  
      let id = setInterval(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 100;
          if (this.cooldown === 0) {
          clearInterval(id);
        }
    }}, 200);
    }
    
    canFire() {
      return this.cooldown === 0;
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
  class Bean extends GameObject {
    constructor(x, y) {
      super(x, y);
      (this.width = 20), (this.height = 30);
      this.type = 'Bean';
      this.img = beanImg;
  
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
  
    // moving taco
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
  
    // bean firing
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
  
    // collision detection
    COLLISION_ENEMY_BEAN: "COLLISION_ENEMY_BEAN",
    COLLISION_ENEMY_TACO: "COLLISION_ENEMY_TACO",
  };
  
  // constants definition
  let tacoImg, 
      enemyImg, 
      beanImg,
      canvas, ctx, 
      gameObjects = [], 
      taco, 
      eventEmitter = new EventEmitter();
  
  // to stop the default function of arrow keys and spacebar
  let onKeyDown = function (e) {
    console.log(e.keyCode);
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
  
  // makes it so the 
  window.addEventListener("keydown", (evt) => {
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
    }
  });
  
  // enemy creation function with parameters for no., width, image, and start/stop locations
  function createEnemies() {
    const CHIP_TOTAL = 9;
    const CHIP_WIDTH = CHIP_TOTAL * 98;
    const START_X = (canvas.width - CHIP_WIDTH) / 2;
    const STOP_X = START_X + CHIP_WIDTH;
    
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
  function createTaco() {
    taco = new Taco(
      canvas.width / 2 - 45,
      canvas.height - canvas.height / 4
    );
    taco.img = tacoImg;
    gameObjects.push(taco);
  }

  // update game objects function to handle collision
  function updateGameObjects() {
    const enemies = gameObjects.filter((go) => go.type === 'Enemy');
    const beans = gameObjects.filter((go) => go.type === 'Bean'); // bean hit something
    beans.forEach((b) => {
      enemies.forEach((t) => {
        // bean colliding with CHIP check
        if (intersectRect(b.rectFromGameObject(), t.rectFromGameObject())) {
          eventEmitter.emit(Messages.COLLISION_ENEMY_BEAN, {
            first: b,
            second: t,
          });
        }
      });
    });
  
    gameObjects = gameObjects.filter((go) => !go.dead);
  }
  
  
  // a function to draw the objects under the parent class 'gameObjects'
  function drawGameObjects(ctx) {
    gameObjects.forEach((go) => go.draw(ctx));
  
  }
  
  //GAME INIT
  
  // game initialize function. initializes gameObjects class, createTaco & createEnemies functions, as well as the event emitter for key up, down, left, and right
  function initGame() {
    gameObjects = [];
    createEnemies();
    createTaco();
  
    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
      taco.y -= 10;
    });
  
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
      taco.y += 10;
    });
  
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
      taco.x -= 10;
    });
  
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
      taco.x += 10;
    });
  
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
    if (taco.canFire()) {
      taco.fire();
    }
    // cooldown message
    console.log('cant fire - cooling down')
  });
  
    eventEmitter.on(Messages.COLLISION_ENEMY_BEAN, (_, { first, second }) => {
      first.dead = true;
      second.dead = true;
    });
  }
  
  // on load constant definition
  window.onload = async () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    tacoImg = await loadTexture("https://cdn-icons-png.flaticon.com/512/4062/4062916.png");
    enemyImg = await loadTexture("https://cdn-icons-png.flaticon.com/512/1703/1703709.png");
    beanImg = await loadTexture("https://p7.hiclipart.com/preview/353/1009/280/frijoles-negros-black-turtle-bean-baked-beans-clip-art-black-beans.jpg");
    // star image too
    //starImg = await loadTexture('assets/star.png');
    
    // initialize game, and then loop drawing the canvas every 1ms to show the updated positions of taco, chip.
    initGame();
    let gameLoopId = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //createStars(ctx, canvas, starImg);
      updateGameObjects();
      drawGameObjects(ctx);
    }, 1);
  
  };
    