import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string().datetime(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const greetingResponseSchema = z.object({
  message: z.string(),
});

export type GreetingResponse = z.infer<typeof greetingResponseSchema>;
