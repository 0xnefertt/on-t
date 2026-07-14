'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';

import { focusAreas, type FocusArea, type LearningGoal } from '../types';
import styles from '../ReactPracticePage.module.css';

type SubmissionState =
  | Readonly<{ status: 'idle' }>
  | Readonly<{ status: 'submitted'; goal: LearningGoal }>;

const initialGoal: LearningGoal = {
  title: '',
  focus: 'Components',
  minutesPerDay: 30,
};

function isFocusArea(value: string): value is FocusArea {
  return focusAreas.some((focusArea) => focusArea === value);
}

export function GoalForm() {
  const [goal, setGoal] = useState<LearningGoal>(initialGoal);
  const [submission, setSubmission] = useState<SubmissionState>({
    status: 'idle',
  });

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGoal((currentGoal) => ({
      ...currentGoal,
      title: event.target.value,
    }));
  };

  const handleFocusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextFocus = event.target.value;

    if (!isFocusArea(nextFocus)) {
      return;
    }

    setGoal((currentGoal) => ({
      ...currentGoal,
      focus: nextFocus,
    }));
  };

  const handleMinutesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGoal((currentGoal) => ({
      ...currentGoal,
      minutesPerDay: event.target.valueAsNumber,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmission({ status: 'submitted', goal });
  };

  return (
    <section className={styles.exercise} aria-labelledby="form-title">
      <div className={styles.exerciseHeader}>
        <div>
          <p className={styles.kicker}>EXERCISE 03 · typed events</p>
          <h2 id="form-title">Build a controlled form</h2>
        </div>
        <code>GoalForm.tsx</code>
      </div>

      <form className={styles.goalForm} onSubmit={handleSubmit}>
        <label>
          <span>Learning goal</span>
          <input
            type="text"
            value={goal.title}
            onChange={handleTitleChange}
            placeholder="Build a typed task list"
            required
          />
        </label>

        <div className={styles.formRow}>
          <label>
            <span>Focus area</span>
            <select value={goal.focus} onChange={handleFocusChange}>
              {focusAreas.map((focusArea) => (
                <option key={focusArea} value={focusArea}>
                  {focusArea}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Minutes per day</span>
            <input
              type="number"
              min={10}
              max={180}
              step={5}
              value={goal.minutesPerDay}
              onChange={handleMinutesChange}
              required
            />
          </label>
        </div>

        <button className={styles.submitButton} type="submit">
          Save learning plan
        </button>
      </form>

      {submission.status === 'submitted' && (
        <div className={styles.formResult} role="status">
          <span>PLAN SAVED</span>
          <strong>{submission.goal.title}</strong>
          <p>
            {submission.goal.minutesPerDay} minutes of{' '}
            {submission.goal.focus.toLowerCase()} practice every day.
          </p>
        </div>
      )}

      <p className={styles.note}>
        The union type makes the submitted goal available only when the status
        is submitted.
      </p>
    </section>
  );
}
