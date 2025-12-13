import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import LandingPage from './pages/LandingPage';
import ScenarioSelection from './pages/ScenarioSelection';
import SimulationDashboard from './pages/SimulationDashboard';
import FinalSummary from './pages/FinalSummary';
import ProposalPage from './pages/ProposalPage';
import SubmissionPage from './pages/SubmissionPage';
import AIDetectivePage from './pages/AIDetectivePage';
import BuildBreakFixPage from './pages/BuildBreakFixPage';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/scenarios" element={<ScenarioSelection />} />
          <Route path="/simulate/:scenarioId" element={<SimulationDashboard />} />
          <Route path="/summary" element={<FinalSummary />} />
          <Route path="/proposal" element={<ProposalPage />} />
          <Route path="/submission" element={<SubmissionPage />} />
          <Route path="/ai-detective" element={<AIDetectivePage />} />
          <Route path="/build-break-fix" element={<BuildBreakFixPage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;

