import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, XCircle, Clock, Search, 
  Bell, LogOut, BarChart3, DollarSign, MapPin,
  User, Shield
} from 'lucide-react';
import { useAuth } from './AuthComponents';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [currentView, setCurrentView] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  const fetchApplications = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('signingconnect_token');
      const response = await fetch('/api/admin/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
        calculateStats(data.applications);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const calculateStats = (apps) => {
    const stats = {
      pending: apps.filter(app => app.status === 'pending').length,
      approved: apps.filter(app => app.status === 'approved').length,
      rejected: apps.filter(app => app.status === 'rejected').length,
      total: apps.length
    };
    setStats(stats);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.application_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  const fetchApplicationDetails = async (applicationId) => {
    try {
      const token = localStorage.getItem('signingconnect_token');
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedApplication(data.application);
      } else {
        console.error('Failed to fetch application details');
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
  };

  const updateApplicationStatus = async (applicationId, status, rejectionReason = '') => {
    try {
      const token = localStorage.getItem('signingconnect_token');
      const response = await fetch(`/api/admin/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          rejectionReason,
          notes: `Status updated by ${user.email} on ${new Date().toLocaleString()}`
        })
      });

      if (response.ok) {
        await fetchApplications();
        setSelectedApplication(null);
        alert(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
      } else {
        alert('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Error updating application status');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue', onClick }) => (
    <div 
      className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow ${onClick ? 'hover:bg-gray-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
    </div>
  );

  const ApplicationRow = ({ application }) => (
    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => fetchApplicationDetails(application.id)}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{application.application_id}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{application.first_name} {application.last_name}</div>
        <div className="text-sm text-gray-500">{application.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{application.phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{application.years_experience}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{application.monthly_volume}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          application.status === 'approved' ? 'bg-green-100 text-green-800' :
          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {application.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(application.created_at).toLocaleDateString()}
      </td>
    </tr>
  );

  const ApplicationDetailsModal = () => {
    if (!selectedApplication) return null;

    const app = selectedApplication;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <p className="text-gray-600">ID: {app.application_id}</p>
              </div>
              <button 
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-sm text-gray-900">{app.first_name} {app.last_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{app.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{app.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <p className="text-sm text-gray-900">{app.years_experience}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Volume</label>
                  <p className="text-sm text-gray-900">{app.monthly_volume}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <p className="text-sm text-gray-900">{app.business_name || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Professional Credentials */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Professional Credentials
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notary License</label>
                  <p className="text-sm text-gray-900">{app.notary_license}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Expiration</label>
                  <p className="text-sm text-gray-900">{new Date(app.license_expiration).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E&O Insurance</label>
                  <p className="text-sm text-gray-900">{app.eo_insurance}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Coverage Amount</label>
                  <p className="text-sm text-gray-900">${app.insurance_amount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Service Coverage */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Service Coverage
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Primary Counties</label>
                    <p className="text-sm text-gray-900">{app.primary_counties || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Radius</label>
                    <p className="text-sm text-gray-900">{app.service_radius} miles</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <div className="flex flex-wrap gap-2">
                    {app.weekdays_available && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Weekdays</span>}
                    {app.evenings_available && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Evenings</span>}
                    {app.weekends_available && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Weekends</span>}
                    {app.holidays_available && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Holidays</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Structure */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Fee Structure
              </h3>
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Refinance (w/ insurance)</label>
                  <p className="text-sm text-gray-900">${app.refinance_with_insurance}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Purchase Closings</label>
                  <p className="text-sm text-gray-900">${app.purchase_closings}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">HELOC</label>
                  <p className="text-sm text-gray-900">${app.home_equity_heloc}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reverse Mortgage</label>
                  <p className="text-sm text-gray-900">${app.reverse_mortgage}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Commercial</label>
                  <p className="text-sm text-gray-900">${app.commercial_closing}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Travel Fee/Mile</label>
                  <p className="text-sm text-gray-900">${app.travel_fee_per_mile}</p>
                </div>
              </div>
            </div>

            {/* Application Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Status</label>
                    <p className={`text-sm font-medium ${
                      app.status === 'pending' ? 'text-yellow-600' :
                      app.status === 'approved' ? 'text-green-600' :
                      app.status === 'rejected' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="text-sm text-gray-900">{new Date(app.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {app.status === 'pending' && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    const reason = prompt('Reason for rejection (optional):');
                    updateApplicationStatus(app.id, 'rejected', reason || '');
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => updateApplicationStatus(app.id, 'approved')}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </button>
              </div>
            </div>
          )}
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
              <span className="text-sm text-gray-500 bg-red-100 text-red-700 px-2 py-1 rounded">Admin Portal</span>
              <nav className="hidden md:flex space-x-6">
                <button 
                  onClick={() => setCurrentView('applications')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'applications' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Applications
                </button>
                <button 
                  onClick={() => setCurrentView('analytics')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Analytics
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="flex items-center space-x-2">
                <User className="w-8 h-8 text-gray-600 bg-gray-200 rounded-full p-1" />
                <div className="text-sm">
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-gray-500">Administrator</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 p-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Applications View */}
        {currentView === 'applications' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Agent Applications</h1>
              <p className="text-gray-600">Review and manage signing agent applications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Applications" 
                value={stats.total} 
                icon={FileText} 
                color="blue"
                onClick={() => setStatusFilter('all')}
              />
              <StatCard 
                title="Pending Review" 
                value={stats.pending} 
                icon={Clock} 
                color="yellow"
                onClick={() => setStatusFilter('pending')}
              />
              <StatCard 
                title="Approved" 
                value={stats.approved} 
                icon={CheckCircle} 
                color="green"
                onClick={() => setStatusFilter('approved')}
              />
              <StatCard 
                title="Rejected" 
                value={stats.rejected} 
                icon={XCircle} 
                color="red"
                onClick={() => setStatusFilter('rejected')}
              />
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or application ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading applications...</p>
                </div>
              ) : filteredApplications.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <ApplicationRow key={application.id} application={application} />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No applications found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Platform performance and agent network insights</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-600">
                  Advanced analytics and reporting features will be available here including:
                </p>
                <ul className="text-gray-600 text-left max-w-md mx-auto mt-4 space-y-2">
                  <li>• Application approval rates and trends</li>
                  <li>• Agent performance metrics</li>
                  <li>• Revenue and commission tracking</li>
                  <li>• Geographic coverage analysis</li>
                  <li>• Customer satisfaction scores</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      <ApplicationDetailsModal />
    </div>
  );
};

export default AdminDashboard;