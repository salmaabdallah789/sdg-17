import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import StrategyCard from '../components/StrategyCard';

const FinalSummary = () => {
  const navigate = useNavigate();
  const { finalSummary, resetGame } = useGame();

  useEffect(() => {
    if (!finalSummary) {
      navigate('/');
    }
  }, [finalSummary, navigate]);

  if (!finalSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading summary...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            You didn't finish the game. You navigated a future.
          </h1>
          <p className="text-2xl text-gray-600">
            Here's how your community is doing in 2040.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-8">
          <StrategyCard summary={finalSummary} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-br from-secondary-50 to-primary-50 border-2 border-secondary-200 mt-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Your Journey is Complete!</h3>
            <p className="text-gray-600 mb-6 text-center">
              You've navigated through all scenarios in 2035. Now it's time to reflect on your experience and write your proposal.
            </p>
            
            <div className="bg-white rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-800 mb-4">What to Include in Your Proposal:</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Reflect on the AI tools you used and their impact</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Discuss the ethical dilemmas you faced</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Propose how AI can be used responsibly for social impact</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2">•</span>
                  <span>Share lessons learned from your decisions</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/proposal')}
                className="btn-primary text-lg px-8 py-4"
              >
                Write Your Proposal →
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default FinalSummary;

