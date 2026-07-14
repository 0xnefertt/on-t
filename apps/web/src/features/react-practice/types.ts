export const focusAreas = [
  'Components',
  'State',
  'Forms',
  'Data fetching',
] as const;

export type FocusArea = (typeof focusAreas)[number];

export type Difficulty = 'Beginner' | 'Intermediate';

export type LearningTopic = Readonly<{
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
}>;

export type LearningGoal = Readonly<{
  title: string;
  focus: FocusArea;
  minutesPerDay: number;
}>;

export type Principle = Readonly<{
  number: string;
  title: string;
  description: string;
  source: string;
}>;
