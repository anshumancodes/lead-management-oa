import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { requestLogger } from './common/middlewares/request.js';
import { responseMiddleware } from './common/middlewares/response.js';
import { errorHandler } from './common/middlewares/error.js';

const app = express();

//Core middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

//Custom middlewares
app.use(requestLogger);
app.use(responseMiddleware);

// Routes 
// import userRouter from './routes/user.route.js';
// app.use('/api/v1/user', userRouter);

// Error handler (must be last)
app.use(errorHandler);

export default app;
