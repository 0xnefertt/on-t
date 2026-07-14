'use client';

import { useQuery } from '@tanstack/react-query';

import { greetingResponseSchema } from '@on-t/shared';

import styles from '../ReactPracticePage.module.css';

async function getGreeting() {
  const response = await fetch('/api/greeting');

  if (!response.ok) {
    throw new Error('The API request failed.');
  }

  return greetingResponseSchema.parse(await response.json());
}

export function ApiStatus() {
  const greeting = useQuery({
    queryKey: ['greeting'],
    queryFn: getGreeting,
  });

  return (
    <div className={styles.apiStatus} aria-live="polite">
      <span
        className={greeting.isSuccess ? styles.statusOnline : styles.statusDot}
      />
      <div>
        <small>FULL-STACK CHECK</small>
        {greeting.isPending && <strong>Connecting to Express...</strong>}
        {greeting.isError && <strong>Express API is offline.</strong>}
        {greeting.data && <strong>{greeting.data.message}</strong>}
      </div>
    </div>
  );
}
