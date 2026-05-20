import { Router } from 'express';
import { DataComponentController } from '../controllers/dataComponentController.js';

const router = Router();

// הבאת כל ה-Readers וה-Writers יחד לפי מזהה מילון (Contract)
router.get('/contract/:contract_config_id', DataComponentController.getComponentsByContractId);

// עדכון קונפיגורציה של רכיב (מקבל סוג DR/DW ומזהה רכיב)
router.put('/:component_type/:component_id', DataComponentController.updateConfig);

export default router;