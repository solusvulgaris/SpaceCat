// Physics engine for the space cat game
// Handles collision detection, movement, and physics calculations

class PhysicsEngine {
    constructor() {
        this.gravity = 0.5;
        this.friction = 0.98;
        this.maxVelocity = 300;
        this.collisionThreshold = 20;
    }

    // Check collision between two objects (robust for our mixed shapes)
    checkCollision(obj1, obj2) {
        const getPos = (o) => o?.position || o?.state?.position || (typeof o?.x === 'number' && typeof o?.y === 'number' ? { x: o.x, y: o.y } : null);
        const getRadius = (o) => (typeof o?.radius === 'number' ? o.radius : (typeof o?.config?.radius === 'number' ? o.config.radius : null));
        const getRect = (o) => (typeof o?.width === 'number' && typeof o?.height === 'number' && typeof o?.x === 'number' && typeof o?.y === 'number') ? { x: o.x, y: o.y, w: o.width, h: o.height } : null;

        const p1 = getPos(obj1);
        const p2 = getPos(obj2);
        const r1 = getRadius(obj1);
        const r2 = getRadius(obj2);
        const rect1 = getRect(obj1);
        const rect2 = getRect(obj2);

        // Circle-circle
        if (p1 && p2 && r1 != null && r2 != null) {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < (r1 + r2);
        }

        // Rect-rect
        if (rect1 && rect2) {
            return rect1.x < rect2.x + rect2.w &&
                   rect1.x + rect1.w > rect2.x &&
                   rect1.y < rect2.y + rect2.h &&
                   rect1.y + rect1.h > rect2.y;
        }

        // Circle-rect (obj1 circle, obj2 rect)
        if (p1 && r1 != null && rect2) {
            const cx = Math.max(rect2.x, Math.min(p1.x, rect2.x + rect2.w));
            const cy = Math.max(rect2.y, Math.min(p1.y, rect2.y + rect2.h));
            const dx = p1.x - cx;
            const dy = p1.y - cy;
            return (dx * dx + dy * dy) < (r1 * r1);
        }

        // Circle-rect (obj2 circle, obj1 rect)
        if (p2 && r2 != null && rect1) {
            const cx = Math.max(rect1.x, Math.min(p2.x, rect1.x + rect1.w));
            const cy = Math.max(rect1.y, Math.min(p2.y, rect1.y + rect1.h));
            const dx = p2.x - cx;
            const dy = p2.y - cy;
            return (dx * dx + dy * dy) < (r2 * r2);
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

// Ensure global for browser tests
if (typeof window !== 'undefined') {
    window.PhysicsEngine = PhysicsEngine;
}
