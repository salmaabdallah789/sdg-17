import { useState } from 'react';
import { motion } from 'framer-motion';
import { Round, Decision } from '../types/game';
import AIToolCard from './AIToolCard';
import DecisionQuestionCard from './DecisionQuestionCard';

interface RoundCardProps {
  round: Round;
  onDecision: (decision: Decision) => void;
  roundNumber: number;
  totalRounds: number;
}

const RoundCard: React.FC<RoundCardProps> = ({ round, onDecision, roundNumber, totalRounds }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const allQuestionsAnswered = round.decisionQuestions.every(
      q => selectedOptions[q.id]
    );

    if (!allQuestionsAnswered) {
      alert('Please answer all questions before proceeding.');
      return;
    }

    // Process each decision
    round.decisionQuestions.forEach(question => {
      const optionId = selectedOptions[question.id];
      const option = question.options.find(opt => opt.id === optionId);
      
      if (option) {
        const decision: Decision = {
          questionId: question.id,
          optionId: option.id,
          questionText: question.prompt,
          optionText: option.text,
          effects: option.effects
        };
        onDecision(decision);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900">{round.title}</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Round {roundNumber} of {totalRounds}
          </span>
        </div>
        
        <p className="text-gray-700 leading-relaxed mb-6">{round.situation}</p>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Available AI Tools</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {round.tools.map(tool => (
              <AIToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {round.decisionQuestions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DecisionQuestionCard
              question={question}
              selectedOption={selectedOptions[question.id]}
              onSelect={(optionId) => handleOptionSelect(question.id, optionId)}
            />
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="btn-primary w-full text-lg py-4"
      >
        Make Decisions & Continue
      </motion.button>
    </div>
  );
};

export default RoundCard;

