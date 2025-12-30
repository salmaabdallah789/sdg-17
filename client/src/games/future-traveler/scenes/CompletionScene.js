import Phaser from 'phaser';
import { gameState } from '../state/GameState.js';

export default class CompletionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CompletionScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

        // Title
        this.add.text(width / 2, 150, 'MISSION COMPLETE!', {
            fontSize: '56px',
            fill: '#50c878',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Success message
        this.add.text(width / 2, 250, 'You successfully navigated 2025!', {
            fontSize: '28px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Stats display
        const statsBg = this.add.rectangle(width / 2, 400, 600, 300, 0x2a2a3e)
            .setStrokeStyle(3, 0x3498db);

        this.add.text(width / 2, 320, 'Your Achievements:', {
            fontSize: '32px',
            fill: '#3498db',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const stats = [
            `Player: ${gameState.playerName}`,
            `Coins Collected: ${gameState.coins}`,
            `AI Tools Found: ${gameState.toolsCollected2025.length}`,
            `Tools: ${gameState.toolsCollected2025.join(', ') || 'None'}`
        ];

        stats.forEach((stat, index) => {
            this.add.text(width / 2, 370 + index * 40, stat, {
                fontSize: '20px',
                fill: '#fff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
        });

        // Completion message
        const completionText = gameState.coins >= 20 && gameState.toolsCollected2025.length >= 3
            ? 'Excellent! You collected many resources and tools!'
            : gameState.coins >= 10 && gameState.toolsCollected2025.length >= 2
            ? 'Good job! You gathered valuable resources!'
            : 'You completed the mission! Try collecting more next time!';

        this.add.text(width / 2, 550, completionText, {
            fontSize: '22px',
            fill: '#f1c40f',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            wordWrap: { width: 800 }
        }).setOrigin(0.5);

        // Back to home button
        const homeButton = this.add.rectangle(width / 2, height - 100, 300, 60, 0x3498db)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => homeButton.setFillStyle(0x5dade2))
            .on('pointerout', () => homeButton.setFillStyle(0x3498db))
            .on('pointerdown', () => {
                // Navigate back to home
                if (typeof window !== 'undefined') {
                    window.location.href = '/home';
                }
            });

        this.add.text(width / 2, height - 100, 'Back to Home', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Replay button
        const replayButton = this.add.rectangle(width / 2, height - 180, 300, 60, 0x27ae60)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => replayButton.setFillStyle(0x2ecc71))
            .on('pointerout', () => replayButton.setFillStyle(0x27ae60))
            .on('pointerdown', () => {
                gameState.init();
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('CustomizeCharacterScene');
                });
            });

        this.add.text(width / 2, height - 180, 'Play Again', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
}

