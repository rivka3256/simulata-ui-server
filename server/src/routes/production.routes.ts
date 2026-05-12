import { Router } from 'express';
import { getAllProductions, getProductionById } from '../controllers/production.controller.js';

const router = Router();

router.get('/', getAllProductions);
router.get('/:id', getProductionById);

export default router;
