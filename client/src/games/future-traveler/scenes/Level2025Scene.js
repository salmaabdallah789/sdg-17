import Phaser from 'phaser';
import { gameState } from '../state/GameState.js';

export default class Level2025Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2025Scene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Create enhanced map with obstacles
        this.createMap();

        // Create player
        this.player = this.add.circle(100, 100, 20, gameState.avatarConfig.color);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // Create obstacles/walls
        this.obstacles = this.physics.add.staticGroup();
        this.createObstacles();

        // Create moving hazards
        this.hazards = this.physics.add.group();
        this.createHazards();

        // Create coins (many more)
        this.coins = this.physics.add.group();
        this.createCoins();

        // Create AI tools (more tools)
        this.tools = this.physics.add.group();
        this.createTools();

        // Create checkpoints
        this.checkpoints = this.physics.add.group();
        this.createCheckpoints();

        // Create gate
        this.gate = this.add.rectangle(width - 150, height - 150, 100, 100, 0x9b59b6);
        this.physics.add.existing(this.gate);
        this.gate.body.setImmovable(true);

        // Collisions
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.tools, this.collectTool, null, this);
        this.physics.add.overlap(this.player, this.checkpoints, this.reachCheckpoint, null, this);
        this.physics.add.overlap(this.player, this.hazards, this.hitHazard, null, this);
        this.physics.add.overlap(this.player, this.gate, this.checkGate, null, this);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');

        // Game state
        this.playerHealth = 3;
        this.checkpointsReached = 0;
        this.totalCheckpoints = 5; // Will be set in createCheckpoints

        // HUD
        this.createHUD();

        // Instructions
        this.add.text(20, 20, 'Use Arrow Keys or WASD to move\nAvoid red hazards!\nCollect coins and tools\nReach checkpoints\nFind the purple gate!', {
            fontSize: '14px',
            fill: '#fff',
            fontFamily: 'Arial',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });

        // Year display
        this.add.text(width / 2, 30, 'YEAR: 2025', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            backgroundColor: '#2a2a3e',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Gate instruction
        this.gateText = this.add.text(width - 150, height - 200, 'Press E to Complete', {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Arial',
            backgroundColor: '#9b59b6',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setVisible(false);

        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    createMap() {
        const { width, height } = this.cameras.main;
        
        // Ground with pattern
        this.add.rectangle(width / 2, height / 2, width, height, 0x2c3e50);
        
        // Add some visual variety
        for (let i = 0; i < 20; i++) {
            this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                5,
                0x34495e,
                0.3
            );
        }
    }

    createObstacles() {
        const { width, height } = this.cameras.main;
        
        // Create extended maze-like walls for longer gameplay
        const wallPositions = [
            // Vertical walls - more complex maze
            { x: 300, y: 200, w: 20, h: 150 },
            { x: 500, y: 100, w: 20, h: 200 },
            { x: 700, y: 300, w: 20, h: 180 },
            { x: 900, y: 150, w: 20, h: 250 },
            { x: 400, y: 500, w: 20, h: 200 },
            { x: 600, y: 600, w: 20, h: 150 },
            { x: 800, y: 450, w: 20, h: 200 },
            { x: 250, y: 350, w: 20, h: 100 },
            { x: 450, y: 250, w: 20, h: 120 },
            { x: 650, y: 150, w: 20, h: 100 },
            { x: 850, y: 550, w: 20, h: 150 },
            { x: 350, y: 650, w: 20, h: 100 },
            // Horizontal walls - more barriers
            { x: 200, y: 300, w: 150, h: 20 },
            { x: 450, y: 400, w: 200, h: 20 },
            { x: 750, y: 200, w: 180, h: 20 },
            { x: 350, y: 600, w: 200, h: 20 },
            { x: 650, y: 500, w: 150, h: 20 },
            { x: 550, y: 250, w: 100, h: 20 },
            { x: 150, y: 400, w: 100, h: 20 },
            { x: 500, y: 300, w: 120, h: 20 },
            { x: 800, y: 350, w: 100, h: 20 },
            { x: 300, y: 500, w: 80, h: 20 },
            { x: 700, y: 650, w: 150, h: 20 }
        ];

        wallPositions.forEach(pos => {
            const wall = this.add.rectangle(pos.x, pos.y, pos.w, pos.h, 0x7f8c8d);
            this.physics.add.existing(wall, true);
            this.obstacles.add(wall);
        });
    }

    createHazards() {
        const { width, height } = this.cameras.main;
        
        // More moving hazards for increased challenge
        const hazardPaths = [
            { startX: 250, startY: 250, endX: 450, endY: 250, speed: 100 },
            { startX: 600, startY: 350, endX: 600, endY: 550, speed: 120 },
            { startX: 850, startY: 400, endX: 1050, endY: 400, speed: 110 },
            { startX: 400, startY: 550, endX: 400, endY: 350, speed: 100 },
            { startX: 750, startY: 100, endX: 950, endY: 300, speed: 90 },
            { startX: 300, startY: 450, endX: 500, endY: 450, speed: 105 },
            { startX: 650, startY: 200, endX: 650, endY: 400, speed: 115 },
            { startX: 500, startY: 500, endX: 700, endY: 500, speed: 95 },
            { startX: 200, startY: 150, endX: 200, endY: 350, speed: 100 },
            { startX: 900, startY: 250, endX: 1100, endY: 250, speed: 110 }
        ];

        hazardPaths.forEach((path, index) => {
            const hazard = this.add.circle(path.startX, path.startY, 25, 0xe74c3c);
            this.physics.add.existing(hazard);
            hazard.body.setImmovable(true);
            hazard.hazardId = index;
            this.hazards.add(hazard);

            // Move hazard back and forth
            this.tweens.add({
                targets: hazard,
                x: path.endX,
                y: path.endY,
                duration: (Phaser.Math.Distance.Between(path.startX, path.startY, path.endX, path.endY) / path.speed) * 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Linear'
            });
        });
    }

    createCoins() {
        const { width, height } = this.cameras.main;
        
        // Many more coins scattered throughout the extended map (30+ coins)
        const coinPositions = [
            // Area 1 - Starting area
            { x: 150, y: 150 }, { x: 200, y: 200 }, { x: 250, y: 100 }, { x: 180, y: 120 },
            // Area 2 (after first obstacle)
            { x: 350, y: 150 }, { x: 400, y: 250 }, { x: 450, y: 180 }, { x: 380, y: 200 },
            // Area 3
            { x: 550, y: 200 }, { x: 600, y: 300 }, { x: 650, y: 250 }, { x: 580, y: 220 },
            // Area 4
            { x: 750, y: 350 }, { x: 800, y: 400 }, { x: 850, y: 450 }, { x: 780, y: 380 },
            // Area 5
            { x: 500, y: 500 }, { x: 550, y: 550 }, { x: 600, y: 600 }, { x: 520, y: 520 },
            // Area 6
            { x: 300, y: 450 }, { x: 350, y: 500 }, { x: 400, y: 550 }, { x: 320, y: 480 },
            // Area 7
            { x: 700, y: 500 }, { x: 750, y: 550 }, { x: 800, y: 600 }, { x: 720, y: 520 },
            // Area 8 (near gate)
            { x: 950, y: 500 }, { x: 1000, y: 550 }, { x: 1050, y: 600 },
            { x: 900, y: 450 }, { x: 950, y: 400 }, { x: 1000, y: 350 },
            // Bonus coins in hidden areas
            { x: 150, y: 500 }, { x: 200, y: 550 }, { x: 250, y: 600 },
            { x: 100, y: 300 }, { x: 100, y: 400 }, { x: 100, y: 500 },
            // Additional coins for longer gameplay
            { x: 1100, y: 200 }, { x: 1100, y: 300 }, { x: 1100, y: 400 },
            { x: 50, y: 250 }, { x: 50, y: 350 }, { x: 50, y: 450 },
            { x: 200, y: 50 }, { x: 400, y: 50 }, { x: 600, y: 50 }
        ];

        coinPositions.forEach(pos => {
            const coin = this.add.circle(pos.x, pos.y, 15, 0xf1c40f);
            this.physics.add.existing(coin);
            coin.body.setImmovable(true);
            this.coins.add(coin);

            // Rotating animation
            this.tweens.add({
                targets: coin,
                angle: 360,
                duration: 2000,
                repeat: -1,
                ease: 'Linear'
            });
        });
    }

    createTools() {
        // More tools available (4-5 tools for longer gameplay)
        const tools2025 = ['NLP Assistant', 'Computer Vision', 'Chatbot', 'Data Analyzer', 'Pattern Recognition'];
        const selectedTools = Phaser.Utils.Array.Shuffle(tools2025).slice(0, 4);

        const toolPositions = [
            { x: 350, y: 350 },
            { x: 650, y: 450 },
            { x: 850, y: 300 },
            { x: 500, y: 600 }
        ];

        selectedTools.forEach((toolName, index) => {
            const tool = this.add.rectangle(
                toolPositions[index].x,
                toolPositions[index].y,
                40,
                40,
                0x3498db
            );
            this.physics.add.existing(tool);
            tool.body.setImmovable(true);
            tool.toolName = toolName;
            this.tools.add(tool);

            // Pulsing animation
            this.tweens.add({
                targets: tool,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Label
            this.add.text(toolPositions[index].x, toolPositions[index].y + 30, toolName, {
                fontSize: '12px',
                fill: '#fff',
                fontFamily: 'Arial',
                backgroundColor: '#2a2a3e',
                padding: { x: 5, y: 2 }
            }).setOrigin(0.5);
        });
    }

    createCheckpoints() {
        // More checkpoints for longer gameplay (5 checkpoints)
        const checkpointPositions = [
            { x: 400, y: 300 },
            { x: 600, y: 250 },
            { x: 700, y: 400 },
            { x: 850, y: 350 },
            { x: 950, y: 500 }
        ];
        
        this.totalCheckpoints = checkpointPositions.length;

        checkpointPositions.forEach((pos, index) => {
            const checkpoint = this.add.circle(pos.x, pos.y, 30, 0x50c878, 0.5)
                .setStrokeStyle(3, 0x50c878);
            this.physics.add.existing(checkpoint);
            checkpoint.body.setImmovable(true);
            checkpoint.checkpointId = index;
            checkpoint.reached = false;
            this.checkpoints.add(checkpoint);

            // Label
            this.add.text(pos.x, pos.y - 40, `Checkpoint ${index + 1}`, {
                fontSize: '14px',
                fill: '#50c878',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                backgroundColor: '#2a2a3e',
                padding: { x: 5, y: 2 }
            }).setOrigin(0.5);
        });
    }

    createHUD() {
        const { width } = this.cameras.main;

        this.hudBg = this.add.rectangle(width - 200, 120, 180, 250, 0x000000, 0.7);
        this.hudBg.setStrokeStyle(2, 0xffffff);

        this.nameText = this.add.text(width - 200, 40, `Player: ${gameState.playerName}`, {
            fontSize: '16px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.coinsText = this.add.text(width - 200, 80, `Coins: ${gameState.coins}`, {
            fontSize: '18px',
            fill: '#f1c40f',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.healthText = this.add.text(width - 200, 110, `Health: ${this.playerHealth}/3`, {
            fontSize: '16px',
            fill: '#e74c3c',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.checkpointText = this.add.text(width - 200, 140, `Checkpoints: ${this.checkpointsReached}/${this.totalCheckpoints}`, {
            fontSize: '14px',
            fill: '#50c878',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.toolsText = this.add.text(width - 200, 170, 'Tools:', {
            fontSize: '14px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.toolsListText = this.add.text(width - 200, 200, 'None', {
            fontSize: '12px',
            fill: '#3498db',
            fontFamily: 'Arial',
            wordWrap: { width: 160 }
        }).setOrigin(0.5);

        this.objectiveText = this.add.text(width - 200, 230, 'Find the gate!', {
            fontSize: '14px',
            fill: '#9b59b6',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    update() {
        // Player movement with smooth acceleration
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            velocityX = -speed;
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            velocityX = speed;
        }

        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            velocityY = -speed;
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            velocityY = speed;
        }

        this.player.body.setVelocity(velocityX, velocityY);

        // Update HUD
        this.coinsText.setText(`Coins: ${gameState.coins}`);
        this.healthText.setText(`Health: ${this.playerHealth}/3`);
        this.checkpointText.setText(`Checkpoints: ${this.checkpointsReached}/${this.totalCheckpoints}`);
        const toolsList = gameState.toolsCollected2025.length > 0
            ? gameState.toolsCollected2025.join(', ')
            : 'None';
        this.toolsListText.setText(toolsList);

        // Check gate proximity
        const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.gate.x,
            this.gate.y
        );

        if (distance < 80) {
            this.gateText.setVisible(true);
            if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
                this.enterGate();
            }
        } else {
            this.gateText.setVisible(false);
        }
    }

    collectCoin(player, coin) {
        coin.destroy();
        gameState.addCoins(1);
        
        // Visual feedback
        const feedback = this.add.text(player.x, player.y - 30, '+1 Coin', {
            fontSize: '20px',
            fill: '#f1c40f',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        this.tweens.add({
            targets: feedback,
            y: feedback.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => feedback.destroy()
        });
    }

    collectTool(player, tool) {
        gameState.collectTool2025(tool.toolName);
        tool.destroy();
        
        // Show popup
        const popup = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            400,
            150,
            0x2a2a3e
        ).setStrokeStyle(3, 0x3498db);

        const popupText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            `Tool Acquired: ${tool.toolName}`,
            {
                fontSize: '24px',
                fill: '#fff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            popup.destroy();
            popupText.destroy();
        });
    }

    reachCheckpoint(player, checkpoint) {
        if (!checkpoint.reached) {
            checkpoint.reached = true;
            this.checkpointsReached++;
            checkpoint.setFillStyle(0x50c878, 1);
            
            // Show feedback
            const feedback = this.add.text(
                checkpoint.x,
                checkpoint.y - 50,
                'Checkpoint Reached!',
                {
                    fontSize: '20px',
                    fill: '#50c878',
                    fontFamily: 'Arial',
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5);
            
            this.tweens.add({
                targets: feedback,
                y: feedback.y - 30,
                alpha: 0,
                duration: 2000,
                onComplete: () => feedback.destroy()
            });
        }
    }

    hitHazard(player, hazard) {
        // Damage player
        this.playerHealth--;
        
        if (this.playerHealth <= 0) {
            // Game over - restart level
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                gameState.coins = 0;
                gameState.toolsCollected2025 = [];
                this.scene.restart();
            });
        } else {
            // Visual feedback
            this.player.setTint(0xff0000);
            this.time.delayedCall(200, () => {
                this.player.clearTint();
            });
            
            // Knockback
            const angle = Phaser.Math.Angle.Between(hazard.x, hazard.y, player.x, player.y);
            this.player.body.setVelocity(
                Math.cos(angle) * 300,
                Math.sin(angle) * 300
            );
            
            // Brief invincibility
            this.player.body.setCollideWorldBounds(false);
            this.time.delayedCall(1000, () => {
                this.player.body.setCollideWorldBounds(true);
            });
        }
    }

    checkGate(player, gate) {
        // Handled in update()
    }

    enterGate() {
        // Mark as submitted
        if (typeof window !== 'undefined') {
            localStorage.setItem('future-traveler-submitted', 'true');
        }
        
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CompletionScene');
        });
    }
}

