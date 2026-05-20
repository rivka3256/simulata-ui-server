
// import { Router } from 'express';
// import { SimulationRunController } from '../controllers/simulationRunController.js';

// const router = Router();

// // 1. הרצת סימולציה חדשה (מקבלת מזהה קונפיגורציה ומריצה)
// router.post('/simulations/:simulation_config_id/run', SimulationRunController.runSimulation);

// // 2. הבאת כל הרישות שקיימות במערכת (לדאשבורד הכללי למשל)
// router.get('/', SimulationRunController.getAll);

// // 3. הבאת *כל* הריצות של סימולציה ספציפית (לפי מזהה קונפיגורציה)
// // שים לב: כאן הפרמטר בנתיב תואם בדיוק למה שהפונקציה מצפה לקבל (simulation_config_id)
// router.get('/simulation/:simulation_config_id', SimulationRunController.getBySimulationId);

// // 4. הבאת מופע ריצה *אחד ספציפי* (בשביל ה-Polling והעדכון הדינמי)
// // הראוט הכללי עם הפרמטר (:) תמיד צריך להיות בסוף כדי שלא יתפוס נתיבים סטטיים
// router.get('/:simulation_run_id', SimulationRunController.getOneById);

// // 5. עצירת ריצה ספציפית
// router.post('/:simulation_run_id/stop', SimulationRunController.stopSimulation);

// export default router;

import { Router } from 'express';
import { SimulationRunController } from '../controllers/simulationRunController.js';

const router = Router();

router.get('/', SimulationRunController.getAll);
router.get('/simulation/:simulation_config_id', SimulationRunController.getBySimulationId);
router.get('/name/:simulation_name', SimulationRunController.getBySimulationName);
router.get('/status/:status', SimulationRunController.getBySimulationByStatus);

// תמיכה בשני הדרכים להרצה - גם ב-body וגם בנתיב הישן שלך
router.post('/run', SimulationRunController.runSimulation);
router.post('/simulations/:simulation_config_id/run', SimulationRunController.runSimulation);

// 🌟 הראוטים הקריטיים של ה-UI שלך שהחזרתי לחיים:
router.get('/:simulation_run_id', SimulationRunController.getOneById);
router.post('/:simulation_run_id/stop', SimulationRunController.stopSimulation);

export default router;