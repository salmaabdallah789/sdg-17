/**
 * Global Game State Management
 * Persists data across all scenes
 */
export const gameState = {
    playerName: '',
    avatarConfig: {
        color: 0x4a90e2, // Default blue
        style: 'default'
    },
    coins: 0,
    budget: 0,
    toolsCollected2025: [],
    toolsOwned2035: [],
    score: 0,
    
    init() {
        // Reset to defaults
        this.playerName = '';
        this.avatarConfig = { color: 0x4a90e2, style: 'default' };
        this.coins = 0;
        this.budget = 0;
        this.toolsCollected2025 = [];
        this.toolsOwned2035 = [];
        this.score = 0;
    },
    
    addCoins(amount) {
        this.coins += amount;
        this.budget = this.coins; // 1 coin = 1 budget unit
    },
    
    collectTool2025(toolName) {
        if (!this.toolsCollected2025.includes(toolName)) {
            this.toolsCollected2025.push(toolName);
            // Tools from 2025 are automatically owned in 2035
            if (!this.toolsOwned2035.includes(toolName)) {
                this.toolsOwned2035.push(toolName);
            }
        }
    },
    
    buyTool2035(toolName, cost) {
        if (this.budget >= cost && !this.toolsOwned2035.includes(toolName)) {
            this.budget -= cost;
            this.toolsOwned2035.push(toolName);
            return true;
        }
        return false;
    },
    
    hasTool(toolName) {
        return this.toolsOwned2035.includes(toolName);
    },
    
    addScore(points) {
        this.score += points;
    },
    
    getFinalMessage() {
        if (this.score >= 21) {
            return 'Major success: community stabilized.';
        } else if (this.score >= 11) {
            return 'Partial success: some recovery achieved.';
        } else {
            return 'Mission failed: community impact limited.';
        }
    }
};

