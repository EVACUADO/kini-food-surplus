import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  Users,
  ShoppingBag,
  TrendingUp,
  Settings,
  Shield,
  BarChart3,
  UserCheck,
  Store,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Mock analytics data since analyticsFunctions doesn't exist
      const mockAnalytics = {
        totalUsers: 1250,
        totalMerchants: 89,
        totalTransactions: 3420,
        revenue: 125000,
        foodWasteReduced: 1250,
        co2Reduced: 890
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    // Mock sign out since authFunctions doesn't exist
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8">
                  <img
                    src="/Kini white logo.png"
                    alt="Kini Logo"
                    className="h-full w-full object-cover rounded-xl"
                  />
                </div>
                <span className="text-xl font-bold text-[#469b47]">
                  Kini Food Surplus
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">Admin Panel</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  System Admin
                </span>
                <button
                  onClick={handleSignOut}
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
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'text-[#469b47] border-b-2 border-[#469b47]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'users'
                  ? 'text-[#469b47] border-b-2 border-[#469b47]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('merchants')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'merchants'
                  ? 'text-[#469b47] border-b-2 border-[#469b47]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Store className="w-4 h-4 inline mr-2" />
              Merchants
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'text-[#469b47] border-b-2 border-[#469b47]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'system'
                  ? 'text-[#469b47] border-b-2 border-[#469b47]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              System
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.totalUsers || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Merchants</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.totalMerchants || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[#469b47]/10 rounded-full flex items-center justify-center">
                    <Store className="w-6 h-6 text-[#469b47]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.totalTransactions || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Waste Reduced</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.foodWasteReduced || 0} kg
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-lg font-bold text-gray-900">99.9%</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Response Time</p>
                  <p className="text-lg font-bold text-gray-900">120ms</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-sm text-gray-600">Error Rate</p>
                  <p className="text-lg font-bold text-gray-900">0.1%</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-lg font-bold text-gray-900">
                    {analytics?.totalUsers || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No recent activity</p>
                <p className="text-sm text-gray-500 mt-1">
                  System activity will appear here
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-6">User Management</h3>

            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                No users registered yet
              </h4>
              <p className="text-gray-500 text-sm">
                User data will appear here as people sign up
              </p>
            </div>
          </div>
        )}

        {/* Merchants Tab */}
        {activeTab === 'merchants' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-6">Merchant Management</h3>

            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-12 h-12 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                No merchants registered yet
              </h4>
              <p className="text-gray-500 text-sm">
                Merchant applications will appear here for verification
              </p>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-6">Platform Analytics</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">
                  Growth Metrics
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">User Growth</span>
                    <span className="text-sm font-medium">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Merchant Growth
                    </span>
                    <span className="text-sm font-medium">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Order Growth</span>
                    <span className="text-sm font-medium">0%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">
                  Impact Metrics
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Food Waste Prevented
                    </span>
                    <span className="text-sm font-medium">0 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Money Saved</span>
                    <span className="text-sm font-medium">₱0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CO2 Reduced</span>
                    <span className="text-sm font-medium">0 kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">System Controls</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Maintenance Mode
                    </h4>
                    <p className="text-sm text-gray-600">
                      Enable to perform system updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#469b47]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#469b47]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      New User Registration
                    </h4>
                    <p className="text-sm text-gray-600">
                      Allow new users to sign up
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#469b47]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#469b47]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Merchant Applications
                    </h4>
                    <p className="text-sm text-gray-600">
                      Accept new merchant applications
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#469b47]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#469b47]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Audit Logs</h3>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No audit logs available</p>
                <p className="text-sm text-gray-500 mt-1">
                  System activities will be logged here
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
