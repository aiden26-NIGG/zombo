const player = document.getElementById('player');
const zombiesContainer = document.getElementById('zombies');
const bulletsContainer = document.getElementById('bullets');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const rapidFireButton = document.getElementById('rapid-fire');
const moreDamageButton = document.getElementById('more-damage');

let score = 0;
let lives = 3;
let bulletDamage = 1;
let fireRate = 500; // Time between shots in milliseconds
let gameInterval;
let zombieInterval;
let lastShotTime = 0;

// Player position (bottom center)
const playerX = 400; // Half of game container width
const playerY = 560; // Near the bottom
player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

// Create zombies from random positions at the top
function createZombie() {
  const zombie = document.createElement('div');
  zombie.classList.add('zombie');
  zombie.textContent = '🧟‍♂️'; // Zombie emoji
  zombie.style.left = `${Math.random() * 760}px`; // Random horizontal position
  zombie.style.top = `-40px`; // Start above the screen
  zombiesContainer.appendChild(zombie);

  const moveZombie = setInterval(() => {
    const zombieY = parseFloat(zombie.style.top);
    zombie.style.top = `${zombieY + 2}px`; // Move zombie downward

    // Check for collision with player
    const zombieRect = zombie.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    if (
      zombieRect.left < playerRect.right &&
      zombieRect.right > playerRect.left &&
      zombieRect.top < playerRect.bottom &&
      zombieRect.bottom > playerRect.top
    ) {
      clearInterval(moveZombie);
      zombie.remove();
      loseLife();
    }

    // Remove zombie if it goes off screen
    if (zombieY > 600) {
      clearInterval(moveZombie);
      zombie.remove();
    }
  }, 20);
}

// Shoot bullets
document.addEventListener('click', (e) => {
  const currentTime = Date.now();
  if (currentTime - lastShotTime < fireRate) return; // Respect fire rate
  lastShotTime = currentTime;

  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.textContent = '🔸'; // Bullet emoji
  bullet.style.left = `${playerX}px`;
  bullet.style.top = `${playerY}px`;
  bulletsContainer.appendChild(bullet);

  const angle = Math.atan2(
    e.clientY - playerY,
    e.clientX - playerX
  );
  const speed = 5;

  const moveBullet = setInterval(() => {
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    bullet.style.left = `${parseFloat(bullet.style.left) + dx}px`;
    bullet.style.top = `${parseFloat(bullet.style.top) + dy}px`;

    // Check for collision with zombies
    const bulletRect = bullet.getBoundingClientRect();
    zombiesContainer.childNodes.forEach((zombie) => {
      const zombieRect = zombie.getBoundingClientRect();
      if (
        bulletRect.left < zombieRect.right &&
        bulletRect.right > zombieRect.left &&
        bulletRect.top < zombieRect.bottom &&
        bulletRect.bottom > zombieRect.top
      ) {
        clearInterval(moveBullet);
        bullet.remove();
        zombie.remove();
        score += 10 * bulletDamage; // Increase score based on damage
        scoreElement.textContent = `Score: ${score}`;
      }
    });

    // Remove bullet if it goes off screen
    if (
      bulletRect.left < -10 ||
      bulletRect.right > 810 ||
      bulletRect.top < -10 ||
      bulletRect.bottom > 610
    ) {
      clearInterval(moveBullet);
      bullet.remove();
    }
  }, 20);
});

// Upgrade: Rapid Fire
rapidFireButton.addEventListener('click', () => {
  if (score >= 50) {
    score -= 50;
    fireRate = Math.max(100, fireRate - 100); // Increase fire rate (minimum 100ms)
    scoreElement.textContent = `Score: ${score}`;
    rapidFireButton.textContent = `Rapid Fire (Cost: ${50 + 50})`; // Increase cost for next upgrade
  }
});

// Upgrade: More Damage
moreDamageButton.addEventListener('click', () => {
  if (score >= 100) {
    score -= 100;
    bulletDamage += 1; // Increase bullet damage
    scoreElement.textContent = `Score: ${score}`;
    moreDamageButton.textContent = `More Damage (Cost: ${100 + 100})`; // Increase cost for next upgrade
  }
});

// Update score
function updateScore() {
  scoreElement.textContent = `Score: ${score}`;
}

// Lose a life
function loseLife() {
  lives--;
  livesElement.textContent = `Lives: ${lives}`;
  if (lives === 0) {
    endGame();
  }
}

// End game
function endGame() {
  clearInterval(gameInterval);
  clearInterval(zombieInterval);
  alert(`Game Over! Your final score is ${score}.`);
  resetGame();
}

// Reset game
function resetGame() {
  zombiesContainer.innerHTML = '';
  bulletsContainer.innerHTML = '';
  score = 0;
  lives = 3;
  bulletDamage = 1;
  fireRate = 500;
  scoreElement.textContent = `Score: ${score}`;
  livesElement.textContent = `Lives: ${lives}`;
  rapidFireButton.textContent = `Rapid Fire (Cost: 50)`;
  moreDamageButton.textContent = `More Damage (Cost: 100)`;
  startGame();
}

// Start game
function startGame() {
  gameInterval = setInterval(updateScore, 1000);
  zombieInterval = setInterval(createZombie, 1000); // Zombies spawn every second
}

startGame();