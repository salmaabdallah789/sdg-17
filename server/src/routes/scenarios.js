import express from 'express';
import { getScenarios, getScenarioById } from '../controllers/scenarioController.js';
//test log
const router = express.Router();

router.get('/', getScenarios);
router.get('/:id', getScenarioById);

export default router;

