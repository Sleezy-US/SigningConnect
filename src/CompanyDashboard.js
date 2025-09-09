import React, { useState, useCallback } from 'react';
import { Plus, Filter, Eye, MapPin, Clock, DollarSign, FileText, User, Calendar, Bell, CheckCircle, X } from 'lucide-react';

const CompanyDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showJobPostForm, setShowJobPostForm] = useState(false);
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Purchase Signing',
      location: 'Orlando, FL 32801',
      appointmentDate: '2024-01-15',
      appointmentTime: '14:00',
      fee: 150,
      status: 'filled',
      assignedAgent: 'John Smith',
      agentPhone: '(407) 555-0123',
      agentRating: 4.8,
      datePosted: '2024-01-10',
      documentType: 'Purchase loan documents',
      specialInstructions: 'Borrower prefers afternoon appointments'
    },
    {
      id: 2,
      title: 'Refinance Signing',
      location: 'Tampa, FL 33602',
      appointmentDate: '2024-01-16',
      appointmentTime: '10:30',
      fee: 125,
      status: 'open',
      assignedAgent: null,
      datePosted: '2024-01-12',
      documentType: 'Refinance loan documents',
      specialInstructions: 'Two borrowers, kitchen table preferred'
    },
    {
      id: 3,
      title: 'HELOC Signing',
      location: 'Clearwater, FL 33755',
      appointmentDate: '2024-01-17',
      appointmentTime: '16:00',
      fee: 175,
      status: 'pending',
      assignedAgent: 'Sarah Johnson',
      agentPhone: '(727) 555-0199',
      agentRating: 4.9,
      datePosted: '2024-01-11',
      documentType: 'HELOC documents',
      specialInstructions: 'Located in gated community - will provide gate code'
    }
  ]);

  const [newJob, setNewJob] = useState({
    title: '',
    location: '',
    appointmentDate: '',
    appointmentTime: '',
    fee: '',
    documentType: '',
    specialInstructions: ''
  });

  const [companyStats] = useState({
    totalJobs: 47,
    activeJobs: 12,
    completedJobs: 35,
    averageRating: 4.7,
    monthlySpend: 5250
  });

  // Fixed: Use useCallback to prevent unnecessary re-renders
  const updateJobField = useCallback((field, value) => {
    setNewJob(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmitJob = () => {
    if (!newJob.title || !newJob.location || !newJob.appointmentDate || !newJob.appointmentTime || !newJob.fee) {
      alert('Please fill in all required fields');
      return;
    }

    const jobData = {
      id: Date.now(),
      ...newJob,
      fee: parseInt(newJob.fee),
      status: 'open',
      assignedAgent: null,
      datePosted: new Date().toISOString().split('T')[0]
    };
    
    setJobs(prev => [jobData, ...prev]);
    setNewJob({
      title: '',
      location: '',
      appointmentDate: '',
      appointmentTime: '',
      fee: '',
      documentType: '',
      specialInstructions: ''
    });
    setShowJobPostForm(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': { color: 'bg-blue-100 text-blue-800', text: 'Open' },
      'filled': { color: 'bg-green-100 text-green-800', text: 'Filled' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      'completed': { color: 'bg-gray-100 text-gray-800', text: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig['open'];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
    </div>
  );

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
            {getStatusBadge(job.status)}
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
          <p className="flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            {job.documentType}
          </p>
        </div>
      </div>

      {job.assignedAgent && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600 font-medium mb-1">Assigned Agent:</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{job.assignedAgent}</p>
              <p className="text-sm text-gray-600">{job.agentPhone}</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Rating: {job.agentRating}/5.0</p>
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.floor(job.agentRating))}
              </div>
            </div>
          </div>
        </div>
      )}

      {job.specialInstructions && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-medium mb-1">Special Instructions:</p>
          <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">{job.specialInstructions}</p>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
        <span>Posted: {new Date(job.datePosted).toLocaleDateString()}</span>
        <span>Job ID: #{job.id}</span>
      </div>

      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
          View Details
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          Edit
        </button>
        {job.status === 'open' && (
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  const JobPostForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Post New Signing Job</h2>
          <button 
            onClick={() => setShowJobPostForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signing Type *
              </label>
              <select
                value={newJob.title}
                onChange={(e) => updateJobField('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select signing type</option>
                <option value="Purchase Signing">Purchase Signing</option>
                <option value="Refinance Signing">Refinance Signing</option>
                <option value="HELOC Signing">HELOC Signing</option>
                <option value="Reverse Mortgage Signing">Reverse Mortgage Signing</option>
                <option value="Modification Signing">Modification Signing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={newJob.fee}
                  onChange={(e) => updateJobField('fee', e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="150"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Address *
            </label>
            <input
              type="text"
              value={newJob.location}
              onChange={(e) => updateJobField('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main St, Orlando, FL 32801"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date *
              </label>
              <input
                type="date"
                value={newJob.appointmentDate}
                onChange={(e) => updateJobField('appointmentDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Time *
              </label>
              <input
                type="time"
                value={newJob.appointmentTime}
                onChange={(e) => updateJobField('appointmentTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <input
              type="text"
              value={newJob.documentType}
              onChange={(e) => updateJobField('documentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Purchase loan documents"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              value={newJob.specialInstructions}
              onChange={(e) => updateJobField('specialInstructions', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special instructions for the signing agent..."
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => setShowJobPostForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitJob}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Post Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setCurrentView('jobs')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'jobs' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Manage Jobs
                </button>
                <button 
                  onClick={() => setCurrentView('agents')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'agents' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Agent Network
                </button>
                <button 
                  onClick={() => setCurrentView('billing')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'billing' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Billing
                </button>
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
                <span className="text-sm font-medium">First National Title</span>
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
              <p className="text-gray-600">Manage your signing jobs and track performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard title="Total Jobs" value={companyStats.totalJobs} icon={FileText} />
              <StatCard title="Active Jobs" value={companyStats.activeJobs} icon={Clock} color="blue" />
              <StatCard title="Completed" value={companyStats.completedJobs} icon={CheckCircle} color="green" />
              <StatCard title="Avg Rating" value={`${companyStats.averageRating}/5.0`} icon={User} color="yellow" />
              <StatCard title="Monthly Spend" value={`$${companyStats.monthlySpend}`} icon={DollarSign} color="green" />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Recent Jobs</h2>
                </div>
                <div className="p-6 space-y-4">
                  {jobs.slice(0, 3).map(job => (
                    <div key={job.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.location}</p>
                        <p className="text-xs text-gray-500">{new Date(job.appointmentDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${job.fee}</p>
                        {getStatusBadge(job.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Quick Actions</h2>
                </div>
                <div className="p-6 space-y-3">
                  <button 
                    onClick={() => setShowJobPostForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Post New Job
                  </button>
                  <button 
                    onClick={() => setCurrentView('jobs')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    View All Jobs
                  </button>
                  <button 
                    onClick={() => setCurrentView('agents')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Browse Agents
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Jobs View */}
        {currentView === 'jobs' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
                <p className="text-gray-600">Track and manage your signing job postings.</p>
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
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Agent Network View */}
        {currentView === 'agents' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Agent Network</h1>
              <p className="text-gray-600">Browse and connect with qualified signing agents in your area.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-center text-gray-500 py-8">
                Agent network features coming soon. You'll be able to browse agent profiles, 
                view ratings, and build preferred agent lists.
              </p>
            </div>
          </div>
        )}

        {/* Billing View */}
        {currentView === 'billing' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
              <p className="text-gray-600">Manage your account billing and payment history.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-center text-gray-500 py-8">
                Billing features coming soon. You'll be able to view invoices, 
                manage payment methods, and track expenses.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Job Post Form Modal */}
      {showJobPostForm && <JobPostForm />}
    </div>
  );
};

export default CompanyDashboard;