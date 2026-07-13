import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { healthResponseSchema } from '@on-t/shared';

import { createApp } from './app.js';

describe('API', () => {
  it('returns a valid health response', async () => {
    const response = await request(createApp()).get('/api/health').expect(200);

    expect(healthResponseSchema.parse(response.body).status).toBe('ok');
  });

  it('returns a greeting', async () => {
    const response = await request(createApp())
      .get('/api/greeting')
      .expect(200);

    expect(response.body.message).toContain('TypeScript');
  });
});
