// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth, LoginModal, RegisterModal } from './AuthComponents';
import AgentDashboard from './AgentDashboard';
import CompanyDashboard from './CompanyDashboard';
import ProfessionalRegistration from './ProfessionalRegistration';
import { useState } from 'react';

const LandingPage = ({ onShowLogin, onShowRegister }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">SigningConnect</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onShowLogin}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={onShowRegister}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Connect with Professional Notaries Nationwide
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The fastest, most reliable platform for remote notary services and document signing.
          Professional agents available 24/7 across all 50 states.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            to="/register-agent"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg font-medium inline-flex items-center justify-center"
          >
            Join as Signing Agent
          </Link>
          <button 
            onClick={onShowRegister}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium"
          >
            Post a Job
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Matching</h3>
            <p className="text-gray-600">Get matched with qualified notaries in minutes, not hours.</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Verified Professionals</h3>
            <p className="text-gray-600">All agents are background-checked and fully insured.</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Mobile Ready</h3>
            <p className="text-gray-600">Complete signings anywhere with our mobile platform.</p>
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