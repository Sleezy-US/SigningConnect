import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, LoginModal, RegisterModal, ForgotPasswordModal, ProtectedRoute } from './AuthComponents';
import AgentDashboard from './AgentDashboard';
import CompanyDashboard from './CompanyDashboard';
import ProfessionalRegistration from './ProfessionalRegistration';
import { useState } from 'react';

const LandingPage = ({ onShowLogin, onShowRegister }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SigningConnect</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onShowLogin}
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onShowRegister}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Professional Document
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Signing Services
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with certified notaries and signing agents nationwide. Secure, efficient, 
            and compliant document execution for real estate, legal, and business transactions.
          </p>
        </div>
        
        {/* Professional Service Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* Join as Professional Agent */}
          <div className="group relative">
            <a 
              href="/register-agent"
              className="block"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      Join as Signing Agent
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Become part of our professional network. Flexible scheduling, competitive fees ($75-200 per signing), 
                      and ongoing support for certified notaries and signing agents.
                    </p>
                    <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                      Apply Today
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Request Services */}
          <button 
            onClick={onShowRegister}
            className="group relative text-left"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    Request Signing Services
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Find qualified notaries for your real estate closings, loan documents, legal papers, 
                    and business transactions. Fast matching with verified professionals.
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                    Get Started
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/30">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Fast & Reliable</h3>
            <p className="text-gray-600 text-sm">Professional notaries available within 2 hours nationwide</p>
          </div>
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/30">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Fully Verified</h3>
            <p className="text-gray-600 text-sm">Background-checked agents with E&O insurance coverage</p>
          </div>
          <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/30">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Mobile Platform</h3>
            <p className="text-gray-600 text-sm">Complete signings anywhere with secure mobile technology</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AuthenticatedApp = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
          onSwitchToForgotPassword={() => {
            setShowLogin(false);
            setShowForgotPassword(true);
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
        
        <ForgotPasswordModal 
          isOpen={showForgotPassword} 
          onClose={() => setShowForgotPassword(false)}
          onSwitchToLogin={() => {
            setShowForgotPassword(false);
            setShowLogin(true);
          }}
        />
      </>
    );
  }

  // Redirect based on user type
  if (user.userType === 'company') {
    return <Navigate to="/company" replace />;
  } else if (user.userType === 'agent') {
    return <Navigate to="/agent" replace />;
  } else {
    return <Navigate to="/admin" replace />;
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
          <Route 
            path="/agent" 
            element={
              <ProtectedRoute requiredUserType="agent">
                <AgentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company" 
            element={
              <ProtectedRoute requiredUserType="company">
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default route */}
          <Route path="/" element={<AuthenticatedApp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;