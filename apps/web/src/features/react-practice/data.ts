import type { LearningTopic, Principle } from './types';

export const principles = [
  {
    number: '01',
    title: 'Describe the data',
    description:
      'Start with a type. Components become easier to understand when their data has a clear shape.',
    source: 'types.ts',
  },
  {
    number: '02',
    title: 'Pass explicit props',
    description:
      'Keep component inputs small and readonly. A component should advertise exactly what it needs.',
    source: 'TypedList.tsx',
  },
  {
    number: '03',
    title: 'Own minimal state',
    description:
      'Store only values that change. Calculate totals and progress from existing state during render.',
    source: 'TopicChecklist.tsx',
  },
  {
    number: '04',
    title: 'Model every outcome',
    description:
      'Use union types for states such as idle and submitted instead of unrelated boolean flags.',
    source: 'GoalForm.tsx',
  },
] satisfies ReadonlyArray<Principle>;

export const learningTopics = [
  {
    id: 'typed-props',
    title: 'Typed props',
    description: 'Define clear inputs for reusable components.',
    difficulty: 'Beginner',
  },
  {
    id: 'state-events',
    title: 'State and events',
    description: 'Update UI safely with typed event handlers.',
    difficulty: 'Beginner',
  },
  {
    id: 'derived-state',
    title: 'Derived state',
    description: 'Calculate values instead of synchronizing duplicate state.',
    difficulty: 'Intermediate',
  },
  {
    id: 'controlled-forms',
    title: 'Controlled forms',
    description: 'Keep form values predictable and validated.',
    difficulty: 'Intermediate',
  },
] satisfies ReadonlyArray<LearningTopic>;
