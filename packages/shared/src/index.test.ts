import { healthResponseSchema } from './index.js';

describe('healthResponseSchema', () => {
  it('accepts a valid health response', () => {
    const result = healthResponseSchema.safeParse({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });

    expect(result.success).toBe(true);
  });
});
