import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { env } from './config/env.js';
import { requestLogger } from './common/middlewares/request.js';
import { responseMiddleware } from './common/middlewares/response.js';
import { errorHandler } from './common/middlewares/error.js';

import authRouter from './routes/auth.route.js';
import leadsRouter from './routes/leads.route.js';

const app = express();

//Security 
app.use(helmet());

// Core middlewares
app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Custom middlewares
app.use(requestLogger);
app.use(responseMiddleware);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth',  authRouter);
app.use('/api/v1/leads', leadsRouter);

// 404 handler 
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

export default app;
