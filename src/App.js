// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth, LoginModal, RegisterModal } from './AuthComponents';
import AgentDashboard from './AgentDashboard';
import CompanyDashboard from './CompanyDashboard';
import ProfessionalRegistration from './ProfessionalRegistration';
import { useState } from 'react';

const LandingPage = ({ onShowLogin, onShowRegister }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">SigningConnect</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onShowLogin}
              className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onShowRegister}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm font-medium backdrop-blur-sm transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Connect with Professional
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Notaries Nationwide
            </span>
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            The fastest, most reliable platform for remote notary services and document signing.
            Professional agents available 24/7 across all 50 states.
          </p>
          
          {/* Interactive Background Cards */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center mb-20">
            {/* Join as Agent Card */}
            <Link 
              to="/register-agent"
              className="group relative"
            >
              <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/25">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/40 transition-colors">
                    <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Join as Signing Agent</h3>
                  <p className="text-green-100/80 mb-6">Earn $75-200 per signing. Flexible schedule, professional support.</p>
                  <div className="inline-flex items-center text-green-300 font-semibold group-hover:text-green-200 transition-colors">
                    Apply Now
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Post a Job Card */}
            <button 
              onClick={onShowRegister}
              className="group relative"
            >
              <div className="relative bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/40 transition-colors">
                    <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Post a Job</h3>
                  <p className="text-blue-100/80 mb-6">Find verified notaries in minutes. Secure, fast, reliable service.</p>
                  <div className="inline-flex items-center text-blue-300 font-semibold group-hover:text-blue-200 transition-colors">
                    Get Started
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Fast Matching</h3>
              <p className="text-white/70">Get matched with qualified notaries in minutes, not hours.</p>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Verified Professionals</h3>
              <p className="text-white/70">All agents are background-checked and fully insured.</p>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Mobile Ready</h3>
              <p className="text-white/70">Complete signings anywhere with our mobile platform.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AuthenticatedApp = () => {
  const { isAuthenticated, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage 
          onShowLogin={() => setShowLogin(true)} 
          onShowRegister={() => setShowRegister(true)}
        />
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
      </>
    );
  }

  // Redirect based on user type
  if (user.userType === 'company') {
    return <Navigate to="/company" replace />;
  } else {
    return <Navigate to="/agent" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/register-agent" element={<ProfessionalRegistration />} />
          
          {/* Protected routes */}
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="/company" element={<CompanyDashboard />} />
          
          {/* Default route */}
          <Route path="/" element={<AuthenticatedApp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;