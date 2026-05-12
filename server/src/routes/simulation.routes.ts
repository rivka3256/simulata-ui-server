import { Router } from 'express';
import { getAllSimulations, getSimulationById, createSimulation } from '../controllers/simulation.controller.js';

const router = Router();

router.get('/', getAllSimulations);
router.post('/', createSimulation);
router.get('/:id', getSimulationById);

export default router;
