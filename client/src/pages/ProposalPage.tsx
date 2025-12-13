import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

const ProposalPage = () => {
  const navigate = useNavigate();
  const { finalSummary, gameState, resetGame } = useGame();
  const [proposal, setProposal] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load saved proposal from localStorage if exists
  useEffect(() => {
    const scenarioId = gameState?.scenario?.id || finalSummary?.scenario?.name?.toLowerCase().replace(/\s+/g, '-') || 'default';
    const savedProposal = localStorage.getItem(`proposal-${scenarioId}`);
    if (savedProposal) {
      setProposal(savedProposal);
    }
  }, [gameState, finalSummary]);

  // Auto-save to localStorage (debounced)
  useEffect(() => {
    if (gameState && proposal.trim()) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`proposal-${gameState.scenario.id}`, proposal);
      }, 1000); // Save 1 second after user stops typing
      
      return () => clearTimeout(timeoutId);
    }
  }, [proposal, gameState]);

  const handleSave = () => {
    const scenarioId = gameState?.scenario?.id || finalSummary?.scenario?.name?.toLowerCase().replace(/\s+/g, '-') || 'default';
    localStorage.setItem(`proposal-${scenarioId}`, proposal);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExport = () => {
    if (!proposal.trim()) {
      alert('Please write your proposal before exporting.');
      return;
    }

    const content = `
AI & Social Impact Proposal - SDG 17 Simulation

Scenario: ${finalSummary?.scenario.name || 'Unknown'}
Date: ${new Date().toLocaleDateString()}

${proposal}

---
Generated from SDG 17: Future Decisions Simulation
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SDG17-Proposal-${finalSummary?.scenario.name.replace(/\s+/g, '-') || 'proposal'}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (!proposal.trim()) {
      alert('Please write your proposal before submitting.');
      return;
    }

    // Save submission data (matching Build-Break-Fix structure)
    const scenarioData = {
      id: gameState?.scenario?.id || finalSummary?.scenario?.id || 'unknown',
      name: finalSummary?.scenario.name || gameState?.scenario?.name || 'Unknown',
      scores: finalSummary?.scores || {},
      indicators: finalSummary?.finalIndicators || {},
      decisions: gameState?.decisions || []
    };
    
    const submissionData = {
      game: 'future-decisions',
      proposal: proposal,
      scenarios: [scenarioData], // Array of completed scenarios (like Build-Break-Fix rounds)
      currentScenario: gameState?.scenario?.id || finalSummary?.scenario?.id || null,
      totalScenarios: 2, // Update this if more scenarios are added
      challengesCompleted: 1, // Can submit after any scenario
      timestamp: new Date().toISOString(),
      scores: finalSummary?.scores || {},
      indicators: finalSummary?.finalIndicators || {}
    };

    // Mark as submitted
    localStorage.setItem('future-decisions-submitted', 'true');
    localStorage.setItem('future-decisions-submission', JSON.stringify(submissionData));

    // Navigate to submission confirmation
    navigate('/submission');
  };

  if (!finalSummary && !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">No simulation data found. Please complete a scenario first.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Write Your Proposal
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Reflect on your experience and propose how AI can be used responsibly for social impact
          </p>
          {finalSummary && (
            <p className="text-sm text-gray-500">
              Scenario: <span className="font-semibold">{finalSummary.scenario.name}</span>
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Guiding Questions</h2>
          <div className="space-y-3 text-gray-700">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="font-semibold mb-2">🤖 AI & Technology:</p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                <li>What AI tools did you use and how did they help or hinder your decisions?</li>
                <li>What are the limitations and biases you observed in AI systems?</li>
                <li>How can AI be designed to be more inclusive and fair?</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="font-semibold mb-2">🌍 Social Impact & SDGs:</p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                <li>How did your decisions affect different groups in the community?</li>
                <li>What trade-offs did you face between efficiency and equity?</li>
                <li>How can technology support sustainable development goals without leaving anyone behind?</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="font-semibold mb-2">⚖️ Ethics & Responsibility:</p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                <li>What ethical dilemmas did you encounter?</li>
                <li>How did you balance privacy, safety, and inclusion?</li>
                <li>What principles should guide AI deployment in public services?</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="font-semibold mb-2">💡 Your Proposal:</p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                <li>Based on your experience, propose a framework or guidelines for using AI in social impact projects</li>
                <li>What would you do differently? What worked well?</li>
                <li>How can communities be better involved in AI decision-making?</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="mb-4">
            <label htmlFor="proposal" className="block text-lg font-semibold text-gray-800 mb-2">
              Your Proposal
            </label>
            <textarea
              id="proposal"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Write your proposal here... Reflect on your experience, the AI tools you used, the social impact of your decisions, and propose how AI can be used responsibly for sustainable development goals."
              className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none resize-y text-gray-700 leading-relaxed"
            />
            <div className="mt-2 text-sm text-gray-500">
              {proposal.length} characters
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="btn-primary"
            >
              {saved ? '✓ Saved!' : 'Save Draft'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              disabled={!proposal.trim()}
              className="btn-secondary"
            >
              {copied ? '✓ Copied!' : 'Copy Text'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              disabled={!proposal.trim()}
              className="btn-secondary"
            >
              Export as .txt
            </motion.button>
          </div>
        </motion.div>

        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/summary')}
            className="btn-secondary"
          >
            ← Back to Summary
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!proposal.trim()}
            className="btn-primary"
          >
            Submit Proposal
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProposalPage;

