import { motion } from 'framer-motion';
import { Scenario } from '../types/game';

interface ScenarioCardProps {
  scenario: Scenario;
  onClick: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="card cursor-pointer h-full hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <div className="text-5xl mb-4">{scenario.thumbnail}</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{scenario.name}</h2>
      <p className="text-gray-600 mb-4 leading-relaxed">{scenario.description}</p>
      
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">Key Challenges:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {scenario.challenges.map((challenge, idx) => (
            <li key={idx} className="text-sm">{challenge}</li>
          ))}
        </ul>
      </div>

      <button className="btn-primary w-full mt-4">
        Start This Scenario
      </button>
    </motion.div>
  );
};

export default ScenarioCard;

