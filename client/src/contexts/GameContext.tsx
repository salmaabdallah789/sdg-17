import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, Scenario, Decision, FinalSummary } from '../types/game';
import { apiService } from '../services/apiService';

interface GameContextType {
  gameState: GameState | null;
  setGameState: (state: GameState | null) => void;
  startGame: (scenario: Scenario) => void;
  makeDecision: (decision: Decision) => void;
  finalSummary: FinalSummary | null;
  setFinalSummary: (summary: FinalSummary | null) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [finalSummary, setFinalSummary] = useState<FinalSummary | null>(null);

  const startGame = (scenario: Scenario) => {
    const newGameState: GameState = {
      scenario,
      currentRoundIndex: 0,
      indicators: { ...scenario.initialIndicators },
      decisions: [],
      log: [`Started simulation: ${scenario.name}`],
      year: 2035
    };
    setGameState(newGameState);
  };

  const makeDecision = async (decision: Decision) => {
    if (!gameState) return;

    try {
      const result = await apiService.processDecision({
        currentState: gameState,
        decision
      });

      const updatedState = {
        ...result.updatedState,
        currentRoundIndex: gameState.currentRoundIndex + 1
      };

      setGameState(updatedState);
    } catch (error) {
      console.error('Error processing decision:', error);
    }
  };

  const resetGame = () => {
    setGameState(null);
    setFinalSummary(null);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        startGame,
        makeDecision,
        finalSummary,
        setFinalSummary,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

