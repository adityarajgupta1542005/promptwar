/**
 * @fileoverview Tests for SimulatorResults sub-component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import SimulatorResults from '../SimulatorResults';

const mockScenario = {
  id: 'test-scenario',
  title: 'Test Scenario',
  titleHi: 'टेस्ट परिदृश्य',
  steps: [
    { id: 's1', title: 'Step 1' },
    { id: 's2', title: 'Step 2' },
    { id: 's3', title: 'Step 3' },
  ],
};

const mockAnswers = [
  { step: 'Step 1', correct: true },
  { step: 'Step 2', correct: false },
  { step: 'Step 3', correct: true },
];

describe('SimulatorResults Component', () => {
  const defaultProps = {
    language: 'en',
    L: (key) => ({
      simComplete: 'Complete!',
      simExcellent: 'Excellent!',
      simGood: 'Good Job!',
      simKeepLearning: 'Keep Learning!',
      simNeedPractice: 'Need Practice',
      simTryAgain: 'Try Again',
      simAllScenarios: 'All Scenarios',
    }[key] || key),
    scenario: mockScenario,
    score: 2,
    answers: mockAnswers,
    startScenario: vi.fn(),
    restart: vi.fn(),
  };

  it('renders the completion heading', () => {
    render(<SimulatorResults {...defaultProps} />);
    expect(screen.getByText('Complete!')).toBeInTheDocument();
  });

  it('displays the score fraction', () => {
    render(<SimulatorResults {...defaultProps} />);
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('shows correct grade for score >= 60%', () => {
    render(<SimulatorResults {...defaultProps} />);
    // 2/3 = 67% -> "Good Job!"
    expect(screen.getByText('Good Job!')).toBeInTheDocument();
  });

  it('renders answer review list', () => {
    render(<SimulatorResults {...defaultProps} />);
    expect(screen.getByRole('list', { name: /answer review/i })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('marks correct answers with ✓', () => {
    render(<SimulatorResults {...defaultProps} />);
    const checks = screen.getAllByText('✓');
    expect(checks).toHaveLength(2);
  });

  it('marks incorrect answers with ✗', () => {
    render(<SimulatorResults {...defaultProps} />);
    expect(screen.getByText('✗')).toBeInTheDocument();
  });

  it('calls startScenario when Try Again is clicked', () => {
    render(<SimulatorResults {...defaultProps} />);
    fireEvent.click(screen.getByText('Try Again'));
    expect(defaultProps.startScenario).toHaveBeenCalledWith(mockScenario);
  });

  it('calls restart when All Scenarios is clicked', () => {
    render(<SimulatorResults {...defaultProps} />);
    fireEvent.click(screen.getByText('All Scenarios'));
    expect(defaultProps.restart).toHaveBeenCalledTimes(1);
  });

  it('shows Excellent grade for perfect score', () => {
    render(<SimulatorResults {...defaultProps} score={3} />);
    expect(screen.getByText('Excellent!')).toBeInTheDocument();
  });

  it('shows Need Practice for low score', () => {
    render(<SimulatorResults {...defaultProps} score={0} />);
    expect(screen.getByText('Need Practice')).toBeInTheDocument();
  });

  it('has accessible score label', () => {
    render(<SimulatorResults {...defaultProps} />);
    expect(screen.getByLabelText(/score: 2 out of 3/i)).toBeInTheDocument();
  });
});
