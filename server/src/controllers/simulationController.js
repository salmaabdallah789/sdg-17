import { calculateDecisionImpact, generateFinalSummary } from '../services/simulationService.js';

/**
 * Process a decision and return updated game state
 */
export const processDecision = (req, res) => {
  try {
    const { currentState, decision } = req.body;
    const result = calculateDecisionImpact(currentState, decision);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate final summary and strategy card
 */
export const generateSummary = (req, res) => {
  try {
    const { gameState } = req.body;
    const summary = generateFinalSummary(gameState);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

