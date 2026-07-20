import type { Metadata } from 'next';

import { MotionPracticePage } from '../../features/motion/MotionPracticePage';

export const metadata: Metadata = {
  title: 'On T / Tailwind Motion Lab',
  description: 'Practice Tailwind CSS utilities, transitions, and keyframes',
};

export default function MotionPage() {
  return <MotionPracticePage />;
}
