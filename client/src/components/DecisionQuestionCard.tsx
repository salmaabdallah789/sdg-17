import { motion } from 'framer-motion';
import { DecisionQuestion } from '../types/game';

interface DecisionQuestionCardProps {
  question: DecisionQuestion;
  selectedOption: string | undefined;
  onSelect: (optionId: string) => void;
}

const DecisionQuestionCard: React.FC<DecisionQuestionCardProps> = ({
  question,
  selectedOption,
  onSelect
}) => {
  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{question.prompt}</h3>
      <p className="text-gray-600 mb-4 text-sm">{question.description}</p>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedOption === option.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedOption === option.id
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300'
            }`}>
                {selectedOption === option.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="text-gray-800">{option.text}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DecisionQuestionCard;

