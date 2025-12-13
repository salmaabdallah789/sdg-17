import express from 'express';
import { processDecision, generateSummary } from '../controllers/simulationController.js';

const router = express.Router();

router.post('/decision', processDecision);
router.post('/summary', generateSummary);

export default router;

