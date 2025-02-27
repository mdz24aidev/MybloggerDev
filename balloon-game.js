document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const gameContainer = document.getElementById('game-container');
    const startButton = document.getElementById('start-button');
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const highScoreDisplay = document.getElementById('high-score');
    const timerDisplay = document.getElementById('timer');
    const missedDisplay = document.getElementById('missed');
    const loadingBarContainer = document.getElementById('loading-bar-container');
    const loadingBar = document.getElementById('loading-bar');
    const gameOverContainer = document.getElementById('game-over-container');
    const gameOverMessage = document.getElementById('game-over-message');
    const nextLevelButton = document.getElementById('next-level-button');
    const restartButton = document.getElementById('restart-button');
    const pauseButton = document.getElementById('pause-button');
    const exitButton = document.getElementById('exit-button');
    const controlsSection = document.getElementById('controls');

    // Game variables
    let score = 0;
    let level = 1;
    let highScore = localStorage.getItem('balloonHighScore') || 0;
    let timeLeft = 10; // in seconds
    let missed = 0;
    let maxMissed = 5; // Maximum missed balloons before game over
    let gameTimer;
    let generationTimer;
    let balloonGenerationInterval = 1000; // in ms, will be adjusted by level
    let balloonSpeed = 5; // seconds to float up - lower means faster
    let isGameRunning = false;
    let isPaused = false;
    let balloonsPopped = 0;
    let balloonsForNextLevel = 10; // Balloons needed to advance to the next level
    let specialBalloonChance = 0.1; // 10% chance for a special balloon
    let heartBalloonChance = 0.05; // 5% chance for a heart balloon
    
    // Initialize game displays
    highScoreDisplay.textContent = `High Score: ${highScore}`;
    
    // Start button functionality
    startButton.addEventListener('click', function() {
        startGame();
    });

    // Pause button functionality
    pauseButton.addEventListener('click', function() {
        togglePause();
    });
    
    // Exit button functionality
    exitButton.addEventListener('click', function() {
        endGame(false);
    });
    
    // Next Level button functionality
    nextLevelButton.addEventListener('click', function() {
        startNextLevel();
    });
    
    // Restart button functionality
    restartButton.addEventListener('click', function() {
        restartGame();
    });

    // Game starting sequence
    function startGame() {
        // Only start if not already running
        if (!isGameRunning) {
            // Show a countdown or loading animation
            startButton.style.display = 'none';
            loadingBarContainer.style.display = 'block';
            
            let progress = 0;
            const loadingInterval = setInterval(function() {
                progress += 1;
                loadingBar.style.width = progress + '%';
                if (progress >= 100) {
                    clearInterval(loadingInterval);
                    loadingBarContainer.style.display = 'none';
                    
                    // Initialize game state
                    score = 0;
                    missed = 0;
                    timeLeft = 10;
                    balloonsPopped = 0;
                    
                    // Update displays
                    scoreDisplay.textContent = `Score: ${score}`;
                    levelDisplay.textContent = `Level: ${level}`;
                    timerDisplay.textContent = `Time: ${timeLeft}s`;
                    missedDisplay.textContent = `Missed: ${missed}`;
                    
                    // Show controls
                    controlsSection.style.display = 'block';
                    
                    // Start game timers
                    isGameRunning = true;
                    startTimers();
                }
            }, 20); // Update every 20ms for smooth animation
        }
    }

    // Function to start game timers
    function startTimers() {
        // Timer countdown
        gameTimer = setInterval(function() {
            if (isPaused) return; // Do nothing if game is paused
            
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}s`;
            
            if (timeLeft <= 0) {
                checkGameProgress();
            }
        }, 1000);
        
        // Balloon generation
        generationTimer = setInterval(function() {
            if (isPaused) return; // Do nothing if game is paused
            
            generateBalloon();
        }, balloonGenerationInterval);
    }

    // Function to toggle pause state
    function togglePause() {
        isPaused = !isPaused;
        
        if (isPaused) {
            pauseButton.textContent = 'Resume';
            // Pause all balloon animations
            document.querySelectorAll('.balloon').forEach(balloon => {
                balloon.style.animationPlayState = 'paused';
            });
        } else {
            pauseButton.textContent = 'Pause';
            // Resume all balloon animations
            document.querySelectorAll('.balloon').forEach(balloon => {
                balloon.style.animationPlayState = 'running';
            });
        }
    }

    // Function to generate a balloon
    function generateBalloon() {
        if (!isGameRunning || isPaused) return;
        
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Random position
        const randomLeftPosition = Math.random() * 90; // Keep within container
        balloon.style.left = `${randomLeftPosition}%`;
        
        // Random color if not a special balloon
        const isSpecialBalloon = Math.random() < specialBalloonChance;
        const isHeartBalloon = Math.random() < heartBalloonChance;
        
        if (isHeartBalloon) {
            // Create a heart-shaped balloon (bonus life)
            balloon.classList.add('heart-balloon');
            balloon.dataset.type = 'heart';
        } else if (isSpecialBalloon) {
            // Special balloon (double points)
            balloon.style.backgroundColor = 'gold';
            balloon.dataset.type = 'special';
        } else {
            // Regular balloon with random color
            const randomColor = getRandomColor();
            balloon.style.backgroundColor = randomColor;
            balloon.dataset.type = 'regular';
        }
        
        // Set animation duration based on level (accelerates with higher levels)
        const speedAdjustment = Math.max(1, balloonSpeed - (level - 1) * 0.5);
        balloon.style.animation = `float ${speedAdjustment}s linear forwards`;
        
        // Event listener for popping balloon
        balloon.addEventListener('click', function() {
            popBalloon(balloon);
        });
        
        // Add balloon to game area
        gameContainer.appendChild(balloon);
        
        // Remove balloon and count as missed if it goes off-screen
        balloon.addEventListener('animationend', function() {
            // Only count as missed if it wasn't already popped
            if (gameContainer.contains(balloon)) {
                missedBalloon(balloon);
            }
        });
    }

    // Function to handle popping a balloon
    function popBalloon(balloon) {
        // Play pop sound effect
        playPopSound();
        
        // Add points based on balloon type
        let pointsToAdd = 0;
        
        if (balloon.dataset.type === 'special') {
            pointsToAdd = 2; // Double points for special balloons
        } else if (balloon.dataset.type === 'heart') {
            // Heart balloon reduces missed count
            missed = Math.max(0, missed - 1);
            missedDisplay.textContent = `Missed: ${missed}`;
            pointsToAdd = 0; // No points, but gives a bonus of reducing missed count
        } else {
            pointsToAdd = 1; // Regular balloon
        }
        
        // Update score
        score += pointsToAdd;
        scoreDisplay.textContent = `Score: ${score}`;
        
        // Count popped balloon for level progression
        balloonsPopped++;
        
        // Add sparkle effect at balloon position
        createSparkleEffect(balloon);
        
        // Remove balloon
        gameContainer.removeChild(balloon);
    }

    // Function to handle missed balloon
    function missedBalloon(balloon) {
        // Only count as missed if it's not a heart balloon
        if (balloon.dataset.type !== 'heart') {
            missed++;
            missedDisplay.textContent = `Missed: ${missed}`;
            
            // Check if too many balloons have been missed
            if (missed >= maxMissed) {
                endGame(false); // Game over - too many missed
            }
        }
        
        // Remove balloon
        if (gameContainer.contains(balloon)) {
            gameContainer.removeChild(balloon);
        }
    }

    // Function to create sparkle effect when balloon is popped
    function createSparkleEffect(balloon) {
        const balloonRect = balloon.getBoundingClientRect();
        const containerRect = gameContainer.getBoundingClientRect();
        
        // Create multiple sparkles
        for (let i = 0; i < 10; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Position inside the balloon
            const relativeX = balloonRect.left - containerRect.left + Math.random() * balloonRect.width;
            const relativeY = balloonRect.top - containerRect.top + Math.random() * balloonRect.height;
            
            sparkle.style.left = `${relativeX}px`;
            sparkle.style.top = `${relativeY}px`;
            
            // Add to game container
            gameContainer.appendChild(sparkle);
            
            // Remove after animation
            setTimeout(() => {
                if (gameContainer.contains(sparkle)) {
                    gameContainer.removeChild(sparkle);
                }
            }, 1000);
        }
    }
    
    // Function to play pop sound effect
    function playPopSound() {
        // Sound effect would be added here
        // For simplicity, not implementing actual sound in this code
    }

    // Function to get random color
    function getRandomColor() {
        const colors = ['red', 'blue', 'green', 'purple', 'orange'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Function to check game progress (end of timer)
    function checkGameProgress() {
        clearInterval(gameTimer);
        clearInterval(generationTimer);
        
        // Check if enough balloons were popped to move to next level
        if (balloonsPopped >= balloonsForNextLevel) {
            showLevelCompleteScreen();
        } else {
            endGame(false); // Not enough balloons popped
        }
    }

    // Function to show level complete screen
    function showLevelCompleteScreen() {
        gameOverContainer.style.display = 'flex';
        gameOverMessage.textContent = `Level ${level} Complete! Score: ${score}`;
        nextLevelButton.style.display = 'block';
        restartButton.style.display = 'block';
        
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('balloonHighScore', highScore);
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
    }
    
    // Function to start next level
    function startNextLevel() {
        // Hide game over container
        gameOverContainer.style.display = 'none';
        
        // Increase level
        level++;
        levelDisplay.textContent = `Level: ${level}`;
        
        // Make game harder
        balloonGenerationInterval = Math.max(300, balloonGenerationInterval - 100); // Generate balloons faster
        balloonSpeed = Math.max(2, balloonSpeed - 0.5); // Make balloons move faster
        balloonsForNextLevel += 5; // Need more balloons for next level
        specialBalloonChance = Math.min(0.25, specialBalloonChance + 0.05); // Increase special balloon chance
        
        // Reset for next level
        timeLeft = 10;
        balloonsPopped = 0;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        
        // Clear any existing balloons
        clearAllBalloons();
        
        // Start timers again
        startTimers();
    }
    
    // Function to restart the game
    function restartGame() {
        // Hide game over container
        gameOverContainer.style.display = 'none';
        
        // Reset game variables
        score = 0;
        level = 1;
        timeLeft = 10;
        missed = 0;
        balloonsPopped = 0;
        balloonGenerationInterval = 1000;
        balloonSpeed = 5;
        balloonsForNextLevel = 10;
        specialBalloonChance = 0.1;
        heartBalloonChance = 0.05;
        
        // Update displays
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        missedDisplay.textContent = `Missed: ${missed}`;
        
        // Clear any existing balloons
        clearAllBalloons();
        
        // Start timers again
        startTimers();
    }

    // Function to end the game
    function endGame(victory) {
        // Stop game timers
        clearInterval(gameTimer);
        clearInterval(generationTimer);
        isGameRunning = false;
        
        // Clear all balloons
        clearAllBalloons();
        
        // Hide controls
        controlsSection.style.display = 'none';
        
        // Show appropriate message
        gameOverContainer.style.display = 'flex';
        
        if (victory) {
            gameOverMessage.textContent = `Congratulations! You've completed all levels! Final Score: ${score}`;
        } else {
            let reason = '';
            if (missed >= maxMissed) {
                reason = ' (Too many missed balloons)';
            } else {
                reason = ` (Not enough balloons popped - needed ${balloonsForNextLevel})`;
            }
            
            gameOverMessage.textContent = `Game Over${reason} - Score: ${score}`;
        }
        
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('balloonHighScore', highScore);
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
        
        // Show restart button
        nextLevelButton.style.display = 'none';
        restartButton.style.display = 'block';
        
        // Reset game state
        isPaused = false;
    }

    // Function to clear all balloons
    function clearAllBalloons() {
        const allBalloons = document.querySelectorAll('.balloon');
        allBalloons.forEach(balloon => {
            if (gameContainer.contains(balloon)) {
                gameContainer.removeChild(balloon);
            }
        });
    }

    // Handle window resize to adapt game elements
    window.addEventListener('resize', function() {
        // Code to adjust game elements based on window size could be added here
    });
});
