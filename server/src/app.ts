import express from 'express';
import apiRoutes from './routes/indexRouter.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

export default app;
