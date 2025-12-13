import { motion } from 'framer-motion';
import { GameState } from '../types/game';

interface IndicatorPanelProps {
  gameState: GameState;
}

const IndicatorPanel: React.FC<IndicatorPanelProps> = ({ gameState }) => {
  const { scenario, indicators, year } = gameState;

  const IndicatorBar: React.FC<{ label: string; value: number; color: string }> = ({
    label,
    value,
    color
  }) => {
    const percentage = Math.max(0, Math.min(100, value));
    const colorClass = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    }[color] || 'bg-gray-500';

    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="text-gray-600">{Math.round(percentage)}%</span>
        </div>
        <div className="indicator-bar">
          <motion.div
            className={`indicator-fill ${colorClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="card sticky top-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{scenario.name}</h2>
      <p className="text-sm text-gray-600 mb-6">{scenario.description}</p>

      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="text-3xl font-bold text-primary-600 mb-1">{year}</div>
        <div className="text-sm text-gray-500">Current Year</div>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="text-3xl font-bold text-secondary-600 mb-1">
          ${indicators.budget.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">Remaining Budget</div>
      </div>

      <h3 className="font-semibold text-gray-800 mb-4">Key Indicators</h3>
      
      <IndicatorBar label="Public Trust" value={indicators.publicTrust} color="blue" />
      <IndicatorBar label="Inequality" value={indicators.inequality} color="red" />
      <IndicatorBar label="Safety" value={indicators.safety} color="green" />
      <IndicatorBar label="Ethical Balance" value={indicators.ethicalBalance} color="purple" />
      <IndicatorBar label="Resilience" value={indicators.resilience} color="orange" />
      <IndicatorBar label="Access to Services" value={indicators.accessToServices} color="yellow" />
    </div>
  );
};

export default IndicatorPanel;

