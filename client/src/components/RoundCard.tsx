import { useState } from 'react';
import { motion } from 'framer-motion';
import { Round, Decision, GameState } from '../types/game';
import AIToolCard from './AIToolCard';
import DecisionQuestionCard from './DecisionQuestionCard';
import { useGame } from '../contexts/GameContext';

interface RoundCardProps {
  round: Round;
  onDecision: (decision: Decision) => void;
  roundNumber: number;
  totalRounds: number;
}

const RoundCard: React.FC<RoundCardProps> = ({ round, onDecision, roundNumber, totalRounds }) => {
  const { gameState } = useGame();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [usedTools, setUsedTools] = useState<Set<string>>(new Set());
  const [toolCosts, setToolCosts] = useState<Record<string, number>>({});
  
  const currentBudget = gameState?.indicators.budget || 0;

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleToolUse = (toolId: string) => {
    const tool = round.tools.find(t => t.id === toolId);
    if (tool && tool.cost) {
      const newCost = (toolCosts[toolId] || 0) + tool.cost;
      setToolCosts(prev => ({ ...prev, [toolId]: newCost }));
      setUsedTools(prev => new Set(prev).add(toolId));
    }
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

      // Calculate total tool costs
      const totalToolCost = Object.values(toolCosts).reduce((sum, cost) => sum + cost, 0);
      
      // Check if player can afford the tools they used
      if (totalToolCost > currentBudget) {
        alert(`Insufficient budget! Total tool costs: $${totalToolCost.toLocaleString()}, Available: $${currentBudget.toLocaleString()}`);
        return;
      }

      // Process each decision
      round.decisionQuestions.forEach(question => {
        const optionId = selectedOptions[question.id];
        const option = question.options.find(opt => opt.id === optionId);
        
        if (option) {
          // Deduct tool costs from budget in effects
          const toolCostEffect = totalToolCost > 0 ? { budget: -totalToolCost } : {};
          
          const decision: Decision = {
            questionId: question.id,
            optionId: option.id,
            questionText: question.prompt,
            optionText: option.text,
            effects: {
              ...option.effects,
              ...toolCostEffect
            },
            toolsUsed: Array.from(usedTools),
            toolCosts: toolCosts
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-800">
              Available AI Tools
              <span className="ml-2 text-sm font-normal text-gray-500">
                (Click to use and get insights)
              </span>
            </h3>
            {Object.keys(toolCosts).length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Tool Costs: </span>
                <span className="text-red-600 font-bold">
                  ${Object.values(toolCosts).reduce((sum, cost) => sum + cost, 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {round.tools.map(tool => {
              // Calculate remaining budget: subtract costs of all already used tools
              // If current tool is already used, its cost is already in toolCosts
              const usedToolCosts = Object.values(toolCosts).reduce((sum, cost) => sum + cost, 0);
              const remainingBudget = currentBudget - usedToolCosts;
              
              return (
                <AIToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onUse={handleToolUse}
                  currentBudget={remainingBudget}
                />
              );
            })}
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

