// Spacecraft configuration and management for Space Cat game
// Handles ship components, stats, and upgrades

class SpaceCatShip {
    constructor() {
        // Ship Configuration
        this.config = {
            hull: {
                type: 'Composite',
                cost: 80,
                strength: 10,
                maxHealth: 100
            },
            weapon: {
                type: 'Strong Gun',
                cost: 60,
                damage: 100, // 1-shot asteroid destruction
                fireRate: 1.0, // shots per second
                energyCost: 5
            },
            autopilot: {
                type: 'Improved',
                cost: 40,
                anticipation: true,
                energyConsumption: 1, // 1% per second
                active: false
            },
            navigation: {
                type: 'Improved',
                cost: 40,
                responseDelay: 0.5, // seconds
                accuracy: 0.95
            },
            purrCharge: {
                type: 'PurrCharge-4',
                cost: 40,
                charges: 4,
                maxCharges: 4,
                energyPerCharge: 25
            },
            commandModule: {
                type: 'Standard',
                cost: 50,
                processingPower: 1.0
            },
            ejectionSystem: {
                type: 'Standard',
                cost: 30,
                escapePodAvailable: true
            }
        };

        // Current ship state
        this.state = {
            health: this.config.hull.maxHealth,
            energy: 100,
            position: { x: 400, y: 300 },
            velocity: { x: 0, y: 0 },
            angle: 0,
            shields: false,
            weaponsOnline: true,
            autopilotActive: false,
            purrChargesUsed: 0
        };

        // Ship sprites
        this.sprites = {
            ship: null,
            escapePod: null,
            explosion: null
        };

        // Total ship cost
        this.totalCost = this.calculateTotalCost();
    }

    // Calculate total ship cost
    calculateTotalCost() {
        return Object.values(this.config).reduce((total, component) => total + component.cost, 0);
    }

    // Initialize ship sprites
    async initializeSprites(assetManager) {
        try {
            console.log('🎨 Loading spacecraft sprites...');
            this.sprites.ship = assetManager.getImage('spaceship');
            this.sprites.escapePod = assetManager.getImage('escape_pod');
            this.sprites.explosion = assetManager.getImage('explosion');
            console.log('✅ Spacecraft sprites loaded');
        } catch (error) {
            console.error('❌ Error loading spacecraft sprites:', error);
        }
    }

    // Update ship state
    update(deltaTime) {
        // Update energy consumption
        if (this.state.autopilotActive) {
            this.consumeEnergy(this.config.autopilot.energyConsumption * deltaTime);
        }

        // Update position based on velocity
        this.state.position.x += this.state.velocity.x * deltaTime;
        this.state.position.y += this.state.velocity.y * deltaTime;

        // Apply navigation response delay
        this.updateNavigation(deltaTime);
        
        // Apply friction
        this.state.velocity.x *= 0.98;
        this.state.velocity.y *= 0.98;
    }

    // Consume energy
    consumeEnergy(amount) {
        this.state.energy = Math.max(0, this.state.energy - amount);
        if (this.state.energy <= 0) {
            this.state.weaponsOnline = false;
            this.state.autopilotActive = false;
        }
    }

    // Use PurrCharge
    usePurrCharge() {
        if (this.state.purrChargesUsed < this.config.purrCharge.maxCharges) {
            this.state.energy = Math.min(100, this.state.energy + this.config.purrCharge.energyPerCharge);
            this.state.purrChargesUsed++;
            return true;
        }
        return false;
    }

    // Fire weapon
    fireWeapon() {
        if (this.state.weaponsOnline && this.state.energy >= this.config.weapon.energyCost) {
            this.consumeEnergy(this.config.weapon.energyCost);
            return {
                damage: this.config.weapon.damage,
                position: { ...this.state.position },
                angle: this.state.angle
            };
        }
        return null;
    }

    // Activate escape pod
    activateEscapePod() {
        if (this.config.ejectionSystem.escapePodAvailable) {
            this.config.ejectionSystem.escapePodAvailable = false;
            return {
                position: { ...this.state.position },
                velocity: { ...this.state.velocity }
            };
        }
        return null;
    }

    // Take damage
    takeDamage(damage) {
        const actualDamage = Math.max(1, damage - this.config.hull.strength);
        this.state.health = Math.max(0, this.state.health - actualDamage);
        
        if (this.state.health <= 0) {
            this.explode();
        }
    }

    // Ship explosion
    explode() {
        return {
            position: { ...this.state.position },
            type: 'ship_explosion'
        };
    }

    // Update navigation with response delay
    updateNavigation(deltaTime) {
        // Navigation system implementation with 0.5s response delay
        // This would be connected to the physics engine
    }

    // Get ship status for HUD
    getStatus() {
        return {
            health: this.state.health,
            maxHealth: this.config.hull.maxHealth,
            energy: this.state.energy,
            purrCharges: this.config.purrCharge.maxCharges - this.state.purrChargesUsed,
            autopilotActive: this.state.autopilotActive,
            weaponsOnline: this.state.weaponsOnline,
            escapePodAvailable: this.config.ejectionSystem.escapePodAvailable
        };
    }

    // Get ship configuration summary
    getConfiguration() {
        return {
            totalCost: this.totalCost,
            components: Object.keys(this.config).map(key => ({
                name: key,
                type: this.config[key].type,
                cost: this.config[key].cost
            }))
        };
    }

    // Apply thrust to spacecraft
    applyThrust(power = 1.0) {
        const thrust = power * 50; // Base thrust power
        const radians = (this.state.angle * Math.PI) / 180;
        this.state.velocity.x += Math.sin(radians) * thrust;
        this.state.velocity.y -= Math.cos(radians) * thrust;
        
        // Limit velocity
        const speed = Math.sqrt(this.state.velocity.x * this.state.velocity.x + this.state.velocity.y * this.state.velocity.y);
        const maxSpeed = 200;
        if (speed > maxSpeed) {
            this.state.velocity.x = (this.state.velocity.x / speed) * maxSpeed;
            this.state.velocity.y = (this.state.velocity.y / speed) * maxSpeed;
        }
    }

    // Apply brake to spacecraft
    applyBrake() {
        this.state.velocity.x *= 0.8;
        this.state.velocity.y *= 0.8;
    }

    // Rotate spacecraft
    rotate(angle) {
        this.state.angle += angle;
        if (this.state.angle < 0) this.state.angle += 360;
        if (this.state.angle >= 360) this.state.angle -= 360;
    }

    // Toggle autopilot
    toggleAutopilot() {
        this.state.autopilotActive = !this.state.autopilotActive;
        return this.state.autopilotActive;
    }

    // Toggle weapons
    toggleWeapons() {
        this.state.weaponsOnline = !this.state.weaponsOnline;
        return this.state.weaponsOnline;
    }

    // Use PurrCharge (alias for heal)
    usePurrCharge() {
        if (this.state.purrChargesUsed < this.config.purrCharge.maxCharges) {
            this.state.energy = Math.min(100, this.state.energy + this.config.purrCharge.energyPerCharge);
            this.state.purrChargesUsed++;
            return true;
        }
        return false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpaceCatShip;
}
