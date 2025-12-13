/**
 * Scenario data models
 * Each scenario contains rounds with decision questions and AI tools
 */

export const scenarios = [
  {
    id: "climate_floods",
    name: "Climate Crisis in a Coastal City",
    description: "Floods are increasing in your city. Low-income neighborhoods are most affected. Your city's budget is limited and infrastructure is aging. You have a few AI tools at your disposal to prepare and respond.",
    challenges: [
      "Frequent flooding threatens lives and property",
      "Aging infrastructure needs urgent repairs",
      "Limited budget forces difficult prioritization",
      "Low-income areas lack historical data for AI models"
    ],
    thumbnail: "🌊",
    initialBudget: 1000,
    initialIndicators: {
      publicTrust: 50,
      inequality: 40,
      budget: 1000,
      safety: 50,
      ethicalBalance: 50,
      resilience: 45,
      accessToServices: 50
    },
    rounds: [
      {
        id: "round1",
        title: "First Severe Flood Season",
        situation: "Flood risks are rising earlier than usual this year. Weather patterns are unpredictable, and your early warning systems need activation. Low-income neighborhoods along the river have historically been hit hardest, but they also have the least historical data in your AI training sets.",
        tools: [
          {
            id: "flood_prediction_model",
            name: "AI Flood Prediction Model",
            description: "Uses historical rainfall, river levels, and urban data to forecast flood risk",
            pros: "Can be very accurate if trained on good data",
            cons: "Might underperform in neighborhoods with little historical data",
            icon: "📊"
          },
          {
            id: "emergency_alert_chatbot",
            name: "AI Emergency Alert Chatbot",
            description: "Sends messages via SMS/WhatsApp/app to residents",
            pros: "Can reach many people quickly with tailored advice",
            cons: "Requires up-to-date contact information and language localization",
            icon: "💬"
          },
          {
            id: "satellite_damage_detection",
            name: "AI Satellite Damage Detection System",
            description: "Analyzes satellite imagery to quickly estimate damage after floods",
            pros: "Fast assessment for allocating repairs & aid",
            cons: "Can miss details in informal settlements or non-registered areas",
            icon: "🛰️"
          }
        ],
        decisionQuestions: [
          {
            id: "who_gets_alerts",
            prompt: "Who gets alerts first?",
            description: "Your alert system can reach everyone, but timing matters. Who should receive warnings first?",
            options: [
              {
                id: "all_equal",
                text: "Everyone gets alerts at the same time",
                effects: {
                  publicTrust: 5,
                  inequality: -5,
                  budget: -50,
                  safety: 3,
                  ethicalBalance: 5,
                  resilience: 2,
                  logMessage: "Alerts sent simultaneously. Fair distribution, but slower response in critical areas."
                }
              },
              {
                id: "business_first",
                text: "Critical infrastructure and business districts first",
                effects: {
                  publicTrust: -15,
                  inequality: 15,
                  budget: -30,
                  safety: 8,
                  ethicalBalance: -10,
                  resilience: 5,
                  logMessage: "Business districts protected first. Economic impact minimized, but low-income neighborhoods feel ignored. Public trust decreased."
                }
              },
              {
                id: "low_income_first",
                text: "Low-income neighborhoods and informal settlements first",
                effects: {
                  publicTrust: 10,
                  inequality: -10,
                  budget: -60,
                  safety: 5,
                  ethicalBalance: 15,
                  resilience: 3,
                  logMessage: "Prioritized vulnerable communities. Trust increased, but some business leaders criticized the decision."
                }
              }
            ]
          },
          {
            id: "prediction_accuracy",
            prompt: "Do you prioritize accuracy or speed in flood prediction?",
            description: "Your AI model can be tuned for maximum accuracy (slower, more expensive) or maximum speed (faster, cheaper, less precise).",
            options: [
              {
                id: "max_accuracy",
                text: "Maximum accuracy (higher computational cost and slower)",
                effects: {
                  publicTrust: 8,
                  inequality: -5,
                  budget: -150,
                  safety: 12,
                  ethicalBalance: 5,
                  resilience: 8,
                  logMessage: "High-accuracy predictions enabled. Better warnings, but slower response time and higher costs."
                }
              },
              {
                id: "balanced",
                text: "Balance of accuracy and speed",
                effects: {
                  publicTrust: 3,
                  inequality: 0,
                  budget: -80,
                  safety: 7,
                  ethicalBalance: 3,
                  resilience: 5,
                  logMessage: "Balanced approach chosen. Moderate accuracy with reasonable speed and cost."
                }
              },
              {
                id: "max_speed",
                text: "Maximum speed (rough predictions, cheaper)",
                effects: {
                  publicTrust: -5,
                  inequality: 5,
                  budget: -30,
                  safety: 3,
                  ethicalBalance: -5,
                  resilience: 2,
                  logMessage: "Fast but less accurate predictions. Some false alarms caused alert fatigue. Budget saved."
                }
              }
            ]
          },
          {
            id: "location_data",
            prompt: "Do you collect precise citizen location data?",
            description: "More precise location data improves prediction accuracy, but raises privacy concerns. Some residents may opt out if they feel their privacy is at risk.",
            options: [
              {
                id: "detailed_gps",
                text: "Yes, detailed GPS + personal data (higher accuracy, more risk)",
                effects: {
                  publicTrust: -10,
                  inequality: 5,
                  budget: -40,
                  safety: 10,
                  ethicalBalance: -15,
                  resilience: 5,
                  logMessage: "Detailed location data collected. Predictions improved, but privacy advocates raised concerns. Some residents opted out."
                }
              },
              {
                id: "neighborhood_level",
                text: "Only approximate neighborhood-level location",
                effects: {
                  publicTrust: 5,
                  inequality: -3,
                  budget: -20,
                  safety: 6,
                  ethicalBalance: 8,
                  resilience: 4,
                  logMessage: "Neighborhood-level data used. Good balance between accuracy and privacy. Most residents comfortable."
                }
              },
              {
                id: "voluntary_only",
                text: "No additional location data, only voluntary signup data",
                effects: {
                  publicTrust: 10,
                  inequality: -8,
                  budget: -10,
                  safety: 2,
                  ethicalBalance: 15,
                  resilience: 1,
                  logMessage: "Voluntary data only. Privacy protected, but predictions less accurate in areas with low signup rates."
                }
              }
            ]
          }
        ]
      },
      {
        id: "round2",
        title: "Post-Flood Recovery",
        situation: "The floods have receded, but damage is extensive. Your satellite damage detection system shows widespread destruction, especially in informal settlements that weren't fully mapped. Recovery resources are limited, and you must decide how to allocate aid.",
        tools: [
          {
            id: "satellite_damage_detection",
            name: "AI Satellite Damage Detection System",
            description: "Analyzes satellite imagery to quickly estimate damage after floods",
            pros: "Fast assessment for allocating repairs & aid",
            cons: "Can miss details in informal settlements or non-registered areas",
            icon: "🛰️"
          },
          {
            id: "aid_allocation_ai",
            name: "AI Aid Allocation System",
            description: "Optimizes distribution of resources based on damage assessments and population data",
            pros: "Efficient resource allocation",
            cons: "May favor areas with better data, potentially excluding informal settlements",
            icon: "📦"
          }
        ],
        decisionQuestions: [
          {
            id: "aid_priority",
            prompt: "How do you prioritize aid distribution?",
            description: "Resources are limited. You must decide who gets help first.",
            options: [
              {
                id: "damage_based",
                text: "Prioritize areas with highest damage (as detected by AI)",
                effects: {
                  publicTrust: -8,
                  inequality: 10,
                  budget: -100,
                  safety: 8,
                  ethicalBalance: -8,
                  resilience: 5,
                  logMessage: "Aid allocated by AI damage assessment. Efficient, but informal settlements with poor data received less help."
                }
              },
              {
                id: "vulnerability_based",
                text: "Prioritize most vulnerable communities first",
                effects: {
                  publicTrust: 12,
                  inequality: -12,
                  budget: -120,
                  safety: 6,
                  ethicalBalance: 15,
                  resilience: 4,
                  logMessage: "Vulnerable communities prioritized. More equitable, but slower overall recovery."
                }
              },
              {
                id: "mixed_approach",
                text: "Balance damage severity and community vulnerability",
                effects: {
                  publicTrust: 5,
                  inequality: -3,
                  budget: -110,
                  safety: 7,
                  ethicalBalance: 8,
                  resilience: 6,
                  logMessage: "Balanced approach used. Some trade-offs, but generally fair distribution."
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "health_emergency",
    name: "Public Health Emergency in a Dense Urban Area",
    description: "A new infectious disease is spreading rapidly through your densely populated city. Healthcare facilities are overwhelmed, and you need to deploy AI tools to track, predict, and respond to the outbreak while managing limited resources.",
    challenges: [
      "Rapid disease spread in dense population",
      "Overwhelmed healthcare system",
      "Need for contact tracing vs privacy",
      "Vaccine and treatment allocation decisions"
    ],
    thumbnail: "🏥",
    initialBudget: 1200,
    initialIndicators: {
      publicTrust: 55,
      inequality: 35,
      budget: 1200,
      safety: 45,
      ethicalBalance: 55,
      resilience: 50,
      accessToServices: 55
    },
    rounds: [
      {
        id: "round1",
        title: "Outbreak Detection and Tracking",
        situation: "Cases are rising rapidly. You need to track the spread and predict hotspots, but contact tracing raises privacy concerns. Some communities distrust government surveillance.",
        tools: [
          {
            id: "disease_prediction",
            name: "AI Disease Spread Prediction Model",
            description: "Predicts outbreak hotspots using mobility data and case reports",
            pros: "Accurate predictions help allocate resources",
            cons: "Requires extensive data collection, privacy concerns",
            icon: "🔬"
          },
          {
            id: "contact_tracing_app",
            name: "AI-Powered Contact Tracing App",
            description: "Tracks close contacts using smartphone data",
            pros: "Effective at breaking transmission chains",
            cons: "Privacy invasive, excludes people without smartphones",
            icon: "📱"
          }
        ],
        decisionQuestions: [
          {
            id: "contact_tracing_approach",
            prompt: "How do you implement contact tracing?",
            description: "Contact tracing is crucial but raises privacy and equity concerns.",
            options: [
              {
                id: "mandatory_app",
                text: "Mandatory app with GPS tracking for all residents",
                effects: {
                  publicTrust: -15,
                  inequality: 10,
                  budget: -80,
                  safety: 15,
                  ethicalBalance: -20,
                  resilience: 8,
                  logMessage: "Mandatory tracking implemented. Effective but controversial. Low-income communities without smartphones excluded."
                }
              },
              {
                id: "voluntary_opt_in",
                text: "Voluntary opt-in with privacy protections",
                effects: {
                  publicTrust: 8,
                  inequality: -5,
                  budget: -60,
                  safety: 8,
                  ethicalBalance: 12,
                  resilience: 5,
                  logMessage: "Voluntary system with privacy safeguards. Lower adoption but higher trust."
                }
              },
              {
                id: "manual_tracing",
                text: "Manual contact tracing with limited AI support",
                effects: {
                  publicTrust: 5,
                  inequality: -8,
                  budget: -40,
                  safety: 3,
                  ethicalBalance: 10,
                  resilience: 2,
                  logMessage: "Manual approach chosen. Privacy protected but slower response."
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "education_gaps",
    name: "Education Gaps in a Remote Region",
    description: "Your remote region has severe educational inequalities. Many students lack access to quality teachers and resources. AI-powered educational tools could help, but they risk creating digital divides and reducing human connection.",
    challenges: [
      "Lack of qualified teachers in remote areas",
      "Limited internet infrastructure",
      "Language and cultural barriers",
      "Risk of digital divide"
    ],
    thumbnail: "📚",
    initialBudget: 800,
    initialIndicators: {
      publicTrust: 60,
      inequality: 50,
      budget: 800,
      safety: 70,
      ethicalBalance: 60,
      resilience: 55,
      accessToServices: 40
    },
    rounds: [
      {
        id: "round1",
        title: "Deploying AI Tutoring Systems",
        situation: "You can deploy AI tutoring systems to reach remote students, but this requires internet infrastructure and may replace human teachers.",
        tools: [
          {
            id: "ai_tutor",
            name: "AI Personalized Tutoring System",
            description: "Adaptive learning platform that personalizes content",
            pros: "Scales to reach many students",
            cons: "Requires internet, may lack cultural context",
            icon: "🤖"
          }
        ],
        decisionQuestions: [
          {
            id: "deployment_strategy",
            prompt: "How do you deploy AI education tools?",
            description: "Balancing reach, equity, and human connection.",
            options: [
              {
                id: "full_automation",
                text: "Replace teachers with AI tutors where possible",
                effects: {
                  publicTrust: -10,
                  inequality: 8,
                  budget: -50,
                  safety: 0,
                  ethicalBalance: -12,
                  resilience: -5,
                  accessToServices: 15,
                  logMessage: "AI tutors deployed widely. More students reached, but teachers feel replaced and cultural connection lost."
                }
              },
              {
                id: "hybrid_approach",
                text: "AI supports teachers, doesn't replace them",
                effects: {
                  publicTrust: 8,
                  inequality: -5,
                  budget: -80,
                  safety: 0,
                  ethicalBalance: 10,
                  resilience: 8,
                  accessToServices: 10,
                  logMessage: "Hybrid model chosen. Teachers supported by AI tools. Better outcomes but higher cost."
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "inequality_tech",
    name: "Rising Inequality & Unemployment in a Tech-Driven City",
    description: "Your city is becoming a tech hub, but automation and AI are displacing workers while creating high-paying jobs for the educated. The gap between tech workers and service workers is widening rapidly.",
    challenges: [
      "Job displacement from automation",
      "Skills gap between workers",
      "Housing costs rising due to tech workers",
      "Social tensions increasing"
    ],
    thumbnail: "🏙️",
    initialBudget: 1500,
    initialIndicators: {
      publicTrust: 45,
      inequality: 60,
      budget: 1500,
      safety: 65,
      ethicalBalance: 40,
      resilience: 50,
      accessToServices: 55
    },
    rounds: [
      {
        id: "round1",
        title: "Automation and Job Training",
        situation: "Local factories are automating rapidly. You can invest in retraining programs or provide basic income support, but resources are limited.",
        tools: [
          {
            id: "job_matching_ai",
            name: "AI Job Matching Platform",
            description: "Matches displaced workers with new opportunities",
            pros: "Efficient job placement",
            cons: "May favor workers with existing skills",
            icon: "💼"
          }
        ],
        decisionQuestions: [
          {
            id: "worker_support",
            prompt: "How do you support displaced workers?",
            description: "Workers need help, but approaches vary in cost and effectiveness.",
            options: [
              {
                id: "retraining_focus",
                text: "Invest heavily in AI-powered retraining programs",
                effects: {
                  publicTrust: 5,
                  inequality: -8,
                  budget: -200,
                  safety: 0,
                  ethicalBalance: 8,
                  resilience: 10,
                  accessToServices: 12,
                  logMessage: "Retraining programs launched. Some workers benefit, but older workers struggle to adapt."
                }
              },
              {
                id: "basic_income",
                text: "Provide basic income support for displaced workers",
                effects: {
                  publicTrust: 12,
                  inequality: -15,
                  budget: -300,
                  safety: 0,
                  ethicalBalance: 15,
                  resilience: 5,
                  accessToServices: 8,
                  logMessage: "Basic income provided. Immediate relief, but long-term sustainability questioned."
                }
              },
              {
                id: "minimal_support",
                text: "Minimal support, let market adjust naturally",
                effects: {
                  publicTrust: -15,
                  inequality: 20,
                  budget: -50,
                  safety: -5,
                  ethicalBalance: -10,
                  resilience: -8,
                  accessToServices: -5,
                  logMessage: "Minimal intervention. Budget saved, but inequality and social tensions increased significantly."
                }
              }
            ]
          }
        ]
      }
    ]
  }
];

