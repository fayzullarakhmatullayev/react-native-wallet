import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import { initDB } from './config/db.js';
import rateLimiterMiddleware from './middleware/rate-limiter.middleware.js';
import transactionsRoute from './routes/transactions.route.js';

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(rateLimiterMiddleware);
app.use(express.json());
const PORT = process.env.PORT || 5001;

// Routes
app.use('/api/transactions', transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server started on http://localhost:${PORT}`));
});
