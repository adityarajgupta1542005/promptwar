/**
 * Simulator — Voting journey simulator with multi-phase quiz flow.
 *
 * Renders three distinct phases:
 *  1. **Select** — Choose a scenario from available quiz categories
 *  2. **Playing** — Interactive step-by-step quiz with feedback
 *  3. **Results** — Score summary with answer review
 *
 * All state management is delegated to the useSimulator hook.
 *
 * @module Simulator
 */
import { useLanguage, lt } from '../contexts/LanguageContext';
import { useSimulator } from '../hooks/useSimulator';
import SimulatorSelect from './SimulatorSelect';
import SimulatorResults from './SimulatorResults';
import SimulatorQuiz from './SimulatorQuiz';

/**
 * Simulator page component — orchestrates phase rendering.
 * @returns {JSX.Element}
 */
export default function Simulator() {
  const simulatorState = useSimulator();
  const { phase } = simulatorState;

  if (phase === 'select') {
    return <SimulatorSelect {...simulatorState} />;
  }

  if (phase === 'results') {
    return <SimulatorResults {...simulatorState} />;
  }

  return <SimulatorQuiz {...simulatorState} />;
}
