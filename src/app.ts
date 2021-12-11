import express from 'express';
import cors from 'cors';
import healthRouter from './routes/healthRouter';
import questionRouter from './routes/questionsRouter';

const app = express();

app.use(cors());
app.use(express.json());
app.use(healthRouter);
app.use(questionRouter);

export default app;
