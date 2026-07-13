import { useQuery } from '@tanstack/react-query';

import { greetingResponseSchema } from '@on-t/shared';

async function getGreeting() {
  const response = await fetch('/api/greeting');

  if (!response.ok) {
    throw new Error('The API request failed.');
  }

  return greetingResponseSchema.parse(await response.json());
}

const tools = [
  ['React + Vite', 'Fast development with component-based interfaces'],
  ['Express', 'A simple and widely adopted Node.js API server'],
  ['Zod', 'Runtime validation with TypeScript type inference'],
  ['TanStack Query', 'Fetching, caching, and syncing server state'],
  ['Vitest', 'Vite-native unit and integration testing'],
  ['ESLint + Prettier', 'Consistent code quality and formatting'],
] as const;

export function App() {
  const greeting = useQuery({
    queryKey: ['greeting'],
    queryFn: getGreeting,
  });

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">ON T · TYPESCRIPT PLAYGROUND</p>
        <h1>
          One language.
          <br />
          Frontend to backend.
        </h1>
        <p className="intro">
          A small, focused workspace built with tools you will encounter in
          production. Change the code, inspect the types, and learn by testing.
        </p>
        <div className="status" aria-live="polite">
          <span className={greeting.isSuccess ? 'dot online' : 'dot'} />
          {greeting.isPending && 'Connecting to the API server...'}
          {greeting.isError && 'Unable to reach the API server.'}
          {greeting.data?.message}
        </div>
      </section>

      <section className="stack" aria-labelledby="stack-title">
        <div className="section-heading">
          <p>STARTING STACK</p>
          <h2 id="stack-title">Tools you will learn</h2>
        </div>
        <div className="grid">
          {tools.map(([name, description], index) => (
            <article key={name}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{name}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
