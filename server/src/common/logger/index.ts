import { format } from 'date-fns';

const ts = () => format(new Date(), 'yyyy-MM-dd HH:mm:ss');

export const logger = {
  info:  (...args: unknown[]) => console.log (`[INFO  ${ts()}]`, ...args),
  error: (...args: unknown[]) => console.error(`[ERROR ${ts()}]`, ...args),
  warn:  (...args: unknown[]) => console.warn (`[WARN  ${ts()}]`, ...args),
  debug: (...args: unknown[]) => console.debug(`[DEBUG ${ts()}]`, ...args),
};

export default logger;
