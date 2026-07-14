import { z } from 'zod';

import app from './app.js';

const environmentSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
});

const environment = environmentSchema.parse(process.env);

app.listen(environment.PORT, () => {
  console.log(`API server is running at http://localhost:${environment.PORT}`);
});
