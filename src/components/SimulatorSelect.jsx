/**
 * SimulatorSelect — Scenario selection phase of the voting simulator.
 *
 * Displays available quiz scenarios as interactive cards with
 * difficulty badges and step counts.
 *
 * @module SimulatorSelect
 */
import { lt } from '../contexts/LanguageContext';

/**
 * @param {object} props - Spread from useSimulator hook.
 * @returns {JSX.Element}
 */
export default function SimulatorSelect({
  language,
  L,
  simulatorScenarios,
  startScenario,
  diffLabel,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5efe6]">
      <main className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl overflow-hidden p-8 md:p-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#8b572a] tracking-tight">
            {L('simPageTitle')}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8b572a]" aria-hidden="true">
              <span className="text-white font-bold text-xl">✓</span>
            </div>
            <div>
              <div className="font-bold text-xl leading-none flex items-center">
                VoteSmart <span className="text-[#8b572a] ml-1">AI</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-500 mt-1">
                LEARN • PLAY • VERIFY
              </p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <section className="mb-10" aria-label={language === 'hi' ? 'चित्रण' : 'Illustration'}>
          <div className="w-full h-auto bg-[#fdf8f3] rounded-2xl border border-gray-100 overflow-hidden flex justify-center items-center">
            <img
              alt="Polling Booth Illustration"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBcv9tqbGpTwqgQh0Y2vaCQ1g16s6TmgM-j0Tfkxt6kpqn37mCpERiyFA8dDJOXrnbY2rj033ySMpLLyLl6yrzo3yz2ETZY5nnOOWG7Wd57K74B-fI4L5yvlbARoLyB_YojcAF8hCQbKhs2asEK7HRqf2Blm8eBjw5OZ2Owdo_tcfa_3zPgOEXuo3KOl0qFei4KlYNm7tW2jDUa5-SiuJaADPKv4Iz8IAkHobeQizbII_3ai-1AvhZa_Gghoy6o9DPhLPnYaBxQ-Yb"
            />
          </div>
        </section>

        {/* Description */}
        <article className="space-y-6 mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">{L('simPageDesc')}</h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
            {language === 'hi'
              ? 'एक परिदृश्य चुनें और अपनी मतदान यात्रा शुरू करें।'
              : 'Choose a scenario below and begin your voting journey simulation.'}
          </p>
        </article>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10" role="group" aria-label={language === 'hi' ? 'परिदृश्य विकल्प' : 'Scenario options'}>
          {simulatorScenarios.map((s) => (
            <button
              key={s.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:bg-gray-50 transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8b572a]"
              onClick={() => startScenario(s)}
              id={`scenario-${s.id}`}
              type="button"
            >
              <span className="text-3xl mb-3 block" aria-hidden="true">{s.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{lt(s, 'title', language)}</h3>
              <p className="text-sm text-gray-500 mb-3">{lt(s, 'description', language)}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    s.difficulty === 'Beginner'
                      ? 'bg-green-100 text-green-700'
                      : s.difficulty === 'Intermediate'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {diffLabel(s.difficulty)}
                </span>
                <span className="text-xs text-gray-500">
                  {s.steps.length} {L('simSteps')}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
