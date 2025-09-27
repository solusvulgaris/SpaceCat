// Physics engine for the space cat game
// Handles collision detection, movement, and physics calculations

class PhysicsEngine {
    constructor() {
        this.gravity = 0.5;
        this.friction = 0.98;
        this.maxVelocity = 300;
        this.collisionThreshold = 20;
    }

    // Check collision between two objects (improved for circular and rectangular)
    checkCollision(obj1, obj2) {
        // Handle circular collision (for asteroids)
        if (obj1.radius && obj2.radius) {
            const dx = obj1.position.x - obj2.position.x;
            const dy = obj1.position.y - obj2.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < (obj1.radius + obj2.radius);
        }
        
        // Handle rectangular collision
        if (obj1.width && obj1.height && obj2.width && obj2.height) {
            return obj1.x < obj2.x + obj2.width &&
                   obj1.x + obj1.width > obj2.x &&
                   obj1.y < obj2.y + obj2.height &&
                   obj1.y + obj1.height > obj2.y;
        }
        
        // Handle mixed collision (circular vs rectangular)
        if (obj1.radius && obj2.width) {
            const dx = obj1.position.x - (obj2.x + obj2.width/2);
            const dy = obj1.position.y - (obj2.y + obj2.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < (obj1.radius + Math.max(obj2.width, obj2.height)/2);
        }
        
        return false;
    }

    // Apply gravity to an object
    applyGravity(obj) {
        if (obj.velocityY !== undefined) {
            obj.velocityY += this.gravity;
        }
    }

    // Apply friction to an object
    applyFriction(obj) {
        if (obj.velocityX !== undefined) {
            obj.velocityX *= this.friction;
        }
        if (obj.velocityY !== undefined) {
            obj.velocityY *= this.friction;
        }
    }

    // Update object position based on velocity
    updatePosition(obj, deltaTime = 1) {
        if (obj.velocityX !== undefined && obj.velocityY !== undefined) {
            obj.position.x += obj.velocityX * deltaTime;
            obj.position.y += obj.velocityY * deltaTime;
        } else if (obj.x !== undefined && obj.y !== undefined) {
            obj.x += (obj.velocityX || 0) * deltaTime;
            obj.y += (obj.velocityY || 0) * deltaTime;
        }
    }

    // Apply thrust to spacecraft
    applyThrust(obj, thrust, angle) {
        const radians = (angle * Math.PI) / 180;
        obj.velocityX += Math.sin(radians) * thrust;
        obj.velocityY -= Math.cos(radians) * thrust;
        
        // Limit velocity
        const speed = Math.sqrt(obj.velocityX * obj.velocityX + obj.velocityY * obj.velocityY);
        if (speed > this.maxVelocity) {
            obj.velocityX = (obj.velocityX / speed) * this.maxVelocity;
            obj.velocityY = (obj.velocityY / speed) * this.maxVelocity;
        }
    }

    // Calculate distance between two objects
    getDistance(obj1, obj2) {
        const dx = obj1.position.x - obj2.position.x;
        const dy = obj1.position.y - obj2.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Check if object is within bounds
    isWithinBounds(obj, canvasWidth, canvasHeight) {
        const margin = 50; // Allow objects to go slightly off-screen
        return obj.position.x > -margin && 
               obj.position.x < canvasWidth + margin &&
               obj.position.y > -margin && 
               obj.position.y < canvasHeight + margin;
    }

    // Apply navigation delay (0.5s response delay)
    applyNavigationDelay(obj, targetX, targetY, delay = 0.5) {
        if (!obj.navigationTarget) {
            obj.navigationTarget = { x: targetX, y: targetY, time: Date.now() };
        }
        
        const elapsed = (Date.now() - obj.navigationTarget.time) / 1000;
        if (elapsed >= delay) {
            const dx = targetX - obj.position.x;
            const dy = targetY - obj.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > this.collisionThreshold) {
                obj.velocityX = (dx / distance) * obj.speed || 50;
                obj.velocityY = (dy / distance) * obj.speed || 50;
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicsEngine;
}
