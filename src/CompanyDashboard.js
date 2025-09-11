import React, { useState } from 'react';
import { 
  Plus, Filter, Eye, MapPin, Clock, DollarSign, FileText, User, Calendar, 
  Bell, CheckCircle, X, Upload, Lock, Download, AlertTriangle, CreditCard,
  Star, TrendingUp, Camera, MessageSquare, Shield, Award, Zap,
  ChevronDown, BarChart3, Users, Activity, ThumbsUp, ThumbsDown
} from 'lucide-react';

const EnhancedCompanyDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showJobPostForm, setShowJobPostForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Purchase Signing',
      location: 'Orlando, FL 32801',
      appointmentDate: '2024-01-15',
      appointmentTime: '14:00',
      fee: 150,
      status: 'completed',
      assignedAgent: {
        name: 'John Smith',
        phone: '(407) 555-0123',
        rating: 4.8,
        completionRate: 98,
        responseTime: '3 mins',
        id: 'agent_001'
      },
      datePosted: '2024-01-10',
      documentType: 'Purchase loan documents',
      specialInstructions: 'Borrower prefers afternoon appointments',
      hasDocuments: true,
      documentCount: 45,
      paymentStatus: 'pending',
      completionPhotos: ['signing1.jpg', 'documents1.jpg'],
      customerFeedback: {
        rating: 5,
        comment: 'Excellent service, very professional and on time.',
        timestamp: '2024-01-15T16:30:00'
      },
      qualityScore: 95,
      completedAt: '2024-01-15T15:45:00'
    },
    {
      id: 2,
      title: 'Refinance Signing',
      location: 'Tampa, FL 33602',
      appointmentDate: '2024-01-16',
      appointmentTime: '10:30',
      fee: 125,
      status: 'in_progress',
      assignedAgent: {
        name: 'Sarah Johnson',
        phone: '(727) 555-0199',
        rating: 4.9,
        completionRate: 99,
        responseTime: '2 mins',
        id: 'agent_002'
      },
      datePosted: '2024-01-12',
      documentType: 'Refinance loan documents',
      hasDocuments: false,
      documentCount: 0,
      paymentStatus: 'escrowed',
      estimatedCompletion: '2024-01-16T12:00:00'
    },
    {
      id: 3,
      title: 'HELOC Signing',
      location: 'Clearwater, FL 33755',
      appointmentDate: '2024-01-17',
      appointmentTime: '16:00',
      fee: 175,
      status: 'confirmed',
      assignedAgent: {
        name: 'Mike Rodriguez',
        phone: '(813) 555-0187',
        rating: 4.7,
        completionRate: 96,
        responseTime: '5 mins',
        id: 'agent_003'
      },
      datePosted: '2024-01-11',
      documentType: 'HELOC documents',
      hasDocuments: true,
      documentCount: 78,
      paymentStatus: 'escrowed'
    }
  ]);

  const [companyStats] = useState({
    totalJobs: 47,
    activeJobs: 12,
    completedJobs: 35,
    averageRating: 4.7,
    monthlySpend: 5250,
    avgCompletionTime: '72 mins',
    onTimeRate: 94,
    customerSatisfaction: 4.8,
    preferredAgents: 8,
    costSavings: 15
  });

  const [paymentMethods] = useState([
    { id: 'escrow', name: 'Escrow (Hold until completion)', fee: '0%', description: 'Secure payment held until job completion' },
    { id: 'instant', name: 'Instant Pay to Agent', fee: '2.9%', description: 'Agent receives payment immediately upon job acceptance' },
    { id: 'completion', name: 'Pay on Completion', fee: '1.5%', description: 'Automatic payment when job is marked complete' }
  ]);

  const [analytics] = useState({
    weeklyJobs: [15, 18, 22, 19, 25, 21, 20],
    agentPerformance: [
      { name: 'John Smith', jobs: 12, rating: 4.8, onTime: 100 },
      { name: 'Sarah Johnson', jobs: 15, rating: 4.9, onTime: 98 },
      { name: 'Mike Rodriguez', jobs: 8, rating: 4.7, onTime: 95 }
    ],
    costComparison: {
      traditional: 180,
      platform: 150,
      savings: 30
    }
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { color: 'bg-blue-100 text-blue-800', text: 'Open', icon: Clock },
      'confirmed': { color: 'bg-yellow-100 text-yellow-800', text: 'Confirmed', icon: CheckCircle },
      'in_progress': { color: 'bg-purple-100 text-purple-800', text: 'In Progress', icon: Activity },
      'completed': { color: 'bg-green-100 text-green-800', text: 'Completed', icon: CheckCircle },
      'cancelled': { color: 'bg-red-100 text-red-800', text: 'Cancelled', icon: X }
    };
    
    const config = statusConfig[status] || statusConfig['open'];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Payment Pending' },
      'escrowed': { color: 'bg-blue-100 text-blue-800', text: 'Funds Escrowed' },
      'paid': { color: 'bg-green-100 text-green-800', text: 'Paid' },
      'failed': { color: 'bg-red-100 text-red-800', text: 'Payment Failed' }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <CreditCard className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, subtitle, onClick }) => (
    <div 
      className={`bg-white rounded-lg shadow p-6 ${onClick ? 'cursor-pointer hover:shadow-lg' : ''} transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end">
          <Icon className={`w-8 h-8 text-${color}-600`} />
          {trend && (
            <div className={`flex items-center text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const EnhancedJobCard = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
            {getStatusBadge(job.status)}
            {job.paymentStatus && getPaymentStatusBadge(job.paymentStatus)}
          </div>
          <p className="text-gray-600 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">${job.fee}</div>
          <p className="text-sm text-gray-500">Fee</p>
        </div>
      </div>

      {/* Agent Information */}
      {job.assignedAgent && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2" />
                {job.assignedAgent.name}
              </h4>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-400" />
                  {job.assignedAgent.rating}/5.0
                </span>
                <span>{job.assignedAgent.completionRate}% completion</span>
                <span>{job.assignedAgent.responseTime} response</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Feedback */}
      {job.customerFeedback && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h5 className="font-medium text-green-900 mb-2 flex items-center">
            <ThumbsUp className="w-4 h-4 mr-2" />
            Customer Feedback
          </h5>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < job.customerFeedback.rating ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium">{job.customerFeedback.rating}/5</span>
          </div>
          <p className="text-sm text-green-800">{job.customerFeedback.comment}</p>
        </div>
      )}

      {/* Quality Score */}
      {job.qualityScore && (
        <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-900">Quality Score</span>
          <div className="flex items-center">
            <div className="w-20 bg-blue-200 rounded-full h-2 mr-3">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${job.qualityScore}%` }}
              ></div>
            </div>
            <span className="text-blue-700 font-semibold">{job.qualityScore}%</span>
          </div>
        </div>
      )}

      {/* Job Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600 font-medium">Appointment:</p>
          <p className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(job.appointmentDate).toLocaleDateString()}
          </p>
          <p className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {job.appointmentTime}
          </p>
        </div>
        <div>
          <p className="text-gray-600 font-medium">Documents:</p>
          {job.hasDocuments ? (
            <div className="flex items-center text-green-600">
              <FileText className="w-4 h-4 mr-1" />
              <span>{job.documentCount} pages secured</span>
            </div>
          ) : (
            <div className="flex items-center text-amber-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span>Upload pending</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={() => setSelectedJob(job)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          View Details
        </button>
        
        {job.status === 'completed' && job.paymentStatus === 'pending' && (
          <button 
            onClick={() => {
              setSelectedJob(job);
              setShowPaymentModal(true);
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Process Payment
          </button>
        )}
        
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          Edit
        </button>
      </div>
    </div>
  );

  const PaymentModal = () => {
    const [selectedMethod, setSelectedMethod] = useState('escrow');
    const [isProcessing, setIsProcessing] = useState(false);

    const processPayment = () => {
      setIsProcessing(true);
      setTimeout(() => {
        setJobs(prev => prev.map(job => 
          job.id === selectedJob.id 
            ? { ...job, paymentStatus: 'paid' }
            : job
        ));
        setIsProcessing(false);
        setShowPaymentModal(false);
        setSelectedJob(null);
      }, 2000);
    };

    if (!selectedJob) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Process Payment</h2>
            <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{selectedJob.title}</h3>
            <p className="text-gray-600">Agent: {selectedJob.assignedAgent?.name}</p>
            <p className="text-2xl font-bold text-green-600 mt-2">${selectedJob.fee}</p>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <div key={method.id} className="border border-gray-200 rounded-lg p-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{method.name}</span>
                        <span className="text-sm text-gray-500">{method.fee}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span>Signing Fee</span>
              <span>${selectedJob.fee}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Processing Fee</span>
              <span>${(selectedJob.fee * (selectedMethod === 'instant' ? 0.029 : selectedMethod === 'completion' ? 0.015 : 0)).toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>${(selectedJob.fee * (1 + (selectedMethod === 'instant' ? 0.029 : selectedMethod === 'completion' ? 0.015 : 0))).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={processPayment}
            disabled={isProcessing}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Process Payment'
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="font-bold text-xl text-blue-600">SigningConnect</div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Company Portal</span>
              <nav className="hidden md:flex space-x-6">
                {[
                  { key: 'dashboard', label: 'Dashboard' },
                  { key: 'jobs', label: 'Manage Jobs' },
                  { key: 'agents', label: 'Agent Network' },
                  { key: 'analytics', label: 'Analytics' },
                  { key: 'billing', label: 'Billing' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setCurrentView(key)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentView === key ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowJobPostForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Job
              </button>
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="flex items-center space-x-2">
                <User className="w-8 h-8 text-gray-600 bg-gray-200 rounded-full p-1" />
                <div className="hidden md:block">
                  <p className="text-sm font-medium">First National Title</p>
                  <p className="text-xs text-gray-500">Premium Account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
              <p className="text-gray-600">Manage your signing jobs, track performance, and monitor agent quality.</p>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard title="Active Jobs" value={companyStats.activeJobs} icon={Activity} color="blue" trend={8} />
              <StatCard title="Completed" value={companyStats.completedJobs} icon={CheckCircle} color="green" trend={15} />
              <StatCard title="Avg Rating" value={`${companyStats.averageRating}/5.0`} icon={Star} color="yellow" />
              <StatCard title="On-Time Rate" value={`${companyStats.onTimeRate}%`} icon={Clock} color="purple" trend={3} />
              <StatCard title="Cost Savings" value={`${companyStats.costSavings}%`} icon={TrendingUp} color="green" subtitle="vs traditional" />
            </div>

            {/* Recent Jobs */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Job Activity
                </h2>
                <button 
                  onClick={() => setCurrentView('jobs')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View All Jobs
                </button>
              </div>
              <div className="p-6 space-y-4">
                {jobs.slice(0, 3).map(job => (
                  <div key={job.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <p className="font-medium">{job.title}</p>
                        {getStatusBadge(job.status)}
                      </div>
                      <p className="text-sm text-gray-600">{job.location}</p>
                      {job.assignedAgent && (
                        <p className="text-xs text-blue-600">Agent: {job.assignedAgent.name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${job.fee}</p>
                      {job.paymentStatus && getPaymentStatusBadge(job.paymentStatus)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Jobs View */}
        {currentView === 'jobs' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
                <p className="text-gray-600">Track and manage your signing job postings with real-time updates.</p>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                <button 
                  onClick={() => setShowJobPostForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {jobs.map(job => (
                <EnhancedJobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Performance insights and business intelligence for your signing operations.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-gray-600">
                  Comprehensive performance metrics and business intelligence features are in development.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Agent Network View */}
        {currentView === 'agents' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Agent Network</h1>
              <p className="text-gray-600">Browse and manage your preferred signing agent network.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Agent Network Coming Soon</h3>
                <p className="text-gray-600">
                  Advanced agent discovery, performance analytics, and network management tools are in development.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Billing View */}
        {currentView === 'billing' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
              <p className="text-gray-600">Manage your account billing, payment methods, and transaction history.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Billing Features Coming Soon</h3>
                <p className="text-gray-600">
                  Comprehensive billing management, automated invoicing, and financial reporting tools are being developed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default EnhancedCompanyDashboard;