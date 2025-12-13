export interface Indicator {
  publicTrust: number;
  inequality: number;
  budget: number;
  safety: number;
  ethicalBalance: number;
  resilience: number;
  accessToServices: number;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  pros: string;
  cons: string;
  icon: string;
}

export interface DecisionOption {
  id: string;
  text: string;
  effects: {
    publicTrust?: number;
    inequality?: number;
    budget?: number;
    safety?: number;
    ethicalBalance?: number;
    resilience?: number;
    accessToServices?: number;
    logMessage?: string;
  };
}

export interface DecisionQuestion {
  id: string;
  prompt: string;
  description: string;
  options: DecisionOption[];
}

export interface Round {
  id: string;
  title: string;
  situation: string;
  tools: AITool[];
  decisionQuestions: DecisionQuestion[];
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  challenges: string[];
  thumbnail: string;
  initialBudget: number;
  initialIndicators: Indicator;
  rounds: Round[];
}

export interface Decision {
  questionId: string;
  optionId: string;
  questionText: string;
  optionText: string;
  toolsUsed?: string[];
  effects: DecisionOption['effects'];
}

export interface GameState {
  scenario: Scenario;
  currentRoundIndex: number;
  indicators: Indicator;
  decisions: Decision[];
  log: string[];
  year: number;
}

export interface FinalSummary {
  scenario: {
    name: string;
    context: string;
  };
  scores: {
    peopleHelped: number;
    harmPrevented: number;
    ethicalScore: number;
    sustainabilityScore: number;
  };
  mostUsedTools: string[];
  ethicalDilemma: {
    question: string;
    choice: string;
    impact: number;
  } | null;
  lesson: string;
  finalIndicators: Indicator;
}

