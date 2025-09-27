// Game objects for Space Cat game
// Handles asteroids, energy pickups, explosions, and other game entities

class Asteroid {
    constructor(x, y, size = 'medium') {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        
        // Size configurations
        this.sizes = {
            small: { radius: 15, health: 25, points: 10 },
            medium: { radius: 25, health: 50, points: 25 },
            large: { radius: 40, health: 100, points: 50 }
        };
        
        this.size = size;
        this.config = this.sizes[size];
        this.health = this.config.health;
        this.maxHealth = this.config.health;
        this.points = this.config.points;
        
        this.sprite = null;
        this.destroyed = false;
    }

    // Initialize asteroid sprite
    initializeSprite(assetManager) {
        this.sprite = assetManager.getImage('asteroid');
    }

    // Update asteroid
    update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.angle += this.rotationSpeed * deltaTime;
    }

    // Take damage
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.destroy();
            return true;
        }
        return false;
    }

    // Destroy asteroid
    destroy() {
        this.destroyed = true;
        return {
            position: { ...this.position },
            points: this.points,
            explosion: true
        };
    }

    // Check collision with other objects
    checkCollision(other) {
        const dx = this.position.x - other.position.x;
        const dy = this.position.y - other.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.config.radius + (other.radius || other.config?.radius || 10));
    }
}

class EnergyPickup {
    constructor(x, y, type = 'healing') {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.angle = 0;
        this.rotationSpeed = 0.05;
        
        this.types = {
            healing: { energy: 25, color: '#00ff00', sprite: 'healing_booster' },
            fuel: { energy: 50, color: '#ffff00', sprite: 'healing_booster' },
            purr: { energy: 15, color: '#ff00ff', sprite: 'healing_booster' }
        };
        
        this.type = type;
        this.config = this.types[type];
        this.collected = false;
        this.sprite = null;
    }

    // Initialize pickup sprite
    initializeSprite(assetManager) {
        this.sprite = assetManager.getImage(this.config.sprite);
    }

    // Update pickup
    update(deltaTime) {
        this.angle += this.rotationSpeed * deltaTime;
    }

    // Collect pickup
    collect() {
        if (!this.collected) {
            this.collected = true;
            return {
                energy: this.config.energy,
                type: this.type
            };
        }
        return null;
    }

    // Check collision with ship
    checkCollision(ship) {
        const dx = this.position.x - ship.state.position.x;
        const dy = this.position.y - ship.state.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 20; // Pickup radius
    }
}

class Explosion {
    constructor(x, y, type = 'asteroid') {
        this.position = { x, y };
        this.type = type;
        this.frame = 0;
        this.maxFrames = 8;
        this.frameTime = 0;
        this.frameDelay = 100; // milliseconds
        this.active = true;
        this.sprite = null;
    }

    // Initialize explosion sprite
    initializeSprite(assetManager) {
        this.sprite = assetManager.getImage('explosion');
    }

    // Update explosion animation
    update(deltaTime) {
        this.frameTime += deltaTime * 1000;
        
        if (this.frameTime >= this.frameDelay) {
            this.frame++;
            this.frameTime = 0;
            
            if (this.frame >= this.maxFrames) {
                this.active = false;
            }
        }
    }

    // Get current animation frame
    getCurrentFrame() {
        return {
            frame: this.frame,
            maxFrames: this.maxFrames,
            active: this.active
        };
    }
}

class EscapePod {
    constructor(x, y) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.angle = 0;
        this.active = true;
        this.sprite = null;
        this.health = 50;
        this.maxHealth = 50;
    }

    // Initialize escape pod sprite
    initializeSprite(assetManager) {
        this.sprite = assetManager.getImage('escape_pod');
    }

    // Update escape pod
    update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }

    // Take damage
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.active = false;
            return true;
        }
        return false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Asteroid, EnergyPickup, Explosion, EscapePod };
}
