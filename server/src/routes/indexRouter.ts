import { Router } from 'express';
import systemRoutes from './systemRouter.js';
import contractRoutes from './contractRouter.js';
// import dataReaderRoutes from './dataReaderRouter.js';
// import dataWriterRoutes from './dataWriterRouter.js';
import simulationConfigRoutes from './simulationConfigRouter.js';
import simulationRunRoutes from './simulationRunRouter.js';
import abcVersionRoutes from './abcVersionRouter.js';
import dataComponentRoutes from './dataComponentRouter.js';

const router = Router();

router.use('/systems', systemRoutes);
router.use('/contracts', contractRoutes);
// router.use('/data-readers', dataReaderRoutes);
// router.use('/data-writers', dataWriterRoutes);
router.use('/simulations', simulationConfigRoutes);
router.use('/runs', simulationRunRoutes);
router.use('/abc-versions', abcVersionRoutes);
router.use('/components', dataComponentRoutes);

export default router;