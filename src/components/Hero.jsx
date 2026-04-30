/**
 * Hero — Landing page with feature showcase, CTA, and footer disclaimer.
 *
 * Serves as the primary entry point showcasing:
 *  - Brand identity and hero image
 *  - Feature cards linking to simulator, guide, myths, and chat
 *  - Main call-to-action for the voting simulator
 *  - Legal disclaimer footer
 *
 * @module Hero
 */
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../data/translations';
import { IconPlay, IconClipboard, IconShield, IconChat, IconArrowRight } from './icons';

/**
 * Hero landing page component.
 * @returns {JSX.Element}
 */
export default function Hero() {
  const { language } = useLanguage();

  /** @param {string} key */
  const L = (key) => t(language, key);

  /** Feature cards configuration */
  const features = [
    { icon: <IconPlay className="w-7 h-7" />, title: L('feat1Title'), desc: L('feat1Desc'), path: '/simulator' },
    { icon: <IconClipboard className="w-7 h-7" />, title: L('feat2Title'), desc: L('feat2Desc'), path: '/guide' },
    { icon: <IconShield className="w-7 h-7" />, title: L('feat3Title'), desc: L('feat3Desc'), path: '/myths' },
    { icon: <IconChat className="w-7 h-7" />, title: L('feat4Title'), desc: L('feat4Desc'), path: '/chat' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f7f3ee]">
      {/* Main Card Container */}
      <section className="max-w-4xl w-full bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden p-8 md:p-12 mb-8">
        {/* Header Section */}
        <header className="flex flex-col items-center text-center mb-8">
          <div className="mb-2">
            <img
              alt="VoteSmart AI Logo"
              className="h-16 w-auto object-contain block"
              width="180"
              height="64"
              fetchpriority="high"
              loading="eager"
              decoding="async"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGTPE9Ox51YDsplCtKiTmJr_3tiu9V2st_Zl6p5Mxp-GVea7r5PJyn3LjYoQ3Z7gkiJ1ZHMDeDytc9wGUk4ynJlExaMyhDaRwMZFqXEPCBwzePwyAs8CDgzImxO48GX--Hoz9BW3ZOW36wECEglFYprxIKfa0ushd8ro4FSlqC6nlk1D3mCUbKfUSExGEdou6HWlYFMoXmpo1KdNbjL-OKrQl2-W07F2e3B0H3sClnRipK53nH5ikU9FgWn8zORmytFlc89Jv1NHDM"
            />
          </div>
          <p className="uppercase tracking-widest text-xs font-bold text-gray-600">
            {L('heroBadge') || 'Learn • Play • Verify'}
          </p>
          <h1 className="mt-8 text-3xl md:text-4xl font-bold text-[#333333]">
            {L('heroTitle1')} <span className="text-[#8c5d38]">{L('heroTitle2')}</span>
          </h1>
          <p className="mt-2 text-gray-600 text-lg">{L('heroSubtitle')}</p>
        </header>

        {/* Hero Image */}
        <section className="flex justify-center mb-12" aria-label={language === 'hi' ? 'चित्रण' : 'Illustration'}>
          <div className="relative w-full max-w-2xl">
            <img
              alt="Electoral Process Illustration"
              className="w-full h-auto rounded-xl block"
              width="672"
              height="400"
              loading="lazy"
              decoding="async"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOPm2bEGM-AxvbdDHEi7PEcaGVKDpSn0RICm1vD1_ghqCTCtptREiEQNKEofpdxoqWj-l9OjOCCZYqsByoqIZatHr6L1Cm4wnaOXR1JprEQtWvhXAAafjsfWDdWdAy_wXBQpHb8d_mhmOE6t_6DuzUgsfqZXktihlXlNbpfIkOa-QAQoaz10WCZZd17H_fMmcf1QQ9TcmDOgToxL4cCwT9BVBmWWEeOZ7szqWgZ0SGxJfL3hK1TIlWVGMfbDbypDDki5Ou2--RIsL3"
            />
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12" id="features-section" aria-label={language === 'hi' ? 'मुख्य विशेषताएं' : 'Key Features'}>
          {features.slice(0, 3).map((f) => (
            <Link key={f.path} to={f.path} className="flex flex-col items-center text-center no-underline group">
              <div className="w-16 h-16 rounded-full bg-[#f0e4d7] flex items-center justify-center mb-4 border border-[#d4a373]/20">
                <span className="text-2xl text-[#8c5d38]">{f.icon}</span>
              </div>
              <h3 className="font-bold text-lg text-[#333333]">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </Link>
          ))}
        </section>

        {/* CTA Button */}
        <section className="flex justify-center">
          <Link
            to="/simulator"
            className="bg-[#8c5d38] hover:bg-[#7a4f2f] text-white font-semibold py-4 px-12 rounded-xl transition duration-300 flex items-center gap-2 text-lg shadow-md no-underline"
            id="start-simulator-btn"
          >
            {L('heroStartSim')}
            <IconArrowRight />
          </Link>
        </section>
      </section>

      {/* Footer Disclaimer */}
      <footer className="w-full flex flex-col items-center space-y-6 pb-8" role="contentinfo">
        <nav className="flex space-x-6 text-sm text-gray-600 font-medium" aria-label={language === 'hi' ? 'बाहरी लिंक' : 'External links'}>
          <a href="https://www.eci.gov.in/contact-us" target="_blank" rel="noopener noreferrer" className="hover:text-[#8c5d38] transition-colors">
            {language === 'hi' ? 'संपर्क करें' : 'Contact Us'}
          </a>
        </nav>
        <div className="w-full max-w-2xl text-center px-4 text-xs text-gray-500 space-y-3">
          <p>
            {language === 'hi'
              ? 'हमारा AI सहायक भारतीय चुनाव आयोग के दिशानिर्देशों और भारत के संविधान से प्राप्त सिद्धांतों पर आधारित जानकारी प्रदान करने के लिए डिज़ाइन किया गया है।'
              : 'Our AI assistant is designed to provide information strictly based on official Indian election guidelines and principles derived from the Constitution of India.'}
          </p>
          <p>
            {language === 'hi'
              ? 'हम भ्रामक या मनगढ़ंत जानकारी उत्पन्न नहीं करते हैं। सभी प्रतिक्रियाएं सार्वजनिक रूप से उपलब्ध सरकारी स्रोतों से संरेखित हैं।'
              : 'We do not generate misleading or fabricated information. All responses are aligned with publicly available government sources, election rules, and verified civic knowledge.'}
          </p>
          <p>
            {language === 'hi'
              ? 'यह एक शैक्षिक उपकरण है और आधिकारिक सरकारी संचार का विकल्प नहीं है। अंतिम सत्यापन के लिए कृपया भारतीय चुनाव आयोग की वेबसाइट देखें।'
              : 'However, this platform is an educational tool and should not be considered a substitute for official government communication. For final verification, users are encouraged to refer to the Election Commission of India website.'}
          </p>
          <p>
            {language === 'hi'
              ? 'हमारा लक्ष्य नागरिकों में जागरूकता, पारदर्शिता और सूचित मतदान को बढ़ावा देना है।'
              : 'Our goal is to promote awareness, transparency, and informed voting among citizens.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
