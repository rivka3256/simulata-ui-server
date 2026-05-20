import { Router } from 'express';
import { SystemController } from '../controllers/systemController.js';

const router = Router();

router.get('/', SystemController.getAll);

export default router;