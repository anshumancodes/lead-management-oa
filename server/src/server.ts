import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';
import logger from './common/logger/index.js';

const start = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('MongoDB connected');

    app.listen(env.PORT, () => {
      logger.info(`server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
    });
  } catch (err) {
    logger.error('Startup error:', err);
    process.exit(1);
  }
};

start();
