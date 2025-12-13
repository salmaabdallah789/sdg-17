import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AIDetectivePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the standalone game
    window.location.href = '/ai-detective/index.html';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading AI Detective...</h1>
        <p className="text-gray-600">Redirecting to the game...</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 btn-secondary"
        >
          ← Back to Games
        </button>
      </div>
    </div>
  );
};

export default AIDetectivePage;

