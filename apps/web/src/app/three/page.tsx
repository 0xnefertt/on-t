import type { Metadata } from 'next';

import { ThreePracticePage } from '../../features/three/ThreePracticePage';

export const metadata: Metadata = {
  title: 'On T / Three.js Lab',
  description:
    'Explore scenes, geometry, materials, light, and render loops with Three.js',
};

export default function ThreePage() {
  return <ThreePracticePage />;
}
