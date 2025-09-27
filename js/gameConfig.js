// Game configuration for Space Cat
// Contains all technical specifications and game parameters

const GAME_CONFIG = {
    // Ship Configuration
    SHIP: {
        // Hull: Composite (80M, Strength 10)
        HULL: {
            type: 'Composite',
            cost: 80,
            strength: 10,
            maxHealth: 100,
            description: 'Reinforced composite hull with excellent durability'
        },
        
        // Weapon: Strong Gun (60M, 1-shot asteroid destruction)
        WEAPON: {
            type: 'Strong Gun',
            cost: 60,
            damage: 100, // 1-shot asteroid destruction
            fireRate: 1.0, // shots per second
            energyCost: 5,
            range: 500,
            description: 'High-powered weapon capable of destroying asteroids in one shot'
        },
        
        // Autopilot: Improved (40M, early anticipation, 1%/s energy use)
        AUTOPILOT: {
            type: 'Improved',
            cost: 40,
            anticipation: true,
            energyConsumption: 1, // 1% per second
            responseTime: 0.2, // seconds
            accuracy: 0.95,
            description: 'Advanced autopilot with early threat detection and anticipation'
        },
        
        // Navigation: Improved (40M, 0.5s response delay)
        NAVIGATION: {
            type: 'Improved',
            cost: 40,
            responseDelay: 0.5, // seconds
            accuracy: 0.95,
            maxSpeed: 200,
            acceleration: 50,
            description: 'Enhanced navigation system with improved response time'
        },
        
        // PurrCharge: PurrCharge-4 (40M, 4 charges)
        PURRCHARGE: {
            type: 'PurrCharge-4',
            cost: 40,
            charges: 4,
            maxCharges: 4,
            energyPerCharge: 25,
            cooldown: 5, // seconds between uses
            description: 'Feline energy system with 4 emergency charges'
        },
        
        // Command Module: Standard (50M)
        COMMAND_MODULE: {
            type: 'Standard',
            cost: 50,
            processingPower: 1.0,
            systemIntegration: 0.9,
            description: 'Standard command module for ship operations'
        },
        
        // Ejection System: Standard (30M)
        EJECTION_SYSTEM: {
            type: 'Standard',
            cost: 30,
            escapePodAvailable: true,
            ejectionTime: 2, // seconds
            description: 'Standard ejection system with escape pod capability'
        }
    },

    // Game Objects
    OBJECTS: {
        // Asteroid configurations
        ASTEROIDS: {
            small: { radius: 15, health: 25, points: 10, speed: 50 },
            medium: { radius: 25, health: 50, points: 25, speed: 30 },
            large: { radius: 40, health: 100, points: 50, speed: 20 }
        },
        
        // Energy pickup types
        PICKUPS: {
            healing: { energy: 25, color: '#00ff00', rarity: 0.4 },
            fuel: { energy: 50, color: '#ffff00', rarity: 0.3 },
            purr: { energy: 15, color: '#ff00ff', rarity: 0.3 }
        },
        
        // Explosion effects
        EXPLOSIONS: {
            asteroid: { frames: 8, duration: 800, size: 'medium' },
            ship: { frames: 12, duration: 1200, size: 'large' },
            pickup: { frames: 4, duration: 400, size: 'small' }
        }
    },

    // Game Mechanics
    MECHANICS: {
        // Energy system
        ENERGY: {
            maxEnergy: 100,
            regenerationRate: 0.5, // per second
            autopilotConsumption: 1, // per second
            weaponCost: 5,
            shieldCost: 2 // per second when active
        },
        
        // Physics
        PHYSICS: {
            gravity: 0.5,
            friction: 0.98,
            maxVelocity: 300,
            collisionThreshold: 20
        },
        
        // Scoring
        SCORING: {
            asteroidSmall: 10,
            asteroidMedium: 25,
            asteroidLarge: 50,
            survivalBonus: 1, // per second
            levelMultiplier: 1.2
        }
    },

    // Sprite Assets
    ASSETS: {
        SHIP: 'spaceship.png',
        ESCAPE_POD: 'escape_pod.png',
        ASTEROID: 'asteroid.png',
        ENERGY_PICKUP: 'healing_booster.png',
        EXPLOSION: 'explosion.png'
    },

    // Total Ship Cost Calculation
    getTotalCost() {
        return Object.values(this.SHIP).reduce((total, component) => total + component.cost, 0);
    },

    // Get ship configuration summary
    getShipSummary() {
        return {
            totalCost: this.getTotalCost(),
            components: Object.keys(this.SHIP).map(key => ({
                name: key,
                type: this.SHIP[key].type,
                cost: this.SHIP[key].cost,
                description: this.SHIP[key].description
            }))
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_CONFIG;
}
