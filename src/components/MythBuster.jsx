/**
 * MythBuster — Election myth verification page.
 *
 * Features:
 *  - AI-powered custom claim verification via Gemini
 *  - Pre-loaded myth database with category filtering
 *  - Expandable myth/reality cards with severity ratings
 *  - Text-to-speech for all myth explanations
 *
 * @module MythBuster
 */
import { useLanguage, lt } from '../contexts/LanguageContext';
import { useMythChecker } from '../hooks/useMythChecker';
import { useSpeech } from '../hooks/useSpeech';
import ListenButton from './ListenButton';

/**
 * MythBuster page component.
 * @returns {JSX.Element}
 */
export default function MythBuster() {
  const {
    language,
    L,
    activeCategory,
    setActiveCategory,
    expandedId,
    toggleExpand,
    customClaim,
    setCustomClaim,
    aiResult,
    checking,
    handleCustomCheck,
    filteredMyths,
    mythCategories,
    verdictConfig,
    severityLabel,
  } = useMythChecker();

  const { speak, speaking, activeId } = useSpeech();
  const listenLabel = language === 'hi' ? 'सुनें' : 'Listen';

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-[#fdf8f3]">
      {/* Page Header */}
      <div className="w-full max-w-4xl text-center mb-8 pt-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#8c5a2b] mb-2">{L('mythPageTitle')}</h1>
        <p className="text-gray-600 text-lg">{L('mythPageDesc')}</p>
      </div>

      {/* Custom Claim Checker */}
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm" id="custom-checker">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{L('mythCheckTitle')}</h2>
        <p className="text-sm text-gray-500 mb-4">{L('mythCheckDesc')}</p>
        <div className="flex gap-3">
          <label htmlFor="claim-input" className="sr-only">{L('mythPlaceholder')}</label>
          <input
            type="text"
            value={customClaim}
            onChange={(e) => setCustomClaim(e.target.value)}
            placeholder={L('mythPlaceholder')}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomCheck()}
            className="flex-1 border border-[#E8E3DD] rounded-xl px-4 py-3 text-gray-800 bg-white focus:outline-none focus:border-[#8c5a2b] focus:ring-1 focus:ring-[#8c5a2b] transition-colors"
            id="claim-input"
          />
          <button
            className="bg-[#8c5a2b] hover:opacity-90 transition-opacity text-white font-medium py-3 px-6 rounded-xl disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#bfa085]"
            onClick={handleCustomCheck}
            disabled={checking || !customClaim.trim()}
            id="check-claim-btn"
            type="button"
          >
            {checking ? <span className="loading-spinner" /> : L('mythVerify')}
          </button>
        </div>

        {/* AI Verdict */}
        {aiResult && (
          <div className="mt-4 rounded-2xl p-6 border" id="ai-verdict" role="alert" aria-live="assertive" style={{ backgroundColor: verdictConfig[aiResult.verdict]?.bg, borderColor: verdictConfig[aiResult.verdict]?.color }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-lg" style={{ color: verdictConfig[aiResult.verdict]?.color }}>
                {language === 'hi' ? verdictConfig[aiResult.verdict]?.labelHi : verdictConfig[aiResult.verdict]?.label}
              </span>
              {aiResult.confidenceScore !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{language === 'hi' ? 'सटीकता:' : 'Confidence:'}</span>
                  <div className="w-24 bg-gray-100 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full" style={{ width: `${aiResult.confidenceScore}%`, backgroundColor: verdictConfig[aiResult.verdict]?.color }}></div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: verdictConfig[aiResult.verdict]?.color }}>{aiResult.confidenceScore}%</span>
                </div>
              )}
            </div>
            <p className="text-gray-800 text-[15px]">📌 {aiResult.explanation}</p>
            {aiResult.source && <p className="text-sm text-gray-500 mt-2">{L('mythSources')}: {aiResult.source}</p>}
            <div className="mt-3">
              <ListenButton
                onClick={() => speak(aiResult.explanation, language, 'ai-verdict')}
                isPlaying={speaking && activeId === 'ai-verdict'}
                label={listenLabel}
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="w-full max-w-4xl flex flex-wrap gap-2 mb-6" role="group" aria-label={language === 'hi' ? 'श्रेणी के अनुसार फ़िल्टर करें' : 'Filter by category'}>
        {mythCategories.map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#8c5a2b] ${
              activeCategory === cat
                ? 'bg-[#8c5a2b] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            aria-label={`Category ${cat}`}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Myths List */}
      <div className="w-full max-w-4xl space-y-4">
        {filteredMyths.map((m) => (
          <div
            key={m.id}
            className="w-full bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden"
            id={`myth-${m.id}`}
          >
            <div className="p-6 md:p-8">
              {/* Myth Header (clickable) */}
              <button
                className="w-full text-left flex items-start justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#8c5a2b] rounded-lg"
                onClick={() => toggleExpand(m.id)}
                aria-expanded={expandedId === m.id}
                aria-controls={`myth-content-${m.id}`}
                type="button"
              >
                <div className="flex-1">
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${
                    m.severity === 'high' ? 'bg-red-100 text-red-700' :
                    m.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {severityLabel(m.severity)} {L('mythRisk')}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">{lt(m, 'myth', language)}</h3>
                </div>
                <span className={`text-gray-500 text-xl transition-transform ${expandedId === m.id ? 'rotate-180' : ''}`} aria-hidden="true">▼</span>
              </button>

              {/* Expanded Content */}
              {expandedId === m.id && (
                <div className="mt-6 space-y-4 animate-fadeIn" id={`myth-content-${m.id}`}>
                  {/* Myth Box */}
                  <section className="bg-[#fcebeb] border border-[#d1b3b3] rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="text-[#a12323]" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="20" aria-hidden="true">
                        <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                      </svg>
                      <h4 className="text-[#a12323] font-bold text-lg m-0">{language === 'hi' ? 'मिथक' : 'Myth'}</h4>
                    </div>
                    <p className="text-gray-800 text-[15px] leading-snug">{lt(m, 'myth', language)}</p>
                  </section>

                  {/* Reality Box */}
                  <section className="bg-[#e6f2e6] border border-[#b5ccb5] rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="text-[#2e7d32]" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="20" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                      <h4 className="text-[#2e7d32] font-bold text-lg m-0">{language === 'hi' ? 'वास्तविकता' : 'Reality'}</h4>
                    </div>
                    <p className="text-gray-800 text-[15px] leading-relaxed">{lt(m, 'fact', language)}</p>
                  </section>

                  {/* Did You Know */}
                  {m.didYouKnow && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                      <h4 className="font-bold text-blue-700 m-0">{L('mythDidYouKnow')}</h4>
                      <p className="text-blue-800 text-sm mt-1">{lt(m, 'didYouKnow', language)}</p>
                    </div>
                  )}

                  {/* Source */}
                  <section>
                    <h4 className="text-gray-500 font-medium mb-1">{L('mythSources')}</h4>
                    <p className="text-gray-800 text-sm">{m.sources.join(', ')}</p>
                  </section>

                  {/* Listen */}
                  <ListenButton
                    onClick={() => {
                      const fullText = `${lt(m, 'myth', language)}. ${lt(m, 'fact', language)}${m.didYouKnow ? '. ' + lt(m, 'didYouKnow', language) : ''}`;
                      speak(fullText, language, `myth-${m.id}`);
                    }}
                    isPlaying={speaking && activeId === `myth-${m.id}`}
                    label={listenLabel}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
