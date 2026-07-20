import { fireEvent, render, screen } from '@testing-library/react';

import { MotionPracticePage } from './MotionPracticePage';

describe('MotionPracticePage', () => {
  it('composes a motion class from the selected controls', () => {
    render(<MotionPracticePage />);

    fireEvent.change(screen.getByLabelText('Transform'), {
      target: { value: 'pop' },
    });
    fireEvent.change(screen.getByLabelText('Duration'), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText('Delay (ms)'), {
      target: { value: '150' },
    });
    fireEvent.change(screen.getByLabelText('Transform origin'), {
      target: { value: 'top-left' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Run motion' }));

    expect(
      screen.getByText(
        'transition-[transform,opacity] duration-1000 ease-out delay-150 origin-top-left -translate-y-10 scale-125 rotate-6 opacity-70',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reset motion' }),
    ).toBeInTheDocument();
  });

  it('covers observer, keyframe, Motion, and scroll-linked concepts', () => {
    render(<MotionPracticePage />);

    expect(
      screen.getByText(/IntersectionObserver\(callback/),
    ).toBeInTheDocument();
    expect(screen.getByText(/@keyframes slide-in/)).toBeInTheDocument();
    expect(screen.getByText(/useReducedMotion\(\)/)).toBeInTheDocument();
    expect(
      screen.getByText(/view-timeline-name: --scroll-lab/),
    ).toBeInTheDocument();
  });

  it('renders accessible links between practice labs', () => {
    render(<MotionPracticePage />);

    expect(screen.getByRole('link', { name: 'React lab' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(
      screen.getAllByRole('link', { name: 'Web3 lab' })[0],
    ).toHaveAttribute('href', '/web3');
  });
});
