import { motion } from 'framer-motion';
import { Indicator } from '../types/game';

interface ScoreCardProps {
  scores: {
    peopleHelped: number;
    harmPrevented: number;
    ethicalScore: number;
    sustainabilityScore: number;
  };
  indicators: Indicator;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ scores, indicators }) => {
  const scoreItems = [
    { label: 'People Helped', value: scores.peopleHelped, color: 'green' },
    { label: 'Harm Prevented', value: scores.harmPrevented, color: 'blue' },
    { label: 'Ethical Balance', value: scores.ethicalScore, color: 'purple' },
    { label: 'Sustainability', value: scores.sustainabilityScore, color: 'orange' }
  ];

  return (
    <div className="card">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Final Scores</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {scoreItems.map((item, index) => {
          const colorClasses = {
            green: 'bg-green-500',
            blue: 'bg-blue-500',
            purple: 'bg-purple-500',
            orange: 'bg-orange-500'
          }[item.color];

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`${colorClasses} text-white rounded-full w-24 h-24 mx-auto mb-3 flex items-center justify-center text-2xl font-bold`}>
                {item.value}
              </div>
              <h3 className="font-semibold text-gray-800">{item.label}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Community Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Public Trust:</span>
            <span className={indicators.publicTrust > 50 ? 'text-green-600' : 'text-red-600'}>
              {indicators.publicTrust > 50 ? 'Strong' : 'Weak'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Inequality:</span>
            <span className={indicators.inequality < 50 ? 'text-green-600' : 'text-red-600'}>
              {indicators.inequality < 50 ? 'Low' : 'High'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Safety:</span>
            <span className={indicators.safety > 50 ? 'text-green-600' : 'text-red-600'}>
              {indicators.safety > 50 ? 'Secure' : 'At Risk'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;

