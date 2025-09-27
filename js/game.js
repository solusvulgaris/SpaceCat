// Space Cat Game - Main Game Logic
class SpaceCatGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'loading'; // loading, menu, playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameSpeed = 1;
        
        // Game modules
        this.assetManager = new AssetManager();
        this.physics = new PhysicsEngine();
        this.ui = new UIManager();
        this.commands = new CommandManager();
        this.spacecraft = null;
        
        // Game objects
        this.asteroids = [];
        this.bullets = [];
        this.particles = [];
        this.explosions = [];
        this.pickups = [];
        this.stars = [];
        
        // Game timing
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Initialize game
        this.init();
    }
    
    async init() {
        try {
            console.log('🚀 Starting Space Cat Game initialization...');
            
            // Load assets first
            this.showLoadingMessage('Loading assets...');
            console.log('📦 Loading assets...');
            const assetsLoaded = await this.assetManager.loadAssets();
            
            if (!assetsLoaded) {
                console.warn('⚠️ Some assets failed to load, using placeholders...');
                this.showLoadingMessage('Some assets failed to load, using placeholders...');
            } else {
                console.log('✅ Assets loaded successfully');
            }
            
            // Initialize spacecraft
            console.log('🚀 Initializing spacecraft...');
            this.spacecraft = new SpaceCatShip();
            await this.spacecraft.initializeSprites(this.assetManager);
            console.log('✅ Spacecraft initialized');
            
            // Initialize modules
            console.log('🎮 Initializing UI...');
            this.ui.init(this, this.spacecraft);
            console.log('✅ UI initialized');
            
            console.log('⌨️ Initializing commands...');
            this.commands.init(this);
            console.log('✅ Commands initialized');
            
            // Setup game
            console.log('⭐ Creating stars...');
            this.createStars();
            console.log('✅ Stars created');
            
            console.log('🎯 Setting up event listeners...');
            this.setupEventListeners();
            console.log('✅ Event listeners set up');
            
            this.gameState = 'menu';
            this.showLoadingMessage('Ready to launch!');
            console.log('🎉 Game initialization complete!');
            
            // Start game loop
            this.gameLoop();
            
        } catch (error) {
            console.error('❌ Game initialization failed:', error);
            console.error('Stack trace:', error.stack);
            this.showLoadingMessage('Game initialization failed!');
        }
    }
    
    setupEventListeners() {
        // UI events
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startGame());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.togglePause());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetGame());
        if (playAgainBtn) playAgainBtn.addEventListener('click', () => this.resetGame());
    }

    showLoadingMessage(message) {
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.fillStyle = '#000011';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw loading message
        ctx.fillStyle = '#4ecdc4';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
        
        // Draw loading animation
        const time = Date.now() * 0.005;
        const x = canvas.width / 2 + Math.cos(time) * 50;
        const y = canvas.height / 2 + Math.sin(time) * 50;
        
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    createStars() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }
    
    spawnAsteroid() {
        if (Math.random() < 0.01 * this.gameSpeed) {
            const size = Math.random() < 0.5 ? 'small' : Math.random() < 0.8 ? 'medium' : 'large';
            const asteroid = new Asteroid(
                Math.random() * this.canvas.width,
                -50,
                size
            );
            asteroid.initializeSprite(this.assetManager);
            this.asteroids.push(asteroid);
        }
    }
    
    spawnPickup() {
        if (Math.random() < 0.005) {
            const types = ['healing', 'fuel', 'purr'];
            const type = types[Math.floor(Math.random() * types.length)];
            const pickup = new EnergyPickup(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                type
            );
            pickup.initializeSprite(this.assetManager);
            this.pickups.push(pickup);
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.asteroids = [];
        this.bullets = [];
        this.particles = [];
        this.explosions = [];
        this.pickups = [];
        
        // Reset spacecraft
        if (this.spacecraft) {
            this.spacecraft.state.health = this.spacecraft.config.hull.maxHealth;
            this.spacecraft.state.energy = 100;
            this.spacecraft.state.position = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
            this.spacecraft.state.velocity = { x: 0, y: 0 };
            this.spacecraft.state.purrChargesUsed = 0;
        }
        
        this.ui.hideGameOver();
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = 'Resume';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = 'Pause';
        }
    }
    
    resetGame() {
        this.gameState = 'menu';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
        this.createPlayer();
        this.updateUI();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'Pause';
        document.getElementById('gameOverScreen').classList.add('hidden');
    }
    
    shoot() {
        if (this.player) {
            this.bullets.push({
                x: this.player.x + this.player.width / 2 - 2,
                y: this.player.y,
                width: 4,
                height: 10,
                speed: 8,
                color: '#ff6b6b'
            });
        }
    }
    
    spawnEnemy() {
        if (Math.random() < 0.02 * this.gameSpeed) {
            this.enemies.push({
                x: Math.random() * (this.canvas.width - 40),
                y: -40,
                width: 40,
                height: 40,
                speed: 2 + Math.random() * 2,
                color: '#ff4757',
                health: 1
            });
        }
    }
    
    update() {
        try {
            if (this.gameState !== 'playing') return;
        
        // Update spacecraft
        if (this.spacecraft) {
            this.spacecraft.update(this.deltaTime);
            
            // Keep spacecraft in bounds
            const margin = 25;
            this.spacecraft.state.position.x = Math.max(margin, 
                Math.min(this.canvas.width - margin, this.spacecraft.state.position.x));
            this.spacecraft.state.position.y = Math.max(margin, 
                Math.min(this.canvas.height - margin, this.spacecraft.state.position.y));
        }
        
        // Update asteroids
        this.asteroids = this.asteroids.filter(asteroid => {
            asteroid.update(this.deltaTime);
            return this.physics.isWithinBounds(asteroid, this.canvas.width, this.canvas.height);
        });
        
        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.position.x += bullet.velocity.x * this.deltaTime;
            bullet.position.y += bullet.velocity.y * this.deltaTime;
            return this.physics.isWithinBounds(bullet, this.canvas.width, this.canvas.height);
        });
        
        // Update explosions
        this.explosions = this.explosions.filter(explosion => {
            explosion.update(this.deltaTime);
            return explosion.active;
        });
        
        // Update pickups
        this.pickups = this.pickups.filter(pickup => {
            pickup.update(this.deltaTime);
            return this.physics.isWithinBounds(pickup, this.canvas.width, this.canvas.height);
        });
        
        // Spawn objects
        this.spawnAsteroid();
        this.spawnPickup();
        
        // Check collisions
        this.checkCollisions();
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx * this.deltaTime;
            particle.y += particle.vy * this.deltaTime;
            particle.life--;
            return particle.life > 0;
        });
        
        // Update stars
        this.stars.forEach(star => {
            star.y += star.speed * this.deltaTime;
            if (star.y > this.canvas.height) {
                star.y = -star.size;
                star.x = Math.random() * this.canvas.width;
            }
        });
        } catch (error) {
            console.error('❌ Update error:', error);
        }
    }
    
    checkCollisions() {
        // Bullet vs Asteroid collisions
        this.bullets.forEach((bullet, bulletIndex) => {
            this.asteroids.forEach((asteroid, asteroidIndex) => {
                if (this.physics.checkCollision(bullet, asteroid)) {
                    // Remove bullet and asteroid
                    this.bullets.splice(bulletIndex, 1);
                    const destroyed = asteroid.takeDamage(100); // Strong Gun damage
                    
                    if (destroyed) {
                        this.asteroids.splice(asteroidIndex, 1);
                        
                        // Add score
                        this.score += asteroid.points;
                        this.ui.addScore(asteroid.points);
                        
                        // Create explosion
                        const explosion = new Explosion(asteroid.position.x, asteroid.position.y, 'asteroid');
                        explosion.initializeSprite(this.assetManager);
                        this.explosions.push(explosion);
                        
                        // Check for level up
                        if (this.score > 0 && this.score % 100 === 0) {
                            this.level++;
                            this.gameSpeed += 0.1;
                            this.ui.levelUp();
                        }
                    }
                }
            });
        });
        
        // Spacecraft vs Asteroid collisions
        if (this.spacecraft) {
            this.asteroids.forEach((asteroid, asteroidIndex) => {
                if (this.physics.checkCollision(this.spacecraft, asteroid)) {
                    this.asteroids.splice(asteroidIndex, 1);
                    
                    // Damage spacecraft
                    this.spacecraft.takeDamage(20);
                    
                    // Create explosion
                    const explosion = new Explosion(asteroid.position.x, asteroid.position.y, 'asteroid');
                    explosion.initializeSprite(this.assetManager);
                    this.explosions.push(explosion);
                    
                    if (this.spacecraft.state.health <= 0) {
                        this.gameOver();
                    }
                }
            });
        }
        
        // Spacecraft vs Pickup collisions
        if (this.spacecraft) {
            this.pickups.forEach((pickup, pickupIndex) => {
                if (pickup.checkCollision(this.spacecraft)) {
                    const collected = pickup.collect();
                    if (collected) {
                        this.pickups.splice(pickupIndex, 1);
                        
                        // Apply pickup effect
                        this.spacecraft.state.energy = Math.min(100, 
                            this.spacecraft.state.energy + collected.energy);
                        
                        this.ui.showMessage(`+${collected.energy} Energy!`, '#00ff00');
                    }
                }
            });
        }
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
                color: `hsl(${Math.random() * 60 + 20}, 100%, 50%)`
            });
        }
    }
    
    shoot() {
        if (this.spacecraft && this.spacecraft.state.weaponsOnline) {
            const shot = this.spacecraft.fireWeapon();
            if (shot) {
                this.bullets.push({
                    position: { x: shot.position.x, y: shot.position.y },
                    velocity: { 
                        x: Math.sin((shot.angle * Math.PI) / 180) * 300,
                        y: -Math.cos((shot.angle * Math.PI) / 180) * 300
                    },
                    damage: shot.damage
                });
            }
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.ui.showGameOver();
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    render() {
        try {
            // Clear canvas
            this.ctx.fillStyle = '#000011';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.opacity;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        this.ctx.globalAlpha = 1;
        
        if (this.gameState === 'playing' || this.gameState === 'paused') {
            // Draw spacecraft
            if (this.spacecraft) {
                this.ctx.save();
                this.ctx.translate(this.spacecraft.state.position.x, this.spacecraft.state.position.y);
                this.ctx.rotate((this.spacecraft.state.angle * Math.PI) / 180);
                
                // Draw spacecraft body
                this.ctx.fillStyle = '#4ecdc4';
                this.ctx.fillRect(-15, -25, 30, 50);
                
                // Draw spacecraft details
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(-8, -20, 6, 6); // left eye
                this.ctx.fillRect(2, -20, 6, 6); // right eye
                this.ctx.fillRect(-3, -10, 6, 4); // nose
                
                this.ctx.restore();
            }
            
            // Draw asteroids
            this.asteroids.forEach(asteroid => {
                this.ctx.save();
                this.ctx.translate(asteroid.position.x, asteroid.position.y);
                this.ctx.rotate(asteroid.angle);
                
                this.ctx.fillStyle = '#8B4513';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, asteroid.config.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.strokeStyle = '#654321';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                this.ctx.restore();
            });
            
            // Draw bullets
            this.ctx.fillStyle = '#ff6b6b';
            this.bullets.forEach(bullet => {
                this.ctx.fillRect(bullet.position.x - 2, bullet.position.y - 5, 4, 10);
            });
            
            // Draw explosions
            this.explosions.forEach(explosion => {
                this.ctx.save();
                this.ctx.translate(explosion.position.x, explosion.position.y);
                
                const frame = explosion.getCurrentFrame();
                if (frame.active) {
                    this.ctx.fillStyle = `hsl(${frame.frame * 20}, 100%, 50%)`;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 10 + frame.frame * 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                this.ctx.restore();
            });
            
            // Draw pickups
            this.pickups.forEach(pickup => {
                this.ctx.save();
                this.ctx.translate(pickup.position.x, pickup.position.y);
                this.ctx.rotate(pickup.angle);
                
                this.ctx.fillStyle = pickup.config.color;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                this.ctx.restore();
            });
            
            // Draw particles
            this.particles.forEach(particle => {
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = particle.life / 30;
                this.ctx.fillRect(particle.x, particle.y, 3, 3);
            });
            this.ctx.globalAlpha = 1;
        }
        
        // Draw pause overlay
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#4ecdc4';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
        } catch (error) {
            console.error('❌ Render error:', error);
        }
    }
    
    gameLoop(currentTime = 0) {
        try {
            this.deltaTime = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;
            
            this.update();
            this.render();
            requestAnimationFrame((time) => this.gameLoop(time));
        } catch (error) {
            console.error('❌ Game loop error:', error);
            console.error('Stack trace:', error.stack);
            this.showLoadingMessage('Game error occurred!');
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpaceCatGame();
});
