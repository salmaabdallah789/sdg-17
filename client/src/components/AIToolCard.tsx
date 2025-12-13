import { AITool } from '../types/game';

interface AIToolCardProps {
  tool: AITool;
}

const AIToolCard: React.FC<AIToolCardProps> = ({ tool }) => {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-4">
      <div className="flex items-start mb-2">
        <span className="text-2xl mr-3">{tool.icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{tool.name}</h4>
          <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
        </div>
      </div>
      <div className="mt-3 text-xs space-y-1">
        <div className="text-green-700">
          <span className="font-semibold">✓</span> {tool.pros}
        </div>
        <div className="text-red-700">
          <span className="font-semibold">✗</span> {tool.cons}
        </div>
      </div>
    </div>
  );
};

export default AIToolCard;

