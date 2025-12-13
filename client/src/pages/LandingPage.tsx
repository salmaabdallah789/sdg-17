import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface GameOption {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  features: string[];
  route: string;
  color: string;
  gradient: string;
}

const LandingPage = () => {
  const navigate = useNavigate();

  // Check if any game has been submitted
  const aiDetectiveSubmitted = typeof window !== 'undefined' && localStorage.getItem('ai-detective-submitted') === 'true';
  const buildBreakFixSubmitted = typeof window !== 'undefined' && localStorage.getItem('build-break-fix-submitted') === 'true';
  const futureDecisionsSubmitted = typeof window !== 'undefined' && localStorage.getItem('future-decisions-submitted') === 'true';

  const gameOptions: GameOption[] = [
    {
      id: 'future-decisions',
      title: 'Future Decisions: 2035 Simulation',
      icon: '🌍',
      tagline: 'Navigate crises with AI, budget constraints, and ethical dilemmas',
      description: "It's 2035. Your community is in crisis. You have AI, a shrinking budget, and tough choices. Can you help people without leaving anyone behind?",
      features: [
        'Make strategic decisions with limited resources',
        'Deploy AI tools while managing trade-offs',
        'Balance efficiency, equity, and ethics',
        'See long-term consequences of your choices'
      ],
      route: '/scenarios',
      color: 'primary',
      gradient: 'from-primary-50 to-blue-50'
    },
    {
      id: 'ai-detective',
      title: 'AI Detective: The SDG Mystery',
      icon: '🔍',
      tagline: 'Investigate mysterious crises using AI and data analysis',
      description: 'Why are school dropouts increasing? Why are hospital wait times exploding? Why is food waste rising? Analyze datasets, use AI logic to spot patterns, and identify the real social issue.',
      features: [
        'Analyze real-world datasets',
        'Use AI pattern recognition',
        'Solve mysteries through problem-solving',
        'Learn through investigation, not memorization'
      ],
      route: '/ai-detective',
      color: 'secondary',
      gradient: 'from-purple-50 to-pink-50'
    },
    {
      id: 'build-break-fix',
      title: 'Build–Break–Fix: AI Edition',
      icon: '🔧',
      tagline: 'Build AI ideas, discover problems, and fix them ethically',
      description: 'Build an AI idea fast, break it by discovering bias or harm, then fix it ethically. The winner is NOT the smartest idea—it\'s the most responsibly improved one.',
      features: [
        'Rapidly prototype AI solutions',
        'Identify bias and ethical issues',
        'Iterate and improve responsibly',
        'Compete on ethics, not just innovation'
      ],
      route: '/build-break-fix',
      color: 'green',
      gradient: 'from-green-50 to-emerald-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Logo in top left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-20"
      >
        <img 
          src="/sdg17-logo.jpeg" 
          alt="SDG 17 Logo" 
          className="h-16 md:h-24 w-auto drop-shadow-2xl"
          onError={(e) => {
            // Fallback if image doesn't exist yet
            e.currentTarget.style.display = 'none';
          }}
        />
      </motion.div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            SDG 17: AI & Social Impact Games
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-4 leading-relaxed">
            Explore future society challenges, AI tools, ethics, and long-term impact
          </p>
          <p className="text-lg md:text-xl text-cyan-300 font-semibold">
            Choose your challenge
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {gameOptions.map((game, index) => {
              const isSubmitted = 
                (game.id === 'ai-detective' && aiDetectiveSubmitted) ||
                (game.id === 'build-break-fix' && buildBreakFixSubmitted) ||
                (game.id === 'future-decisions' && futureDecisionsSubmitted);
              
              return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative"
              >
                <div className={`card h-full bg-gradient-to-br from-slate-800/90 via-blue-800/80 to-slate-700/90 backdrop-blur-sm border-2 border-blue-500/30 transition-all duration-300 group ${
                  isSubmitted ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-2xl hover:border-cyan-400/50 cursor-pointer hover:scale-[1.02]'
                }`}
                  onClick={() => !isSubmitted && navigate(game.route)}>
                  {isSubmitted && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10 shadow-lg">
                      ✓ Submitted
                    </div>
                  )}
                  <div className="text-6xl mb-4 drop-shadow-lg">{game.icon}</div>
                  <h2 className="text-2xl font-bold text-white mb-3">{game.title}</h2>
                  <p className="text-sm font-semibold text-cyan-300 mb-4 italic">
                    {game.tagline}
                  </p>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    {game.description}
                  </p>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold text-cyan-200 mb-3 text-sm uppercase tracking-wide">
                      What You'll Do:
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-100">
                      {game.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-cyan-400 mr-2 font-bold">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.button
                    whileHover={!isSubmitted ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                    disabled={isSubmitted}
                    className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all ${
                      isSubmitted
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/50'
                    }`}
                  >
                    {isSubmitted ? '✓ Already Submitted' : `Play ${game.title.includes(':') ? game.title.split(':')[0] : game.title} →`}
                  </motion.button>
                </div>
              </motion.div>
            );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="card bg-slate-800/90 backdrop-blur-sm border-2 border-blue-500/30 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">About These Games</h2>
              <p className="text-blue-100 leading-relaxed mb-4">
                These interactive simulations are designed for students to explore future society challenges, 
                AI tools, ethics, and long-term impact in a playful but deep way. Each game focuses on 
                different aspects of AI and social impact related to the UN Sustainable Development Goals.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
                <div className="p-4 bg-blue-900/50 rounded-lg border border-cyan-500/30">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="font-semibold text-cyan-200">Problem-Solving</p>
                  <p className="text-blue-100">Learn through active investigation and decision-making</p>
                </div>
                <div className="p-4 bg-blue-900/50 rounded-lg border border-cyan-500/30">
                  <div className="text-2xl mb-2">🤖</div>
                  <p className="font-semibold text-cyan-200">AI Ethics</p>
                  <p className="text-blue-100">Understand the real-world implications of AI technology</p>
                </div>
                <div className="p-4 bg-blue-900/50 rounded-lg border border-cyan-500/30">
                  <div className="text-2xl mb-2">🌍</div>
                  <p className="font-semibold text-cyan-200">Social Impact</p>
                  <p className="text-blue-100">Explore how technology affects communities and sustainability</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

