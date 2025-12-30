import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const DeveloperPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'integration' | 'api' | 'build'>('overview');

  const codeExamples = {
    iframe: `<iframe 
  src="https://your-domain.com/home" 
  width="100%" 
  height="100vh" 
  frameborder="0"
  title="AI & Social Impact Games"
></iframe>`,
    reactRouter: `// In your existing React app's router
import { Route } from 'react-router-dom';
import SDG17App from './sdg-17-integration';

<Route path="/sdg-games/*" element={<SDG17App />} />`,
    standalone: `<!-- Standalone HTML integration -->
<div id="sdg-17-root"></div>
<script type="module">
  import { createRoot } from 'react-dom/client';
  import App from './sdg-17-app';
  
  const root = createRoot(document.getElementById('sdg-17-root'));
  root.render(<App />);
</script>`,
    api: `// Backend API endpoint example
const express = require('express');
const app = express();

// Proxy requests to AI & Social Impact Games backend
app.use('/api/sdg17', proxy('http://localhost:5000', {
  pathRewrite: { '^/api/sdg17': '/api' }
}));`,
    build: `# Build the application for production
cd client
npm run build

# Output will be in client/dist/
# Deploy the dist/ folder to your web server`,
    env: `# .env file for production
VITE_API_URL=https://your-api-domain.com/api
VITE_BASE_URL=/sdg-games`,
    nginx: `# Nginx configuration example
location /sdg-games {
    alias /var/www/sdg-17/dist;
    try_files $uri $uri/ /sdg-games/index.html;
}

# API proxy
location /api {
    proxy_pass http://localhost:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Developer Documentation
              </h1>
              <p className="text-blue-200 text-lg">
                Integration Guide for AI & Social Impact Games
              </p>
            </div>
            <Link to="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Go To Demo →
              </motion.button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-blue-500/30">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'integration', label: 'Integration Methods' },
              { id: 'api', label: 'API & Backend' },
              { id: 'build', label: 'Build & Deploy' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-blue-300 hover:text-cyan-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Sections */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg border-2 border-blue-500/30 p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Project Overview</h2>
                  <p className="text-blue-100 leading-relaxed mb-4">
                    This is a React-based web application featuring three interactive games focused on 
                    AI ethics, social impact, and sustainable development goals. The application can be 
                    integrated into existing websites through various methods.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                    <h3 className="text-xl font-bold text-cyan-300 mb-3">Tech Stack</h3>
                    <ul className="space-y-2 text-blue-100">
                      <li>• <strong>Frontend:</strong> React 18 + TypeScript</li>
                      <li>• <strong>Styling:</strong> Tailwind CSS</li>
                      <li>• <strong>Routing:</strong> React Router v6</li>
                      <li>• <strong>Animations:</strong> Framer Motion</li>
                      <li>• <strong>Build Tool:</strong> Vite</li>
                      <li>• <strong>Backend:</strong> Node.js + Express</li>
                    </ul>
                  </div>

                  <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                    <h3 className="text-xl font-bold text-cyan-300 mb-3">Project Structure</h3>
                    <pre className="text-sm text-blue-100 font-mono overflow-x-auto">
{`sdg-17-main/
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/   # Page components
│   │   ├── components/
│   │   └── contexts/
│   └── dist/        # Build output
└── server/          # Express backend
    └── src/
        ├── routes/
        ├── controllers/
        └── services/`}
                    </pre>
                  </div>
                </div>

                <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500/50">
                  <h3 className="text-xl font-bold text-cyan-300 mb-3">Quick Start</h3>
                  <ol className="list-decimal list-inside space-y-2 text-blue-100">
                    <li>Install dependencies: <code className="bg-slate-700 px-2 py-1 rounded">npm install</code></li>
                    <li>Build the application: <code className="bg-slate-700 px-2 py-1 rounded">npm run build</code></li>
                    <li>Choose an integration method (see Integration Methods tab)</li>
                    <li>Configure your server to serve the built files</li>
                    <li>Set up API proxy if using backend features</li>
                  </ol>
                </div>
              </motion.div>
            )}

            {/* Integration Methods Tab */}
            {activeTab === 'integration' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Integration Methods</h2>
                  <p className="text-blue-100 mb-6">
                    Choose the integration method that best fits your existing website architecture.
                  </p>
                </div>

                {/* Method 1: Iframe */}
                <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">Method 1: Iframe Integration</h3>
                  <p className="text-blue-100 mb-4">
                    Simplest method. Embed the entire application in an iframe. Best for quick integration 
                    without modifying your existing codebase.
                  </p>
                  <div className="bg-slate-900 p-4 rounded-lg mb-4">
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                      {codeExamples.iframe}
                    </pre>
                  </div>
                  <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500/50">
                    <p className="text-yellow-200 text-sm">
                      <strong>Note:</strong> Ensure your server allows iframe embedding and configure 
                      CORS headers appropriately.
                    </p>
                  </div>
                </div>

                {/* Method 2: React Router Integration */}
                <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">Method 2: React Router Integration</h3>
                  <p className="text-blue-100 mb-4">
                    If your website is already built with React, integrate the routes directly into 
                    your existing router.
                  </p>
                  <div className="bg-slate-900 p-4 rounded-lg mb-4">
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                      {codeExamples.reactRouter}
                    </pre>
                  </div>
                  <div className="space-y-2 text-blue-100 text-sm">
                    <p><strong>Steps:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                      <li>Copy the <code className="bg-slate-700 px-1 rounded">client/src</code> folder to your project</li>
                      <li>Install required dependencies: <code className="bg-slate-700 px-1 rounded">react-router-dom framer-motion</code></li>
                      <li>Import and add routes as shown above</li>
                      <li>Ensure Tailwind CSS is configured in your project</li>
                    </ol>
                  </div>
                </div>

                {/* Method 3: Standalone Integration */}
                <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">Method 3: Standalone Component</h3>
                  <p className="text-blue-100 mb-4">
                    Mount the React app as a standalone component in a specific DOM element. 
                    Works with any framework or vanilla HTML.
                  </p>
                  <div className="bg-slate-900 p-4 rounded-lg mb-4">
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                      {codeExamples.standalone}
                    </pre>
                  </div>
                </div>

                {/* CSS Integration */}
                <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">CSS & Styling</h3>
                  <p className="text-blue-100 mb-4">
                    The application uses Tailwind CSS. Ensure Tailwind is properly configured or 
                    include the compiled CSS:
                  </p>
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`<!-- Include compiled CSS -->
<link rel="stylesheet" href="/sdg-games/styles.css">

<!-- Or ensure Tailwind is configured in your build process -->`}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}

            {/* API & Backend Tab */}
            {activeTab === 'api' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">API & Backend Configuration</h2>
                  <p className="text-blue-100 mb-6">
                    The application includes a Node.js/Express backend for game data and scenarios. 
                    Configure API endpoints based on your deployment setup.
                  </p>
                </div>

                <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">Backend Setup</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-blue-100 mb-2">1. Install server dependencies:</p>
                      <div className="bg-slate-900 p-4 rounded-lg">
                        <pre className="text-sm text-green-400 font-mono">cd server && npm install</pre>
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-100 mb-2">2. Start the backend server:</p>
                      <div className="bg-slate-900 p-4 rounded-lg">
                        <pre className="text-sm text-green-400 font-mono">npm run server</pre>
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-100 mb-2">3. Default API endpoint: <code className="bg-slate-700 px-2 py-1 rounded">http://localhost:5000/api</code></p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">API Proxy Configuration</h3>
                  <p className="text-blue-100 mb-4">
                    If integrating into an existing backend, proxy API requests:
                  </p>
                  <div className="bg-slate-900 p-4 rounded-lg mb-4">
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                      {codeExamples.api}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">Environment Variables</h3>
                  <p className="text-blue-100 mb-4">Create a <code className="bg-slate-700 px-2 py-1 rounded">.env</code> file:</p>
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                      {codeExamples.env}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">API Endpoints</h3>
                  <div className="space-y-2 text-blue-100">
                    <p><code className="bg-slate-700 px-2 py-1 rounded">GET /api/scenarios</code> - Get all available scenarios</p>
                    <p><code className="bg-slate-700 px-2 py-1 rounded">GET /api/scenarios/:id</code> - Get specific scenario</p>
                    <p><code className="bg-slate-700 px-2 py-1 rounded">POST /api/simulation/start</code> - Start a simulation</p>
                    <p><code className="bg-slate-700 px-2 py-1 rounded">POST /api/simulation/decision</code> - Submit a decision</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Build & Deploy Tab */}
            {activeTab === 'build' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Build & Deployment</h2>
                  <p className="text-blue-100 mb-6">
                    Instructions for building the application and deploying it to production.
                  </p>
                </div>

                <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">Building for Production</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-blue-100 mb-2">1. Build the frontend:</p>
                      <div className="bg-slate-900 p-4 rounded-lg">
                        <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                          {codeExamples.build}
                        </pre>
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-100 mb-2">2. The build output will be in <code className="bg-slate-700 px-2 py-1 rounded">client/dist/</code></p>
                    </div>
                    <div>
                      <p className="text-blue-100 mb-2">3. Configure base path in <code className="bg-slate-700 px-2 py-1 rounded">vite.config.ts</code> if deploying to a subdirectory:</p>
                      <div className="bg-slate-900 p-4 rounded-lg">
                        <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`export default defineConfig({
  base: '/sdg-games/', // Your subdirectory path
  // ... rest of config
})`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">Nginx Configuration</h3>
                  <p className="text-blue-100 mb-4">Example Nginx configuration for serving the application:</p>
                  <div className="bg-slate-900 p-4 rounded-lg">
                    <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                      {codeExamples.nginx}
                    </pre>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-6 rounded-lg border border-cyan-500/30">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">Deployment Checklist</h3>
                  <ul className="space-y-2 text-blue-100">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">✓</span>
                      <span>Build the frontend application</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">✓</span>
                      <span>Deploy backend server (or configure API proxy)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">✓</span>
                      <span>Configure environment variables</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">✓</span>
                      <span>Set up CORS headers if needed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">✓</span>
                      <span>Configure routing for SPA (all routes → index.html)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">✓</span>
                      <span>Test API endpoints and frontend-backend communication</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">✓</span>
                      <span>Verify all game features work in production</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500/50">
                  <h3 className="text-xl font-bold text-cyan-300 mb-3">Important Notes</h3>
                  <ul className="space-y-2 text-blue-100 text-sm">
                    <li>• The application uses client-side routing. Ensure your server is configured to serve <code className="bg-slate-700 px-1 rounded">index.html</code> for all routes.</li>
                    <li>• If deploying to a subdirectory, update the base path in Vite config and React Router.</li>
                    <li>• Backend API should be accessible from your frontend domain (configure CORS if needed).</li>
                    <li>• Consider using environment variables for API URLs in different environments.</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperPage;

