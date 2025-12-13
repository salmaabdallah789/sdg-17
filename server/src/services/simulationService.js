/**
 * Calculate the impact of a decision on game indicators
 */
export const calculateDecisionImpact = (currentState, decision) => {
  const { questionId, optionId, effects } = decision;
  
  // Apply effects to current state
  const updatedState = {
    ...currentState,
    indicators: {
      publicTrust: Math.max(0, Math.min(100, currentState.indicators.publicTrust + (effects.publicTrust || 0))),
      inequality: Math.max(0, Math.min(100, currentState.indicators.inequality + (effects.inequality || 0))),
      budget: Math.max(0, currentState.indicators.budget + (effects.budget || 0)),
      safety: Math.max(0, Math.min(100, currentState.indicators.safety + (effects.safety || 0))),
      ethicalBalance: Math.max(0, Math.min(100, currentState.indicators.ethicalBalance + (effects.ethicalBalance || 0))),
      resilience: Math.max(0, Math.min(100, currentState.indicators.resilience + (effects.resilience || 0))),
      accessToServices: Math.max(0, Math.min(100, currentState.indicators.accessToServices + (effects.accessToServices || 0)))
    },
    decisions: [...(currentState.decisions || []), decision],
    log: [...(currentState.log || []), effects.logMessage || 'Decision made']
  };

  return {
    updatedState,
    immediateEffects: effects
  };
};

/**
 * Generate final summary and strategy card
 */
export const generateFinalSummary = (gameState) => {
  const { scenario, indicators, decisions } = gameState;
  
  // Calculate scores
  const peopleHelped = Math.round(indicators.safety * 10);
  const harmPrevented = Math.round((100 - indicators.inequality) * 5);
  const ethicalScore = indicators.ethicalBalance;
  const sustainabilityScore = Math.round(
    (indicators.resilience + indicators.publicTrust + (100 - indicators.inequality)) / 3
  );

  // Find most used tools
  const toolUsage = {};
  decisions.forEach(decision => {
    if (decision.toolsUsed) {
      decision.toolsUsed.forEach(tool => {
        toolUsage[tool] = (toolUsage[tool] || 0) + 1;
      });
    }
  });

  const mostUsedTools = Object.entries(toolUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tool]) => tool);

  // Find ethical dilemma with most impact
  const ethicalDecisions = decisions.filter(d => 
    Math.abs(d.effects?.ethicalBalance || 0) > 5
  );
  const biggestEthicalImpact = ethicalDecisions.length > 0 
    ? ethicalDecisions.reduce((max, d) => 
        Math.abs(d.effects?.ethicalBalance || 0) > Math.abs(max.effects?.ethicalBalance || 0) ? d : max
      )
    : null;

  // Generate lesson
  const lessons = generateLesson(indicators, decisions);

  return {
    scenario: {
      name: scenario.name,
      context: scenario.description
    },
    scores: {
      peopleHelped,
      harmPrevented,
      ethicalScore,
      sustainabilityScore
    },
    mostUsedTools,
    ethicalDilemma: biggestEthicalImpact ? {
      question: biggestEthicalImpact.questionText,
      choice: biggestEthicalImpact.optionText,
      impact: biggestEthicalImpact.effects?.ethicalBalance
    } : null,
    lesson: lessons,
    finalIndicators: indicators
  };
};

/**
 * Generate a lesson based on player decisions
 */
const generateLesson = (indicators, decisions) => {
  if (indicators.ethicalBalance < 30) {
    return "Prioritizing efficiency over ethics can leave vulnerable groups behind. Balancing speed with fairness requires careful consideration of who benefits and who is excluded.";
  }
  if (indicators.inequality > 70) {
    return "Focusing on immediate solutions without addressing systemic inequality creates deeper divides. Long-term stability requires ensuring equal access to resources and opportunities.";
  }
  if (indicators.publicTrust < 30) {
    return "Transparency and inclusion build trust. When communities feel excluded from decision-making, even effective solutions can fail due to lack of public support.";
  }
  if (indicators.budget < 20) {
    return "Short-term cost savings can lead to long-term crises. Investing in resilient infrastructure and inclusive systems prevents future emergencies.";
  }
  if (indicators.ethicalBalance > 70 && indicators.safety > 60) {
    return "Balancing ethical considerations with practical needs is challenging but possible. Your approach shows that inclusive, privacy-aware solutions can still be effective.";
  }
  return "Every decision involves trade-offs. The key is understanding who benefits, who is affected, and how choices today shape the community's future.";
};

