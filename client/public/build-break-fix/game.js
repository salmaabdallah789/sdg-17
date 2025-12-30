/* AI & Social Impact Games: Build–Break–Fix (AI Edition) - Game Logic
 * 
 * INSTRUCTIONS: Open index.html in a web browser to play.
 * No server required - runs entirely in the browser.
 * 
 * Game Flow:
 * Splash → How to Play → Challenge Select → BUILD → BREAK → FIX → Summary
 * (Repeat 3 times) → Final Results
 */

// ===== GAME STATE =====
const gameState = {
    currentScreen: 'splash',
    currentChallenge: null,
    currentRound: 0,
    totalRounds: 3,
    rounds: [],
    phase: 'build', // build, break, fix
    timeRemaining: 120, // 2 minutes per phase
    
    // Build phase selections
    selectedProblem: null,
    selectedUsers: null,
    selectedApproach: null,
    selectedData: [],
    selectedMetric: null,
    
    // Break phase selections
    selectedRisks: [],
    
    // Fix phase selections
    selectedEthics: [],
    selectedGovernance: null,
    selectedPartners: [],
    selectedFeasibility: null,
    
    // Scores
    impactScore: 0,
    ethicsScore: 0,
    feasibilityScore: 0,
    innovationScore: 0,
    partnershipScore: 0,
    riskDebt: 100,
    reputation: 50
};

// ===== SOUND HOOKS =====
const soundEffects = {
    play: function(soundName) {
        console.log(`[Sound] Playing: ${soundName}`);
    }
};

// ===== GAME DATA =====

const challenges = [
    {
        id: 'flood-alert',
        title: 'Flood Alert Now',
        icon: '🌊',
        sdg: 'SDG 11 & 13',
        sdgIcon: '🏙️',
        description: 'Disaster preparedness system needs AI enhancement, but must avoid inequality in alerts.',
        constraints: {
            budget: 'Limited',
            time: 'Urgent',
            connectivity: 'Variable'
        },
        problems: [
            { id: 'p1', name: 'Early Warning System', description: 'Predict floods 48 hours in advance' },
            { id: 'p2', name: 'Evacuation Routing', description: 'Optimize safe evacuation paths' },
            { id: 'p3', name: 'Resource Allocation', description: 'Distribute emergency supplies efficiently' }
        ],
        targetUsers: [
            { id: 'u1', name: 'All Residents', description: 'Entire city population' },
            { id: 'u2', name: 'Low-Income Areas', description: 'Vulnerable neighborhoods first' },
            { id: 'u3', name: 'Critical Infrastructure', description: 'Hospitals, schools, utilities' }
        ],
        aiApproaches: [
            { id: 'a1', name: 'Classification', description: 'Classify flood risk levels' },
            { id: 'a2', name: 'Forecasting', description: 'Predict flood timing and severity' },
            { id: 'a3', name: 'Chatbot', description: 'Answer questions and send alerts' },
            { id: 'a4', name: 'Computer Vision', description: 'Analyze satellite imagery' },
            { id: 'a5', name: 'Recommendation', description: 'Recommend evacuation routes' }
        ],
        dataSources: [
            { id: 'd1', name: 'Weather APIs', description: 'Real-time weather data' },
            { id: 'd2', name: 'Satellite Imagery', description: 'Historical flood patterns' },
            { id: 'd3', name: 'Social Media', description: 'Crowdsourced reports' },
            { id: 'd4', name: 'Sensor Networks', description: 'River level sensors' },
            { id: 'd5', name: 'Census Data', description: 'Population demographics' },
            { id: 'd6', name: 'Mobile Location', description: 'GPS tracking data' }
        ],
        successMetrics: [
            { id: 'm1', name: 'Alert Accuracy', description: 'Percentage of accurate predictions' },
            { id: 'm2', name: 'Response Time', description: 'Time to reach all residents' },
            { id: 'm3', name: 'Coverage Rate', description: 'Percentage of population reached' },
            { id: 'm4', name: 'Cost Efficiency', description: 'Cost per person alerted' }
        ],
        risks: [
            { id: 'r1', name: 'Digital Divide', description: 'Low-income areas lack smartphones', isReal: true },
            { id: 'r2', name: 'Language Barriers', description: 'Alerts not in local languages', isReal: true },
            { id: 'r3', name: 'Data Bias', description: 'Historical data missing informal settlements', isReal: true },
            { id: 'r4', name: 'Privacy Invasion', description: 'GPS tracking raises privacy concerns', isReal: true },
            { id: 'r5', name: 'False Alarms', description: 'Over-prediction causes alert fatigue', isReal: true },
            { id: 'r6', name: 'Server Downtime', description: 'System crashes during peak usage', isReal: false },
            { id: 'r7', name: 'Slow Internet', description: 'Network congestion delays alerts', isReal: false },
            { id: 'r8', name: 'Battery Drain', description: 'App uses too much phone battery', isReal: false }
        ],
        ethicsOptions: [
            { id: 'e1', name: 'Privacy Protection', description: 'Minimize data collection, anonymize', impact: { ethics: 15, feasibility: -5 } },
            { id: 'e2', name: 'Fairness Auditing', description: 'Test on diverse populations', impact: { ethics: 12, feasibility: -3 } },
            { id: 'e3', name: 'Transparency', description: 'Explain how predictions work', impact: { ethics: 10, feasibility: -2 } },
            { id: 'e4', name: 'Accessibility', description: 'Multiple languages, offline options', impact: { ethics: 12, feasibility: -4 } },
            { id: 'e5', name: 'Human Oversight', description: 'Experts review critical decisions', impact: { ethics: 8, feasibility: -6 } },
            { id: 'e6', name: 'Consent Mechanisms', description: 'Opt-in for location tracking', impact: { ethics: 10, feasibility: -3 } }
        ],
        governanceOptions: [
            { id: 'g1', name: 'Community Consent', description: 'Residents approve data use', impact: { ethics: 15, feasibility: -5 } },
            { id: 'g2', name: 'Regular Audits', description: 'Third-party bias testing', impact: { ethics: 12, feasibility: -4 } },
            { id: 'g3', name: 'Documentation', description: 'Clear records of decisions', impact: { ethics: 8, feasibility: -2 } },
            { id: 'g4', name: 'Appeals Process', description: 'Residents can challenge alerts', impact: { ethics: 10, feasibility: -3 } }
        ],
        partnerOptions: [
            { id: 'p1', name: 'Local Government', description: 'City emergency services', impact: { feasibility: 15, partnership: 15 } },
            { id: 'p2', name: 'NGOs', description: 'Disaster relief organizations', impact: { feasibility: 12, partnership: 12 } },
            { id: 'p3', name: 'Telecom Companies', description: 'SMS and network infrastructure', impact: { feasibility: 10, partnership: 8 } },
            { id: 'p4', name: 'Community Centers', description: 'Local outreach hubs', impact: { feasibility: 12, partnership: 15 } },
            { id: 'p5', name: 'Schools', description: 'Education and distribution', impact: { feasibility: 10, partnership: 10 } },
            { id: 'p6', name: 'Youth Organizations', description: 'Volunteer networks', impact: { feasibility: 8, partnership: 12 } }
        ],
        feasibilityOptions: [
            { id: 'f1', name: 'Phased Rollout', description: 'Start small, scale gradually', impact: { feasibility: 15, impact: 5 } },
            { id: 'f2', name: 'Open Source', description: 'Use free tools, reduce costs', impact: { feasibility: 12, impact: 3 } },
            { id: 'f3', name: 'Public-Private Partnership', description: 'Share costs with companies', impact: { feasibility: 10, impact: 8 } },
            { id: 'f4', name: 'Volunteer Team', description: 'Community members help build', impact: { feasibility: 8, impact: 5 } }
        ],
        bestPath: {
            problem: 'p1',
            users: 'u2',
            approach: 'a2',
            data: ['d1', 'd4'],
            metric: 'm3',
            risks: ['r1', 'r2', 'r3'],
            ethics: ['e1', 'e4'],
            governance: 'g1',
            partners: ['p1', 'p4'],
            feasibility: 'f1'
        }
    },
    {
        id: 'clinic-queue',
        title: 'Clinic Queue Chaos',
        icon: '🏥',
        sdg: 'SDG 3',
        sdgIcon: '💊',
        description: 'Healthcare access system needs AI triage, but must ensure fairness across all patients.',
        constraints: {
            budget: 'Tight',
            time: 'Immediate',
            connectivity: 'Good'
        },
        problems: [
            { id: 'p1', name: 'Triage Optimization', description: 'Prioritize patients by urgency' },
            { id: 'p2', name: 'Wait Time Prediction', description: 'Estimate wait times accurately' },
            { id: 'p3', name: 'Resource Scheduling', description: 'Optimize doctor and room allocation' }
        ],
        targetUsers: [
            { id: 'u1', name: 'All Patients', description: 'Everyone seeking care' },
            { id: 'u2', name: 'Emergency Cases', description: 'Critical patients first' },
            { id: 'u3', name: 'Underserved Communities', description: 'Low-income, rural areas' }
        ],
        aiApproaches: [
            { id: 'a1', name: 'Classification', description: 'Classify urgency levels' },
            { id: 'a2', name: 'Forecasting', description: 'Predict patient flow' },
            { id: 'a3', name: 'Chatbot', description: 'Pre-screen symptoms' },
            { id: 'a4', name: 'Recommendation', description: 'Suggest appointment times' }
        ],
        dataSources: [
            { id: 'd1', name: 'Medical Records', description: 'Patient history' },
            { id: 'd2', name: 'Symptom Reports', description: 'Patient descriptions' },
            { id: 'd3', name: 'Vital Signs', description: 'Real-time health metrics' },
            { id: 'd4', name: 'Historical Data', description: 'Past clinic patterns' },
            { id: 'd5', name: 'Insurance Data', description: 'Coverage information' },
            { id: 'd6', name: 'Social Determinants', description: 'Socioeconomic factors' }
        ],
        successMetrics: [
            { id: 'm1', name: 'Wait Time Reduction', description: 'Average minutes saved' },
            { id: 'm2', name: 'Triage Accuracy', description: 'Correct priority assignment' },
            { id: 'm3', name: 'Patient Satisfaction', description: 'Satisfaction scores' },
            { id: 'm4', name: 'Resource Utilization', description: 'Efficiency of staff/rooms' }
        ],
        risks: [
            { id: 'r1', name: 'Bias Against Minorities', description: 'AI under-prioritizes certain groups', isReal: true },
            { id: 'r2', name: 'Language Barriers', description: 'Non-native speakers misclassified', isReal: true },
            { id: 'r3', name: 'Data Gaps', description: 'Missing records for uninsured patients', isReal: true },
            { id: 'r4', name: 'Privacy Violations', description: 'Health data shared without consent', isReal: true },
            { id: 'r5', name: 'Over-Reliance', description: 'Doctors trust AI too much, miss cases', isReal: true },
            { id: 'r6', name: 'Power Outage', description: 'System fails during blackout', isReal: false },
            { id: 'r7', name: 'Slow Processing', description: 'AI takes too long to analyze', isReal: false },
            { id: 'r8', name: 'Interface Confusion', description: 'Doctors find UI difficult', isReal: false }
        ],
        ethicsOptions: [
            { id: 'e1', name: 'Bias Testing', description: 'Regular audits on diverse populations', impact: { ethics: 15, feasibility: -3 } },
            { id: 'e2', name: 'Health Data Privacy', description: 'HIPAA-compliant, encrypted storage', impact: { ethics: 15, feasibility: -5 } },
            { id: 'e3', name: 'Transparent Algorithms', description: 'Explainable triage decisions', impact: { ethics: 12, feasibility: -4 } },
            { id: 'e4', name: 'Human Oversight', description: 'Doctors review all AI recommendations', impact: { ethics: 10, feasibility: -6 } },
            { id: 'e5', name: 'Accessibility', description: 'Multiple languages, assistive tech', impact: { ethics: 12, feasibility: -4 } },
            { id: 'e6', name: 'Fairness Metrics', description: 'Track outcomes by demographic', impact: { ethics: 10, feasibility: -2 } }
        ],
        governanceOptions: [
            { id: 'g1', name: 'Patient Consent', description: 'Informed consent for AI use', impact: { ethics: 12, feasibility: -3 } },
            { id: 'g2', name: 'Regular Audits', description: 'Independent bias testing', impact: { ethics: 15, feasibility: -5 } },
            { id: 'g3', name: 'Documentation', description: 'Clear decision logs', impact: { ethics: 8, feasibility: -2 } },
            { id: 'g4', name: 'Appeals Process', description: 'Patients can challenge triage', impact: { ethics: 10, feasibility: -4 } }
        ],
        partnerOptions: [
            { id: 'p1', name: 'Hospitals', description: 'Major healthcare providers', impact: { feasibility: 15, partnership: 15 } },
            { id: 'p2', name: 'Community Clinics', description: 'Local health centers', impact: { feasibility: 12, partnership: 15 } },
            { id: 'p3', name: 'Health NGOs', description: 'Public health organizations', impact: { feasibility: 10, partnership: 12 } },
            { id: 'p4', name: 'Government Health', description: 'Public health agencies', impact: { feasibility: 12, partnership: 10 } },
            { id: 'p5', name: 'Patient Advocacy', description: 'Community health groups', impact: { feasibility: 8, partnership: 12 } },
            { id: 'p6', name: 'Tech Companies', description: 'Healthcare tech providers', impact: { feasibility: 10, partnership: 8 } }
        ],
        feasibilityOptions: [
            { id: 'f1', name: 'Pilot Program', description: 'Test in one clinic first', impact: { feasibility: 15, impact: 5 } },
            { id: 'f2', name: 'Open Source Tools', description: 'Use free AI frameworks', impact: { feasibility: 12, impact: 3 } },
            { id: 'f3', name: 'Grant Funding', description: 'Apply for health innovation grants', impact: { feasibility: 10, impact: 8 } },
            { id: 'f4', name: 'Volunteer Developers', description: 'Community tech volunteers', impact: { feasibility: 8, impact: 5 } }
        ],
        bestPath: {
            problem: 'p1',
            users: 'u1',
            approach: 'a1',
            data: ['d1', 'd3'],
            metric: 'm2',
            risks: ['r1', 'r3', 'r4'],
            ethics: ['e1', 'e2'],
            governance: 'g2',
            partners: ['p1', 'p2'],
            feasibility: 'f1'
        }
    },
    {
        id: 'learning-gaps',
        title: 'Learning Gaps',
        icon: '📚',
        sdg: 'SDG 4',
        sdgIcon: '🎓',
        description: 'Education personalization system needs AI, but must avoid bias and exclusion.',
        constraints: {
            budget: 'Moderate',
            time: '6 months',
            connectivity: 'Limited'
        },
        problems: [
            { id: 'p1', name: 'Personalized Learning', description: 'Adapt content to each student' },
            { id: 'p2', name: 'Gap Identification', description: 'Find learning gaps early' },
            { id: 'p3', name: 'Resource Recommendation', description: 'Suggest best learning materials' }
        ],
        targetUsers: [
            { id: 'u1', name: 'All Students', description: 'Every learner in the system' },
            { id: 'u2', name: 'Struggling Students', description: 'Those falling behind' },
            { id: 'u3', name: 'Remote Learners', description: 'Students without reliable internet' }
        ],
        aiApproaches: [
            { id: 'a1', name: 'Classification', description: 'Classify learning styles' },
            { id: 'a2', name: 'Forecasting', description: 'Predict student performance' },
            { id: 'a3', name: 'Chatbot', description: 'Tutoring assistant' },
            { id: 'a4', name: 'Recommendation', description: 'Recommend learning paths' }
        ],
        dataSources: [
            { id: 'd1', name: 'Test Scores', description: 'Academic performance data' },
            { id: 'd2', name: 'Learning Analytics', description: 'Platform interaction data' },
            { id: 'd3', name: 'Attendance Records', description: 'School attendance patterns' },
            { id: 'd4', name: 'Socioeconomic Data', description: 'Family background info' },
            { id: 'd5', name: 'Teacher Notes', description: 'Educator observations' },
            { id: 'd6', name: 'Parent Surveys', description: 'Home environment data' }
        ],
        successMetrics: [
            { id: 'm1', name: 'Learning Gains', description: 'Improvement in test scores' },
            { id: 'm2', name: 'Engagement Rate', description: 'Time spent learning' },
            { id: 'm3', name: 'Completion Rate', description: 'Students finishing courses' },
            { id: 'm4', name: 'Equity Score', description: 'Gap reduction across groups' }
        ],
        risks: [
            { id: 'r1', name: 'Stereotype Reinforcement', description: 'AI reinforces biases about groups', isReal: true },
            { id: 'r2', name: 'Privacy Concerns', description: 'Student data shared inappropriately', isReal: true },
            { id: 'r3', name: 'Digital Divide', description: 'Students without devices excluded', isReal: true },
            { id: 'r4', name: 'Low-Quality Data', description: 'Biased training data from privileged schools', isReal: true },
            { id: 'r5', name: 'Over-Personalization', description: 'Students miss diverse perspectives', isReal: true },
            { id: 'r6', name: 'Server Crashes', description: 'Platform goes down during exams', isReal: false },
            { id: 'r7', name: 'Slow Loading', description: 'Pages take too long to load', isReal: false },
            { id: 'r8', name: 'Complex Interface', description: 'Students find UI confusing', isReal: false }
        ],
        ethicsOptions: [
            { id: 'e1', name: 'Bias Auditing', description: 'Test on diverse student populations', impact: { ethics: 15, feasibility: -3 } },
            { id: 'e2', name: 'Student Privacy', description: 'FERPA-compliant, minimal data', impact: { ethics: 15, feasibility: -5 } },
            { id: 'e3', name: 'Transparency', description: 'Explain recommendations to students', impact: { ethics: 10, feasibility: -2 } },
            { id: 'e4', name: 'Accessibility', description: 'Works offline, low-end devices', impact: { ethics: 12, feasibility: -4 } },
            { id: 'e5', name: 'Teacher Oversight', description: 'Educators review AI suggestions', impact: { ethics: 10, feasibility: -6 } },
            { id: 'e6', name: 'Inclusive Design', description: 'Tested with diverse learners', impact: { ethics: 12, feasibility: -3 } }
        ],
        governanceOptions: [
            { id: 'g1', name: 'Parent Consent', description: 'Families approve data use', impact: { ethics: 12, feasibility: -3 } },
            { id: 'g2', name: 'Regular Audits', description: 'Independent bias testing', impact: { ethics: 15, feasibility: -5 } },
            { id: 'g3', name: 'Documentation', description: 'Clear learning path records', impact: { ethics: 8, feasibility: -2 } },
            { id: 'g4', name: 'Appeals Process', description: 'Students can challenge recommendations', impact: { ethics: 10, feasibility: -3 } }
        ],
        partnerOptions: [
            { id: 'p1', name: 'Schools', description: 'Educational institutions', impact: { feasibility: 15, partnership: 15 } },
            { id: 'p2', name: 'NGOs', description: 'Education nonprofits', impact: { feasibility: 12, partnership: 12 } },
            { id: 'p3', name: 'Tech Companies', description: 'EdTech providers', impact: { feasibility: 10, partnership: 8 } },
            { id: 'p4', name: 'Community Centers', description: 'After-school programs', impact: { feasibility: 12, partnership: 15 } },
            { id: 'p5', name: 'Parent Associations', description: 'Family engagement groups', impact: { feasibility: 10, partnership: 12 } },
            { id: 'p6', name: 'Government Education', description: 'Public education agencies', impact: { feasibility: 12, partnership: 10 } }
        ],
        feasibilityOptions: [
            { id: 'f1', name: 'Pilot Schools', description: 'Start with 3-5 schools', impact: { feasibility: 15, impact: 5 } },
            { id: 'f2', name: 'Open Source Platform', description: 'Use free learning tools', impact: { feasibility: 12, impact: 3 } },
            { id: 'f3', name: 'Education Grants', description: 'Apply for innovation funding', impact: { feasibility: 10, impact: 8 } },
            { id: 'f4', name: 'Teacher Training', description: 'Educators help implement', impact: { feasibility: 8, impact: 5 } }
        ],
        bestPath: {
            problem: 'p1',
            users: 'u1',
            approach: 'a4',
            data: ['d1', 'd2'],
            metric: 'm4',
            risks: ['r1', 'r3', 'r4'],
            ethics: ['e1', 'e4'],
            governance: 'g2',
            partners: ['p1', 'p4'],
            feasibility: 'f1'
        }
    }
];

// ===== STATE MANAGEMENT =====

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const screen = document.getElementById(screenId + '-screen');
    if (screen) {
        screen.classList.add('active');
        gameState.currentScreen = screenId;
        soundEffects.play('screen-transition');
    }
}

// ===== INITIALIZATION =====

function init() {
    // Check if already submitted
    const isSubmitted = localStorage.getItem('build-break-fix-submitted') === 'true';
    if (isSubmitted) {
        showScreen('submission');
        return;
    }
    
    setupEventListeners();
    showScreen('splash');
}

function setupEventListeners() {
    document.getElementById('start-btn').addEventListener('click', () => {
        showScreen('how-to-play');
    });

    const splashHomeBtn = document.getElementById('splash-home-btn');
    if (splashHomeBtn) {
        splashHomeBtn.addEventListener('click', () => {
            window.location.href = '/';
        });
    }

    document.getElementById('continue-from-howto-btn').addEventListener('click', () => {
        showScreen('challenge-select');
        renderChallengeSelection();
    });

    document.getElementById('reduce-motion').addEventListener('change', (e) => {
        document.body.classList.toggle('reduce-motion', e.target.checked);
    });

    document.getElementById('finish-build-btn').addEventListener('click', () => {
        startBreakPhase();
    });

    document.getElementById('finish-break-btn').addEventListener('click', () => {
        startFixPhase();
    });

    document.getElementById('finish-fix-btn').addEventListener('click', () => {
        finishRound();
    });

    const writeProposalRoundBtn = document.getElementById('write-proposal-round-btn');
    if (writeProposalRoundBtn) {
        writeProposalRoundBtn.addEventListener('click', () => {
            // Store current round context for proposal
            gameState.proposalContext = {
                fromRound: true,
                roundNumber: gameState.currentRound,
                challengeName: gameState.currentChallenge ? gameState.currentChallenge.title : 'Current Challenge'
            };
            showScreen('proposal');
            loadProposal();
        });
    }

    document.getElementById('next-challenge-btn').addEventListener('click', () => {
        nextChallenge();
    });

    document.getElementById('summary-home-btn').addEventListener('click', () => {
        window.location.href = '/';
    });

    document.getElementById('final-replay-btn').addEventListener('click', () => {
        resetGame();
        showScreen('challenge-select');
        renderChallengeSelection();
    });

    document.getElementById('final-home-btn').addEventListener('click', () => {
        window.location.href = '/';
    });

    // Proposal screen buttons
    const writeProposalBtn = document.getElementById('write-proposal-btn');
    if (writeProposalBtn) {
        writeProposalBtn.addEventListener('click', () => {
            // Store final results context for proposal
            gameState.proposalContext = {
                fromRound: false,
                roundNumber: gameState.currentRound,
                allChallengesComplete: gameState.currentRound >= gameState.totalRounds
            };
            showScreen('proposal');
            loadProposal();
        });
    }

    const saveProposalBtn = document.getElementById('save-proposal-btn');
    if (saveProposalBtn) {
        saveProposalBtn.addEventListener('click', saveProposal);
    }

    const copyProposalBtn = document.getElementById('copy-proposal-btn');
    if (copyProposalBtn) {
        copyProposalBtn.addEventListener('click', copyProposal);
    }

    const exportProposalBtn = document.getElementById('export-proposal-btn');
    if (exportProposalBtn) {
        exportProposalBtn.addEventListener('click', exportProposal);
    }

    const backToFinalResultsBtn = document.getElementById('back-to-final-results-btn');
    if (backToFinalResultsBtn) {
        backToFinalResultsBtn.addEventListener('click', () => {
            // Check if we came from round summary or final results
            if (gameState.currentRound < gameState.totalRounds) {
                // Still have more challenges, go back to round summary
                showScreen('round-summary');
                const lastRound = gameState.rounds[gameState.rounds.length - 1];
                if (lastRound) {
                    renderRoundSummary(lastRound);
                }
            } else {
                // All challenges complete, go back to final results
                showScreen('final-results');
                renderFinalResults();
            }
        });
    }

    const submitProposalBtn = document.getElementById('submit-proposal-btn');
    if (submitProposalBtn) {
        submitProposalBtn.addEventListener('click', submitProposal);
    }

    // Submission home button removed - now uses direct link to UNITAR

    // Auto-save proposal as user types
    const proposalTextarea = document.getElementById('proposal-text');
    if (proposalTextarea) {
        let autoSaveTimeout;
        proposalTextarea.addEventListener('input', () => {
            updateCharCount();
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                autoSaveProposal();
            }, 1000);
        });
    }
}

// ===== CHALLENGE SELECTION =====

function renderChallengeSelection() {
    const container = document.getElementById('challenge-cards');
    container.innerHTML = '';
    
    challenges.forEach((challenge, index) => {
        const card = document.createElement('div');
        card.className = 'challenge-card';
        card.innerHTML = `
            <div class="challenge-card-icon">${challenge.icon}</div>
            <h3 class="challenge-card-title">${challenge.title}</h3>
            <p class="challenge-card-description">${challenge.description}</p>
            <span class="sdg-badge-small">${challenge.sdgIcon} ${challenge.sdg}</span>
        `;
        card.addEventListener('click', () => selectChallenge(challenge.id));
        container.appendChild(card);
    });
}

function selectChallenge(challengeId) {
    gameState.currentChallenge = challenges.find(c => c.id === challengeId);
    gameState.currentRound++;
    resetRoundState();
    showScreen('build');
    renderBuildPhase();
    startTimer('build');
}

function resetRoundState() {
    gameState.phase = 'build';
    gameState.timeRemaining = 120;
    gameState.selectedProblem = null;
    gameState.selectedUsers = null;
    gameState.selectedApproach = null;
    gameState.selectedData = [];
    gameState.selectedMetric = null;
    gameState.selectedRisks = [];
    gameState.selectedEthics = [];
    gameState.selectedGovernance = null;
    gameState.selectedPartners = [];
    gameState.selectedFeasibility = null;
    gameState.impactScore = 0;
    gameState.ethicsScore = 0;
    gameState.feasibilityScore = 0;
    gameState.innovationScore = 0;
    gameState.partnershipScore = 0;
    gameState.riskDebt = 100;
    gameState.reputation = 50;
}

// ===== TIMER =====

let timerInterval = null;

function startTimer(phase) {
    if (timerInterval) clearInterval(timerInterval);
    
    gameState.timeRemaining = 120; // 2 minutes
    updateTimerDisplay(phase);
    
    timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay(phase);
        
        if (gameState.timeRemaining <= 0) {
            clearInterval(timerInterval);
            handleTimeUp(phase);
        }
    }, 1000);
}

function updateTimerDisplay(phase) {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timerElement = document.getElementById(phase + '-timer');
    if (timerElement) {
        timerElement.textContent = timeDisplay;
        if (gameState.timeRemaining < 30) {
            timerElement.parentElement.style.background = 'var(--accent-red)';
        } else if (gameState.timeRemaining < 60) {
            timerElement.parentElement.style.background = 'var(--accent-orange)';
        }
    }
}

function handleTimeUp(phase) {
    soundEffects.play('time-up');
    if (phase === 'build') {
        // Auto-advance if selections made
        if (gameState.selectedProblem && gameState.selectedUsers && gameState.selectedApproach && 
            gameState.selectedData.length === 2 && gameState.selectedMetric) {
            startBreakPhase();
        } else {
            alert('Time\'s up! Please complete your selections to continue.');
        }
    } else if (phase === 'break') {
        if (gameState.selectedRisks.length === 3) {
            startFixPhase();
        } else {
            alert('Time\'s up! Please select 3 risk cards to continue.');
        }
    } else if (phase === 'fix') {
        if (gameState.selectedEthics.length === 2 && gameState.selectedGovernance && 
            gameState.selectedPartners.length === 2 && gameState.selectedFeasibility) {
            finishRound();
        } else {
            alert('Time\'s up! Please complete your selections to finish.');
        }
    }
}

// ===== BUILD PHASE =====

function renderBuildPhase() {
    const challenge = gameState.currentChallenge;
    
    document.getElementById('current-challenge-name').textContent = challenge.title;
    document.getElementById('current-sdg-badge').innerHTML = `<span class="sdg-badge-small">${challenge.sdgIcon} ${challenge.sdg}</span>`;
    
    renderOptions('problem', challenge.problems);
    renderOptions('user', challenge.targetUsers);
    renderOptions('approach', challenge.aiApproaches);
    renderOptions('data', challenge.dataSources, true);
    renderOptions('metric', challenge.successMetrics);
    
    updateSolutionPreview();
}

function renderOptions(type, options, multiSelect = false) {
    const container = document.getElementById(type + '-options');
    if (!container) return;
    
    container.innerHTML = '';
    
    options.forEach(option => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.dataset.optionId = option.id;
        card.dataset.optionType = type;
        
        card.innerHTML = `
            <div class="option-card-name">${option.name}</div>
            <div class="option-card-description">${option.description}</div>
        `;
        
        if (gameState.phase === 'build') {
            card.addEventListener('click', () => selectBuildOption(type, option.id, multiSelect));
        } else if (gameState.phase === 'fix') {
            card.addEventListener('click', () => selectFixOption(type, option.id, multiSelect));
        }
        container.appendChild(card);
    });
}

function selectBuildOption(type, optionId, multiSelect = false) {
    if (multiSelect) {
        if (type === 'data') {
            if (gameState.selectedData.includes(optionId)) {
                gameState.selectedData = gameState.selectedData.filter(id => id !== optionId);
            } else if (gameState.selectedData.length < 2) {
                gameState.selectedData.push(optionId);
            } else {
                alert('You can only select 2 data sources.');
                return;
            }
        }
    } else {
        switch(type) {
            case 'problem':
                gameState.selectedProblem = optionId;
                break;
            case 'user':
                gameState.selectedUsers = optionId;
                break;
            case 'approach':
                gameState.selectedApproach = optionId;
                break;
            case 'metric':
                gameState.selectedMetric = optionId;
                break;
        }
    }
    
    updateOptionCards(type);
    updateSolutionPreview();
    checkBuildComplete();
    soundEffects.play('select');
}

function updateOptionCards(type) {
    const cards = document.querySelectorAll(`[data-option-type="${type}"]`);
    cards.forEach(card => {
        const optionId = card.dataset.optionId;
        let isSelected = false;
        
        if (gameState.phase === 'build') {
            if (type === 'data') {
                isSelected = gameState.selectedData.includes(optionId);
            } else {
                switch(type) {
                    case 'problem':
                        isSelected = gameState.selectedProblem === optionId;
                        break;
                    case 'user':
                        isSelected = gameState.selectedUsers === optionId;
                        break;
                    case 'approach':
                        isSelected = gameState.selectedApproach === optionId;
                        break;
                    case 'metric':
                        isSelected = gameState.selectedMetric === optionId;
                        break;
                }
            }
        } else if (gameState.phase === 'fix') {
            if (type === 'ethics') {
                isSelected = gameState.selectedEthics.includes(optionId);
            } else if (type === 'partner') {
                isSelected = gameState.selectedPartners.includes(optionId);
            } else if (type === 'governance') {
                isSelected = gameState.selectedGovernance === optionId;
            } else if (type === 'feasibility') {
                isSelected = gameState.selectedFeasibility === optionId;
            }
        }
        
        card.classList.toggle('selected', isSelected);
    });
}

function updateSolutionPreview() {
    const challenge = gameState.currentChallenge;
    
    document.getElementById('preview-problem').textContent = 
        gameState.selectedProblem ? challenge.problems.find(p => p.id === gameState.selectedProblem)?.name : 'Not selected';
    document.getElementById('preview-problem').classList.toggle('selected', !!gameState.selectedProblem);
    
    document.getElementById('preview-users').textContent = 
        gameState.selectedUsers ? challenge.targetUsers.find(u => u.id === gameState.selectedUsers)?.name : 'Not selected';
    document.getElementById('preview-users').classList.toggle('selected', !!gameState.selectedUsers);
    
    document.getElementById('preview-approach').textContent = 
        gameState.selectedApproach ? challenge.aiApproaches.find(a => a.id === gameState.selectedApproach)?.name : 'Not selected';
    document.getElementById('preview-approach').classList.toggle('selected', !!gameState.selectedApproach);
    
    if (gameState.selectedData.length > 0) {
        const dataNames = gameState.selectedData.map(id => 
            challenge.dataSources.find(d => d.id === id)?.name
        ).join(', ');
        document.getElementById('preview-data').textContent = dataNames;
        document.getElementById('preview-data').classList.add('selected');
    } else {
        document.getElementById('preview-data').textContent = 'Not selected';
        document.getElementById('preview-data').classList.remove('selected');
    }
    
    document.getElementById('preview-metric').textContent = 
        gameState.selectedMetric ? challenge.successMetrics.find(m => m.id === gameState.selectedMetric)?.name : 'Not selected';
    document.getElementById('preview-metric').classList.toggle('selected', !!gameState.selectedMetric);
}

function checkBuildComplete() {
    const complete = gameState.selectedProblem && 
                     gameState.selectedUsers && 
                     gameState.selectedApproach && 
                     gameState.selectedData.length === 2 && 
                     gameState.selectedMetric;
    
    document.getElementById('finish-build-btn').disabled = !complete;
}

// ===== BREAK PHASE =====

function startBreakPhase() {
    clearInterval(timerInterval);
    gameState.phase = 'break';
    showScreen('break');
    renderBreakPhase();
    startTimer('break');
    calculateBuildScores();
}

function renderBreakPhase() {
    const challenge = gameState.currentChallenge;
    const container = document.getElementById('risk-cards');
    container.innerHTML = '';
    
    // Shuffle risks
    const shuffledRisks = [...challenge.risks].sort(() => Math.random() - 0.5);
    
    shuffledRisks.forEach(risk => {
        const card = document.createElement('div');
        card.className = 'risk-card';
        card.dataset.riskId = risk.id;
        card.dataset.isReal = risk.isReal;
        
        const front = document.createElement('div');
        front.className = 'risk-card-front';
        front.innerHTML = `
            <div class="risk-card-name">?</div>
            <div class="risk-card-description">Click to reveal</div>
        `;
        
        const back = document.createElement('div');
        back.className = 'risk-card-back';
        back.innerHTML = `
            <div class="risk-card-name">${risk.name}</div>
            <div class="risk-card-description">${risk.description}</div>
        `;
        
        card.appendChild(front);
        card.appendChild(back);
        
        card.addEventListener('click', () => selectRisk(risk.id, risk.isReal));
        container.appendChild(card);
    });
    
    updateSelectedRisks();
}

function selectRisk(riskId, isReal) {
    if (gameState.selectedRisks.length >= 3 && !gameState.selectedRisks.includes(riskId)) {
        alert('You can only select 3 risk cards.');
        return;
    }
    
    const card = document.querySelector(`[data-risk-id="${riskId}"]`);
    if (!card) return;
    
    if (gameState.selectedRisks.includes(riskId)) {
        // Deselect
        gameState.selectedRisks = gameState.selectedRisks.filter(id => id !== riskId);
        card.classList.remove('selected', 'wrong');
        card.classList.remove('flipped');
    } else {
        // Select
        if (gameState.selectedRisks.length < 3) {
            gameState.selectedRisks.push(riskId);
            card.classList.add('flipped');
            
            if (isReal) {
                card.classList.add('selected');
                createConfetti();
                soundEffects.play('correct');
            } else {
                card.classList.add('wrong');
                soundEffects.play('wrong');
                gameState.riskDebt += 10;
                gameState.reputation -= 5;
            }
        }
    }
    
    updateSelectedRisks();
    checkBreakComplete();
}

function updateSelectedRisks() {
    const countEl = document.getElementById('selected-risks-count');
    const listEl = document.getElementById('selected-risks-list');
    
    if (countEl) {
        countEl.textContent = `${gameState.selectedRisks.length}/3`;
    }
    
    if (listEl) {
        listEl.innerHTML = '';
        gameState.selectedRisks.forEach(riskId => {
            const challenge = gameState.currentChallenge;
            const risk = challenge.risks.find(r => r.id === riskId);
            if (risk) {
                const tag = document.createElement('div');
                tag.className = 'selected-risk-tag';
                tag.textContent = risk.name;
                listEl.appendChild(tag);
            }
        });
    }
}

function checkBreakComplete() {
    document.getElementById('finish-break-btn').disabled = gameState.selectedRisks.length !== 3;
}

function calculateBuildScores() {
    // Base scores from build phase choices
    gameState.impactScore = 40;
    gameState.innovationScore = 30;
    gameState.feasibilityScore = 30;
    
    // Adjust based on selections (simplified scoring)
    if (gameState.selectedUsers === 'u2' || gameState.selectedUsers === 'u3') {
        gameState.impactScore += 10; // Focusing on vulnerable groups
    }
    
    if (gameState.selectedApproach) {
        gameState.innovationScore += 10;
    }
}

// ===== FIX PHASE =====

function startFixPhase() {
    clearInterval(timerInterval);
    gameState.phase = 'fix';
    showScreen('fix');
    renderFixPhase();
    startTimer('fix');
    calculateBreakScores();
    updateScoreBars();
}

function renderFixPhase() {
    const challenge = gameState.currentChallenge;
    
    renderOptions('ethics', challenge.ethicsOptions, true);
    renderOptions('governance', challenge.governanceOptions);
    renderOptions('partner', challenge.partnerOptions, true);
    renderOptions('feasibility', challenge.feasibilityOptions);
}

function selectFixOption(type, optionId, multiSelect = false) {
    if (type === 'ethics' && multiSelect) {
        if (gameState.selectedEthics.includes(optionId)) {
            gameState.selectedEthics = gameState.selectedEthics.filter(id => id !== optionId);
        } else if (gameState.selectedEthics.length < 2) {
            gameState.selectedEthics.push(optionId);
        } else {
            alert('You can only select 2 ethics safeguards.');
            return;
        }
    } else if (type === 'partner' && multiSelect) {
        if (gameState.selectedPartners.includes(optionId)) {
            gameState.selectedPartners = gameState.selectedPartners.filter(id => id !== optionId);
        } else if (gameState.selectedPartners.length < 2) {
            gameState.selectedPartners.push(optionId);
        } else {
            alert('You can only select 2 partners.');
            return;
        }
    } else if (type === 'governance') {
        gameState.selectedGovernance = optionId;
    } else if (type === 'feasibility') {
        gameState.selectedFeasibility = optionId;
    }
    
    updateOptionCards(type);
    calculateFixScores();
    updateScoreBars();
    checkFixComplete();
    soundEffects.play('select');
}

function calculateBreakScores() {
    // Calculate scores from break phase
    const challenge = gameState.currentChallenge;
    const realRisks = challenge.risks.filter(r => r.isReal).map(r => r.id);
    const selectedRealRisks = gameState.selectedRisks.filter(id => realRisks.includes(id));
    
    gameState.ethicsScore += selectedRealRisks.length * 10;
    gameState.riskDebt -= selectedRealRisks.length * 15;
    
    // Penalty for wrong selections
    const wrongSelections = gameState.selectedRisks.length - selectedRealRisks.length;
    gameState.riskDebt += wrongSelections * 10;
    gameState.reputation -= wrongSelections * 5;
}

function calculateFixScores() {
    const challenge = gameState.currentChallenge;
    
    // Reset to break phase scores
    let ethics = gameState.ethicsScore;
    let feasibility = gameState.feasibilityScore;
    let partnership = 0;
    
    // Add ethics safeguards
    gameState.selectedEthics.forEach(ethId => {
        const eth = challenge.ethicsOptions.find(e => e.id === ethId);
        if (eth) {
            ethics += eth.impact.ethics || 0;
            feasibility += eth.impact.feasibility || 0;
        }
    });
    
    // Add governance
    if (gameState.selectedGovernance) {
        const gov = challenge.governanceOptions.find(g => g.id === gameState.selectedGovernance);
        if (gov) {
            ethics += gov.impact.ethics || 0;
            feasibility += gov.impact.feasibility || 0;
        }
    }
    
    // Add partners
    gameState.selectedPartners.forEach(partId => {
        const part = challenge.partnerOptions.find(p => p.id === partId);
        if (part) {
            feasibility += part.impact.feasibility || 0;
            partnership += part.impact.partnership || 0;
        }
    });
    
    // Add feasibility plan
    if (gameState.selectedFeasibility) {
        const feas = challenge.feasibilityOptions.find(f => f.id === gameState.selectedFeasibility);
        if (feas) {
            feasibility += feas.impact.feasibility || 0;
            gameState.impactScore += feas.impact.impact || 0;
        }
    }
    
    // Reduce risk debt based on fixes
    const riskReduction = gameState.selectedEthics.length * 5 + 
                         (gameState.selectedGovernance ? 5 : 0);
    gameState.riskDebt = Math.max(0, gameState.riskDebt - riskReduction);
    
    gameState.ethicsScore = Math.min(100, ethics);
    gameState.feasibilityScore = Math.min(100, feasibility);
    gameState.partnershipScore = Math.min(100, partnership);
}

function updateScoreBars() {
    animateScoreBar('impact', gameState.impactScore);
    animateScoreBar('ethics', gameState.ethicsScore);
    animateScoreBar('feasibility', gameState.feasibilityScore);
    animateScoreBar('partnership', gameState.partnershipScore);
    animateScoreBar('risk-debt', gameState.riskDebt, true);
}

function animateScoreBar(type, value, isRisk = false) {
    const bar = document.getElementById(type + '-bar');
    const valueEl = document.getElementById(type + '-value');
    
    if (bar && valueEl) {
        const percentage = Math.max(0, Math.min(100, value));
        bar.style.width = percentage + '%';
        valueEl.textContent = Math.round(value);
        
        if (isRisk) {
            bar.className = 'score-fill risk';
        } else {
            bar.className = 'score-fill';
        }
    }
}

function checkFixComplete() {
    const complete = gameState.selectedEthics.length === 2 && 
                     gameState.selectedGovernance && 
                     gameState.selectedPartners.length === 2 && 
                     gameState.selectedFeasibility;
    
    document.getElementById('finish-fix-btn').disabled = !complete;
}

// ===== ROUND SUMMARY =====

function finishRound() {
    clearInterval(timerInterval);
    calculateFinalRoundScores();
    
    const roundData = {
        challenge: gameState.currentChallenge.id,
        challengeName: gameState.currentChallenge.title,
        build: {
            problem: gameState.selectedProblem,
            users: gameState.selectedUsers,
            approach: gameState.selectedApproach,
            data: gameState.selectedData,
            metric: gameState.selectedMetric
        },
        break: {
            risks: gameState.selectedRisks
        },
        fix: {
            ethics: gameState.selectedEthics,
            governance: gameState.selectedGovernance,
            partners: gameState.selectedPartners,
            feasibility: gameState.selectedFeasibility
        },
        scores: {
            impact: gameState.impactScore,
            ethics: gameState.ethicsScore,
            feasibility: gameState.feasibilityScore,
            innovation: gameState.innovationScore,
            partnership: gameState.partnershipScore,
            riskDebt: gameState.riskDebt,
            reputation: gameState.reputation
        }
    };
    
    gameState.rounds.push(roundData);
    gameState.lastRoundData = roundData; // Store for proposal page
    
    showScreen('round-summary');
    renderRoundSummary(roundData);
}

function calculateFinalRoundScores() {
    // Final calculations
    const totalScore = Math.round(
        (gameState.impactScore * 0.3) +
        (gameState.ethicsScore * 0.25) +
        (gameState.feasibilityScore * 0.2) +
        (gameState.partnershipScore * 0.15) +
        (gameState.innovationScore * 0.1) -
        (gameState.riskDebt * 0.1)
    );
    
    gameState.roundTotalScore = Math.max(0, totalScore);
}

function renderRoundSummary(roundData) {
    document.getElementById('current-round-number').textContent = gameState.currentRound;
    
    // Scores removed - no longer displaying
    
    renderCaseCard(roundData);
    
    document.getElementById('download-report-btn').addEventListener('click', () => {
        downloadReport(roundData);
    });
}

function animateScore(elementId, targetValue) {
    const element = document.getElementById(elementId);
    let current = 0;
    const increment = targetValue / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 30);
}

function renderCaseCard(roundData) {
    const challenge = gameState.currentChallenge;
    const container = document.getElementById('case-card-content');
    
    const problem = challenge.problems.find(p => p.id === roundData.build.problem);
    const users = challenge.targetUsers.find(u => u.id === roundData.build.users);
    const approach = challenge.aiApproaches.find(a => a.id === roundData.build.approach);
    const dataSources = roundData.build.data.map(id => challenge.dataSources.find(d => d.id === id)?.name).join(', ');
    const metric = challenge.successMetrics.find(m => m.id === roundData.build.metric);
    const risks = roundData.break.risks.map(id => challenge.risks.find(r => r.id === id)?.name).join(', ');
    const ethics = roundData.fix.ethics.map(id => challenge.ethicsOptions.find(e => e.id === id)?.name).join(', ');
    const partners = roundData.fix.partners.map(id => challenge.partnerOptions.find(p => p.id === id)?.name).join(', ');
    
    container.innerHTML = `
        <div class="case-card-item">
            <strong>Problem:</strong> ${problem?.name || 'N/A'}
        </div>
        <div class="case-card-item">
            <strong>Target Users:</strong> ${users?.name || 'N/A'}
        </div>
        <div class="case-card-item">
            <strong>AI Approach:</strong> ${approach?.name || 'N/A'}
        </div>
        <div class="case-card-item">
            <strong>Data Sources:</strong> ${dataSources || 'N/A'}
        </div>
        <div class="case-card-item">
            <strong>Success Metric:</strong> ${metric?.name || 'N/A'}
        </div>
        <div class="case-card-item">
            <strong>Identified Risks:</strong> ${risks || 'N/A'}
        </div>
        <div class="case-card-item">
            <strong>Ethics Safeguards:</strong> ${ethics || 'N/A'}
        </div>
        <div class="case-card-item">
            <strong>Partners:</strong> ${partners || 'N/A'}
        </div>
        <div class="case-card-item">
            <strong>Final Scores:</strong> Impact: ${roundData.scores.impact}, Ethics: ${roundData.scores.ethics}, Feasibility: ${roundData.scores.feasibility}, Partnerships: ${roundData.scores.partnership}
        </div>
    `;
}

function downloadReport(roundData) {
    const report = {
        challenge: roundData.challengeName,
        date: new Date().toISOString(),
        build: roundData.build,
        break: roundData.break,
        fix: roundData.fix,
        scores: roundData.scores
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Build-Break-Fix-${roundData.challengeName.replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    soundEffects.play('download');
}

function nextChallenge() {
    if (gameState.currentRound < gameState.totalRounds) {
        // More challenges to go
        showScreen('challenge-select');
        renderChallengeSelection();
    } else {
        // All challenges complete
        showScreen('final-results');
        renderFinalResults();
    }
}

// ===== FINAL RESULTS =====

function renderFinalResults() {
    // Calculate aggregate scores (for badge determination only, not displayed)
    const totalImpact = gameState.rounds.reduce((sum, r) => sum + r.scores.impact, 0) / gameState.rounds.length;
    const totalEthics = gameState.rounds.reduce((sum, r) => sum + r.scores.ethics, 0) / gameState.rounds.length;
    const totalFeasibility = gameState.rounds.reduce((sum, r) => sum + r.scores.feasibility, 0) / gameState.rounds.length;
    const totalPartnership = gameState.rounds.reduce((sum, r) => sum + r.scores.partnership, 0) / gameState.rounds.length;
    const totalRiskDebt = gameState.rounds.reduce((sum, r) => sum + r.scores.riskDebt, 0) / gameState.rounds.length;
    const totalTime = gameState.rounds.length * 6; // 6 minutes per round
    
    // Scores removed - no longer displaying
    
    determineBadge(totalPartnership, totalEthics, totalImpact, totalRiskDebt, totalTime);
    renderTimeline();
}

function determineBadge(partnership, ethics, impact, riskDebt, time) {
    let badgeTitle = 'Champion';
    let badgeIcon = '🏆';
    
    if (partnership >= 80) {
        badgeTitle = 'Partnership Pro';
        badgeIcon = '🤝';
    } else if (ethics >= 85) {
        badgeTitle = 'Ethics Guardian';
        badgeIcon = '⚖️';
    } else if (impact >= 80) {
        badgeTitle = 'Impact Architect';
        badgeIcon = '🌟';
    } else if (time < 15) {
        badgeTitle = 'Speed Solver';
        badgeIcon = '⚡';
    } else if (riskDebt < 20) {
        badgeTitle = 'Risk Tamer';
        badgeIcon = '🛡️';
    }
    
    document.getElementById('final-badge-icon').textContent = badgeIcon;
    document.getElementById('final-badge-title').textContent = badgeTitle;
}

function renderTimeline() {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    
    gameState.rounds.forEach((round, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.style.animationDelay = `${index * 0.2}s`;
        
        item.innerHTML = `
            <div class="timeline-challenge">Challenge ${index + 1}: ${round.challengeName}</div>
            <div class="timeline-details">
                Built: ${round.build.approach} solution | 
                Found ${round.break.risks.length} risks | 
                Score: ${round.scores.impact + round.scores.ethics + round.scores.feasibility}
            </div>
        `;
        
        timeline.appendChild(item);
    });
}

// ===== UTILITIES =====

function createConfetti() {
    const container = document.getElementById('confetti-container');
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = ['var(--primary-cyan)', 'var(--accent-green)', 'var(--accent-orange)'][Math.floor(Math.random() * 3)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

function resetGame() {
    Object.assign(gameState, {
        currentScreen: 'splash',
        currentChallenge: null,
        currentRound: 0,
        rounds: [],
        phase: 'build',
        timeRemaining: 120,
        selectedProblem: null,
        selectedUsers: null,
        selectedApproach: null,
        selectedData: [],
        selectedMetric: null,
        selectedRisks: [],
        selectedEthics: [],
        selectedGovernance: null,
        selectedPartners: [],
        selectedFeasibility: null,
        impactScore: 0,
        ethicsScore: 0,
        feasibilityScore: 0,
        innovationScore: 0,
        partnershipScore: 0,
        riskDebt: 100,
        reputation: 50
    });
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// ===== PROPOSAL FUNCTIONS =====

function loadProposal() {
    const proposalText = document.getElementById('proposal-text');
    if (!proposalText) return;
    
    // Load saved proposal from localStorage
    const savedProposal = localStorage.getItem('build-break-fix-proposal');
    
    if (savedProposal) {
        proposalText.value = savedProposal;
    }
    
    updateCharCount();
}

function updateCharCount() {
    const proposalText = document.getElementById('proposal-text');
    const charCount = document.getElementById('char-count');
    
    if (proposalText && charCount) {
        const count = proposalText.value.length;
        charCount.textContent = `${count} characters`;
    }
}

function autoSaveProposal() {
    const proposalText = document.getElementById('proposal-text');
    if (!proposalText) return;
    
    localStorage.setItem('build-break-fix-proposal', proposalText.value);
}

function saveProposal() {
    const proposalText = document.getElementById('proposal-text');
    const saveStatus = document.getElementById('save-status');
    
    if (!proposalText) return;
    
    localStorage.setItem('build-break-fix-proposal', proposalText.value);
    
    if (saveStatus) {
        saveStatus.textContent = '✓ Draft saved!';
        saveStatus.style.color = 'var(--accent-green)';
        setTimeout(() => {
            saveStatus.textContent = '';
        }, 2000);
    }
    
    soundEffects.play('save');
}

function copyProposal() {
    const proposalText = document.getElementById('proposal-text');
    const saveStatus = document.getElementById('save-status');
    
    if (!proposalText) return;
    
    if (!proposalText.value.trim()) {
        if (saveStatus) {
            saveStatus.textContent = 'Please write your proposal first.';
            saveStatus.style.color = 'var(--accent-orange)';
            setTimeout(() => {
                saveStatus.textContent = '';
            }, 2000);
        }
        return;
    }
    
    navigator.clipboard.writeText(proposalText.value).then(() => {
        if (saveStatus) {
            saveStatus.textContent = '✓ Copied to clipboard!';
            saveStatus.style.color = 'var(--accent-green)';
            setTimeout(() => {
                saveStatus.textContent = '';
            }, 2000);
        }
        soundEffects.play('copy');
    }).catch(err => {
        console.error('Failed to copy:', err);
        if (saveStatus) {
            saveStatus.textContent = 'Failed to copy. Please try again.';
            saveStatus.style.color = 'var(--accent-orange)';
        }
    });
}

function exportProposal() {
    const proposalText = document.getElementById('proposal-text');
    
    if (!proposalText || !proposalText.value.trim()) {
        alert('Please write your proposal before exporting.');
        return;
    }
    
    const badgeTitle = document.getElementById('final-badge-title') ? document.getElementById('final-badge-title').textContent : 'Champion';
    const finalScores = {
        impact: document.getElementById('final-impact') ? document.getElementById('final-impact').textContent : '0',
        ethics: document.getElementById('final-ethics') ? document.getElementById('final-ethics').textContent : '0',
        feasibility: document.getElementById('final-feasibility') ? document.getElementById('final-feasibility').textContent : '0',
        partnership: document.getElementById('final-partnership') ? document.getElementById('final-partnership').textContent : '0',
        total: document.getElementById('final-total') ? document.getElementById('final-total').textContent : '0'
    };
    
    const content = `
Build–Break–Fix Proposal - AI & Social Impact Games

Date: ${new Date().toLocaleDateString()}
Badge Earned: ${badgeTitle}

FINAL SCORES:
Impact: ${finalScores.impact}
Ethics: ${finalScores.ethics}
Feasibility: ${finalScores.feasibility}
Partnerships: ${finalScores.partnership}
Total: ${finalScores.total}

MY PROPOSAL:

${proposalText.value}

---
Generated from AI & Social Impact Games: Build–Break–Fix (AI Edition)
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Build-Break-Fix-Proposal-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    soundEffects.play('export');
}

function submitProposal() {
    const proposalText = document.getElementById('proposal-text');
    
    if (!proposalText || !proposalText.value.trim()) {
        alert('Please write your proposal before submitting.');
        return;
    }
    
    // No confirmation popup - direct submission
    
    // Save submission data
    // Check if we're on final results or round summary
    const isFinalResults = gameState.currentRound >= gameState.totalRounds;
    const badgeTitle = isFinalResults && document.getElementById('final-badge-title') 
        ? document.getElementById('final-badge-title').textContent 
        : 'In Progress';
    
    // Get scores from gameState (scores still calculated internally, just not displayed)
    const finalScores = {
        impact: gameState.rounds.length > 0 ? Math.round(gameState.rounds.reduce((sum, r) => sum + r.scores.impact, 0) / gameState.rounds.length) : gameState.impactScore,
        ethics: gameState.rounds.length > 0 ? Math.round(gameState.rounds.reduce((sum, r) => sum + r.scores.ethics, 0) / gameState.rounds.length) : gameState.ethicsScore,
        feasibility: gameState.rounds.length > 0 ? Math.round(gameState.rounds.reduce((sum, r) => sum + r.scores.feasibility, 0) / gameState.rounds.length) : gameState.feasibilityScore,
        partnership: gameState.rounds.length > 0 ? Math.round(gameState.rounds.reduce((sum, r) => sum + r.scores.partnership, 0) / gameState.rounds.length) : gameState.partnershipScore,
        total: 0 // Not calculated anymore
    };
    
    const submissionData = {
        game: 'build-break-fix',
        proposal: proposalText.value,
        rounds: gameState.rounds,
        currentRound: gameState.currentRound,
        totalRounds: gameState.totalRounds,
        challengesCompleted: gameState.rounds.length,
        timestamp: new Date().toISOString(),
        scores: finalScores,
        badge: badgeTitle
    };
    
    // Mark as submitted
    localStorage.setItem('build-break-fix-submitted', 'true');
    localStorage.setItem('build-break-fix-submission', JSON.stringify(submissionData));
    
    // Show submission screen
    showScreen('submission');
    createConfetti();
    soundEffects.play('submit');
}

// ===== START GAME =====

document.addEventListener('DOMContentLoaded', init);

