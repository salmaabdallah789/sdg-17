import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SubmissionPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if actually submitted
    const isSubmitted = localStorage.getItem('future-decisions-submitted') === 'true';
    if (!isSubmitted) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="card text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Congratulations on Completing the Challenge!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Your proposal has been successfully submitted! You've shown incredible strategic thinking, 
              ethical awareness, and a deep understanding of how AI can be used responsibly for social 
              impact and sustainable development. We're excited to see your innovative ideas!
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📋 Evaluation Process</h2>
              <p className="text-gray-700 mb-4">
                Your game performance, answers, and proposal will be evaluated by our panel of judges. 
                Winners will be selected based on:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">✓</span>
                  <span>Quality of decision-making and strategic thinking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">✓</span>
                  <span>Effective use of AI tools while managing trade-offs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">✓</span>
                  <span>Depth of ethical considerations and social impact awareness</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">✓</span>
                  <span>Understanding of SDG principles and partnerships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">✓</span>
                  <span>Clarity and thoughtfulness of the written proposal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">✓</span>
                  <span>Overall impact and feasibility of proposed solutions</span>
                </li>
              </ul>
              <p className="text-center text-lg font-semibold text-primary-600 mt-6 pt-4 border-t border-gray-300">
                Results will be announced soon!
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 mb-8 text-center border-2 border-yellow-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">🌟 Good Luck! 🌟</h3>
              <p className="text-gray-700 text-lg">
                We wish you the best of luck in the evaluation! Your thoughtful approach to decision-making 
                and ethical considerations shows real potential. Keep making a positive impact!
              </p>
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://unitar.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg px-8 py-4 inline-block text-center no-underline"
            >
              Explore UNITAR Official Page →
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmissionPage;

