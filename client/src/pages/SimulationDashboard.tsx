import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { apiService } from '../services/apiService';
import IndicatorPanel from '../components/IndicatorPanel';
import RoundCard from '../components/RoundCard';
import NarrativeLog from '../components/NarrativeLog';

const SimulationDashboard = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const { gameState, setGameState, makeDecision, setFinalSummary } = useGame();

  // Calculate derived values (safe even if gameState is null)
  const currentRound = gameState?.scenario?.rounds?.[gameState.currentRoundIndex];
  const isGameComplete = gameState?.scenario?.rounds 
    ? gameState.currentRoundIndex >= gameState.scenario.rounds.length 
    : false;

  // All hooks must be called before any conditional returns
  useEffect(() => {
    // Check if already submitted
    const isSubmitted = localStorage.getItem('future-decisions-submitted') === 'true';
    if (isSubmitted) {
      navigate('/submission');
      return;
    }

    // Load scenario if we don't have gameState or if scenarioId changed
    if (scenarioId && (!gameState || gameState.scenario?.id !== scenarioId)) {
      const loadScenario = async () => {
        try {
          const scenario = await apiService.getScenario(scenarioId);
          if (scenario && scenario.rounds) {
            const newGameState = {
              scenario,
              currentRoundIndex: 0,
              indicators: { ...scenario.initialIndicators },
              decisions: [],
              log: [`Started simulation: ${scenario.name}`],
              year: 2035
            };
            setGameState(newGameState);
          }
        } catch (error) {
          console.error('Error loading scenario:', error);
        }
      };
      loadScenario();
    }
  }, [scenarioId, gameState, setGameState]);

  useEffect(() => {
    if (isGameComplete && gameState) {
      const generateSummary = async () => {
        try {
          const summary = await apiService.generateSummary(gameState);
          setFinalSummary(summary);
          navigate('/summary');
        } catch (error) {
          console.error('Error generating summary:', error);
        }
      };
      generateSummary();
    }
  }, [isGameComplete, gameState, navigate, setFinalSummary]);

  // Conditional return AFTER all hooks
  if (!gameState || !gameState.scenario || !gameState.scenario.rounds) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading simulation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - Indicators */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <IndicatorPanel gameState={gameState} />
          </motion.div>

          {/* Center Panel - Current Round */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-6"
          >
            {!isGameComplete && currentRound ? (
              <RoundCard
                round={currentRound}
                onDecision={makeDecision}
                roundNumber={gameState.currentRoundIndex + 1}
                totalRounds={gameState.scenario.rounds.length}
              />
            ) : (
              <div className="card text-center">
                <p className="text-xl text-gray-600">Processing final results...</p>
              </div>
            )}
          </motion.div>

          {/* Right Panel - Narrative Log */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <NarrativeLog log={gameState.log} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SimulationDashboard;

