import { motion, AnimatePresence } from 'framer-motion';
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
  const selectedOptionData = selectedOption 
    ? question.options.find(opt => opt.id === selectedOption)
    : null;

  const formatImpact = (value: number | undefined, label: string) => {
    if (value === undefined || value === 0) return null;
    const isPositive = value > 0;
    const absValue = Math.abs(value);
    return {
      value: absValue,
      label,
      isPositive,
      icon: isPositive ? '↑' : '↓',
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-50' : 'bg-red-50',
      borderColor: isPositive ? 'border-green-200' : 'border-red-200'
    };
  };

  const impacts = selectedOptionData?.effects ? [
    formatImpact(selectedOptionData.effects.publicTrust, 'Public Trust'),
    formatImpact(selectedOptionData.effects.inequality, 'Inequality'),
    formatImpact(selectedOptionData.effects.budget, 'Budget'),
    formatImpact(selectedOptionData.effects.safety, 'Safety'),
    formatImpact(selectedOptionData.effects.ethicalBalance, 'Ethical Balance'),
    formatImpact(selectedOptionData.effects.resilience, 'Resilience'),
    formatImpact(selectedOptionData.effects.accessToServices, 'Access to Services')
  ].filter(Boolean) : [];

  const positiveImpacts = impacts.filter(i => i?.isPositive).length;
  const negativeImpacts = impacts.filter(i => !i?.isPositive).length;

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

      <AnimatePresence>
        {selectedOptionData && impacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">📊</span>
                Impact Preview:
              </h4>
              <div className={`p-3 rounded-lg border-2 ${
                positiveImpacts > negativeImpacts 
                  ? 'bg-green-50 border-green-200' 
                  : positiveImpacts < negativeImpacts
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {impacts.map((impact, idx) => (
                    impact && (
                      <div key={idx} className={`flex items-center justify-between p-2 rounded ${impact.bgColor} border ${impact.borderColor}`}>
                        <span className="text-xs font-medium text-gray-700">{impact.label}:</span>
                        <span className={`text-xs font-bold ${impact.color} flex items-center`}>
                          {impact.icon} {impact.value}
                        </span>
                      </div>
                    )
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <p className={`text-xs font-semibold ${
                    positiveImpacts > negativeImpacts 
                      ? 'text-green-700' 
                      : positiveImpacts < negativeImpacts
                      ? 'text-red-700'
                      : 'text-yellow-700'
                  }`}>
                    {positiveImpacts > negativeImpacts 
                      ? '✓ Overall positive impact expected'
                      : positiveImpacts < negativeImpacts
                      ? '⚠️ Overall negative impact expected'
                      : '⚖️ Mixed impact - trade-offs involved'}
                  </p>
                </div>
              </div>
            </div>
            {selectedOptionData.effects.logMessage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <span className="font-semibold">💭 Consequence:</span> {selectedOptionData.effects.logMessage}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DecisionQuestionCard;

