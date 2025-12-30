import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import CustomizeCharacterScene from '../games/future-traveler/scenes/CustomizeCharacterScene';
import Level2025Scene from '../games/future-traveler/scenes/Level2025Scene';
import CompletionScene from '../games/future-traveler/scenes/CompletionScene';
import { gameState } from '../games/future-traveler/state/GameState';

const FutureTravelerPage = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if already submitted
    const isSubmitted = localStorage.getItem('future-traveler-submitted') === 'true';
    if (isSubmitted) {
      // Could redirect to submission page if needed
    }

    // Initialize game state
    gameState.init();

    if (containerRef.current && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 1200,
        height: 800,
        parent: containerRef.current,
        backgroundColor: '#1a1a2e',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        },
        scene: [
          CustomizeCharacterScene,
          Level2025Scene,
          CompletionScene
        ]
      };

      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div ref={containerRef} className="border-3 border-blue-500 rounded-lg overflow-hidden shadow-2xl" />
    </div>
  );
};

export default FutureTravelerPage;
