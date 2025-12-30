import { scenarios } from '../models/scenarios.js';

/**
 * Get all scenarios (full data needed for game)
 */
export const getAllScenarios = () => {
  // Return full scenario data including initialIndicators and rounds
  return scenarios;
};

/**
 * Get full scenario details by ID
 */
export const getScenario = (id) => {
  return scenarios.find(s => s.id === id);
};

