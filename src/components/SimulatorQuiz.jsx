/**
 * SimulatorQuiz — Active quiz phase of the voting simulator.
 *
 * Displays:
 *  - Step progress stepper with visual indicators
 *  - Quiz question and answer options
 *  - Immediate feedback with correct answer reveal
 *  - Next step / see results button
 *
 * @module SimulatorQuiz
 */
import { lt } from '../contexts/LanguageContext';
import { IconCheck, IconCircleCheck, IconCircleX, IconArrowRight } from './icons';

/**
 * @param {object} props - Spread from useSimulator hook.
 * @returns {JSX.Element}
 */
export default function SimulatorQuiz({
  language,
  L,
  scenario,
  stepIndex,
  selectedOption,
  showFeedback,
  score,
  handleSelect,
  nextStep,
  restart,
}) {
  const step = scenario.steps[stepIndex];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5EFEB]">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center" aria-label={language === 'hi' ? 'मतदान प्रश्नोत्तरी' : 'Voting Quiz'}>
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={restart}
            className="text-[#8b572a] font-semibold hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#8b572a] rounded"
            type="button"
          >
            ← {L('simBack')}
          </button>
          <h1 className="text-xl text-gray-800 font-bold">{lt(scenario, 'title', language)}</h1>
          <div className="text-[#8b572a] font-semibold" aria-label={`${L('simScore')}: ${score}`}>
            {L('simScore')}: {score}
          </div>
        </div>

        {/* Step Progress Indicator */}
        <nav
          className="relative flex items-center justify-between mb-8 px-2 w-full max-w-lg"
          aria-label={language === 'hi' ? `चरण ${stepIndex + 1} / ${scenario.steps.length}` : `Step ${stepIndex + 1} of ${scenario.steps.length}`}
        >
          {scenario.steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div
                className={`z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                  i <= stepIndex ? 'bg-[#8b572a]' : 'bg-gray-300'
                }`}
                aria-current={i === stepIndex ? 'step' : undefined}
              >
                {i < stepIndex ? <IconCheck /> : i + 1}
              </div>
              {i < scenario.steps.length - 1 && (
                <div className={`h-[2px] flex-grow mx-2 ${i < stepIndex ? 'bg-[#8b572a]' : 'bg-gray-300'}`} aria-hidden="true" />
              )}
            </div>
          ))}
        </nav>

        {/* Progress text */}
        <div className="text-sm text-gray-500 mb-2 self-end" aria-hidden="true">
          {stepIndex + 1}/{scenario.steps.length}
        </div>

        {/* Quiz Card */}
        <div className="w-full bg-[#FCFAF7] border border-[#E8E3DD] rounded-2xl p-8 shadow-sm" id="sim-step-card">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-snug">
            {lt(step, 'title', language)}
          </h2>
          <p className="text-gray-600 text-base mb-8 leading-relaxed">
            {lt(step, 'scenario', language)}
          </p>

          {/* Answer Options */}
          <div className="space-y-3" role="radiogroup" aria-label={language === 'hi' ? 'उत्तर विकल्प' : 'Answer options'}>
            {step.options.map((opt) => {
              let optClasses = 'border rounded-xl p-4 cursor-pointer transition-colors text-left w-full focus:outline-none focus:ring-2 focus:ring-[#8b572a]';
              if (showFeedback) {
                if (opt.correct) {
                  optClasses += ' border-[#B49372] bg-[#F1E6D4]';
                } else if (selectedOption?.id === opt.id && !opt.correct) {
                  optClasses += ' border-red-300 bg-red-50';
                } else {
                  optClasses += ' border-[#E8E3DD] bg-white opacity-50';
                }
              } else {
                optClasses += ' border-[#E8E3DD] bg-white hover:bg-gray-50';
              }

              return (
                <button
                  key={opt.id}
                  className={optClasses}
                  onClick={() => handleSelect(opt)}
                  disabled={showFeedback}
                  id={`option-${opt.id}`}
                  type="button"
                  role="radio"
                  aria-checked={selectedOption?.id === opt.id}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-gray-800 ${selectedOption?.id === opt.id ? 'font-medium' : ''}`}>
                      {lt(opt, 'text', language)}
                    </span>
                    {showFeedback && opt.correct && (
                      <IconCircleCheck className="w-6 h-6 text-green-700" />
                    )}
                    {showFeedback && selectedOption?.id === opt.id && !opt.correct && (
                      <IconCircleX className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <section
            className="w-full mt-2"
            role="alert"
            aria-live="assertive"
          >
            <div
              className={`rounded-2xl p-6 border ${
                selectedOption?.correct
                  ? 'bg-[#E4EFE0] border-[#93C493]'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold text-lg ${selectedOption?.correct ? 'text-[#235D3A]' : 'text-red-700'}`}>
                  {selectedOption?.correct ? L('simCorrect') : L('simWrong')}
                </span>
                {selectedOption?.correct && (
                  <IconCircleCheck className="w-5 h-5 text-[#235D3A]" />
                )}
              </div>
              <p className={selectedOption?.correct ? 'text-[#235D3A]' : 'text-red-700'}>
                {lt(selectedOption, 'feedback', language)}
              </p>
              {!selectedOption?.correct && (
                <p className="text-red-700 mt-2">
                  {language === 'hi' ? '✅ सही उत्तर: ' : '✅ The correct answer is: '}
                  <strong>{lt(step.options.find((o) => o.correct), 'text', language)}</strong>
                </p>
              )}
              {step.learnMore && (
                <p className="mt-2 text-sm text-gray-600">
                  <strong>{L('simLearnMore')}:</strong> {step.learnMore}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Next Button */}
        {showFeedback && (
          <footer className="w-full mt-6">
            <button
              className="w-full bg-[#956034] hover:opacity-90 transition-opacity text-white font-medium py-4 px-6 flex justify-center items-center gap-2 text-lg rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#956034]"
              onClick={nextStep}
              id="next-step-btn"
              type="button"
            >
              {stepIndex < scenario.steps.length - 1 ? L('simNextStep') : L('simSeeResults')}
              <IconArrowRight />
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}
