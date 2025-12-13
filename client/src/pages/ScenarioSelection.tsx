import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Scenario } from '../types/game';
import ScenarioCard from '../components/ScenarioCard';

const ScenarioSelection = () => {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already submitted
    const isSubmitted = localStorage.getItem('future-decisions-submitted') === 'true';
    if (isSubmitted) {
      navigate('/submission');
      return;
    }

    const fetchScenarios = async () => {
      try {
        const data = await apiService.getScenarios();
        setScenarios(data);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScenarios();
  }, [navigate]);

  const handleSelectScenario = (scenario: Scenario) => {
    // Don't call startGame here - let SimulationDashboard load the full scenario
    navigate(`/simulate/${scenario.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading scenarios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Choose Your Scenario</h1>
          <p className="text-xl text-gray-600">
            Each scenario presents unique challenges and ethical dilemmas
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ScenarioCard
                scenario={scenario}
                onClick={() => handleSelectScenario(scenario)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelection;

