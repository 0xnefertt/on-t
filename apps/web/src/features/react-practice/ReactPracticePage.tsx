import Link from 'next/link';

import { ApiStatus } from './components/ApiStatus';
import { CounterExercise } from './components/CounterExercise';
import { GoalForm } from './components/GoalForm';
import { TopicChecklist } from './components/TopicChecklist';
import { TypedList } from './components/TypedList';
import { learningTopics, principles } from './data';
import styles from './ReactPracticePage.module.css';

export function ReactPracticePage() {
  return (
    <main>
      <header className={styles.siteHeader}>
        <a
          className={styles.brand}
          href="#top"
          aria-label="On T React Lab home"
        >
          ON T <span>/ REACT LAB</span>
        </a>
        <nav aria-label="Practice sections">
          <a href="#principles">Principles</a>
          <a href="#exercises">Exercises</a>
          <a href="#source-map">Source map</a>
          <Link href="/web3">Web3 lab</Link>
        </nav>
      </header>

      <section className={styles.hero} id="top">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>REACT + TYPESCRIPT · PRACTICE 001</p>
          <h1 aria-label="Learn React by changing it">
            Learn React
            <br />
            by changing it.
          </h1>
          <p className={styles.heroIntro}>
            Three small exercises. Real state, real events, real types. Read the
            source, change one rule, and let TypeScript explain the result.
          </p>
          <a className={styles.heroAction} href="#exercises">
            Start with state <span aria-hidden="true">↓</span>
          </a>
        </div>

        <aside className={styles.codePanel} aria-label="TypeScript example">
          <div className={styles.codePanelHeader}>
            <span>TopicChecklist.tsx</span>
            <span>TYPE SAFE</span>
          </div>
          <pre>
            <code>{`type Props = Readonly<{
  topics: readonly LearningTopic[];
}>;

const [completedIds, setCompletedIds] =
  useState<Set<string>>(() => new Set());

const progress = Math.round(
  (completedIds.size / topics.length) * 100,
);`}</code>
          </pre>
          <p>
            The compiler checks the shape. React keeps the interface in sync.
          </p>
        </aside>
      </section>

      <section className={styles.stats} aria-label="Course summary">
        <div>
          <strong>03</strong>
          <span>interactive exercises</span>
        </div>
        <div>
          <strong>04</strong>
          <span>core patterns</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>strict TypeScript</span>
        </div>
        <div>
          <strong>0</strong>
          <span>uses of any</span>
        </div>
      </section>

      <section className={styles.principlesSection} id="principles">
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>READ IN THIS ORDER</p>
          <h2>Four habits before four hooks.</h2>
          <p>
            Good React starts with a clear data model. Hooks become much easier
            after the component boundaries and state ownership are correct.
          </p>
        </div>

        <TypedList
          className={styles.principleList}
          items={principles}
          getKey={(principle) => principle.number}
          renderItem={(principle) => (
            <article className={styles.principleCard}>
              <span>{principle.number}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
              <code>{principle.source}</code>
            </article>
          )}
        />
      </section>

      <section className={styles.exercisesSection} id="exercises">
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>CHANGE THE VALUES</p>
          <h2>Practice in the browser. Verify in the source.</h2>
          <p>
            Each interaction demonstrates one React pattern and one TypeScript
            pattern. Open the filename shown in each panel while you use it.
          </p>
        </div>

        <div className={styles.exerciseGrid}>
          <CounterExercise />
          <TopicChecklist topics={learningTopics} />
          <GoalForm />
        </div>
      </section>

      <section className={styles.sourceSection} id="source-map">
        <div>
          <p className={styles.kicker}>SOURCE MAP</p>
          <h2>Follow the data, not the folders.</h2>
        </div>
        <ol className={styles.sourceSteps}>
          <li>
            <span>1</span>
            <div>
              <code>types.ts</code>
              <p>Learn the data shapes and literal unions first.</p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <code>data.ts</code>
              <p>See how satisfies checks data without losing inference.</p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <code>components/*.tsx</code>
              <p>Trace props into state, event handlers, and rendered UI.</p>
            </div>
          </li>
          <li>
            <span>4</span>
            <div>
              <code>ReactPracticePage.tsx</code>
              <p>See how small components compose into one route.</p>
            </div>
          </li>
        </ol>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>ON T / REACT LAB</strong>
          <p>Read it. Change it. Break the type. Fix the model.</p>
        </div>
        <ApiStatus />
      </footer>
    </main>
  );
}
