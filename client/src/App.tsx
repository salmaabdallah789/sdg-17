import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import DeveloperPage from './pages/DeveloperPage';
import LandingPage from './pages/LandingPage';
import CharacterCreationPage from './pages/CharacterCreationPage';
import StoryIntroPage from './pages/StoryIntroPage';
import SimulationDashboard from './pages/SimulationDashboard';
import FinalSummary from './pages/FinalSummary';
import ProposalPage from './pages/ProposalPage';
import SubmissionPage from './pages/SubmissionPage';
import AIDetectivePage from './pages/AIDetectivePage';
import BuildBreakFixPage from './pages/BuildBreakFixPage';
import FutureTravelerPage from './pages/FutureTravelerPage';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DeveloperPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/character" element={<CharacterCreationPage />} />
          <Route path="/story-intro" element={<StoryIntroPage />} />
          <Route path="/simulate" element={<SimulationDashboard />} />
          <Route path="/summary" element={<FinalSummary />} />
          <Route path="/proposal" element={<ProposalPage />} />
          <Route path="/submission" element={<SubmissionPage />} />
          <Route path="/ai-detective" element={<AIDetectivePage />} />
          <Route path="/build-break-fix" element={<BuildBreakFixPage />} />
          <Route path="/future-traveler" element={<FutureTravelerPage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;

