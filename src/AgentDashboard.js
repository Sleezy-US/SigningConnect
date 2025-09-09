import React, { useState, useEffect } from 'react';
import { Bell, MapPin, Clock, DollarSign, FileText, User, Calendar, Settings, Menu, X, Smartphone, Mail, MessageSquare } from 'lucide-react';

const SigningConnectPlatform = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Purchase - Conventional Loan',
      company: 'First National Title',
      location: 'Orlando, FL',
      distance: '8.2 miles',
      fee: 150,
      scheduledTime: '2024-01-15T14:00:00',
      documents: 'Purchase package, Title docs, Loan docs',
      status: 'available',
      priority: 'normal',
      estimatedDuration: '90 minutes'
    },
    {
      id: 2,
      title: 'Refinance - HELOC',
      company: 'Sunshine Escrow Services',
      location: 'Tampa, FL',
      distance: '12.5 miles',
      fee: 125,
      scheduledTime: '2024-01-15T16:30:00',
      documents: 'Refinance package, HELOC docs',
      status: 'available',
      priority: 'urgent',
      estimatedDuration: '60 minutes'
    },
    {
      id: 3,
      title: 'Purchase - FHA Loan',
      company: 'Bay Area Title Co',
      location: 'Clearwater, FL',
      distance: '15.1 miles',
      fee: 175,
      scheduledTime: '2024-01-16T10:00:00',
      documents: 'FHA Purchase package, Disclosures',
      status: 'pending',
      priority: 'normal',
      estimatedDuration: '120 minutes'
    }
  ]);

  const [userStats] = useState({
    completedJobs: 147,
    monthlyEarnings: 4250,
    rating: 4.8,
    onTimeRate: 98
  });

  useEffect(() => {
    // Simulate real-time notifications
    const timer = setTimeout(() => {
      const newNotification = {
        id: Date.now(),
        title: 'New Job Available',
        message: 'Reverse Mortgage - $200 - 6.3 miles away',
        type: 'job_alert',
        timestamp: new Date()
      };
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const acceptJob = (jobId) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'accepted' } : job
    ));
  };

  const JobCard = ({ job }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
      job.priority === 'urgent' ? 'border-red-500' : 'border-blue-500'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">${job.fee}</div>
          {job.priority === 'urgent' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Urgent
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {job.location}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {job.distance}
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(job.scheduledTime).toLocaleDateString()} at {new Date(job.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {job.estimatedDuration}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <FileText className="w-4 h-4 mr-1" />
          Documents:
        </div>
        <p className="text-sm text-gray-700">{job.documents}</p>
      </div>

      <div className="flex space-x-2">
        {job.status === 'available' && (
          <>
            <button 
              onClick={() => acceptJob(job.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Accept Job
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              View Details
            </button>
          </>
        )}
        {job.status === 'accepted' && (
          <div className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-md font-medium text-center">
            Job Accepted - Check Schedule
          </div>
        )}
        {job.status === 'pending' && (
          <div className="flex-1 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md font-medium text-center">
            Pending Approval
          </div>
        )}
      </div>
    </div>
  );

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

  const NotificationItem = ({ notification }) => (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        <Bell className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{notification.title}</p>
        <p className="text-sm text-gray-600">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {notification.timestamp.toLocaleTimeString()}
        </p>
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
                  Available Jobs
                </button>
                <button 
                  onClick={() => setCurrentView('schedule')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'schedule' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Schedule
                </button>
                <button 
                  onClick={() => setCurrentView('earnings')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'earnings' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Earnings
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-8 h-8 text-gray-600 bg-gray-200 rounded-full p-1" />
                <span className="text-sm font-medium">John Doe</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your signing activity overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Completed Jobs" value={userStats.completedJobs} icon={FileText} />
              <StatCard title="Monthly Earnings" value={`$${userStats.monthlyEarnings}`} icon={DollarSign} color="green" />
              <StatCard title="Rating" value={`${userStats.rating}/5.0`} icon={User} color="yellow" />
              <StatCard title="On-Time Rate" value={`${userStats.onTimeRate}%`} icon={Clock} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Recent Job Activity</h2>
                </div>
                <div className="p-6 space-y-4">
                  {jobs.slice(0, 3).map(job => (
                    <div key={job.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${job.fee}</p>
                        <p className="text-xs text-gray-500">{job.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Recent Notifications</h2>
                </div>
                <div className="p-6">
                  {notifications.length > 0 ? (
                    <div className="space-y-2">
                      {notifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No new notifications</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Available Jobs View */}
        {currentView === 'jobs' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
                <p className="text-gray-600">Browse and accept signing jobs in your area.</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Filter
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Refresh
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Schedule View */}
        {currentView === 'schedule' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
              <p className="text-gray-600">View your upcoming signing appointments.</p>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="space-y-4">
                  {jobs.filter(job => job.status === 'accepted').map(job => (
                    <div key={job.id} className="border-l-4 border-green-500 pl-4 py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(job.scheduledTime).toLocaleDateString()} at {new Date(job.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                          <p className="text-sm text-gray-500">{job.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${job.fee}</p>
                          <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Earnings View */}
        {currentView === 'earnings' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
              <p className="text-gray-600">Track your income and payment history.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <StatCard title="This Month" value="$4,250" icon={DollarSign} color="green" />
              <StatCard title="Last Month" value="$3,890" icon={DollarSign} color="blue" />
              <StatCard title="Pending" value="$750" icon={Clock} color="yellow" />
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Payment History</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {[
                    { date: '2024-01-10', amount: 150, client: 'First National Title', status: 'Paid' },
                    { date: '2024-01-08', amount: 175, client: 'Bay Area Title Co', status: 'Paid' },
                    { date: '2024-01-05', amount: 125, client: 'Sunshine Escrow', status: 'Pending' },
                  ].map((payment, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{payment.client}</p>
                        <p className="text-sm text-gray-600">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${payment.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-4 gap-1">
          {[
            { key: 'dashboard', icon: User, label: 'Dashboard' },
            { key: 'jobs', icon: FileText, label: 'Jobs' },
            { key: 'schedule', icon: Calendar, label: 'Schedule' },
            { key: 'earnings', icon: DollarSign, label: 'Earnings' }
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setCurrentView(key)}
              className={`p-3 text-center ${
                currentView === key ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SigningConnectPlatform;
// This is the AgentDashboard component