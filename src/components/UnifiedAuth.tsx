import React, { useState } from 'react';
import {
  Users,
  Store,
  ShoppingBag,
  TrendingDown,
  Sparkles,
  Heart,
  Award,
  Star,
} from 'lucide-react';
import Login from './Login';
import CustomerSignup from './CustomerSignup';
import MerchantSignup from './MerchantSignup';
import { useNavigate } from 'react-router-dom';

interface UnifiedAuthProps {
  initialType?: 'login' | 'signup';
}

const UnifiedAuth: React.FC<UnifiedAuthProps> = ({ initialType = 'login' }) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<
    'selection' | 'login' | 'customer-signup' | 'merchant-signup'
  >(initialType === 'login' ? 'login' : 'selection');

  const handleBack = () => {
    setCurrentView('selection');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleSwitchToSignup = () => {
    setCurrentView('selection');
  };

  const handleCustomerSignup = () => {
    setCurrentView('customer-signup');
  };

  const handleMerchantSignup = () => {
    setCurrentView('merchant-signup');
  };

  const handleLoginSuccess = (userType: 'customer' | 'merchant') => {
    if (userType === 'customer') {
      navigate('/CustomerDashboard');
    } else {
      navigate('/MerchantDashboard');
    }
  };

  if (currentView === 'login') {
    return (
      <Login
        onBack={handleBack}
        onSwitchToSignup={handleSwitchToSignup}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentView === 'customer-signup') {
    return (
      <CustomerSignup
        onBack={handleBack}
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  }

  if (currentView === 'merchant-signup') {
    return (
      <MerchantSignup
        onBack={handleBack}
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  }

  // Enhanced Selection View
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Kini Family!
          </h1>
        </div>
        <p className="text-gray-600 text-sm">
          Choose how you'd like to get started
        </p>

        {/* Visual Separator */}
        <div className="flex justify-center mt-4">
          <div className="w-16 h-1 bg-gradient-to-r from-[#469b47] to-blue-500 rounded-full"></div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Enhanced Customer Option */}
        <button
          onClick={handleCustomerSignup}
          className="w-full group bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 hover:border-[#469b47] hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#469b47] to-[#3A7D44] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <Heart className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#469b47] transition-colors">
                I'm a Customer
              </h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Save money on quality food and help reduce waste
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  <span>Up to 70% off</span>
                </div>
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Quality food
                </div>
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Help environment
                </div>
              </div>
            </div>
          </div>
        </button>

        {/* Enhanced Merchant Option */}
        <button
          onClick={handleMerchantSignup}
          className="w-full group bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-6 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                <Award className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="text-left flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                I'm a Merchant
              </h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Sell surplus food and reduce waste in your business
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Turn waste to revenue
                </div>
                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  New customers
                </div>
                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Token system
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Enhanced Login Link */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-600 mb-4">Already have an account?</p>
        <button
          onClick={handleSwitchToLogin}
          className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-2xl hover:border-[#469b47] hover:text-[#469b47] transition-all duration-300 font-semibold text-sm transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign In
        </button>
      </div>

      {/* Enhanced Feature Highlights */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-center mb-4">
          <Star className="w-5 h-5 text-yellow-500 mr-2" />
          <h4 className="font-bold text-gray-900 text-sm">Why Choose Kini?</h4>
        </div>
        <div className="space-y-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[#469b47] rounded-full"></div>
            <span className="text-gray-600">
              Chat-based transactions with screenshot verification
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[#469b47] rounded-full"></div>
            <span className="text-gray-600">
              Support local businesses and reduce food waste
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[#469b47] rounded-full"></div>
            <span className="text-gray-600">
              Safe and verified merchants with quality standards
            </span>
          </div>
        </div>
      </div>

      {/* Stats Preview */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="text-[#469b47] font-bold text-lg">70%</div>
          <div className="text-gray-600 text-xs">Savings</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="text-[#469b47] font-bold text-lg">500+</div>
          <div className="text-gray-600 text-xs">Partners</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="text-[#469b47] font-bold text-lg">25K+</div>
          <div className="text-gray-600 text-xs">Users</div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAuth;
