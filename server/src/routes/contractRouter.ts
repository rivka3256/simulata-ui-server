import { Router } from 'express';
import { ContractController } from '../controllers/contractController.js';

const router = Router();

router.get('/', ContractController.getAll);
router.get('/system/:system_id', ContractController.getBySystemId);

export default router;