// UI management for the space cat game
// Handles user interface elements, HUD, and display updates

class UIManager {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.spacecraft = null;
        this.game = null;
    }

    // Initialize UI elements
    init(game, spacecraft) {
        this.game = game;
        this.spacecraft = spacecraft;
        this.updateHUD();
        this.setupEventListeners();
    }

    // Setup event listeners for UI updates
    setupEventListeners() {
        // Update HUD every frame
        setInterval(() => this.updateHUD(), 100);
    }

    // Update HUD with spacecraft data
    updateHUD() {
        if (!this.spacecraft) return;

        const status = this.spacecraft.getStatus();
        
        // Update basic stats
        this.updateElement('hud-score', this.score);
        this.updateElement('hud-lives', this.lives);
        this.updateElement('hud-level', this.level);
        
        // Update spacecraft status
        this.updateElement('hull-value', `${status.health}/${status.maxHealth}`);
        this.updateElement('energy-value', `${Math.round(status.energy)}%`);
        this.updateElement('purr-count', status.purrCharges);
        
        // Update health bar
        const healthPercent = (status.health / status.maxHealth) * 100;
        this.updateBar('health-fill', healthPercent);
        
        // Update energy bar
        this.updateBar('energy-fill', status.energy);
        
        // Update system status indicators
        this.updateStatusIndicator('weapons-status', status.weaponsOnline ? 'ONLINE' : 'OFFLINE', status.weaponsOnline);
        this.updateStatusIndicator('autopilot-status', status.autopilotActive ? 'ON' : 'OFF', status.autopilotActive);
        this.updateStatusIndicator('navigation-status', 'ACTIVE', true);
        this.updateStatusIndicator('escape-status', status.escapePodAvailable ? 'READY' : 'USED', status.escapePodAvailable);
    }

    // Update individual element
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Update progress bar
    updateBar(id, percentage) {
        const element = document.getElementById(id);
        if (element) {
            element.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
            
            // Change color based on percentage
            if (percentage > 70) {
                element.style.backgroundColor = '#00ff00';
            } else if (percentage > 30) {
                element.style.backgroundColor = '#ffff00';
            } else {
                element.style.backgroundColor = '#ff0000';
            }
        }
    }

    // Update status indicator
    updateStatusIndicator(id, text, isActive) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
            element.className = `status-indicator ${isActive ? 'online' : 'offline'}`;
        }
    }

    // Add points to score
    addScore(points) {
        this.score += points;
        this.showMessage(`+${points} points!`, '#00ff00');
    }

    // Lose a life
    loseLife() {
        this.lives--;
        this.showMessage('Life lost!', '#ff0000');
        return this.lives <= 0;
    }

    // Level up
    levelUp() {
        this.level++;
        this.showMessage(`Level ${this.level}!`, '#4ecdc4');
    }

    // Show message on screen
    showMessage(text, color = '#ffffff') {
        const message = document.createElement('div');
        message.className = 'game-message';
        message.textContent = text;
        message.style.color = color;
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.fontSize = '24px';
        message.style.fontWeight = 'bold';
        message.style.zIndex = '1000';
        message.style.pointerEvents = 'none';
        message.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        
        document.body.appendChild(message);
        
        // Animate message
        message.style.opacity = '0';
        message.style.transform = 'translate(-50%, -50%) scale(0.5)';
        
        setTimeout(() => {
            message.style.transition = 'all 0.5s ease-out';
            message.style.opacity = '1';
            message.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        // Remove message after 2 seconds
        setTimeout(() => {
            message.style.transition = 'all 0.5s ease-in';
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -50%) scale(0.5)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 500);
        }, 2000);
    }

    // Show game over screen
    showGameOver() {
        const gameOver = document.getElementById('gameOverScreen');
        if (gameOver) {
            document.getElementById('finalScore').textContent = this.score;
            gameOver.classList.remove('hidden');
        }
    }

    // Hide game over screen
    hideGameOver() {
        const gameOver = document.getElementById('gameOverScreen');
        if (gameOver) {
            gameOver.classList.add('hidden');
        }
    }

    // Update radar display
    updateRadar(objects) {
        const radarDot = document.getElementById('radar-dot');
        if (radarDot && objects.length > 0) {
            // Simple radar animation
            const angle = Date.now() * 0.001;
            const radius = 20;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            radarDot.style.transform = `translate(${x}px, ${y}px)`;
        }
    }

    // Update minimap
    updateMinimap(canvas, objects) {
        const minimap = document.getElementById('minimap');
        if (minimap) {
            const ctx = minimap.getContext('2d');
            ctx.clearRect(0, 0, minimap.width, minimap.height);
            
            // Draw grid
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 10; i++) {
                const pos = (i / 10) * minimap.width;
                ctx.beginPath();
                ctx.moveTo(pos, 0);
                ctx.lineTo(pos, minimap.height);
                ctx.moveTo(0, pos);
                ctx.lineTo(minimap.width, pos);
                ctx.stroke();
            }
            
            // Draw objects
            objects.forEach(obj => {
                const x = (obj.position.x / canvas.width) * minimap.width;
                const y = (obj.position.y / canvas.height) * minimap.height;
                
                ctx.fillStyle = obj.type === 'asteroid' ? '#ff0000' : 
                               obj.type === 'pickup' ? '#00ff00' : '#ffff00';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
