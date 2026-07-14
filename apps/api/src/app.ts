import cors from 'cors';
import express from 'express';
import type { RequestHandler } from 'express';
import * as helmetModule from 'helmet';
import { pinoHttp } from 'pino-http';

import type { GreetingResponse, HealthResponse } from '@on-t/shared';

const createHelmetMiddleware =
  helmetModule.default as unknown as () => RequestHandler;

export function createApp() {
  const app = express();

  app.use(createHelmetMiddleware());
  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp());

  app.get('/api/health', (_request, response) => {
    const body: HealthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };

    response.json(body);
  });

  app.get('/api/greeting', (_request, response) => {
    const body: GreetingResponse = {
      message: 'The frontend and backend are connected with TypeScript.',
    };

    response.json(body);
  });

  return app;
}

const app = createApp();

export default app;
