import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Lock,
  AlertCircle,
  User,
  Store,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import AppHeader from './AppHeader';

interface LoginProps {
  onBack?: () => void;
  onSwitchToSignup?: () => void;
  onLoginSuccess?: (userType: 'customer' | 'merchant') => void;
}

const Login: React.FC<LoginProps> = ({
  onBack,
  onSwitchToSignup,
  onLoginSuccess,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer' as 'customer' | 'merchant',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (loginError) setLoginError('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError('');

    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Mock authentication data
        const mockUsers = [
          {
            email: 'customer@example.com',
            password: 'password123',
            role: 'customer',
            name: 'John Customer',
          },
          {
            email: 'merchant@example.com',
            password: 'password123',
            role: 'merchant',
            name: 'Green Restaurant',
          },
        ];

        const user = mockUsers.find((u) => u.email === formData.email);

        if (!user) {
          throw new Error(
            'Account not found. Please check your email address.'
          );
        }

        if (user.password !== formData.password) {
          throw new Error('Invalid password. Please try again.');
        }

        if (user.role !== formData.userType) {
          throw new Error(
            `This account is registered as ${user.role}. Please select the correct account type.`
          );
        }

        // Store user data in localStorage (simulating auth context)
        const userData = {
          email: user.email,
          role: user.role,
          name: user.name,
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));

        // Call the success callback if provided, otherwise use default navigation
        if (onLoginSuccess) {
          onLoginSuccess(user.role as 'customer' | 'merchant');
        } else {
          // Fallback navigation
          if (user.role === 'merchant') {
            navigate('/MerchantDashboard');
          } else {
            navigate('/CustomerDashboard');
          }
        }
      } catch (error) {
        setLoginError(
          error instanceof Error
            ? error.message
            : 'Login failed. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-8 relative">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute left-0 top-0 inline-flex items-center text-gray-500 hover:text-gray-700 transition-all duration-200 text-sm group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        )}

        {/* Welcome section */}
        <div className="mt-8 mb-6">
          <div className="mb-4">
            <AppHeader title="Sign In" showBackToMain={true} className="justify-center" />
          </div>
          
          <div className="relative inline-block">
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back!
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            Sign in to{' '}
            {formData.userType === 'customer'
              ? 'save on food'
              : 'manage your surplus'}
          </p>
        </div>

        {/* Visual divider */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-1 bg-gradient-to-r from-[#469b47] to-[#3A7D44] rounded-full"></div>
        </div>
      </div>

      {/* Login error message */}
      {loginError && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
          <div className="text-red-700 text-sm">{loginError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User type selection */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Choose your account type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, userType: 'customer' }))
              }
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                formData.userType === 'customer'
                  ? 'border-[#469b47] bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  formData.userType === 'customer'
                    ? 'bg-[#469b47] shadow-lg'
                    : 'bg-gray-100'
                }`}
              >
                <User
                  className={`w-6 h-6 ${
                    formData.userType === 'customer'
                      ? 'text-white'
                      : 'text-gray-400'
                  }`}
                />
              </div>
              <span
                className={`text-sm font-semibold block ${
                  formData.userType === 'customer'
                    ? 'text-[#469b47]'
                    : 'text-gray-700'
                }`}
              >
                Customer
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                Save on food
              </span>
              {formData.userType === 'customer' && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#469b47] rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, userType: 'merchant' }))
              }
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                formData.userType === 'merchant'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  formData.userType === 'merchant'
                    ? 'bg-blue-500 shadow-lg'
                    : 'bg-gray-100'
                }`}
              >
                <Store
                  className={`w-6 h-6 ${
                    formData.userType === 'merchant'
                      ? 'text-white'
                      : 'text-gray-400'
                  }`}
                />
              </div>
              <span
                className={`text-sm font-semibold block ${
                  formData.userType === 'merchant'
                    ? 'text-blue-500'
                    : 'text-gray-700'
                }`}
              >
                Merchant
              </span>
              <span className="text-xs text-gray-500 block mt-1">
                Sell surplus
              </span>
              {formData.userType === 'merchant' && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700"
          >
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-200'
              }`}
              placeholder={`${formData.userType}@example.com`}
            />
          </div>
          {errors.email && (
            <div className="flex items-center text-red-600 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email}
            </div>
          )}
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                errors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-200'
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="flex items-center text-red-600 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.password}
            </div>
          )}
        </div>

        {/* Remember me and forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 text-[#469b47] focus:ring-[#469b47] border-gray-300 rounded transition-all duration-200"
            />
            <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
              Remember me
            </span>
          </label>
          <button
            type="button"
            className="text-sm text-[#469b47] hover:text-[#3A7D44] transition-colors font-semibold hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white py-4 rounded-2xl hover:from-[#3A7D44] hover:to-[#2d5f30] transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-8 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-500 bg-white">or</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* Switch to signup */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">New to Kini Food Surplus?</p>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="w-full border-2 border-[#469b47] text-[#469b47] py-3 rounded-2xl hover:bg-[#469b47] hover:text-white transition-all duration-300 font-semibold text-sm transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Create Account
        </button>
      </div>

      {/* Benefits preview */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4">
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
            Join thousands saving food daily!
          </h4>
          <div className="flex justify-center space-x-6 text-xs">
            <div className="text-center">
              <div className="text-[#469b47] font-bold">70%</div>
              <div className="text-gray-600">Savings</div>
            </div>
            <div className="text-center">
              <div className="text-[#469b47] font-bold">500+</div>
              <div className="text-gray-600">Partners</div>
            </div>
            <div className="text-center">
              <div className="text-[#469b47] font-bold">25K+</div>
              <div className="text-gray-600">Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;