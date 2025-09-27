// Asset management for the space cat game
// Handles loading and management of game assets

class AssetManager {
    constructor() {
        this.images = {};
        this.sounds = {};
        this.loadedCount = 0;
        this.totalAssets = 0;
    }

    // Load all game assets
    async loadAssets() {
        const imageAssets = [
            { name: 'spaceship', path: 'assets/images/spaceship.png', type: 'ship', priority: 'high' },
            { name: 'asteroid', path: 'assets/images/asteroid.png', type: 'obstacle', priority: 'high' },
            { name: 'explosion', path: 'assets/images/explosion.png', type: 'effect', priority: 'medium' },
            { name: 'healing_booster', path: 'assets/images/healing_booster.png', type: 'pickup', priority: 'medium' },
            { name: 'escape_pod', path: 'assets/images/escape_pod.png', type: 'ship', priority: 'low' }
        ];

        this.imageAssets = imageAssets;
        this.totalAssets = imageAssets.length;
        this.loadedAssets = [];
        this.failedAssets = [];
        
        // Load high priority assets first
        const highPriorityAssets = imageAssets.filter(asset => asset.priority === 'high');
        const mediumPriorityAssets = imageAssets.filter(asset => asset.priority === 'medium');
        const lowPriorityAssets = imageAssets.filter(asset => asset.priority === 'low');
        
        try {
            // Load high priority assets first
            await Promise.all(highPriorityAssets.map(asset => this.loadImage(asset)));
            
            // Load medium priority assets
            await Promise.all(mediumPriorityAssets.map(asset => this.loadImage(asset)));
            
            // Load low priority assets
            await Promise.all(lowPriorityAssets.map(asset => this.loadImage(asset)));
            
            console.log('All assets loaded successfully!');
            console.log(`Loaded: ${this.loadedAssets.length}, Failed: ${this.failedAssets.length}`);
            return true;
        } catch (error) {
            console.error('Error loading assets:', error);
            return false;
        }
    }

    // Load a single image asset
    loadImage(asset) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[asset.name] = img;
                this.loadedCount++;
                this.loadedAssets.push(asset.name);
                console.log(`✅ Loaded: ${asset.name} (${asset.type})`);
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`❌ Failed to load: ${asset.path}`);
                this.failedAssets.push(asset.name);
                // Create a placeholder image
                this.images[asset.name] = this.createPlaceholderImage(asset.name, asset.type);
                this.loadedCount++;
                resolve(this.images[asset.name]);
            };
            img.src = asset.path;
        });
    }

    // Create a placeholder image when asset fails to load
    createPlaceholderImage(name, type) {
        const canvas = document.createElement('canvas');
        const size = type === 'ship' ? 48 : type === 'obstacle' ? 32 : 24;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Draw a simple colored rectangle as placeholder based on type
        const colors = {
            'ship': '#00ff00',
            'obstacle': '#8B4513', 
            'effect': '#ff0000',
            'pickup': '#00ffff'
        };
        
        ctx.fillStyle = colors[type] || '#ffff00';
        ctx.fillRect(0, 0, size, size);
        
        // Add border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, size-2, size-2);
        
        // Add text label
        ctx.fillStyle = '#000000';
        ctx.font = `${Math.max(8, size/4)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(name.substring(0, 4), size/2, size/2 + 2);
        
        return canvas;
    }

    // Get an image asset
    getImage(name) {
        return this.images[name];
    }

    // Get assets by type
    getAssetsByType(type) {
        return Object.keys(this.images).filter(name => {
            const asset = this.imageAssets?.find(a => a.name === name);
            return asset && asset.type === type;
        });
    }

    // Get ship assets
    getShipAssets() {
        return this.getAssetsByType('ship');
    }

    // Get obstacle assets
    getObstacleAssets() {
        return this.getAssetsByType('obstacle');
    }

    // Get pickup assets
    getPickupAssets() {
        return this.getAssetsByType('pickup');
    }

    // Get effect assets
    getEffectAssets() {
        return this.getAssetsByType('effect');
    }

    // Check if all assets are loaded
    isLoaded() {
        return this.loadedCount >= this.totalAssets;
    }

    // Get loading progress
    getProgress() {
        return this.totalAssets > 0 ? (this.loadedCount / this.totalAssets) * 100 : 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssetManager;
}
