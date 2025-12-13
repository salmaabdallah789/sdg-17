import { useEffect } from 'react';

const BuildBreakFixPage = () => {
  useEffect(() => {
    // Redirect to the standalone game HTML file
    window.location.href = '/build-break-fix/index.html';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">🔧</div>
        <p className="text-xl text-gray-700">Loading Build–Break–Fix game...</p>
      </div>
    </div>
  );
};

export default BuildBreakFixPage;

