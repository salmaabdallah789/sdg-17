import { scenarios } from '../models/scenarios.js';

/**
 * Get all scenarios (summary list)
 */
export const getAllScenarios = () => {
  return scenarios.map(scenario => ({
    id: scenario.id,
    name: scenario.name,
    description: scenario.description,
    challenges: scenario.challenges,
    thumbnail: scenario.thumbnail
  }));
};

/**
 * Get full scenario details by ID
 */
export const getScenario = (id) => {
  return scenarios.find(s => s.id === id);
};

