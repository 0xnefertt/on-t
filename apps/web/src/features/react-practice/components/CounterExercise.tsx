'use client';

import { useState } from 'react';

import styles from '../ReactPracticePage.module.css';

const MINIMUM_COUNT = 0;

export function CounterExercise() {
  const [count, setCount] = useState<number>(0);

  const decrease = () => {
    setCount((currentCount) => Math.max(MINIMUM_COUNT, currentCount - 1));
  };

  const increase = () => {
    setCount((currentCount) => currentCount + 1);
  };

  return (
    <section className={styles.exercise} aria-labelledby="counter-title">
      <div className={styles.exerciseHeader}>
        <div>
          <p className={styles.kicker}>EXERCISE 01 · useState&lt;number&gt;</p>
          <h2 id="counter-title">State changes the screen</h2>
        </div>
        <code>CounterExercise.tsx</code>
      </div>

      <div className={styles.counterDemo}>
        <button
          className={styles.secondaryButton}
          type="button"
          onClick={decrease}
          disabled={count === MINIMUM_COUNT}
          aria-label="Decrease count"
        >
          −
        </button>
        <output className={styles.counterValue} aria-live="polite">
          {count}
        </output>
        <button
          className={styles.primaryButton}
          type="button"
          onClick={increase}
          aria-label="Increase count"
        >
          +
        </button>
      </div>

      <p className={styles.note}>
        Notice the functional update: the next value is calculated from the
        current value instead of reading a stale closure.
      </p>
    </section>
  );
}
