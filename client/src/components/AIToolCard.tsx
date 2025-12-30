import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AITool } from '../types/game';

interface AIToolCardProps {
  tool: AITool;
  onUse?: (toolId: string) => void;
  currentBudget?: number;
}

const AIToolCard: React.FC<AIToolCardProps> = ({ tool, onUse, currentBudget = 0 }) => {
  const [isUsed, setIsUsed] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const canAfford = currentBudget >= (tool.cost || 0);

  const handleUse = () => {
    if (!canAfford) {
      alert(`Insufficient budget! This tool costs $${tool.cost || 0}, but you only have $${currentBudget.toLocaleString()}.`);
      return;
    }
    
    setIsUsed(true);
    setShowInsight(true);
    if (onUse) {
      onUse(tool.id);
    }
  };

  const generateInsight = () => {
    // Generate contextual insight based on tool
    const insights: Record<string, string> = {
      'flood_prediction_model': 'The AI model predicts high flood risk in 3 neighborhoods. However, 2 of these areas have limited historical data, so confidence is lower. Consider supplementing with ground surveys.',
      'emergency_alert_chatbot': 'Analysis shows 40% of low-income residents may not receive alerts due to outdated contact info. Recommend community outreach to update databases before deployment.',
      'satellite_damage_detection': 'Satellite analysis can quickly identify major damage, but may miss 15-20% of issues in informal settlements not visible from above. Combine with on-ground verification.',
      'aid_allocation_ai': 'AI suggests optimal resource distribution, but may favor areas with better data quality. Manually verify recommendations for underserved communities.',
      'disease_prediction': 'The model identifies 5 high-risk zones, but 2 are in areas with limited testing data. Consider increasing testing in these zones to improve prediction accuracy.',
      'contact_tracing_app': 'App adoption analysis shows 65% coverage in high-income areas but only 35% in low-income neighborhoods. This gap could create blind spots in tracking.',
      'predictive_healthcare': 'AI can identify high-risk patients, but historical bias in training data may underrepresent certain demographics. Review model fairness before full deployment.',
      'smart_traffic_management': 'Traffic optimization could reduce commute times by 20%, but may prioritize routes through wealthier areas. Ensure equitable distribution of benefits.',
      'resource_allocation_ai': 'AI suggests optimal resource distribution, but may favor areas with better data quality. Manually verify recommendations for underserved communities.',
      'education_ai_tutor': 'AI tutoring shows promise but requires internet access. 30% of students lack reliable connectivity, which could widen the education gap.',
      'job_matching_ai': 'The matching algorithm works well for formal sector jobs but struggles with informal economy opportunities. Consider expanding training data.'
    };
    
    // If we have a specific insight, use it
    if (insights[tool.id]) {
      return insights[tool.id];
    }
    
    // Otherwise, generate a contextual insight based on pros/cons
    return `Using ${tool.name} could provide valuable insights: ${tool.pros.toLowerCase()}. However, ${tool.cons.toLowerCase()}. Consider these trade-offs when making decisions.`;
  };

  return (
    <div className={`bg-gradient-to-br from-primary-50 to-secondary-50 border-2 rounded-lg p-4 transition-all ${
      isUsed 
        ? 'border-primary-400 bg-primary-100' 
        : canAfford 
          ? 'border-primary-200 hover:border-primary-300 cursor-pointer' 
          : 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
    }`}
    onClick={!isUsed && canAfford ? handleUse : undefined}>
      <div className="flex items-start mb-2">
        <span className="text-2xl mr-3">{tool.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{tool.name}</h4>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${
                canAfford ? 'text-green-600' : 'text-red-600'
              }`}>
                ${(tool.cost || 0).toLocaleString()}
              </span>
              {isUsed && (
                <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full">Used</span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
        </div>
      </div>
      {!canAfford && !isUsed && (
        <div className="mb-2 text-xs text-red-600 font-semibold">
          ⚠️ Insufficient budget
        </div>
      )}
      <div className="mt-3 text-xs space-y-1">
        <div className="text-green-700">
          <span className="font-semibold">✓</span> {tool.pros}
        </div>
        <div className="text-red-700">
          <span className="font-semibold">✗</span> {tool.cons}
        </div>
      </div>
      
      <AnimatePresence>
        {showInsight && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-primary-300"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <span className="text-lg mr-2">💡</span>
                <div>
                  <p className="text-xs font-semibold text-blue-900 mb-1">AI Insight:</p>
                  <p className="text-xs text-blue-800 leading-relaxed">{tool.insight || generateInsight()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIToolCard;

