import { getAllScenarios, getScenario } from '../services/scenarioService.js';

/**
 * Get all available scenarios
 */
export const getScenarios = (req, res) => {
  try {
    const scenarios = getAllScenarios();
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a specific scenario by ID
 */
export const getScenarioById = (req, res) => {
  try {
    const scenario = getScenario(req.params.id);
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    res.json(scenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

