// import { Router } from 'express';
// import { SimulationConfigController } from '../controllers/simulationConfigController.js';
// import { SimulationRunController } from '../controllers/simulationRunController.js';

// const router = Router();

// router.get('/', SimulationConfigController.getAll);
// router.get('/names', SimulationConfigController.getSimulationsNames);

// router.get('/:simulation_config_id', SimulationConfigController.getById);

// router.get('/:scenario_name', SimulationConfigController.getByName);

// router.post('/', SimulationConfigController.create);
// // router.post('/:simulation_config_id/run', SimulationRunController.runSimulation);
// router.delete('/:simulation_config_id', SimulationConfigController.delete);
// router.put('/:simulation_config_id', SimulationConfigController.update);

// export default router; 

import { Router } from 'express';
import { SimulationConfigController } from '../controllers/simulationConfigController.js';

const router = Router();

router.get('/', SimulationConfigController.getAll);
router.get('/names', SimulationConfigController.getSimulationsNames);

// תמיכה בשתי הכתובות ליתר ביטחון עבור ה-UI שלך ושלה:
router.get('/:simulation_config_id', SimulationConfigController.getById);
router.get('/name/:simulation_name', SimulationConfigController.getByName); 

router.post('/', SimulationConfigController.create);
router.delete('/:simulation_config_id', SimulationConfigController.delete);
router.put('/:simulation_config_id', SimulationConfigController.update);

export default router;