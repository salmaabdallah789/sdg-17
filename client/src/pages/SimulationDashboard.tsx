import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useGame } from '../contexts/GameContext';
import { apiService } from '../services/apiService';
import IndicatorPanel from '../components/IndicatorPanel';
import RoundCard from '../components/RoundCard';
import NarrativeLog from '../components/NarrativeLog';

const SimulationDashboard = () => {
  const navigate = useNavigate();
  const { 
    gameState, 
    setGameState, 
    makeDecision, 
    setFinalSummary,
    allScenarios,
    setAllScenarios,
    currentScenarioIndex,
    setCurrentScenarioIndex,
    completedScenarios,
    setCompletedScenarios
  } = useGame();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScenarioTransition, setShowScenarioTransition] = useState(false);

  // Calculate derived values (safe even if gameState is null)
  const currentRound = gameState?.scenario?.rounds?.[gameState.currentRoundIndex];
  const isScenarioComplete = gameState?.scenario?.rounds 
    ? gameState.currentRoundIndex >= gameState.scenario.rounds.length 
    : false;
  const isAllScenariosComplete = allScenarios.length > 0 && currentScenarioIndex >= allScenarios.length;

  // Load all scenarios on mount - simplified logic
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const loadScenarios = async () => {
      try {
        console.log('🔄 Loading scenarios from:', `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/scenarios`);
        setLoading(true);
        setError(null);
        
        // First, test if server is reachable
        try {
          const healthCheck = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/health`, { timeout: 3000 });
          console.log('✅ Server is reachable:', healthCheck.data);
        } catch (healthError) {
          console.warn('⚠️ Health check failed, but continuing...');
        }
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Request timeout - server may not be running')), 8000);
        });
        
        const scenariosPromise = apiService.getScenarios();
        const scenarios = await Promise.race([scenariosPromise, timeoutPromise]) as any;
        
        clearTimeout(timeoutId);
        
        if (!mounted) {
          console.log('Component unmounted, aborting');
          return;
        }
        
        console.log('✅ Scenarios loaded:', scenarios?.length || 0, 'scenarios');
        
        if (!scenarios || scenarios.length === 0) {
          throw new Error('No scenarios found in response');
        }
        
        setAllScenarios(scenarios);
        
        // Always initialize first scenario if we don't have gameState
        if (!gameState && scenarios.length > 0) {
          console.log('🎮 Initializing first scenario:', scenarios[0].name);
          const firstScenario = scenarios[0];
          const newGameState = {
            scenario: firstScenario,
            currentRoundIndex: 0,
            indicators: { ...firstScenario.initialIndicators },
            decisions: [],
            log: [`Started simulation: ${firstScenario.name}`],
            year: 2035
          };
          setGameState(newGameState);
          setCurrentScenarioIndex(0);
          console.log('✅ Game state initialized');
        }
        
        setLoading(false);
        console.log('✅ Loading complete - ready to play!');
      } catch (error: any) {
        clearTimeout(timeoutId);
        console.error('❌ Error loading scenarios:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status
        });
        
        if (mounted) {
          let errorMessage = 'Failed to load scenarios.';
          if (error.message?.includes('timeout') || error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
            errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
          } else if (error.response?.status === 404) {
            errorMessage = 'API endpoint not found. Check server routes.';
          } else if (error.response?.status >= 500) {
            errorMessage = 'Server error. Check server logs.';
          } else {
            errorMessage = error.message || errorMessage;
          }
          setError(errorMessage);
          setLoading(false);
        }
      }
    };
    
    // Always load scenarios on mount
    loadScenarios();
    
    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle scenario completion
  useEffect(() => {
    if (isScenarioComplete && gameState && !showScenarioTransition && allScenarios.length > 0) {
      const handleScenarioComplete = async () => {
        // Mark scenario as completed
        const updatedCompleted = completedScenarios.includes(gameState.scenario.id)
          ? completedScenarios
          : [...completedScenarios, gameState.scenario.id];
        setCompletedScenarios(updatedCompleted);

        // Check if there are more scenarios
        if (currentScenarioIndex < allScenarios.length - 1) {
          // Show transition to next scenario
          setShowScenarioTransition(true);
          
          // After transition animation, load next scenario
          setTimeout(() => {
            const nextIndex = currentScenarioIndex + 1;
            const nextScenario = allScenarios[nextIndex];
            
            const newGameState = {
              scenario: nextScenario,
              currentRoundIndex: 0,
              indicators: { ...nextScenario.initialIndicators },
              decisions: [],
              log: [`Started simulation: ${nextScenario.name}`],
              year: 2035
            };
            
            setGameState(newGameState);
            setCurrentScenarioIndex(nextIndex);
            setShowScenarioTransition(false);
          }, 3000);
        } else {
          // All scenarios complete - generate final summary
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
      };
      
      handleScenarioComplete();
    }
  }, [isScenarioComplete, gameState, currentScenarioIndex, allScenarios.length, completedScenarios, showScenarioTransition, navigate, setFinalSummary, setCompletedScenarios, setCurrentScenarioIndex, setGameState]);

  // Conditional return AFTER all hooks
  // Show loading if: loading is true OR we don't have gameState/scenario/rounds
  const shouldShowLoading = loading || !gameState || !gameState.scenario || !gameState.scenario.rounds || gameState.scenario.rounds.length === 0;
  
  if (shouldShowLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md px-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🌍
          </motion.div>
          <div className="text-xl text-white mb-4">Loading simulation...</div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/50 border border-red-500 rounded-lg p-6 mt-4 max-w-md"
            >
              <p className="text-red-200 text-sm mb-3 font-semibold">⚠️ Connection Error</p>
              <p className="text-red-300 text-xs mb-4">{error}</p>
              <div className="bg-red-950/50 rounded p-3 mb-4">
                <p className="text-red-200 text-xs font-semibold mb-2">To fix this:</p>
                <ol className="text-red-300 text-xs list-decimal list-inside space-y-1">
                  <li>Open a terminal in the project root</li>
                  <li>Navigate to the server folder: <code className="bg-red-900/50 px-1 rounded">cd server</code></li>
                  <li>Run: <code className="bg-red-900/50 px-1 rounded">npm start</code></li>
                  <li>Wait for "Server running on http://localhost:5000"</li>
                  <li>Then refresh this page</li>
                </ol>
              </div>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  window.location.reload();
                }}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
              >
                Retry Connection
              </button>
            </motion.div>
          )}
          {!error && (
            <div className="text-blue-300 text-sm mt-4">
              <p>Checking server connection...</p>
              <p className="text-xs mt-2 opacity-75">If this takes too long, check the browser console (F12) for errors</p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Show scenario transition
  if (showScenarioTransition && currentScenarioIndex < allScenarios.length - 1) {
    const nextScenario = allScenarios[currentScenarioIndex + 1];
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl px-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-8xl mb-8"
          >
            ⏳
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Scenario Complete!
          </h2>
          <p className="text-xl text-blue-200 mb-6">
            Preparing next challenge...
          </p>
          {nextScenario && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-slate-800/50 rounded-lg p-6 border border-cyan-500/30"
            >
              <div className="text-6xl mb-4">{nextScenario.thumbnail}</div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-2">
                Next: {nextScenario.name}
              </h3>
              <p className="text-blue-200">{nextScenario.description}</p>
            </motion.div>
          )}
        </motion.div>
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
            {/* Scenario Header */}
            <div className="card mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{gameState.scenario.thumbnail}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {gameState.scenario.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Scenario {currentScenarioIndex + 1} of {allScenarios.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!isScenarioComplete && currentRound ? (
              <RoundCard
                round={currentRound}
                onDecision={makeDecision}
                roundNumber={gameState.currentRoundIndex + 1}
                totalRounds={gameState.scenario.rounds.length}
              />
            ) : (
              <div className="card text-center">
                <p className="text-xl text-gray-600">Processing results...</p>
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

