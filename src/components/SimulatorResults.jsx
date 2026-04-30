/**
 * SimulatorResults — Results phase of the voting simulator.
 *
 * Displays:
 *  - Grade emoji and score fraction
 *  - Answer review list (correct/incorrect)
 *  - Retry and back-to-scenarios actions
 *
 * @module SimulatorResults
 */
import { lt } from '../contexts/LanguageContext';

/**
 * @param {object} props - Spread from useSimulator hook.
 * @returns {JSX.Element}
 */
export default function SimulatorResults({
  language,
  L,
  scenario,
  score,
  answers,
  startScenario,
  restart,
}) {
  const percentageValue = Math.round((score / scenario.steps.length) * 100);
  const gradeKey =
    percentageValue >= 80
      ? 'simExcellent'
      : percentageValue >= 60
        ? 'simGood'
        : percentageValue >= 40
          ? 'simKeepLearning'
          : 'simNeedPractice';
  const gradeEmoji =
    percentageValue >= 80 ? '🏆' : percentageValue >= 60 ? '👍' : percentageValue >= 40 ? '📚' : '💪';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5EFEB]">
      <main className="w-full max-w-md mx-auto flex flex-col items-center" id="results-card">
        <h1 className="text-xl text-gray-800 mb-6 font-bold">{L('simComplete')}</h1>
        <div className="w-full bg-[#FCFAF7] border border-[#E8E3DD] rounded-2xl p-8 shadow-sm text-center">
          <div className="text-6xl mb-4" aria-hidden="true">{gradeEmoji}</div>
          <p className="text-lg font-semibold text-gray-700 mb-2">{lt(scenario, 'title', language)}</p>
          <div className="text-5xl font-bold text-[#235D3A] mb-2" aria-label={`Score: ${score} out of ${scenario.steps.length}`}>
            {score}/{scenario.steps.length}
          </div>
          <p className="text-[#235D3A] font-semibold mb-6">{L(gradeKey)}</p>

          {/* Answer Review */}
          <div className="space-y-3 text-left mb-6" role="list" aria-label={language === 'hi' ? 'उत्तर समीक्षा' : 'Answer Review'}>
            {answers.map((a, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  a.correct ? 'bg-[#E4EFE0] border-[#93C493]' : 'bg-red-50 border-red-200'
                }`}
                role="listitem"
              >
                <span className={`font-bold ${a.correct ? 'text-[#235D3A]' : 'text-red-600'}`} aria-hidden="true">
                  {a.correct ? '✓' : '✗'}
                </span>
                <span className="text-sm text-gray-800">{a.step}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              className="w-full bg-[#956034] hover:opacity-90 transition-opacity text-white font-medium py-4 px-6 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-[#956034]"
              onClick={() => startScenario(scenario)}
              id="retry-btn"
              type="button"
            >
              {L('simTryAgain')}
            </button>
            <button
              className="w-full border border-[#E8E3DD] bg-white hover:bg-gray-50 transition-colors text-gray-700 font-medium py-4 px-6 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-[#E8E3DD]"
              onClick={restart}
              id="back-scenarios-btn"
              type="button"
            >
              {L('simAllScenarios')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
