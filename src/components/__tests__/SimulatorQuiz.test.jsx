/**
 * @fileoverview Tests for SimulatorQuiz sub-component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import SimulatorQuiz from '../SimulatorQuiz';

const mockStep = {
  id: 'step1',
  title: 'Step 1 Title',
  titleHi: 'चरण 1 शीर्षक',
  desc: 'Step 1 Description',
  descHi: 'चरण 1 विवरण',
  options: [
    { text: 'Correct Option', textHi: 'सही विकल्प', correct: true, feedback: 'Good job!', feedbackHi: 'बहुत बढ़िया!' },
    { text: 'Wrong Option', textHi: 'गलत विकल्प', correct: false, feedback: 'Try again.', feedbackHi: 'पुनः प्रयास करें।' }
  ]
};

describe('SimulatorQuiz Component', () => {
  const defaultProps = {
    language: 'en',
    L: (key) => ({
      simBack: 'Back',
      simNextStep: 'Next Step',
      simFinish: 'Finish',
      simCorrect: 'Correct!',
      simIncorrect: 'Incorrect!',
    }[key] || key),
    currentStep: mockStep,
    stepIndex: 0,
    totalSteps: 3,
    progress: 33,
    selectedOption: null,
    showFeedback: false,
    handleSelect: vi.fn(),
    nextStep: vi.fn(),
    restart: vi.fn(),
  };

  it('renders the back button and calls restart', () => {
    render(<SimulatorQuiz {...defaultProps} />);
    const backBtn = screen.getByText('Back');
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(defaultProps.restart).toHaveBeenCalledTimes(1);
  });

  it('displays the current step index and progress bar', () => {
    render(<SimulatorQuiz {...defaultProps} />);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '33');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders step title and description', () => {
    render(<SimulatorQuiz {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Step 1 Title' })).toBeInTheDocument();
    expect(screen.getByText('Step 1 Description')).toBeInTheDocument();
  });

  it('renders options as radio group and buttons', () => {
    render(<SimulatorQuiz {...defaultProps} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    const options = screen.getAllByRole('radio');
    expect(options).toHaveLength(2);
    expect(screen.getByText('Correct Option')).toBeInTheDocument();
    expect(screen.getByText('Wrong Option')).toBeInTheDocument();
  });

  it('calls handleSelect when an option is clicked', () => {
    render(<SimulatorQuiz {...defaultProps} />);
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    expect(defaultProps.handleSelect).toHaveBeenCalledWith(mockStep.options[0]);
  });

  it('shows feedback when showFeedback is true', () => {
    render(
      <SimulatorQuiz
        {...defaultProps}
        selectedOption={mockStep.options[0]}
        showFeedback={true}
      />
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText('Good job!')).toBeInTheDocument();
  });

  it('disables options when feedback is shown', () => {
    render(
      <SimulatorQuiz
        {...defaultProps}
        selectedOption={mockStep.options[0]}
        showFeedback={true}
      />
    );
    const options = screen.getAllByRole('radio');
    options.forEach(opt => {
      expect(opt).toBeDisabled();
    });
  });

  it('shows Next Step button and calls nextStep on click', () => {
    render(
      <SimulatorQuiz
        {...defaultProps}
        selectedOption={mockStep.options[0]}
        showFeedback={true}
      />
    );
    const nextBtn = screen.getByText('Next Step');
    expect(nextBtn).toBeInTheDocument();
    fireEvent.click(nextBtn);
    expect(defaultProps.nextStep).toHaveBeenCalledTimes(1);
  });

  it('shows Finish button on the last step', () => {
    render(
      <SimulatorQuiz
        {...defaultProps}
        stepIndex={2} // Last step (0-indexed out of 3)
        selectedOption={mockStep.options[0]}
        showFeedback={true}
      />
    );
    const finishBtn = screen.getByText('Finish');
    expect(finishBtn).toBeInTheDocument();
  });
});
