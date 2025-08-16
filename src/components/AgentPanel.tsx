import React, { useState } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Download,
  Eye,
  LogOut,
} from 'lucide-react';
import { logout, getCurrentUser } from '../lib/auth';
import AppHeader from './AppHeader';

const AgentPanel = () => {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  React.useEffect(() => {
    // Get current user info
    const user = getCurrentUser();
    setCurrentUser(user);
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      // Mock applications data since merchantFunctions doesn't exist
      const mockApplications = [
        {
          id: '1',
          businessName: 'Green Restaurant',
          businessEmail: 'green@restaurant.com',
          phoneNumber: '+63 912 345 6789',
          businessLocation: 'Manila, Philippines',
          lineOfBusiness: ['Restaurant', 'Catering'],
          status: 'pending',
          submittedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          businessName: 'Fresh Market',
          businessEmail: 'fresh@market.com',
          phoneNumber: '+63 923 456 7890',
          businessLocation: 'Quezon City, Philippines',
          lineOfBusiness: ['Grocery', 'Fresh Produce'],
          status: 'approved',
          submittedAt: '2024-01-14T15:45:00Z'
        }
      ];
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };


  const handleApprove = (applicationId: string) => {
    const approveApplication = async () => {
      try {
        // Mock approval since merchantFunctions doesn't exist
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'approved' }
            : app
        ));
        alert('Application approved successfully!');
        setSelectedApplication(null);
      } catch (error) {
        console.error('Error approving application:', error);
        alert('An error occurred');
      }
    };
    approveApplication();
  };

  const handleReject = (applicationId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    const rejectApplication = async () => {
      try {
        // Mock rejection since merchantFunctions doesn't exist
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'rejected' }
            : app
        ));
        alert('Application rejected successfully!');
        setSelectedApplication(null);
      } catch (error) {
        console.error('Error rejecting application:', error);
        alert('An error occurred');
      }
    };
    rejectApplication();
  };

  const selectedApp = applications.find(
    (app) => app.id === selectedApplication
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <AppHeader title="Agent Panel" showBackToMain={true} />

            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 px-4 py-2 rounded-xl border border-yellow-200">
                <span className="text-sm font-medium text-yellow-800">
                  {
                    applications.filter((app) => app.status === 'pending')
                      .length
                  }{' '}
                  Pending
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {currentUser?.name || 'Verification Agent'}
                </span>
                <button
                  onClick={logout}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors ml-2"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Pending Applications</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {
                    applications.filter((app) => app.status === 'pending')
                      .length
                  }{' '}
                  applications awaiting review
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#469b47] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading applications...</p>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#469b47]/10 to-[#469b47]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-[#469b47]" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      No applications pending
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      New applications will appear here
                    </p>
                  </div>
                ) : (
                  applications.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApplication(app.id)}
                      className={`p-4 cursor-pointer transition-all duration-300 ${
                        selectedApplication === app.id
                          ? 'bg-[#469b47]/5 border-r-4 border-[#469b47]'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {app.business_name}
                        </h4>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          <span className="ml-1 capitalize">{app.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{app.business_location}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {new Date(app.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-red-600 font-medium">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>24h remaining</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              {selectedApp ? (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {selectedApp.business_name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Application Review
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span className="font-medium">24h remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* Business Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-6">
                        Business Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                          <Building className="w-6 h-6 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Business Name
                            </p>
                            <p className="font-medium text-gray-900">
                              {selectedApp.business_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                          <Mail className="w-6 h-6 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">
                              {selectedApp.business_email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                          <Phone className="w-6 h-6 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">
                              {selectedApp.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                          <MapPin className="w-6 h-6 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-medium text-gray-900">
                              {selectedApp.business_location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-6">
                        Submitted Documents
                      </h4>
                      <div className="space-y-4">
                        {[
                          {
                            type: 'dti',
                            name: 'DTI Certificate',
                            url: selectedApp.dti_certificate_url,
                          },
                          {
                            type: 'bir',
                            name: 'BIR Certificate',
                            url: selectedApp.bir_certificate_url,
                          },
                          {
                            type: 'permit',
                            name: 'Business Permit',
                            url: selectedApp.business_permit_url,
                          },
                        ].map((doc) => (
                          <div
                            key={doc.type}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <FileText className="w-6 h-6 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {doc.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {doc.url
                                    ? 'Document uploaded'
                                    : 'No document'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  doc.url && window.open(doc.url, '_blank')
                                }
                                disabled={!doc.url}
                                className="p-2 text-gray-500 hover:text-[#469b47] transition-colors rounded-lg hover:bg-white disabled:opacity-50"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  doc.url && window.open(doc.url, '_blank')
                                }
                                disabled={!doc.url}
                                className="p-2 text-gray-500 hover:text-[#469b47] transition-colors rounded-lg hover:bg-white disabled:opacity-50"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handleApprove(selectedApp.id)}
                        className="flex items-center space-x-3 bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve Application</span>
                      </button>
                      <button
                        onClick={() => handleReject(selectedApp.id)}
                        className="flex items-center space-x-3 bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>Reject Application</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#469b47]/10 to-[#469b47]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-12 h-12 text-[#469b47]" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-3">
                    Select an application to review
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Choose an application from the list to view details and
                    documents
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPanel;