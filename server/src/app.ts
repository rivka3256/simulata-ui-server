import express from 'express';
import simulationRouter from './routes/simulation.routes.js';
import runRouter from './routes/run.routes.js';
import productionRouter from './routes/production.routes.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/simulations', simulationRouter);
app.use('/api/runs', runRouter);
app.use('/api/productions', productionRouter);

export default app;
