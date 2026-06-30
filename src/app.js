import express from 'express';
import recommendationRoutes from './modules/recommendation/recommendation.routes.js';

const app = express();

app.use(express.json());
app.use('/api/recommendations', recommendationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
