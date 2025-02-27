document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-button');
    const loadingBarContainer = document.getElementById('loading-bar-container');
    const loadingBar = document.getElementById('loading-bar');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const highScoreElement = document.getElementById('high-score');
    const timerElement = document.getElementById('timer');
    const missedElement = document.getElementById('missed');
    const controls = document.getElementById('controls');
    const exitButton = document.getElementById('exit-button');
    const pauseButton = document.getElementById('pause-button');
    const gameContainer = document.getElementById('game-container');
    const gameOverContainer = document.getElementById('game-over-container');
    const gameOverMessage = document.getElementById('game-over-message');
    const nextLevelButton = document.getElementById('next-level-button');
    const restartButton = document.getElementById('restart-button');

    gameOverContainer.style.display = 'none';

    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let gameStarted = false;
    let paused = false;
    let balloonInterval;
    let missedBalloons = 0;
    let timeLeft = 10;
    let timerInterval;
    let difficultyInterval;
    let level = 1;
    let isExiting = false;

    // Sound Effects
    const popSound = new Audio('https://mdz24aidev.github.io/MybloggerDev/pop-sound.mp3');
    const gameOverSound = new Audio('https://mdz24aidev.github.io/MybloggerDev/game-over-sound.mp3');
    const levelUpSound = new Audio('https://raw.githubusercontent.com/Boltim/Games/main/video-game-power-up-38777.mp3');

    function updateHighScore() {
        let storedHigh = localStorage.getItem('highScore') || 0;
        if (score > storedHigh) {
            storedHigh = score;
            localStorage.setItem('highScore', storedHigh);
        }
        const newText = `High Score: ${storedHigh}`;
        if (highScoreElement.textContent !== newText) {
            highScoreElement.textContent = newText;
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (!paused) {
                timeLeft--;
                timerElement.textContent = `Time: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    if (missedBalloons === 0) {
                        if (level < 10) {
                            levelUp();
                        } else {
                            winGame();
                        }
                    } else {
                        gameOver();
                    }
                }
            }
        }, 1000);
    }

    function increaseDifficulty() {
        let currentInterval = 1000;
        difficultyInterval = setInterval(() => {
            if (currentInterval > 300) {
                currentInterval -= 50;
                clearInterval(balloonInterval);
                balloonInterval = setInterval(createBalloon, currentInterval);
            }
        }, 10000);
    }

    function startGame() {
        startButton.style.display = 'none';
        loadingBarContainer.style.display = 'block';
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                loadingBarContainer.style.display = 'none';
                gameStarted = true;
                paused = false;
                isExiting = false;
                score = 0;
                missedBalloons = 0;
                timeLeft = 10;
                level = 1;
                scoreElement.textContent = `Score: ${score}`;
                timerElement.textContent = `Time: ${timeLeft}s`;
                levelElement.textContent = `Level: ${level}`;
                missedElement.textContent = `Missed: 0`;
                gameOverContainer.style.display = 'none';
                controls.style.display = 'block';
                balloonInterval = setInterval(createBalloon, 1000);
                startTimer();
                increaseDifficulty();
                updateHighScore();
            } else {
                width++;
                loadingBar.style.width = width + '%';
            }
        }, 50);
    }

    function pauseGame() {
        paused = !paused;
        pauseButton.textContent = paused ? 'Resume' : 'Pause';
        const balloons = document.querySelectorAll('.balloon');
        if (paused) {
            clearInterval(balloonInterval);
            clearInterval(difficultyInterval);
            balloons.forEach(balloon => {
                balloon.style.animationPlayState = 'paused';
            });
        } else {
            balloonInterval = setInterval(createBalloon, 1000);
            increaseDifficulty();
            balloons.forEach(balloon => {
                balloon.style.animationPlayState = 'running';
            });
        }
    }

    function resetGame() {
        clearInterval(balloonInterval);
        clearInterval(timerInterval);
        clearInterval(difficultyInterval);
        document.querySelectorAll('.balloon').forEach(balloon => balloon.remove());
        score = 0;
        missedBalloons = 0;
        timeLeft = 10;
        level = 1;
        isExiting = false;
        scoreElement.textContent = `Score: ${score}`;
        timerElement.textContent = `Time: ${timeLeft}s`;
        levelElement.textContent = `Level: ${level}`;
        missedElement.textContent = `Missed: 0`;
        gameStarted = false;
        paused = false;
        gameOverContainer.style.display = 'none';
        startButton.style.display = 'block';
        controls.style.display = 'none';
        loadingBarContainer.style.display = 'none';
        loadingBar.style.width = '0%';
    }

    function exitGame() {
        if (isExiting) return;
        isExiting = true;
        clearInterval(balloonInterval);
        clearInterval(timerInterval);
        clearInterval(difficultyInterval);
        document.querySelectorAll('.balloon').forEach(balloon => balloon.remove());
        gameStarted = false;
        paused = false;
        controls.style.display = 'none';
        startButton.style.display = 'block';
        gameOverMessage.innerHTML = `
            <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="clipArea">
                        <rect x="20" y="20" width="360" height="160" />
                    </clipPath>
                </defs>
                <style>
                    .game-over-text {
                        font-family: 'Pixelate', monospace;
                        font-size: 48px;
                        fill: #FF0000;
                        stroke: #FFFFFF;
                        stroke-width: 4px;
                        paint-order: stroke;
                    }
                </style>
                <rect x="20" y="20" width="360" height="160" fill="#000000" rx="10" />
                <g clip-path="url(#clipArea)">
                    <text x="400" y="110" class="game-over-text">GAME OVER
                        <animate attributeName="x" from="400" to="-200" dur="3s" repeatCount="indefinite"/>
                    </text>
                </g>
                <rect x="20" y="20" width="360" height="160" fill="none" stroke="#FFFFFF" stroke-width="4px" rx="10" />
            </svg>
        `;
        nextLevelButton.style.display = 'none';
        restartButton.style.display = 'inline-block';
        gameOverContainer.style.display = 'flex';
        updateHighScore();
        gameOverSound.play();
    }

    function gameOver() {
        clearInterval(balloonInterval);
        clearInterval(timerInterval);
        clearInterval(difficultyInterval);
        document.querySelectorAll('.balloon').forEach(balloon => balloon.remove());
        gameStarted = false;
        paused = false;
        controls.style.display = 'none';
        gameOverMessage.innerHTML = `
            <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="clipArea">
                        <rect x="20" y="20" width="360" height="160" />
                    </clipPath>
                </defs>
                <style>
                    .game-over-text {
                        font-family: 'Pixelate', monospace;
                        font-size: 48px;
                        fill: #FF0000;
                        stroke: #FFFFFF;
                        stroke-width: 4px;
                        paint-order: stroke;
                    }
                </style>
                <rect x="20" y="20" width="360" height="160" fill="#000000" rx="10" />
                <g clip-path="url(#clipArea)">
                    <text x="400" y="110" class="game-over-text">GAME OVER
                        <animate attributeName="x" from="400" to="-200" dur="3s" repeatCount="indefinite"/>
                    </text>
                </g>
                <rect x="20" y="20" width="360" height="160" fill="none" stroke="#FFFFFF" stroke-width="4px" rx="10" />
            </svg>
        `;
        gameOverContainer.style.display = 'flex';
        restartButton.style.display = 'inline-block';
        nextLevelButton.style.display = 'none';
        updateHighScore();
        gameOverSound.play();
    }

    function winGame() {
        clearInterval(balloonInterval);
        clearInterval(timerInterval);
        clearInterval(difficultyInterval);
        document.querySelectorAll('.balloon').forEach(balloon => balloon.remove());
        gameStarted = false;
        paused = false;
        controls.style.display = 'none';
        gameOverMessage.innerHTML = `
            <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                <style>
                    .win-text {
                        font-family: 'Pixelate', monospace;
                        font-size: 48px;
                        fill: #FFD700;
                        stroke: #FFFFFF;
                        stroke-width: 4px;
                        paint-order: stroke;
                    }
                </style>
                <rect x="20" y="20" width="360" height="160" fill="#000000" rx="10" />
                <text x="50%" y="50%" text-anchor="middle" class="win-text">YOU WIN!</text>
                <rect x="20" y="20" width="360" height="160" fill="none" stroke="#FFFFFF" stroke-width="4px" rx="10" />
            </svg>
        `;
        gameOverContainer.style.display = 'flex';
        restartButton.style.display = 'inline-block';
        nextLevelButton.style.display = 'none';
        updateHighScore();
        gameOverSound.play();
    }

    function createBalloon() {
        if (!gameStarted || paused || document.querySelectorAll('.balloon').length >= 10) return;
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        if (Math.random() < 0.1) {
            balloon.classList.add('heart-balloon');
        }
        balloon.style.left = Math.random() * (gameContainer.offsetWidth - 50) + 'px';
        balloon.style.top = gameContainer.offsetHeight + 'px';
        balloon.style.backgroundColor = getRandomColor();
        balloon.addEventListener('click', () => popBalloon(balloon));
        balloon.addEventListener('touchstart', () => popBalloon(balloon));
        balloon.addEventListener('animationend', () => {
            missedBalloons++;
            missedElement.textContent = `Missed: ${missedBalloons}`;
            if (missedBalloons >= 3) {
                gameOver();
            }
            balloon.remove();
        });
        gameContainer.appendChild(balloon);
    }

    function popBalloon(balloon) {
        if (!gameStarted || paused) return;
        if (balloon.classList.contains('heart-balloon')) {
            score += 10;
        } else {
            score += 1;
        }
        scoreElement.textContent = `Score: ${score}`;
        missedBalloons = 0;
        missedElement.textContent = `Missed: 0`;
        popSound.play();
        const numSparks = 5;
        for (let i = 0; i < numSparks; i++) {
            const spark = document.createElement('div');
            spark.classList.add('sparkle');
            const angle = Math.random() * 360;
            const distance = Math.random() * 20 + 10;
            const x = balloon.offsetLeft + balloon.offsetWidth / 2 + Math.cos(angle) * distance;
            const y = balloon.offsetTop + balloon.offsetHeight / 2 + Math.sin(angle) * distance;
            spark.style.left = x + 'px';
            spark.style.top = y + 'px';
            gameContainer.appendChild(spark);
            setTimeout(() => spark.remove(), 1000);
        }
        balloon.remove();
    }

    function getRandomColor() {
        const colors = ['#FF69B4', '#FFD700', '#32CD32', '#FF4500', '#00BFFF', '#FF6347'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function startNextLevel() {
        gameOverContainer.style.display = 'none';
        controls.style.display = 'block';
        timeLeft = 10;
        missedBalloons = 0;
        missedElement.textContent = `Missed: 0`;
        timerElement.textContent = `Time: ${timeLeft}s`;
        balloonInterval = setInterval(createBalloon, Math.max(300, 1000 - (level * 20)));
        startTimer();
        increaseDifficulty();
    }

    function levelUp() {
        level++;
        levelUpSound.play();
        clearInterval(balloonInterval);
        clearInterval(timerInterval);
        clearInterval(difficultyInterval);
        document.querySelectorAll('.balloon').forEach(balloon => balloon.remove());
        timeLeft = 10;
        missedBalloons = 0;
        missedElement.textContent = `Missed: 0`;
        timerElement.textContent = `Time: ${timeLeft}s`;
        levelElement.textContent = `Level: ${level}`;
        gameOverMessage.innerHTML = `
            <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                <style>
                    @keyframes blink{0%,to{opacity:1}50%{opacity:0}}
                </style>
                <rect x="20" y="20" width="360" height="130" rx="10"/>
                <text x="50%" y="50%" text-anchor="middle" style="font-family:&quot;Pixelate&quot;,monospace;font-size:48px;fill:#32cd32;stroke:#fff;stroke-width:4px;paint-order:stroke;animation:blink 1s infinite">LEVEL UP</text>
                <rect x="20" y="20" width="360" height="130" fill="none" stroke="#FFF" stroke-width="4" rx="10"/>
            </svg>
        `;
        gameOverContainer.style.display = 'flex';
        nextLevelButton.style.display = 'inline-block';
        controls.style.display = 'none';
        updateHighScore();
    }

    startButton.addEventListener('click', startGame);
    exitButton.addEventListener('click', exitGame);
    pauseButton.addEventListener('click', pauseGame);
    nextLevelButton.addEventListener('click', startNextLevel);
    restartButton.addEventListener('click', resetGame);
    updateHighScore();
});
