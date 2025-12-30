# AI & Social Impact Games: Future Decisions Simulation

A browser-based decision-making simulation game where students explore future society challenges, AI tools, ethics, and long-term impact.

## Tagline
"It's 2035. Your community is in crisis. You have AI, a shrinking budget, and tough choices. Can you help people without leaving anyone behind?"

## Tech Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS, React Router, Framer Motion
- **Backend**: Node.js with Express
- **State Management**: React Context API

## Installation

1. Install all dependencies:
```bash
npm run install-all
```

Or manually:
```bash
npm install
cd server && npm install
cd ../client && npm install
```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run separately:

**Backend** (runs on http://localhost:5000):
```bash
npm run server
```

**Frontend** (runs on http://localhost:3000):
```bash
npm run client
```

### Production Build

```bash
npm run build
```

## Game Flow

1. **Landing Page**: Introduction and "Start Simulation" button
2. **Scenario Selection**: Choose from 4+ scenarios (Climate, Health, Education, Inequality)
3. **Simulation Dashboard**: Main game screen with rounds, decisions, and consequences
4. **Final Summary**: Review your impact and ethical balance
5. **Strategy Card**: Exportable summary of your decisions and lessons learned

## Project Structure

```
SDG-17/
├── server/          # Node.js backend
├── client/          # React frontend
└── README.md
```

## Core Concepts

- **Scenarios**: Different community challenges (floods, health crises, education gaps, inequality)
- **Rounds**: Multiple decision points within each scenario
- **AI Tools**: Predictive models, chatbots, image recognition, early warning systems
- **Indicators**: Public Trust, Inequality, Budget, Safety, Ethical Balance
- **Consequences**: Every decision affects multiple indicators and creates trade-offs

## License

MIT

