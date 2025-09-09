import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AgentDashboard from './AgentDashboard';
import CompanyDashboard from './CompanyDashboard';
import { AuthProvider, useAuth, LoginModal, RegisterModal } from './AuthComponents';
import { User, Building, CheckCircle, Shield, Clock, Users } from 'lucide-react';

// Landing Page Component
const LandingPage = ({ onShowLogin, onShowRegister }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-2xl text-blue-600">SigningConnect</div>
            <div className="flex space-x-4">
              <button
                onClick={onShowLogin}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={onShowRegister}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The Modern Platform for
            <span className="text-blue-600 block">Signing Coordination</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect title companies with qualified signing agents instantly. 
            Secure document handling, transparent pricing, and nationwide coverage.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onShowRegister}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Using SigningConnect
            </button>
            <button
              onClick={onShowLogin}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>

        {/* Two-Column Features */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* For Title Companies */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Building className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">For Title Companies</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Agent Matching</h3>
                  <p className="text-gray-600">Post jobs and get qualified agents assigned within minutes, not hours.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Document Upload</h3>
                  <p className="text-gray-600">End-to-end encrypted file handling with automatic 72-hour deletion.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Full Payment Management</h3>
                  <p className="text-gray-600">We handle all payments, scheduling, and agent coordination for you.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Vetted Agent Network</h3>
                  <p className="text-gray-600">All signing agents are verified, licensed, and rated by previous companies.</p>
                </div>
              </li>
            </ul>

            <button
              onClick={onShowRegister}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Post Your First Job
            </button>
          </div>

          {/* For Signing Agents */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <User className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">For Signing Agents</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Real-Time Job Alerts</h3>
                  <p className="text-gray-600">Get instant notifications for jobs in your area via mobile app and SMS.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Transparent Pricing</h3>
                  <p className="text-gray-600">See exact fees upfront with distance calculation from your location.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Guaranteed Payment</h3>
                  <p className="text-gray-600">Get paid on time, every time. We handle all payment processing.</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Build Your Reputation</h3>
                  <p className="text-gray-600">Earn ratings and reviews to get priority access to higher-paying jobs.</p>
                </div>
              </li>
            </ul>

            <button
              onClick={onShowRegister}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Start Finding Jobs
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Title Company Backed</h3>
              <p className="text-gray-600">Licensed title company with real industry expertise, not just another tech platform.</p>
            </div>
            <div>
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">72-Hour Security</h3>
              <p className="text-gray-600">All documents automatically deleted after 72 hours for maximum data protection.</p>
            </div>
            <div>
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nationwide Coverage</h3>
              <p className="text-gray-600">Growing network of verified signing agents in all RON-enabled states.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="font-bold text-2xl text-blue-400 mb-4">SigningConnect</div>
            <p className="text-gray-400 mb-6">
              The professional platform for mortgage document signing coordination.
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={onShowLogin}
                className="text-blue-400 hover:text-blue-300"
              >
                Sign In
              </button>
              <button
                onClick={onShowRegister}
                className="text-blue-400 hover:text-blue-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main authenticated app component
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
        
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
        
        <RegisterModal
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </>
    );
  }

  // User is authenticated, show appropriate dashboard
  return (
    <Routes>
      {/* Agent portal */}
      <Route path="/agent" element={<AgentDashboard />} />
      
      {/* Company portal */}
      <Route path="/company" element={<CompanyDashboard />} />
      
      {/* Redirect based on user type */}
      <Route 
        path="/" 
        element={
          <Navigate 
            to={user?.userType === 'company' ? '/company' : '/agent'} 
            replace 
          />
        } 
      />
      
      {/* Catch all other routes */}
      <Route 
        path="*" 
        element={
          <Navigate 
            to={user?.userType === 'company' ? '/company' : '/agent'} 
            replace 
          />
        } 
      />
    </Routes>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthenticatedApp />
      </Router>
    </AuthProvider>
  );
}

export default App;