const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const gameOverDisplay = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const finalHighScoreDisplay = document.getElementById('final-high-score');
const startMessage = document.getElementById('start-message');
const speedIndicator = document.getElementById('speed-indicator');
const levelDisplay = document.getElementById('level');

let snake = [{ x: 180, y: 180 }];
let food = { x: 0, y: 0 };
let direction = '';
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameInterval;
let baseSpeed = 200;
let currentSpeed = baseSpeed;
let gameStarted = false;
let level = 1;

highScoreDisplay.textContent = highScore;

function startGame() {
    if (!gameStarted && direction) {
        gameStarted = true;
        startMessage.style.display = 'none';
        createFood();
        updateGameInterval();
    }
}

function updateGameInterval() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, currentSpeed);
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };

    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        createFood();
    } else {
        drawFood();
    }
}

function drawFood() {
    let foodElement = document.querySelector('.food');
    if (!foodElement) {
        foodElement = document.createElement('div');
        foodElement.className = 'food';
        board.appendChild(foodElement);
    }
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
}

function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y -= 20; break;
        case 'down': head.y += 20; break;
        case 'left': head.x -= 20; break;
        case 'right': head.x += 20; break;
    }

    if (isCollision(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;

        if (score % 50 === 0) {
            increaseSpeed();
        }

        createFood();
    } else {
        snake.pop();
    }

    drawSnake();
}

function increaseSpeed() {
    level++;
    levelDisplay.textContent = level;
    currentSpeed = Math.max(50, baseSpeed - (level - 1) * 20);
    const speedMultiplier = (baseSpeed / currentSpeed).toFixed(1);
    speedIndicator.textContent = `Speed: ${speedMultiplier}x`;
    updateGameInterval();
}

function drawSnake() {
    const segments = document.querySelectorAll('.snake');
    segments.forEach(segment => segment.remove());

    snake.forEach((segment, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.className = `snake ${index === 0 ? 'head' : ''}`;
        snakeElement.style.left = segment.x + 'px';
        snakeElement.style.top = segment.y + 'px';
        board.appendChild(snakeElement);
    });
}

function changeDirection(event) {
    const keyMap = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
    };

    const newDirection = keyMap[event.key];

    if (!newDirection) return;

    const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };

    if (opposites[newDirection] !== direction) {
        direction = newDirection;
        if (!gameStarted) {
            startGame();
        }
    }
}

function isCollision(position) {
    return position.x < 0 || position.x >= 600 ||
        position.y < 0 || position.y >= 400 ||
        snake.some(segment => segment.x === position.x && segment.y === position.y);
}

function gameOver() {
    clearInterval(gameInterval);

    document.querySelectorAll('.snake, .food').forEach(element => element.style.display = 'none');

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
    }

    finalScoreDisplay.textContent = score;
    finalHighScoreDisplay.textContent = highScore;
    gameOverDisplay.style.display = 'block';
}

function restartGame() {
    snake = [{ x: 180, y: 180 }];
    direction = '';
    score = 0;
    level = 1;
    currentSpeed = baseSpeed;
    gameStarted = false;
    scoreDisplay.textContent = '0';
    highScoreDisplay.textContent = highScore;
    levelDisplay.textContent = '1';
    speedIndicator.textContent = 'Speed: 1x';
    gameOverDisplay.style.display = 'none';
    startMessage.style.display = 'block';

    document.querySelectorAll('.snake, .food').forEach(element => element.remove());
}

document.addEventListener('keydown', changeDirection);
