/**
 * @fileoverview Tests for SimulatorSelect sub-component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import SimulatorSelect from '../SimulatorSelect';
import { simulatorScenarios } from '../../data/simulatorSteps';

describe('SimulatorSelect Component', () => {
  const defaultProps = {
    language: 'en',
    L: (key) => key,
    simulatorScenarios,
    startScenario: vi.fn(),
    diffLabel: (d) => d,
  };

  it('renders the page title heading', () => {
    render(<SimulatorSelect {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders hero image with alt text', () => {
    render(<SimulatorSelect {...defaultProps} />);
    const img = screen.getByAltText('Polling Booth Illustration');
    expect(img).toBeInTheDocument();
  });

  it('renders scenario cards as buttons', () => {
    render(<SimulatorSelect {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('renders difficulty badges on cards', () => {
    render(<SimulatorSelect {...defaultProps} />);
    expect(screen.getAllByText(/Beginner|Intermediate|Advanced/)).toHaveLength(
      simulatorScenarios.length
    );
  });

  it('calls startScenario when a card is clicked', () => {
    render(<SimulatorSelect {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(defaultProps.startScenario).toHaveBeenCalledWith(simulatorScenarios[0]);
  });

  it('renders scenario group with aria-label', () => {
    render(<SimulatorSelect {...defaultProps} />);
    expect(screen.getByRole('group', { name: /scenario options/i })).toBeInTheDocument();
  });

  it('each card has a unique ID', () => {
    const { container } = render(<SimulatorSelect {...defaultProps} />);
    simulatorScenarios.forEach((s) => {
      expect(container.querySelector(`#scenario-${s.id}`)).toBeInTheDocument();
    });
  });
});
