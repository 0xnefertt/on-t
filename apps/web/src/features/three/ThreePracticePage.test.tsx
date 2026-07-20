import { fireEvent, render, screen } from '@testing-library/react';

import { ThreePracticePage } from './ThreePracticePage';

describe('ThreePracticePage', () => {
  it('renders the scene graph and live controls', () => {
    render(<ThreePracticePage />);

    expect(
      screen.getByRole('heading', { name: 'Shape the invisible.' }),
    ).toBeInTheDocument();
    expect(screen.getByText('The scene graph')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Interactive Three.js/)).toHaveLength(2);
  });

  it('updates geometry, material, speed, and animation state', () => {
    render(<ThreePracticePage />);

    fireEvent.change(screen.getByLabelText('Geometry'), {
      target: { value: 'torus-knot' },
    });
    fireEvent.change(screen.getByLabelText('Material'), {
      target: { value: 'wireframe' },
    });
    fireEvent.change(screen.getByRole('slider', { name: 'Rotation speed' }), {
      target: { value: '1.8' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Pause animation' }));

    expect(screen.getByText(/TorusKnotGeometry/)).toBeInTheDocument();
    expect(screen.getByText(/wireframe: true/)).toBeInTheDocument();
    expect(screen.getByText('1.8×')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Resume animation' }),
    ).toBeInTheDocument();
  });
});
