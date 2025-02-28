// Variables globales
let score = 0;
let level = 1;
let highScore = localStorage.getItem('balloonHighScore') || 0;
let missed = 0;
let timeLeft = 20;
let gameInterval;
let timerInterval;
let isPaused = false;
let balloonsPopped = 0;
let gameActive = false;
let balloonCounter = 0;
let maxMissed = 5;
let balloonPointTarget = 10;
let loadingTimeout;
let balloons = [];

// Éléments DOM
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const highScoreElement = document.getElementById('high-score');
const timerElement = document.getElementById('timer');
const missedElement = document.getElementById('missed');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const nextLevelButton = document.getElementById('next-level-button');
const pauseButton = document.getElementById('pause-button');
const exitButton = document.getElementById('exit-button');
const gameOverContainer = document.getElementById('game-over-container');
const gameOverMessage = document.getElementById('game-over-message');
const loadingBarContainer = document.getElementById('loading-bar-container');
const loadingBar = document.getElementById('loading-bar');

// Initialiser les éléments
document.addEventListener('DOMContentLoaded', function() {
    // Mettre à jour l'affichage initial
    updateScore();
    updateLevel();
    updateHighScore();
    updateMissed();
    updateTimer();
    
    // Afficher le bouton Start
    startButton.style.display = 'block';
    gameOverContainer.style.display = 'none';
    pauseButton.style.display = 'none';
    exitButton.style.display = 'none';
    
    // Événements des boutons
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    nextLevelButton.addEventListener('click', nextLevel);
    pauseButton.addEventListener('click', togglePause);
    exitButton.addEventListener('click', exitGame);
});

// Démarrer le jeu
function startGame() {
    // Réinitialiser l'état du jeu
    resetGame();
    
    // Afficher la barre de chargement
    loadingBarContainer.style.display = 'block';
    loadingBar.style.width = '0%';
    startButton.style.display = 'none';
    
    let width = 0;
    const loadingInterval = setInterval(function() {
        if (width >= 100) {
            clearInterval(loadingInterval);
            loadingBarContainer.style.display = 'none';
            
            // Commencer le jeu réel
            gameActive = true;
            startGamePlay();
        } else {
            width += 1;
            loadingBar.style.width = width + '%';
        }
    }, 20);
}

// Commencer le gameplay
function startGamePlay() {
    // Afficher les contrôles
    pauseButton.style.display = 'block';
    exitButton.style.display = 'block';
    
    // Commencer le compte à rebours
    startTimer();
    
    // Générer des ballons
    generateBalloons();
}

// Générer des ballons
function generateBalloons() {
    if (isPaused || !gameActive) return;
    
    gameInterval = setInterval(function() {
        if (isPaused || !gameActive) return;
        
        // Créer un nouveau ballon
        createBalloon();
    }, 1000 / level);
}

// Créer un ballon
function createBalloon() {
    if (isPaused || !gameActive) return;
    
    // Création d'un élément ballon
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    
    // Type de ballon (normal, or, cœur)
    const balloonType = Math.random() < 0.15 ? (Math.random() < 0.5 ? 'gold' : 'heart') : 'normal';
    balloon.classList.add(balloonType);
    
    // Position horizontale aléatoire
    const leftPos = Math.floor(Math.random() * (gameContainer.offsetWidth - 50));
    balloon.style.left = leftPos + 'px';
    
    // Position initiale (en bas)
    balloon.style.bottom = '-50px';
    
    // Identifier unique pour le ballon
    const balloonId = 'balloon-' + balloonCounter++;
    balloon.id = balloonId;
    balloons.push(balloonId);
    
    // Événement de clic pour éclater le ballon
    balloon.addEventListener('click', function() {
        popBalloon(balloon, balloonType);
    });
    
    // Ajouter au conteneur de jeu
    gameContainer.appendChild(balloon);
    
    // Animation de montée
    const speed = Math.floor(Math.random() * 3) + 2;
    const balloonInterval = setInterval(function() {
        if (isPaused) return;
        
        const currentBottom = parseInt(balloon.style.bottom);
        if (currentBottom > gameContainer.offsetHeight) {
            clearInterval(balloonInterval);
            
            // Le ballon a quitté l'écran sans être éclaté
            if (gameContainer.contains(balloon)) {
                gameContainer.removeChild(balloon);
                
                // Supprimer l'ID du ballon de la liste
                balloons = balloons.filter(id => id !== balloonId);
                
                // Augmenter le nombre de ballons manqués
                if (balloonType !== 'heart') {
                    missed++;
                    updateMissed();
                    
                    // Vérifier la condition de fin de jeu
                    checkGameOver();
                }
            }
        } else {
            balloon.style.bottom = (currentBottom + speed) + 'px';
        }
    }, 20);
}

// Éclater un ballon
function popBalloon(balloon, type) {
    if (!gameActive) return;
    
    // Animation d'éclatement
    balloon.classList.add('pop');
    
    // Supprimer le ballon après l'animation
    setTimeout(function() {
        if (gameContainer.contains(balloon)) {
            gameContainer.removeChild(balloon);
            
            // Supprimer l'ID du ballon de la liste
            balloons = balloons.filter(id => id !== balloon.id);
        }
    }, 300);
    
    // Mettre à jour le score selon le type de ballon
    if (type === 'gold') {
        // Ballon or: 2 points
        score += 2;
        balloonsPopped += 2;
    } else if (type === 'heart') {
        // Ballon cœur: réduit le nombre de ballons manqués
        if (missed > 0) {
            missed--;
            updateMissed();
        }
    } else {
        // Ballon normal: 1 point
        score++;
        balloonsPopped++;
    }
    
    // Mettre à jour les affichages
    updateScore();
    
    // Vérifier si le niveau est terminé
    if (balloonsPopped >= balloonPointTarget) {
        levelComplete();
    }
}

// Niveau terminé
function levelComplete() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    // Supprimer tous les ballons
    clearAllBalloons();
    
    // Afficher le message de victoire
    gameOverMessage.textContent = 'Level Complete! Score: ' + score;
    gameOverContainer.style.display = 'block';
    nextLevelButton.style.display = 'block';
    restartButton.style.display = 'none';
    pauseButton.style.display = 'none';
    exitButton.style.display = 'none';
}

// Passer au niveau suivant
function nextLevel() {
    // Augmenter le niveau
    level++;
    updateLevel();
    
    // Réinitialiser certaines variables
    timeLeft = 20 + (level * 2); // Plus de temps pour les niveaux supérieurs
    balloonsPopped = 0;
    
    // Mettre à jour les affichages
    updateTimer();
    
    // Cacher le message
    gameOverContainer.style.display = 'none';
    
    // Recommencer le jeu
    gameActive = true;
    startGamePlay();
}

// Démarrer le minuteur
function startTimer() {
    updateTimer();
    timerInterval = setInterval(function() {
        if (isPaused) return;
        
        timeLeft--;
        updateTimer();
        
        // Fin du temps
        if (timeLeft <= 0) {
            timeUp();
        }
    }, 1000);
}

// Fin du temps
function timeUp() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    // Supprimer tous les ballons
    clearAllBalloons();
    
    // Vérifier si le score est un nouveau record
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('balloonHighScore', highScore);
        updateHighScore();
    }
    
    // Afficher le message de fin de jeu
    gameOverMessage.textContent = 'Time\'s up! Score: ' + score;
    gameOverContainer.style.display = 'block';
    nextLevelButton.style.display = 'none';
    restartButton.style.display = 'block';
    pauseButton.style.display = 'none';
    exitButton.style.display = 'none';
}

// Vérifier la condition de fin de jeu
function checkGameOver() {
    if (missed >= maxMissed) {
        gameActive = false;
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        
        // Supprimer tous les ballons
        clearAllBalloons();
        
        // Vérifier si le score est un nouveau record
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('balloonHighScore', highScore);
            updateHighScore();
        }
        
        // Afficher le message de fin de jeu
        gameOverMessage.textContent = 'Game Over! Score: ' + score;
        gameOverContainer.style.display = 'block';
        nextLevelButton.style.display = 'none';
        restartButton.style.display = 'block';
        pauseButton.style.display = 'none';
        exitButton.style.display = 'none';
    }
}

// Supprimer tous les ballons
function clearAllBalloons() {
    // Supprimer tous les ballons du DOM
    for (const balloonId of balloons) {
        const balloon = document.getElementById(balloonId);
        if (balloon && gameContainer.contains(balloon)) {
            gameContainer.removeChild(balloon);
        }
    }
    
    // Vider le tableau des ballons
    balloons = [];
}

// Redémarrer le jeu
function restartGame() {
    // Réinitialiser toutes les variables
    resetGame();
    
    // Cacher les messages
    gameOverContainer.style.display = 'none';
    
    // Commencer le jeu
    gameActive = true;
    startGamePlay();
}

// Réinitialiser l'état du jeu
function resetGame() {
    score = 0;
    balloonsPopped = 0;
    missed = 0;
    timeLeft = 20;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    clearAllBalloons();
    updateScore();
    updateMissed();
    updateTimer();
}

// Mettre en pause / reprendre le jeu
function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    
    if (!isPaused && gameActive) {
        // Si le jeu reprend, assurez-vous que les boutons sont visibles
        pauseButton.style.display = 'block';
        exitButton.style.display = 'block';
    }
}

// Quitter le jeu
function exitGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    clearAllBalloons();
    
    // Vérifier si le score est un nouveau record
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('balloonHighScore', highScore);
        updateHighScore();
    }
    
    // Revenir à l'écran d'accueil
    startButton.style.display = 'block';
    gameOverContainer.style.display = 'none';
    pauseButton.style.display = 'none';
    exitButton.style.display = 'none';
}

// Fonctions de mise à jour de l'affichage
function updateScore() {
    scoreElement.textContent = 'Score: ' + score;
}

function updateLevel() {
    levelElement.textContent = 'Level: ' + level;
}

function updateHighScore() {
    highScoreElement.textContent = 'High Score: ' + highScore;
}

function updateTimer() {
    timerElement.textContent = 'Time: ' + timeLeft + 's';
}

function updateMissed() {
    missedElement.textContent = 'Missed: ' + missed;
}
