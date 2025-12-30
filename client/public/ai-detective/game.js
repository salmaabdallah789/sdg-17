/* AI & Social Impact Games: AI Detective - Game Logic
 * 
 * INSTRUCTIONS: Open index.html in a web browser to play.
 * No server required - runs entirely in the browser.
 * 
 * Game Flow:
 * 1. Splash → 2. Case Select → 3. Briefing → 4. Investigation Hub
 * → 5. Evidence Analysis → 6. Interrogation → 7. Deduction Board
 * → 8. Final Accusation → 9. Results
 */

// ===== GAME STATE =====
const gameState = {
    currentScreen: 'splash',
    currentCase: null,
    currentCaseIndex: 0,
    totalCases: 3,
    completedCases: [], // Track completed cases like Build-Break-Fix tracks rounds
    timeRemaining: 0,
    energy: 0,
    cluesFound: [],
    evidence: [],
    npcsInterviewed: [],
    trust: {},
    impactScore: 0,
    ethicsScore: 0,
    feasibilityScore: 0,
    selectedRootCause: null,
    selectedAISolution: null,
    selectedEthics: [],
    selectedPartners: [],
    deductionBoard: {
        symptoms: [],
        causes: [],
        root: []
    },
    connections: []
};

// ===== SOUND HOOKS (Placeholder - ready for audio files) =====
const soundEffects = {
    play: function(soundName) {
        // Placeholder for sound effects
        // Example: new Audio(`sounds/${soundName}.mp3`).play();
        console.log(`[Sound] Playing: ${soundName}`);
    }
};

// ===== GAME DATA =====

const cases = [
    {
        id: 'vanishing-classrooms',
        title: 'The Vanishing Classrooms',
        icon: '📚',
        sdg: 'SDG 4: Quality Education',
        sdgIcon: '🎓',
        setting: 'Riverside City, 2035',
        timeLimit: 15,
        initialEnergy: 25,
        story: `Riverside City's education system is in crisis. Over the past year, 
        dropout rates have skyrocketed from 5% to 23%. Classrooms are emptying, 
        and the city council is desperate for answers. You're an AI detective 
        brought in to investigate. The data shows patterns, but the real cause 
        remains hidden.`,
        objectives: [
            'Investigate 4 key locations',
            'Collect 8 pieces of evidence',
            'Interview 3 key witnesses',
            'Identify the root cause',
            'Propose an ethical AI solution'
        ],
        locations: [
            { id: 'school', name: 'Riverside High School', x: 20, y: 30, width: 150, height: 100 },
            { id: 'library', name: 'Public Library', x: 200, y: 50, width: 120, height: 80 },
            { id: 'community', name: 'Community Center', x: 100, y: 180, width: 140, height: 90 },
            { id: 'home', name: 'Student Housing District', x: 250, y: 200, width: 130, height: 100 }
        ],
        clues: [
            { id: 'c1', name: 'Attendance Records', location: 'school', description: 'Digital attendance shows 40% absenteeism in low-income areas', isRedHerring: false },
            { id: 'c2', name: 'Internet Access Data', location: 'home', description: 'Only 30% of students have reliable home internet', isRedHerring: false },
            { id: 'c3', name: 'Library Usage Stats', location: 'library', description: 'Library computer usage increased 200% during school hours', isRedHerring: false },
            { id: 'c4', name: 'Teacher Survey', location: 'school', description: 'Teachers report students unable to complete online homework', isRedHerring: false },
            { id: 'c5', name: 'Transportation Records', location: 'community', description: 'Bus routes unchanged - not a transportation issue', isRedHerring: true },
            { id: 'c6', name: 'Budget Documents', location: 'school', description: 'School budget increased this year - funding is adequate', isRedHerring: true },
            { id: 'c7', name: 'Parent Complaints', location: 'home', description: 'Parents report children sharing devices with siblings', isRedHerring: false },
            { id: 'c8', name: 'Digital Divide Report', location: 'library', description: 'Report shows 60% digital divide in low-income neighborhoods', isRedHerring: false }
        ],
        npcs: [
            {
                id: 'principal',
                name: 'Principal Martinez',
                avatar: '👨‍💼',
                location: 'school',
                trust: 50,
                dialogues: [
                    {
                        id: 'd1',
                        text: 'We\'ve tried everything - tutoring, after-school programs, but nothing works. The students just... disappear.',
                        options: [
                            { text: 'What changed in the past year?', next: 'd2', trustChange: 5 },
                            { text: 'Are students failing classes?', next: 'd3', trustChange: 0 }
                        ]
                    },
                    {
                        id: 'd2',
                        text: 'We moved to fully digital curriculum. It was supposed to modernize education, but...',
                        options: [
                            { text: 'Do all students have devices?', next: 'd4', trustChange: 10 },
                            { text: 'Is the curriculum too difficult?', next: 'd5', trustChange: -5 }
                        ]
                    },
                    {
                        id: 'd3',
                        text: 'No, that\'s the strange part. When they do attend, they perform well. But attendance is the problem.',
                        options: [
                            { text: 'What changed in the past year?', next: 'd2', trustChange: 5 }
                        ]
                    },
                    {
                        id: 'd4',
                        text: 'That\'s a good question. We assumed they did, but we never actually checked. The digital divide...',
                        options: [
                            { text: 'Thank you for your time.', next: 'end', trustChange: 5 }
                        ]
                    },
                    {
                        id: 'd5',
                        text: 'No, the curriculum is fine. But I\'m starting to think we made assumptions about student access.',
                        options: [
                            { text: 'Do all students have devices?', next: 'd4', trustChange: 10 }
                        ]
                    }
                ]
            },
            {
                id: 'librarian',
                name: 'Ms. Chen',
                avatar: '👩‍💼',
                location: 'library',
                trust: 50,
                dialogues: [
                    {
                        id: 'd1',
                        text: 'We\'ve seen a huge increase in students using our computers. They line up every day after school.',
                        options: [
                            { text: 'Why do they need library computers?', next: 'd2', trustChange: 10 },
                            { text: 'Is this a recent trend?', next: 'd3', trustChange: 5 }
                        ]
                    },
                    {
                        id: 'd2',
                        text: 'They need to do homework! The school went fully digital, but many students don\'t have reliable internet or devices at home.',
                        options: [
                            { text: 'How many students are affected?', next: 'd4', trustChange: 5 },
                            { text: 'Thank you for the information.', next: 'end', trustChange: 5 }
                        ]
                    },
                    {
                        id: 'd3',
                        text: 'Yes, it started about a year ago when the school district went fully digital.',
                        options: [
                            { text: 'Why do they need library computers?', next: 'd2', trustChange: 10 }
                        ]
                    },
                    {
                        id: 'd4',
                        text: 'We estimate about 40% of students from low-income areas. They can\'t complete assignments without access.',
                        options: [
                            { text: 'Thank you for your help.', next: 'end', trustChange: 10 }
                        ]
                    }
                ]
            },
            {
                id: 'parent',
                name: 'Mrs. Rodriguez',
                avatar: '👩',
                location: 'home',
                trust: 50,
                dialogues: [
                    {
                        id: 'd1',
                        text: 'My daughter used to love school, but now she\'s falling behind. We can\'t afford good internet, and she shares a tablet with her two brothers.',
                        options: [
                            { text: 'When did this start?', next: 'd2', trustChange: 5 },
                            { text: 'Can she use the library?', next: 'd3', trustChange: 10 }
                        ]
                    },
                    {
                        id: 'd2',
                        text: 'About a year ago, when everything went online. She can\'t keep up with the homework.',
                        options: [
                            { text: 'Can she use the library?', next: 'd3', trustChange: 10 },
                            { text: 'Thank you for sharing.', next: 'end', trustChange: 5 }
                        ]
                    },
                    {
                        id: 'd3',
                        text: 'Yes, but it\'s a 30-minute walk, and she has to wait in line. By the time she gets a computer, she\'s exhausted. Many students just give up.',
                        options: [
                            { text: 'I understand. Thank you.', next: 'end', trustChange: 10 }
                        ]
                    }
                ]
            }
        ],
        rootCauses: [
            { id: 'rc1', text: 'Lack of qualified teachers', correct: false },
            { id: 'rc2', text: 'Digital divide - students lack devices/internet', correct: true },
            { id: 'rc3', text: 'Inadequate school funding', correct: false },
            { id: 'rc4', text: 'Poor curriculum quality', correct: false }
        ],
        aiSolutions: [
            { id: 'sol1', name: 'AI-Powered Device Loan Program', description: 'Predictive AI identifies students needing devices and manages loan distribution' },
            { id: 'sol2', name: 'Hybrid Learning AI Platform', description: 'AI adapts content for offline/online access, works on low-end devices' },
            { id: 'sol3', name: 'Community WiFi Expansion', description: 'AI optimizes WiFi placement in underserved areas' },
            { id: 'sol4', name: 'AI Tutoring Replacement', description: 'Replace teachers with AI tutors to cut costs' }
        ],
        ethicsOptions: [
            { id: 'e1', text: 'Privacy-first data collection', impact: 10 },
            { id: 'e2', text: 'Community consent and input', impact: 15 },
            { id: 'e3', text: 'Bias auditing of AI systems', impact: 12 },
            { id: 'e4', text: 'Transparent algorithms', impact: 8 },
            { id: 'e5', text: 'Inclusive design testing', impact: 10 },
            { id: 'e6', text: 'Data minimization', impact: 8 }
        ],
        partnerOptions: [
            { id: 'p1', name: 'Local Schools', impact: 15 },
            { id: 'p2', name: 'Community Centers', impact: 12 },
            { id: 'p3', name: 'Tech Companies', impact: 10 },
            { id: 'p4', name: 'NGOs', impact: 12 },
            { id: 'p5', name: 'Government Agencies', impact: 8 },
            { id: 'p6', name: 'Parent Associations', impact: 10 }
        ]
    },
    {
        id: 'silent-clinics',
        title: 'The Silent Clinics',
        icon: '🏥',
        sdg: 'SDG 3: Good Health & Well-being',
        sdgIcon: '💊',
        setting: 'Metro City, 2035',
        timeLimit: 18,
        initialEnergy: 30,
        story: `Metro City's hospitals are overwhelmed. Wait times have exploded from 
        2 hours to 12 hours. Emergency rooms are at capacity, and patients are 
        leaving without treatment. The city needs answers. You're investigating 
        why the healthcare system is failing.`,
        objectives: [
            'Investigate 4 key locations',
            'Collect 8 pieces of evidence',
            'Interview 3 key witnesses',
            'Identify the root cause',
            'Propose an ethical AI solution'
        ],
        locations: [
            { id: 'hospital', name: 'Metro General Hospital', x: 30, y: 40, width: 160, height: 110 },
            { id: 'clinic', name: 'Community Clinic', x: 220, y: 60, width: 130, height: 85 },
            { id: 'pharmacy', name: 'Pharmacy Network', x: 120, y: 200, width: 140, height: 95 },
            { id: 'neighborhood', name: 'Low-Income Neighborhood', x: 280, y: 220, width: 120, height: 100 }
        ],
        clues: [
            { id: 'c1', name: 'ER Wait Times', location: 'hospital', description: 'Average wait time: 12 hours (was 2 hours)', isRedHerring: false },
            { id: 'c2', name: 'Patient Records', location: 'hospital', description: 'Many patients have no primary care doctor', isRedHerring: false },
            { id: 'c3', name: 'Clinic Closure List', location: 'clinic', description: '15 community clinics closed in past 2 years', isRedHerring: false },
            { id: 'c4', name: 'Appointment Data', location: 'clinic', description: 'Primary care appointments: 3-month wait', isRedHerring: false },
            { id: 'c5', name: 'Pharmacy Prescription Data', location: 'pharmacy', description: 'Prescription fill rates dropped 30% in low-income areas', isRedHerring: false },
            { id: 'c6', name: 'Medication Access Report', location: 'pharmacy', description: 'Many patients can\'t afford medications, skip doses', isRedHerring: false },
            { id: 'c7', name: 'Staffing Records', location: 'hospital', description: 'Nurse staffing levels maintained', isRedHerring: true },
            { id: 'c8', name: 'Equipment Logs', location: 'hospital', description: 'Medical equipment fully functional', isRedHerring: true },
            { id: 'c9', name: 'Insurance Data', location: 'neighborhood', description: '40% of residents uninsured or underinsured', isRedHerring: false },
            { id: 'c10', name: 'Transportation Survey', location: 'neighborhood', description: 'Residents travel 2+ hours to reach remaining clinics', isRedHerring: false }
        ],
        npcs: [
            {
                id: 'doctor',
                name: 'Dr. Kim',
                avatar: '👨‍⚕️',
                location: 'hospital',
                trust: 50,
                dialogues: [
                    {
                        id: 'd1',
                        text: 'We\'re seeing patients who should be in primary care, but they can\'t get appointments. So they come to the ER.',
                        options: [
                            { text: 'Why can\'t they get primary care?', next: 'd2', trustChange: 10 },
                            { text: 'Is the hospital understaffed?', next: 'd3', trustChange: -5 }
                        ]
                    },
                    {
                        id: 'd2',
                        text: 'The community clinics closed. Patients have nowhere else to go. We\'re the last resort.',
                        options: [
                            { text: 'Why did clinics close?', next: 'd4', trustChange: 5 },
                            { text: 'Thank you, doctor.', next: 'end', trustChange: 5 }
                        ]
                    },
                    {
                        id: 'd3',
                        text: 'No, staffing is fine. The problem is volume - we\'re seeing 3x the patients we should.',
                        options: [
                            { text: 'Why can\'t they get primary care?', next: 'd2', trustChange: 10 }
                        ]
                    },
                    {
                        id: 'd4',
                        text: 'Funding cuts. Low-income areas lost their clinics first. Now those communities have no access.',
                        options: [
                            { text: 'I see. Thank you.', next: 'end', trustChange: 10 }
                        ]
                    }
                ]
            },
            {
                id: 'nurse',
                name: 'Nurse Johnson',
                avatar: '👩‍⚕️',
                location: 'hospital',
                trust: 50,
                dialogues: [
                    {
                        id: 'd1',
                        text: 'Patients wait hours for things a primary care doctor could handle in 10 minutes. But they have no doctor.',
                        options: [
                            { text: 'What happened to primary care?', next: 'd2', trustChange: 10 },
                            { text: 'Can they use urgent care?', next: 'd3', trustChange: 5 }
                        ]
                    },
                    {
                        id: 'd2',
                        text: 'The clinics in their neighborhoods closed. They can\'t afford to travel far, and insurance doesn\'t cover it.',
                        options: [
                            { text: 'Thank you for your insight.', next: 'end', trustChange: 10 }
                        ]
                    },
                    {
                        id: 'd3',
                        text: 'Urgent care is expensive and far away. Many patients are uninsured or can\'t afford copays.',
                        options: [
                            { text: 'What happened to primary care?', next: 'd2', trustChange: 10 }
                        ]
                    }
                ]
            },
            {
                id: 'patient',
                name: 'Mr. Thompson',
                avatar: '👨',
                location: 'neighborhood',
                trust: 50,
                dialogues: [
                    {
                        id: 'd1',
                        text: 'I used to go to the clinic down the street, but it closed. Now I have to take 3 buses to see a doctor, or wait 12 hours in the ER.',
                        options: [
                            { text: 'Why did the clinic close?', next: 'd2', trustChange: 5 },
                            { text: 'Do you have insurance?', next: 'd3', trustChange: 10 }
                        ]
                    },
                    {
                        id: 'd2',
                        text: 'They said funding was cut. A lot of clinics in poor neighborhoods closed. Rich areas kept theirs.',
                        options: [
                            { text: 'I understand. Thank you.', next: 'end', trustChange: 10 }
                        ]
                    },
                    {
                        id: 'd3',
                        text: 'I have Medicaid, but many doctors don\'t take it. The ones that do are booked months out.',
                        options: [
                            { text: 'Why did the clinic close?', next: 'd2', trustChange: 5 }
                        ]
                    }
                ]
            }
        ],
        rootCauses: [
            { id: 'rc1', text: 'Insufficient hospital staff', correct: false },
            { id: 'rc2', text: 'Closure of community clinics in underserved areas', correct: true },
            { id: 'rc3', text: 'Outdated medical equipment', correct: false },
            { id: 'rc4', text: 'Poor hospital management', correct: false }
        ],
        aiSolutions: [
            { id: 'sol1', name: 'AI Telemedicine Network', description: 'AI connects patients with remote doctors, reducing travel barriers' },
            { id: 'sol2', name: 'Predictive Resource Allocation', description: 'AI predicts demand and optimizes clinic locations and hours' },
            { id: 'sol3', name: 'AI Triage System', description: 'AI prioritizes ER patients to reduce wait times' },
            { id: 'sol4', name: 'Automated Diagnosis System', description: 'AI replaces doctors for routine diagnoses' }
        ],
        ethicsOptions: [
            { id: 'e1', text: 'Health data privacy protection', impact: 15 },
            { id: 'e2', text: 'Bias testing on diverse populations', impact: 12 },
            { id: 'e3', text: 'Informed consent for AI use', impact: 10 },
            { id: 'e4', text: 'Accessibility for all income levels', impact: 15 },
            { id: 'e5', text: 'Transparent AI decision-making', impact: 8 },
            { id: 'e6', text: 'Human oversight requirement', impact: 10 }
        ],
        partnerOptions: [
            { id: 'p1', name: 'Hospitals', impact: 15 },
            { id: 'p2', name: 'Community Health Centers', impact: 15 },
            { id: 'p3', name: 'Health Insurance Companies', impact: 8 },
            { id: 'p4', name: 'Telemedicine Providers', impact: 12 },
            { id: 'p5', name: 'Government Health Agencies', impact: 10 },
            { id: 'p6', name: 'Patient Advocacy Groups', impact: 12 }
        ]
    },
    {
        id: 'missing-water',
        title: 'The Missing Water',
        icon: '💧',
        sdg: 'SDG 6: Clean Water and Sanitation',
        sdgIcon: '🚰',
        setting: 'Desert City, 2035',
        timeLimit: 20,
        initialEnergy: 35,
        story: `Desert City is facing a water crisis. Water supply losses have 
        increased dramatically, and low-income neighborhoods are hit hardest. 
        Some areas have water 24/7, while others go days without. You must 
        investigate why water access is so unequal.`,
        objectives: [
            'Investigate 4 key locations',
            'Collect 8 pieces of evidence',
            'Interview 3 key witnesses',
            'Identify the root cause',
            'Propose an ethical AI solution'
        ],
        locations: [
            { id: 'treatment', name: 'Water Treatment Plant', x: 25, y: 35, width: 150, height: 105 },
            { id: 'pipes', name: 'Distribution Network', x: 200, y: 55, width: 140, height: 90 },
            { id: 'wealthy', name: 'Wealthy District', x: 110, y: 190, width: 130, height: 95 },
            { id: 'poor', name: 'Low-Income District', x: 260, y: 210, width: 125, height: 100 }
        ],
        clues: [
            { id: 'c1', name: 'Water Loss Report', location: 'treatment', description: '40% water loss in distribution system', isRedHerring: false },
            { id: 'c2', name: 'Pipe Age Data', location: 'pipes', description: 'Aging infrastructure in low-income areas (50+ years old)', isRedHerring: false },
            { id: 'c3', name: 'Leak Detection Logs', location: 'pipes', description: 'Most leaks in old pipe sections', isRedHerring: false },
            { id: 'c4', name: 'Service Records', location: 'poor', description: 'Frequent service interruptions in low-income areas', isRedHerring: false },
            { id: 'c5', name: 'Water Quality Tests', location: 'treatment', description: 'Water quality meets all standards', isRedHerring: true },
            { id: 'c6', name: 'Staffing Reports', location: 'treatment', description: 'Plant staffed adequately', isRedHerring: true },
            { id: 'c7', name: 'Billing Data', location: 'wealthy', description: 'Wealthy areas have consistent water supply', isRedHerring: false },
            { id: 'c8', name: 'Infrastructure Budget', location: 'pipes', description: 'New pipes installed only in wealthy districts', isRedHerring: false }
        ],
        npcs: [
            {
                id: 'engineer',
                name: 'Engineer Patel',
                avatar: '👨‍🔧',
                location: 'treatment',
                trust: 50,
                dialogues: [
                    {
                        id: 'd1',
                        text: 'We produce enough water, but we lose 40% in the distribution system. Most losses are in older pipe networks.',
                        options: [
                            { text: 'Where are the old pipes?', next: 'd2', trustChange: 10 },
                            { text: 'Is water quality the issue?', next: 'd3', trustChange: -5 }
                        ]
                    },
                    {
                        id: 'd2',
                        text: 'The low-income districts have 50-year-old pipes. Wealthy areas got new infrastructure, but poor areas didn\'t.',
                        options: [
                            { text: 'Why weren\'t they replaced?', next: 'd4', trustChange: 5 },
                            { text: 'Thank you.', next: 'end', trustChange: 5 }
                        ]
                    },
                    {
                        id: 'd3',
                        text: 'No, quality is fine. The problem is infrastructure inequality. Old pipes leak, new pipes don\'t.',
                        options: [
                            { text: 'Where are the old pipes?', next: 'd2', trustChange: 10 }
                        ]
                    },
                    {
                        id: 'd4',
                        text: 'Budget priorities. The city focused on areas that could pay higher rates. It\'s a classic infrastructure inequality problem.',
                        options: [
                            { text: 'I understand. Thank you.', next: 'end', trustChange: 10 }
                        ]
                    }
                ]
            },
            {
                id: 'resident',
                name: 'Ms. Garcia',
                avatar: '👩',
                location: 'poor',
                trust: 50,
                dialogues: [
                    {
                        id: 'd1',
                        text: 'We go days without water. The pipes break constantly, and repairs take forever. Meanwhile, the rich neighborhoods never have problems.',
                        options: [
                            { text: 'How long has this been happening?', next: 'd2', trustChange: 5 },
                            { text: 'Do you report the issues?', next: 'd3', trustChange: 10 }
                        ]
                    },
                    {
                        id: 'd2',
                        text: 'Years. It got worse when they replaced pipes in wealthy areas but not here. We\'re stuck with 50-year-old infrastructure.',
                        options: [
                            { text: 'Thank you for sharing.', next: 'end', trustChange: 10 }
                        ]
                    },
                    {
                        id: 'd3',
                        text: 'Yes, constantly. But they patch the leaks instead of replacing pipes. It\'s a temporary fix that doesn\'t solve anything.',
                        options: [
                            { text: 'How long has this been happening?', next: 'd2', trustChange: 5 }
                        ]
                    }
                ]
            },
            {
                id: 'manager',
                name: 'Mr. Chen',
                avatar: '👨‍💼',
                location: 'pipes',
                trust: 50,
                dialogues: [
                    {
                        id: 'd1',
                        text: 'We prioritize repairs based on... economic factors. Areas with higher property values get faster service.',
                        options: [
                            { text: 'That seems unfair.', next: 'd2', trustChange: 10 },
                            { text: 'Is that official policy?', next: 'd3', trustChange: 5 }
                        ]
                    },
                    {
                        id: 'd2',
                        text: 'It is. But it\'s how the system works. We have limited resources, so we focus where the money is. It\'s infrastructure inequality.',
                        options: [
                            { text: 'Thank you for being honest.', next: 'end', trustChange: 10 }
                        ]
                    },
                    {
                        id: 'd3',
                        text: 'Not officially, but it\'s the reality. Budget decisions favor areas that generate more revenue.',
                        options: [
                            { text: 'I see. Thank you.', next: 'end', trustChange: 8 }
                        ]
                    }
                ]
            }
        ],
        rootCauses: [
            { id: 'rc1', text: 'Insufficient water production', correct: false },
            { id: 'rc2', text: 'Aging infrastructure in low-income areas causing leaks', correct: true },
            { id: 'rc3', text: 'Water contamination', correct: false },
            { id: 'rc4', text: 'Inadequate treatment facilities', correct: false }
        ],
        aiSolutions: [
            { id: 'sol1', name: 'AI Leak Detection System', description: 'AI sensors detect leaks early and prioritize repairs in underserved areas' },
            { id: 'sol2', name: 'Predictive Maintenance AI', description: 'AI predicts pipe failures and schedules proactive replacements' },
            { id: 'sol3', name: 'Smart Water Distribution', description: 'AI optimizes water flow to ensure equitable distribution' },
            { id: 'sol4', name: 'Automated Billing AI', description: 'AI increases water rates to fund infrastructure' }
        ],
        ethicsOptions: [
            { id: 'e1', text: 'Equitable infrastructure investment', impact: 15 },
            { id: 'e2', text: 'Community input on AI decisions', impact: 12 },
            { id: 'e3', text: 'Transparent prioritization algorithms', impact: 10 },
            { id: 'e4', text: 'Privacy protection for usage data', impact: 8 },
            { id: 'e5', text: 'Bias auditing for geographic fairness', impact: 12 },
            { id: 'e6', text: 'Affordability safeguards', impact: 10 }
        ],
        partnerOptions: [
            { id: 'p1', name: 'Water Utility', impact: 15 },
            { id: 'p2', name: 'Community Organizations', impact: 12 },
            { id: 'p3', name: 'Infrastructure Companies', impact: 10 },
            { id: 'p4', name: 'Environmental NGOs', impact: 10 },
            { id: 'p5', name: 'Government Agencies', impact: 12 },
            { id: 'p6', name: 'Resident Associations', impact: 12 }
        ]
    }
];

// AI Tools
const aiTools = [
    {
        id: 'pattern-finder',
        name: 'Pattern Finder',
        icon: '📊',
        cost: 5,
        description: 'Highlights anomalies in datasets',
        use: function(data) {
            return {
                type: 'pattern',
                result: 'Anomaly detected: Significant data gaps in low-income areas',
                animation: 'scan'
            };
        }
    },
    {
        id: 'bias-scanner',
        name: 'Bias Scanner',
        icon: '⚖️',
        cost: 4,
        description: 'Detects missing groups in data',
        use: function(data) {
            return {
                type: 'bias',
                result: 'Warning: Data underrepresents low-income communities',
                animation: 'warning'
            };
        }
    },
    {
        id: 'forecast-lens',
        name: 'Forecast Lens',
        icon: '🔮',
        cost: 6,
        description: 'Projects trends and confidence',
        use: function(data) {
            return {
                type: 'forecast',
                result: 'Trend projection: Problem will worsen by 30% in 6 months without intervention',
                animation: 'chart'
            };
        }
    },
    {
        id: 'text-analyzer',
        name: 'Text Clue Analyzer',
        icon: '📝',
        cost: 3,
        description: 'Summarizes witness statements',
        use: function(data) {
            return {
                type: 'text',
                result: 'Key points: Infrastructure inequality, lack of access, systemic bias',
                animation: 'typing'
            };
        }
    },
    {
        id: 'heat-vision',
        name: 'Map Heat Vision',
        icon: '🗺️',
        cost: 7,
        description: 'Overlays hotspots on map',
        use: function(data) {
            return {
                type: 'heat',
                result: 'Hotspots identified: Low-income areas show highest problem density',
                animation: 'heat'
            };
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
    const isSubmitted = localStorage.getItem('ai-detective-submitted') === 'true';
    if (isSubmitted) {
        showScreen('submission');
        return;
    }
    
    setupEventListeners();
    showScreen('splash');
}

function setupEventListeners() {
    document.getElementById('start-btn').addEventListener('click', () => {
        showScreen('case-select');
        renderCaseSelection();
    });

    const splashHomeBtn = document.getElementById('splash-home-btn');
    if (splashHomeBtn) {
        splashHomeBtn.addEventListener('click', () => {
            window.location.href = '/';
        });
    }

    document.getElementById('reduce-motion').addEventListener('change', (e) => {
        document.body.classList.toggle('reduce-motion', e.target.checked);
    });

    document.getElementById('begin-investigation-btn').addEventListener('click', () => {
        startInvestigation();
    });

    const openToolboxBtn = document.getElementById('open-toolbox-btn');
    if (openToolboxBtn) {
        openToolboxBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Open toolbox button clicked');
            openToolbox();
        });
    } else {
        console.error('Open toolbox button not found');
    }

    const closeToolboxBtn = document.getElementById('close-toolbox-btn');
    if (closeToolboxBtn) {
        closeToolboxBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close toolbox button clicked');
            closeToolbox();
        });
    } else {
        console.error('Close toolbox button not found');
    }

    const goToDeductionBtn = document.getElementById('go-to-deduction-btn');
    if (goToDeductionBtn) {
        goToDeductionBtn.addEventListener('click', () => {
            if (gameState.evidence.length > 0) {
                showScreen('deduction-board');
                renderDeductionBoard();
            } else {
                alert('You need to collect at least some evidence before proceeding to the deduction board.');
            }
        });
    }

    // Close analysis button - use direct event listener
    const closeAnalysisBtn = document.getElementById('close-analysis-btn');
    if (closeAnalysisBtn) {
        closeAnalysisBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close analysis button clicked');
            showScreen('investigation-hub');
            setTimeout(() => {
                renderInvestigationHub();
            }, 100);
        });
    } else {
        console.warn('Close analysis button not found on page load - will use event delegation');
        // Fallback: event delegation
        document.addEventListener('click', (e) => {
            if (e.target && (e.target.id === 'close-analysis-btn' || e.target.closest('#close-analysis-btn'))) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close analysis button clicked (delegation)');
                showScreen('investigation-hub');
                setTimeout(() => {
                    renderInvestigationHub();
                }, 100);
            }
        });
    }

    document.getElementById('finalize-deduction-btn').addEventListener('click', () => {
        showScreen('final-accusation');
        renderFinalAccusation();
    });

    document.getElementById('submit-accusation-btn').addEventListener('click', () => {
        calculateResults();
        showScreen('results');
        renderResults();
    });

    document.getElementById('write-proposal-btn').addEventListener('click', () => {
        showScreen('proposal');
        loadProposal();
    });

    document.getElementById('replay-btn').addEventListener('click', () => {
        resetGame();
        showScreen('case-select');
        renderCaseSelection();
    });

    document.getElementById('home-btn').addEventListener('click', () => {
        // Redirect to main app landing page
        window.location.href = '/';
    });

    // Proposal screen buttons
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

    const backToResultsBtn = document.getElementById('back-to-results-btn');
    if (backToResultsBtn) {
        backToResultsBtn.addEventListener('click', () => {
            showScreen('results');
            renderResults();
        });
    }

    const submitProposalBtn = document.getElementById('submit-proposal-btn');
    if (submitProposalBtn) {
        submitProposalBtn.addEventListener('click', submitProposal);
    }

    // Submission home button removed - now uses direct link to UNITAR

    // Auto-save proposal as user types (with debounce)
    const proposalTextarea = document.getElementById('proposal-text');
    if (proposalTextarea) {
        let autoSaveTimeout;
        proposalTextarea.addEventListener('input', () => {
            updateCharCount();
            // Debounce auto-save
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                autoSaveProposal();
            }, 1000); // Save 1 second after user stops typing
        });
    }
}

// ===== CASE SELECTION =====

function renderCaseSelection() {
    const container = document.getElementById('case-cards');
    container.innerHTML = '';
    
    cases.forEach(caseData => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.innerHTML = `
            <div class="case-card-icon">${caseData.icon}</div>
            <h3 class="case-card-title">${caseData.title}</h3>
            <p class="case-card-description">${caseData.story.substring(0, 150)}...</p>
            <span class="sdg-badge">${caseData.sdgIcon} ${caseData.sdg}</span>
        `;
        card.addEventListener('click', () => selectCase(caseData.id));
        container.appendChild(card);
    });
}

function selectCase(caseId) {
    gameState.currentCase = cases.find(c => c.id === caseId);
    gameState.currentCaseIndex = cases.findIndex(c => c.id === caseId);
    gameState.timeRemaining = gameState.currentCase.timeLimit * 60; // Convert to seconds
    gameState.energy = gameState.currentCase.initialEnergy;
    gameState.cluesFound = [];
    gameState.evidence = [];
    gameState.npcsInterviewed = [];
    gameState.trust = {};
    gameState.deductionBoard = { symptoms: [], causes: [], root: [] };
    
    showScreen('briefing');
    renderBriefing();
    startTimer();
}

// ===== BRIEFING =====

function renderBriefing() {
    const caseData = gameState.currentCase;
    document.getElementById('case-title').textContent = caseData.title;
    document.getElementById('sdg-tag').innerHTML = `<span class="sdg-badge">${caseData.sdgIcon} ${caseData.sdg}</span>`;
    document.getElementById('story-text').textContent = caseData.story;
    document.getElementById('time-limit-value').textContent = caseData.timeLimit;
    
    const objectivesList = document.getElementById('objectives');
    objectivesList.innerHTML = '';
    caseData.objectives.forEach(obj => {
        const li = document.createElement('li');
        li.textContent = obj;
        objectivesList.appendChild(li);
    });
    
    // Render map preview
    const mapPreview = document.getElementById('city-map-preview');
    mapPreview.innerHTML = `<div style="text-align: center; padding-top: 80px; color: white; font-size: 1.2rem;">${caseData.setting}</div>`;
}

// ===== TIMER =====

let timerInterval = null;

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        
        if (gameState.timeRemaining <= 0) {
            clearInterval(timerInterval);
            // Time's up - force to deduction board
            if (gameState.currentScreen === 'investigation-hub') {
                showScreen('deduction-board');
                renderDeductionBoard();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timeElement = document.getElementById('time-remaining');
    if (timeElement) {
        timeElement.textContent = timeDisplay;
        if (gameState.timeRemaining < 300) { // Less than 5 minutes
            timeElement.style.color = 'var(--accent-orange)';
        }
    }
}

// ===== INVESTIGATION HUB =====

function startInvestigation() {
    showScreen('investigation-hub');
    // Small delay to ensure screen is visible before rendering
    setTimeout(() => {
        renderInvestigationHub();
    }, 100);
}

function renderInvestigationHub() {
    updateStats();
    renderCityMap();
    renderEvidence();
}

function updateStats() {
    document.getElementById('time-remaining').textContent = formatTime(gameState.timeRemaining);
    document.getElementById('energy-remaining').textContent = gameState.energy;
    const totalClues = gameState.currentCase ? gameState.currentCase.clues.length : 8;
    document.getElementById('clues-found').textContent = `${gameState.cluesFound.length}/${totalClues}`;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function renderCityMap() {
    const map = document.getElementById('city-map');
    map.innerHTML = '';
    map.style.position = 'relative';
    map.style.width = '400px';
    map.style.height = '300px';
    map.style.margin = '0 auto';
    map.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    gameState.currentCase.locations.forEach(loc => {
        const zone = document.createElement('div');
        zone.className = 'map-zone';
        zone.style.left = loc.x + 'px';
        zone.style.top = loc.y + 'px';
        zone.style.width = loc.width + 'px';
        zone.style.height = loc.height + 'px';
        zone.textContent = loc.name;
        zone.dataset.locationId = loc.id;
        
        if (gameState.cluesFound.some(c => {
            const clue = gameState.currentCase.clues.find(cl => cl.id === c);
            return clue && clue.location === loc.id;
        })) {
            zone.classList.add('visited');
        }
        
        zone.addEventListener('click', () => investigateLocation(loc.id));
        map.appendChild(zone);
    });
}

function investigateLocation(locationId) {
    if (!gameState.currentCase) {
        console.error('No case selected');
        return;
    }
    
    const location = gameState.currentCase.locations.find(l => l.id === locationId);
    if (!location) {
        console.error('Location not found:', locationId);
        return;
    }
    
    const availableClues = gameState.currentCase.clues.filter(c => 
        c.location === locationId && !gameState.cluesFound.includes(c.id)
    );
    const npc = gameState.currentCase.npcs.find(n => n.location === locationId);
    
    // Debug logging
    const allCluesAtLocation = gameState.currentCase.clues.filter(c => c.location === locationId);
    console.log('=== Investigation Debug ===');
    console.log('Location ID:', locationId);
    console.log('All clues at location:', allCluesAtLocation.map(c => ({ id: c.id, name: c.name })));
    console.log('Found clues:', gameState.cluesFound);
    console.log('Available clues:', availableClues.map(c => ({ id: c.id, name: c.name })));
    console.log('Has NPC:', !!npc, npc ? npc.name : 'none');
    
    if (availableClues.length > 0) {
        // Find a clue
        const clue = availableClues[0];
        gameState.cluesFound.push(clue.id);
        gameState.evidence.push(clue);
        
        console.log('Evidence found:', clue.name, 'Total evidence:', gameState.evidence.length);
        
        if (clue.isRedHerring) {
            gameState.timeRemaining -= 60; // Lose 1 minute
            gameState.trust[locationId] = (gameState.trust[locationId] || 50) - 5;
        }
        
        createConfetti();
        soundEffects.play('clue-found');
        updateStats();
        renderCityMap();
        
        // Show clue popup with animation
        showCluePopup(clue, () => {
            // After popup animation, render evidence in panel
            renderEvidence();
        });
    } else if (npc && !gameState.npcsInterviewed.includes(npc.id)) {
        // Interview NPC if available and not yet interviewed
        gameState.currentNPC = npc;
        gameState.currentDialogue = npc.dialogues[0];
        if (!gameState.trust[npc.id]) {
            gameState.trust[npc.id] = npc.trust;
        }
        showScreen('interrogation');
        renderInterrogation();
    } else {
        // Check what's available at this location
        const cluesAtThisLocation = gameState.currentCase.clues.filter(c => c.location === locationId);
        const foundAtThisLocation = cluesAtThisLocation.filter(c => gameState.cluesFound.includes(c.id));
        
        console.log('Location:', locationId, 'Total clues at location:', cluesAtThisLocation.length, 'Found:', foundAtThisLocation.length);
        
        if (cluesAtThisLocation.length === 0 && !npc) {
            alert('This location has no evidence or witnesses to investigate. Try other locations on the map.');
        } else if (foundAtThisLocation.length >= cluesAtThisLocation.length) {
            if (npc && gameState.npcsInterviewed.includes(npc.id)) {
                alert('You\'ve already collected all evidence and interviewed the witness at this location. Try other locations.');
            } else if (npc) {
                alert('You\'ve collected all evidence here. You can still interview the witness at this location.');
            } else {
                alert('You\'ve already collected all available evidence from this location. Try other locations to find more evidence.');
            }
        } else {
            // This shouldn't happen if logic is correct, but provide helpful message
            console.warn('Unexpected state: clues available but not found');
            alert('There seems to be an issue. Please try clicking the location again.');
        }
    }
}

function renderEvidence() {
    const grid = document.getElementById('evidence-grid');
    if (!grid) {
        console.error('Evidence grid not found');
        return;
    }
    
    // Update evidence count
    const countElement = document.getElementById('evidence-count');
    if (countElement) {
        countElement.textContent = `(${gameState.evidence.length})`;
    }
    
    grid.innerHTML = '';
    
    if (gameState.evidence.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '2rem';
        emptyMsg.style.color = '#666';
        emptyMsg.textContent = 'No evidence collected yet. Click on map locations to investigate.';
        grid.appendChild(emptyMsg);
        return;
    }
    
    gameState.evidence.forEach((clue, index) => {
        // Check if card already exists
        const existingCard = grid.querySelector(`[data-clue-id="${clue.id}"]`);
        if (existingCard) {
            return; // Skip if already rendered
        }
        
        const card = document.createElement('div');
        card.className = 'evidence-card';
        card.dataset.clueId = clue.id;
        card.style.opacity = '0';
        card.style.transform = 'scale(0.5) translateY(-20px)';
        
        const front = document.createElement('div');
        front.className = 'evidence-card-front';
        front.textContent = '?';
        
        const back = document.createElement('div');
        back.className = 'evidence-card-back';
        back.innerHTML = `<strong>${clue.name}</strong><br><small>${clue.description}</small>`;
        
        card.appendChild(front);
        card.appendChild(back);
        
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            soundEffects.play('card-flip');
        });
        
        grid.appendChild(card);
        
        // Animate card entrance
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
        }, 50 * index);
    });
    
    console.log('Rendered', gameState.evidence.length, 'evidence cards');
}

// ===== AI TOOLBOX =====

function openToolbox() {
    const modal = document.getElementById('toolbox-modal');
    if (!modal) {
        console.error('Toolbox modal not found');
        return;
    }
    modal.classList.add('active');
    renderToolbox();
    soundEffects.play('modal-open');
    
    // Close modal when clicking outside
    modal.addEventListener('click', function closeOnBackdrop(e) {
        if (e.target === modal) {
            closeToolbox();
            modal.removeEventListener('click', closeOnBackdrop);
        }
    });
}

function closeToolbox() {
    const modal = document.getElementById('toolbox-modal');
    if (modal) {
        modal.classList.remove('active');
        soundEffects.play('modal-close');
    }
}

function renderToolbox() {
    const grid = document.getElementById('toolbox-grid');
    if (!grid) {
        console.error('Toolbox grid not found');
        return;
    }
    
    grid.innerHTML = '';
    
    if (!aiTools || aiTools.length === 0) {
        grid.innerHTML = '<p>No AI tools available.</p>';
        return;
    }
    
    aiTools.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        const canAfford = gameState.energy >= tool.cost;
        
        if (!canAfford) {
            card.classList.add('disabled');
        }
        
        card.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-name">${tool.name}</div>
            <div class="tool-cost" style="color: ${canAfford ? 'var(--accent-orange)' : '#999'}">Cost: ${tool.cost} Energy</div>
            <div class="tool-description">${tool.description}</div>
        `;
        
        if (canAfford) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                useTool(tool);
            });
        } else {
            card.style.cursor = 'not-allowed';
            card.title = 'Not enough energy';
        }
        
        grid.appendChild(card);
    });
    
    console.log('Toolbox rendered with', aiTools.length, 'tools. Current energy:', gameState.energy);
}

function useTool(tool) {
    if (!tool) {
        console.error('No tool provided');
        return;
    }
    
    if (gameState.energy < tool.cost) {
        alert('Not enough energy! You need ' + tool.cost + ' energy but only have ' + gameState.energy + '.');
        return;
    }
    
    gameState.energy -= tool.cost;
    closeToolbox();
    
    // Small delay to ensure modal closes before showing new screen
    setTimeout(() => {
        showScreen('evidence-analysis');
        renderToolOutput(tool);
        updateStats();
    }, 200);
}

function renderToolOutput(tool) {
    const output = document.getElementById('tool-output');
    if (!output) {
        console.error('Tool output element not found');
        return;
    }
    
    if (!tool.use || typeof tool.use !== 'function') {
        console.error('Tool use function not available');
        output.innerHTML = '<p>Error: Tool not properly configured.</p>';
        return;
    }
    
    const result = tool.use(gameState.evidence);
    
    if (!result) {
        output.innerHTML = '<p>Error: Tool returned no result.</p>';
        return;
    }
    
    output.innerHTML = `
        <h3>${tool.name} Results</h3>
        <div class="scanner-animation">
            <div class="scanner-line"></div>
        </div>
        <p style="margin-top: 2rem; font-size: 1.1rem; line-height: 1.6;">${result.result}</p>
    `;
    
    if (result.type === 'bias') {
        output.innerHTML += '<div class="bias-warning">⚠️ Bias detected in data collection</div>';
    }
    
    if (tool.id === 'bias-scanner') {
        gameState.ethicsScore += 10;
    }
    
    // Update stats display
    updateStats();
    
    soundEffects.play('tool-use');
    console.log('Tool used:', tool.name, 'Energy remaining:', gameState.energy);
}

// ===== INTERROGATION =====

function renderInterrogation() {
    const npc = gameState.currentNPC;
    document.getElementById('npc-avatar').textContent = npc.avatar;
    document.getElementById('npc-name').textContent = npc.name;
    updateTrustMeter();
    
    const dialogue = gameState.currentDialogue;
    document.getElementById('npc-dialogue').textContent = dialogue.text;
    
    const optionsContainer = document.getElementById('dialogue-options');
    optionsContainer.innerHTML = '';
    
    dialogue.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'dialogue-option';
        btn.textContent = option.text;
        btn.addEventListener('click', () => selectDialogueOption(option));
        optionsContainer.appendChild(btn);
    });
}

function selectDialogueOption(option) {
    if (option.next === 'end') {
        gameState.npcsInterviewed.push(gameState.currentNPC.id);
        showScreen('investigation-hub');
        // Ensure evidence is re-rendered when returning
        setTimeout(() => {
            renderInvestigationHub();
        }, 100);
        return;
    }
    
    gameState.trust[gameState.currentNPC.id] = Math.max(0, Math.min(100, 
        (gameState.trust[gameState.currentNPC.id] || 50) + option.trustChange
    ));
    
    gameState.currentDialogue = gameState.currentNPC.dialogues.find(d => d.id === option.next);
    renderInterrogation();
    soundEffects.play('dialogue');
}

function updateTrustMeter() {
    const trust = gameState.trust[gameState.currentNPC.id] || 50;
    document.getElementById('trust-fill').style.width = trust + '%';
}

// ===== DEDUCTION BOARD =====

function renderDeductionBoard() {
    // Auto-advance if all clues found (but allow manual access too)
    if (gameState.cluesFound.length >= 8 && gameState.currentScreen === 'investigation-hub') {
        showScreen('deduction-board');
    }
    
    // Small delay to ensure screen is visible
    setTimeout(() => {
        renderDeductionColumns();
        renderEvidencePool();
        setupDragAndDrop();
    }, 100);
}

function renderDeductionColumns() {
    ['symptoms', 'causes', 'root'].forEach(columnType => {
        const zone = document.getElementById(columnType + '-zone');
        zone.innerHTML = '';
        gameState.deductionBoard[columnType].forEach(clueId => {
            const clue = gameState.evidence.find(c => c.id === clueId);
            if (clue) {
                const item = createEvidenceItem(clue, false);
                zone.appendChild(item);
            }
        });
    });
}

function renderEvidencePool() {
    const pool = document.getElementById('evidence-pool');
    pool.innerHTML = '';
    
    const usedClues = [
        ...gameState.deductionBoard.symptoms,
        ...gameState.deductionBoard.causes,
        ...gameState.deductionBoard.root
    ];
    
    gameState.evidence.filter(c => !usedClues.includes(c.id)).forEach(clue => {
        const item = createEvidenceItem(clue, true);
        pool.appendChild(item);
    });
    
    checkDeductionComplete();
}

function createEvidenceItem(clue, draggable) {
    const item = document.createElement('div');
    item.className = 'evidence-item';
    item.textContent = clue.name;
    item.dataset.clueId = clue.id;
    item.draggable = draggable;
    
    if (draggable) {
        item.addEventListener('dragstart', handleDragStart);
    }
    
    return item;
}

function setupDragAndDrop() {
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.clueId);
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const clueId = e.dataTransfer.getData('text/plain');
    const column = e.currentTarget.parentElement.dataset.column;
    
    // Remove from other columns
    Object.keys(gameState.deductionBoard).forEach(col => {
        gameState.deductionBoard[col] = gameState.deductionBoard[col].filter(id => id !== clueId);
    });
    
    // Add to new column
    if (!gameState.deductionBoard[column].includes(clueId)) {
        gameState.deductionBoard[column].push(clueId);
    }
    
    renderDeductionBoard();
    soundEffects.play('drop');
}

function checkDeductionComplete() {
    const hasRoot = gameState.deductionBoard.root.length > 0;
    const hasCauses = gameState.deductionBoard.causes.length > 0;
    const hasSymptoms = gameState.deductionBoard.symptoms.length > 0;
    
    document.getElementById('finalize-deduction-btn').disabled = !(hasRoot && hasCauses && hasSymptoms);
}

// ===== FINAL ACCUSATION =====

function renderFinalAccusation() {
    renderRootCauseOptions();
    renderAISolutionOptions();
    renderEthicsOptions();
    renderPartnerOptions();
    checkAccusationComplete();
}

function renderRootCauseOptions() {
    const container = document.getElementById('root-cause-options');
    container.innerHTML = '';
    
    gameState.currentCase.rootCauses.forEach(rc => {
        const option = document.createElement('div');
        option.className = 'option-item';
        option.textContent = rc.text;
        option.dataset.rcId = rc.id;
        option.dataset.correct = rc.correct;
        
        option.addEventListener('click', () => {
            document.querySelectorAll('#root-cause-options .option-item').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            gameState.selectedRootCause = rc.id;
            checkAccusationComplete();
        });
        
        container.appendChild(option);
    });
}

function renderAISolutionOptions() {
    const container = document.getElementById('ai-solution-options');
    container.innerHTML = '';
    
    gameState.currentCase.aiSolutions.forEach(sol => {
        const option = document.createElement('div');
        option.className = 'option-item';
        option.innerHTML = `
            <strong>${sol.name}</strong><br>
            <small>${sol.description}</small>
        `;
        option.dataset.solId = sol.id;
        
        option.addEventListener('click', () => {
            document.querySelectorAll('#ai-solution-options .option-item').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            gameState.selectedAISolution = sol.id;
            checkAccusationComplete();
        });
        
        container.appendChild(option);
    });
}

function renderEthicsOptions() {
    const container = document.getElementById('ethics-options');
    container.innerHTML = '';
    
    gameState.currentCase.ethicsOptions.forEach(eth => {
        const option = document.createElement('div');
        option.className = 'option-item';
        option.textContent = eth.text;
        option.dataset.ethId = eth.id;
        option.dataset.impact = eth.impact;
        
        option.addEventListener('click', () => {
            if (option.classList.contains('selected')) {
                option.classList.remove('selected');
                gameState.selectedEthics = gameState.selectedEthics.filter(id => id !== eth.id);
            } else {
                if (gameState.selectedEthics.length < 2) {
                    option.classList.add('selected');
                    gameState.selectedEthics.push(eth.id);
                } else {
                    alert('You can only select 2 ethics safeguards.');
                }
            }
            checkAccusationComplete();
        });
        
        container.appendChild(option);
    });
}

function renderPartnerOptions() {
    const container = document.getElementById('partner-options');
    container.innerHTML = '';
    
    gameState.currentCase.partnerOptions.forEach(part => {
        const option = document.createElement('div');
        option.className = 'option-item';
        option.textContent = part.name;
        option.dataset.partId = part.id;
        option.dataset.impact = part.impact;
        
        option.addEventListener('click', () => {
            if (option.classList.contains('selected')) {
                option.classList.remove('selected');
                gameState.selectedPartners = gameState.selectedPartners.filter(id => id !== part.id);
            } else {
                if (gameState.selectedPartners.length < 2) {
                    option.classList.add('selected');
                    gameState.selectedPartners.push(part.id);
                } else {
                    alert('You can only select 2 partners.');
                }
            }
            checkAccusationComplete();
        });
        
        container.appendChild(option);
    });
}

function checkAccusationComplete() {
    const complete = gameState.selectedRootCause && 
                     gameState.selectedAISolution &&
                     gameState.selectedEthics.length === 2 &&
                     gameState.selectedPartners.length === 2;
    
    document.getElementById('submit-accusation-btn').disabled = !complete;
}

// ===== RESULTS =====

function calculateResults() {
    // Impact Score
    gameState.impactScore = 50;
    const correctRootCause = gameState.currentCase.rootCauses.find(rc => rc.id === gameState.selectedRootCause);
    if (correctRootCause && correctRootCause.correct) {
        gameState.impactScore += 30;
    }
    gameState.selectedPartners.forEach(partId => {
        const partner = gameState.currentCase.partnerOptions.find(p => p.id === partId);
        if (partner) gameState.impactScore += partner.impact;
    });
    
    // Ethics Score
    gameState.ethicsScore = 40;
    gameState.selectedEthics.forEach(ethId => {
        const eth = gameState.currentCase.ethicsOptions.find(e => e.id === ethId);
        if (eth) gameState.ethicsScore += eth.impact;
    });
    if (gameState.ethicsScore > 0) {
        gameState.ethicsScore += 10; // Bonus for using bias scanner
    }
    
    // Feasibility Score
    gameState.feasibilityScore = 30;
    gameState.selectedPartners.forEach(partId => {
        const partner = gameState.currentCase.partnerOptions.find(p => p.id === partId);
        if (partner) gameState.feasibilityScore += partner.impact * 0.5;
    });
    gameState.feasibilityScore += gameState.selectedPartners.length * 5; // Partnership bonus
    
    // Penalties
    const redHerrings = gameState.evidence.filter(c => c.isRedHerring).length;
    gameState.impactScore -= redHerrings * 5;
    
    // Clamp scores
    gameState.impactScore = Math.max(0, Math.min(100, gameState.impactScore));
    gameState.ethicsScore = Math.max(0, Math.min(100, gameState.ethicsScore));
    gameState.feasibilityScore = Math.max(0, Math.min(100, gameState.feasibilityScore));
}

function renderResults() {
    // Track completed case (like Build-Break-Fix tracks rounds)
    if (gameState.currentCase && !gameState.completedCases.find(c => c.id === gameState.currentCase.id)) {
        gameState.completedCases.push({
            id: gameState.currentCase.id,
            title: gameState.currentCase.title,
            scores: {
                impact: gameState.impactScore,
                ethics: gameState.ethicsScore,
                feasibility: gameState.feasibilityScore
            },
            selectedRootCause: gameState.selectedRootCause,
            selectedAISolution: gameState.selectedAISolution,
            selectedEthics: gameState.selectedEthics,
            selectedPartners: gameState.selectedPartners
        });
    }
    
    // Scores removed - no longer displaying
    // Calculate total for badge determination only
    const totalScore = Math.round((gameState.impactScore + gameState.ethicsScore + gameState.feasibilityScore) / 3);
    
    determineBadge(totalScore);
    generateCaseReport();
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

function determineBadge(totalScore) {
    let badgeTitle = 'Detective';
    let badgeIcon = '🏆';
    
    if (totalScore >= 85) {
        if (gameState.selectedPartners.length >= 2) {
            badgeTitle = 'Partnership Pro';
            badgeIcon = '🤝';
        } else if (gameState.ethicsScore >= 80) {
            badgeTitle = 'Ethics Guardian';
            badgeIcon = '⚖️';
        } else {
            badgeTitle = 'Impact Architect';
            badgeIcon = '🌟';
        }
    } else if (totalScore >= 70) {
        badgeTitle = 'Data Daredevil';
        badgeIcon = '📊';
    }
    
    document.getElementById('badge-icon').textContent = badgeIcon;
    document.getElementById('badge-title').textContent = badgeTitle;
}

function generateCaseReport() {
    const caseData = gameState.currentCase;
    const rootCause = caseData.rootCauses.find(rc => rc.id === gameState.selectedRootCause);
    const solution = caseData.aiSolutions.find(s => s.id === gameState.selectedAISolution);
    
    const report = `
        <strong>Case:</strong> ${caseData.title}<br><br>
        <strong>Root Cause Identified:</strong> ${rootCause ? rootCause.text : 'Unknown'}<br><br>
        <strong>Proposed AI Solution:</strong> ${solution ? solution.name : 'None'}<br>
        ${solution ? solution.description : ''}<br><br>
        <strong>Ethics Safeguards:</strong> ${gameState.selectedEthics.length} selected<br><br>
        <strong>Partners:</strong> ${gameState.selectedPartners.length} selected (Partnership focus)<br><br>
        <strong>Conclusion:</strong> The investigation revealed systemic issues requiring 
        ethical AI solutions and community partnerships to address the ${caseData.sdg} challenge.
    `;
    
    document.getElementById('case-report-text').innerHTML = report;
}

// ===== UTILITIES =====

function showCluePopup(clue, callback) {
    const modal = document.getElementById('clue-popup-modal');
    const nameEl = document.getElementById('clue-popup-name');
    const descEl = document.getElementById('clue-popup-description');
    const content = modal.querySelector('.clue-popup-content');
    
    if (!modal || !nameEl || !descEl || !content) {
        console.error('Clue popup elements not found');
        if (callback) callback();
        return;
    }
    
    // Set content
    nameEl.textContent = clue.name;
    descEl.textContent = clue.description;
    
    // Reset styles
    content.style.transform = '';
    content.style.opacity = '';
    content.style.transition = '';
    modal.style.display = 'flex';
    
    // Show popup with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // After showing for 2.5 seconds, animate down to evidence panel
    setTimeout(() => {
        const evidencePanel = document.querySelector('.evidence-panel');
        const evidenceGrid = document.getElementById('evidence-grid');
        
        if (evidencePanel && evidenceGrid) {
            const panelRect = evidencePanel.getBoundingClientRect();
            const gridRect = evidenceGrid.getBoundingClientRect();
            const contentRect = content.getBoundingClientRect();
            
            // Calculate target position relative to viewport
            const targetX = gridRect.left + (gridRect.width / 2) - (contentRect.width / 2);
            const targetY = gridRect.top + (gridRect.height / 2) - (contentRect.height / 2);
            
            // Get current position
            const currentX = contentRect.left;
            const currentY = contentRect.top;
            
            // Calculate movement
            const deltaX = targetX - currentX;
            const deltaY = targetY - currentY;
            
            // Animate to evidence panel
            content.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            content.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
            content.style.opacity = '0';
            
            // After animation completes, hide modal and render evidence
            setTimeout(() => {
                modal.classList.remove('active');
                modal.style.display = 'none';
                content.style.transform = '';
                content.style.opacity = '';
                content.style.transition = '';
                
                if (callback) callback();
            }, 800);
        } else {
            // Fallback if elements not found
            modal.classList.remove('active');
            modal.style.display = 'none';
            if (callback) callback();
        }
    }, 2500); // Show for 2.5 seconds before animating
}

function createConfetti() {
    const container = document.getElementById('confetti-container');
    for (let i = 0; i < 20; i++) {
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
        currentCase: null,
        timeRemaining: 0,
        energy: 0,
        cluesFound: [],
        evidence: [],
        npcsInterviewed: [],
        trust: {},
        impactScore: 0,
        ethicsScore: 0,
        feasibilityScore: 0,
        selectedRootCause: null,
        selectedAISolution: null,
        selectedEthics: [],
        selectedPartners: [],
        deductionBoard: { symptoms: [], causes: [], root: [] },
        connections: []
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
    const caseId = gameState.currentCase ? gameState.currentCase.id : 'default';
    const savedProposal = localStorage.getItem(`detective-proposal-${caseId}`);
    
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
    if (!proposalText || !gameState.currentCase) return;
    
    const caseId = gameState.currentCase.id;
    localStorage.setItem(`detective-proposal-${caseId}`, proposalText.value);
}

function saveProposal() {
    const proposalText = document.getElementById('proposal-text');
    const saveStatus = document.getElementById('save-status');
    
    if (!proposalText || !gameState.currentCase) return;
    
    const caseId = gameState.currentCase.id;
    localStorage.setItem(`detective-proposal-${caseId}`, proposalText.value);
    
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
    
    if (!gameState.currentCase) {
        alert('No case data available.');
        return;
    }
    
    const caseData = gameState.currentCase;
    const caseReportEl = document.getElementById('case-report-text');
    const caseReport = caseReportEl ? caseReportEl.innerText : '';
    const badgeTitle = document.getElementById('badge-title') ? document.getElementById('badge-title').textContent : 'Detective';
    
    const content = `
AI Detective Proposal - AI & Social Impact Games

Case: ${caseData.title}
Date: ${new Date().toLocaleDateString()}
Badge Earned: ${badgeTitle}

${caseReport ? 'CASE SUMMARY:\n' + caseReport + '\n\n' : ''}
MY PROPOSAL:

${proposalText.value}

---
Generated from AI & Social Impact Games: AI Detective Game
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Detective-Proposal-${caseData.title.replace(/\s+/g, '-')}-${Date.now()}.txt`;
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
    const caseData = gameState.currentCase;
    const caseReportEl = document.getElementById('case-report-text');
    const caseReport = caseReportEl ? caseReportEl.innerText : '';
    const badgeTitle = document.getElementById('badge-title') ? document.getElementById('badge-title').textContent : 'Detective';
    
    const submissionData = {
        game: 'ai-detective',
        proposal: proposalText.value,
        cases: gameState.completedCases, // All completed cases (like Build-Break-Fix rounds)
        currentCase: caseData ? caseData.id : null,
        currentCaseIndex: gameState.currentCaseIndex,
        totalCases: gameState.totalCases,
        challengesCompleted: gameState.completedCases.length, // Number of cases completed
        caseReport: caseReport,
        timestamp: new Date().toISOString(),
        scores: {
            impact: gameState.impactScore,
            ethics: gameState.ethicsScore,
            feasibility: gameState.feasibilityScore,
            total: gameState.impactScore + gameState.ethicsScore + gameState.feasibilityScore
        },
        badge: badgeTitle
    };
    
    // Mark as submitted
    localStorage.setItem('ai-detective-submitted', 'true');
    localStorage.setItem('ai-detective-submission', JSON.stringify(submissionData));
    
    // Show submission screen
    showScreen('submission');
    createConfetti();
    soundEffects.play('submit');
}

// ===== START GAME =====

document.addEventListener('DOMContentLoaded', init);

