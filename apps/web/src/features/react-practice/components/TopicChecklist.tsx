'use client';

import { useState } from 'react';

import type { LearningTopic } from '../types';
import styles from '../ReactPracticePage.module.css';

type TopicChecklistProps = Readonly<{
  topics: readonly LearningTopic[];
}>;

export function TopicChecklist({ topics }: TopicChecklistProps) {
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(
    () => new Set(),
  );

  const completedCount = completedTopicIds.size;
  const progress =
    topics.length === 0
      ? 0
      : Math.round((completedCount / topics.length) * 100);

  const toggleTopic = (topicId: LearningTopic['id']) => {
    setCompletedTopicIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(topicId)) {
        nextIds.delete(topicId);
      } else {
        nextIds.add(topicId);
      }

      return nextIds;
    });
  };

  return (
    <section className={styles.exercise} aria-labelledby="checklist-title">
      <div className={styles.exerciseHeader}>
        <div>
          <p className={styles.kicker}>EXERCISE 02 · derived state</p>
          <h2 id="checklist-title">Track what you understand</h2>
        </div>
        <code>TopicChecklist.tsx</code>
      </div>

      <div className={styles.progressSummary}>
        <span>
          {completedCount} of {topics.length} complete
        </span>
        <strong>{progress}%</strong>
      </div>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Learning progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <ul className={styles.checklist}>
        {topics.map((topic) => {
          const isCompleted = completedTopicIds.has(topic.id);

          return (
            <li key={topic.id}>
              <label className={styles.checklistItem}>
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => toggleTopic(topic.id)}
                />
                <span>
                  <strong>{topic.title}</strong>
                  <small>{topic.description}</small>
                </span>
                <em>{topic.difficulty}</em>
              </label>
            </li>
          );
        })}
      </ul>

      <p className={styles.note}>
        Progress is derived from the Set. There is no second progress state to
        keep synchronized.
      </p>
    </section>
  );
}
