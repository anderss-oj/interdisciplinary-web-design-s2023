function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = path
    img.onload = () => {
      resolve(img)
    }
  })
}

function createEnemies(ctx, canvas, monsterImg) {
  // TODO draw enemies
  const MONSTER_TOTAL = 5;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;
  for (let x = START_X; x < STOP_X; x += 98) {
    for (let y = 0; y < 50 * 5; y += 50) {
      ctx.drawImage(monsterImg, x, y);
    }
  }
}

function createStars(ctx, canvas, starImg) {
  const STAR_COUNT = 50;
  const STAR_SIZE = 5;

  for (let i = 0; i < STAR_COUNT; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.drawImage(starImg, x, y, STAR_SIZE, STAR_SIZE);
  }
}

window.onload = async () => {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  // TODO load textures
  const heroImg = await loadTexture('assets/player.png');
  const monsterImg = await loadTexture('assets/enemyShip.png');
  const starImg = await loadTexture('assets/star.png');

  // TODO draw black background
  ctx.fillStyle = ('black');
  ctx.fillRect(0, 0, 1024, 768); 

  // TODO draw hero
  ctx.drawImage(heroImg, canvas.width / 2 - 45, canvas.height - canvas.height / 4);
  
  // TODO uncomment the next line when you add enemies to screen
  createEnemies(ctx, canvas, monsterImg);

  createStars(ctx, canvas, starImg);
}
