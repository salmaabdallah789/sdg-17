import Phaser from 'phaser';
import { gameState } from '../state/GameState.js';

export default class CustomizeCharacterScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CustomizeCharacterScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Animated background gradient
        this.createAnimatedBackground();

        // Title
        const title = this.add.text(width / 2, 100, 'AI Future Traveler', {
            fontSize: '48px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(width / 2, 160, 'Create Your Character', {
            fontSize: '24px',
            fill: '#a0a0a0',
            fontFamily: 'Arial'
        });
        subtitle.setOrigin(0.5);

        // Name input area
        this.add.text(width / 2, 250, 'Enter Your Name:', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Create input field (simulated with text)
        this.nameText = this.add.text(width / 2, 300, gameState.playerName || 'Click to type...', {
            fontSize: '28px',
            fill: gameState.playerName ? '#fff' : '#888',
            fontFamily: 'Arial',
            backgroundColor: '#2a2a3e',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.nameText.on('pointerdown', () => {
            const name = prompt('Enter your name:', gameState.playerName || '');
            if (name && name.trim()) {
                gameState.playerName = name.trim();
                this.nameText.setText(gameState.playerName);
                this.nameText.setStyle({ fill: '#fff' });
            }
        });

        // Avatar color selection
        this.add.text(width / 2, 380, 'Choose Avatar Color:', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const colors = [
            { name: 'Blue', value: 0x4a90e2 },
            { name: 'Green', value: 0x50c878 },
            { name: 'Red', value: 0xe74c3c },
            { name: 'Purple', value: 0x9b59b6 },
            { name: 'Orange', value: 0xf39c12 },
            { name: 'Yellow', value: 0xf1c40f }
        ];

        const colorButtons = [];
        colors.forEach((color, index) => {
            const x = width / 2 - 150 + (index % 3) * 100;
            const y = 450 + Math.floor(index / 3) * 80;

            const button = this.add.circle(x, y, 30, color.value)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    gameState.avatarConfig.color = color.value;
                    this.updateAvatarPreview();
                    // Highlight selected
                    colorButtons.forEach(btn => btn.setStrokeStyle(2, 0xffffff, 0));
                    button.setStrokeStyle(4, 0xffffff, 1);
                });

            if (gameState.avatarConfig.color === color.value) {
                button.setStrokeStyle(4, 0xffffff, 1);
            }

            this.add.text(x, y + 45, color.name, {
                fontSize: '14px',
                fill: '#fff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            colorButtons.push(button);
        });

        // Avatar preview
        this.avatarPreview = this.add.circle(width / 2, 600, 40, gameState.avatarConfig.color);
        this.add.text(width / 2, 650, 'Preview', {
            fontSize: '16px',
            fill: '#a0a0a0',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Start button
        const startButton = this.add.rectangle(width / 2, height - 80, 300, 60, 0x27ae60)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => startButton.setFillStyle(0x2ecc71))
            .on('pointerout', () => startButton.setFillStyle(0x27ae60))
            .on('pointerdown', () => {
                if (gameState.playerName) {
                    this.cameras.main.fadeOut(500, 0, 0, 0);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('Level2025Scene');
                    });
                } else {
                    this.tweens.add({
                        targets: this.nameText,
                        x: this.nameText.x + 10,
                        duration: 100,
                        yoyo: true,
                        repeat: 1
                    });
                }
            });

        this.add.text(width / 2, height - 80, 'Start Mission (2025)', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    createAnimatedBackground() {
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, 1200),
                Phaser.Math.Between(0, 800),
                Phaser.Math.Between(2, 5),
                0xffffff,
                0.3
            );

            this.tweens.add({
                targets: particle,
                y: particle.y - 200,
                duration: Phaser.Math.Between(3000, 6000),
                repeat: -1,
                ease: 'Linear'
            });

            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-50, 50),
                duration: Phaser.Math.Between(2000, 4000),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
    }

    updateAvatarPreview() {
        this.avatarPreview.setFillStyle(gameState.avatarConfig.color);
    }
}

