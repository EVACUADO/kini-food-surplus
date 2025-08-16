import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Shield,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { login } from '../lib/auth';
import AppHeader from './AppHeader';

interface AdminAgentLoginProps {
  userType: 'admin' | 'agent';
}

const AdminAgentLogin: React.FC<AdminAgentLoginProps> = ({ userType }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
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
        // Demo credentials
        const mockUsers = [
          {
            email: 'admin@kini.com',
            password: 'admin123',
            role: 'admin',
            name: 'System Administrator',
          },
          {
            email: 'agent@kini.com',
            password: 'agent123',
            role: 'agent',
            name: 'Verification Agent',
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

        if (user.role !== userType) {
          throw new Error(
            `This account is registered as ${user.role}. Please use the correct login portal.`
          );
        }

        // Store user data using secure login function
        login({
          email: user.email,
          role: user.role,
          name: user.name,
        });

        // Navigate to appropriate panel
        if (user.role === 'admin') {
          navigate('/AdminPanel');
        } else {
          navigate('/AgentPanel');
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

  const getTitle = () => {
    return userType === 'admin' ? 'Admin Portal' : 'Agent Portal';
  };

  const getSubtitle = () => {
    return userType === 'admin'
      ? 'Access system administration'
      : 'Access verification panel';
  };

  const getIcon = () => {
    return userType === 'admin' ? Shield : CheckCircle;
  };

  const getIconColor = () => {
    return userType === 'admin' ? 'text-red-600' : 'text-blue-600';
  };

  const getBgColor = () => {
    return userType === 'admin' ? 'bg-red-500' : 'bg-blue-500';
  };

  const IconComponent = getIcon();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <AppHeader title={getTitle()} showBackToMain={true} className="justify-center" />
          </div>
          
          <div className="relative inline-block mb-4">
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div className={`w-20 h-20 ${getBgColor()} rounded-2xl flex items-center justify-center shadow-lg`}>
              <IconComponent className={`w-10 h-10 text-white`} />
            </div>
          </div>
          
          <p className="text-gray-600 text-sm">
            {getSubtitle()}
          </p>

          {/* Visual divider */}
          <div className="flex justify-center mt-4">
            <div className="w-16 h-1 bg-gradient-to-r from-[#469b47] to-blue-500 rounded-full"></div>
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
                placeholder={`${userType}@kini.com`}
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
              `Sign In to ${getTitle()}`
            )}
          </button>
        </form>

        {/* Back to main site */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-[#469b47] transition-colors font-medium hover:underline"
          >
            ← Back to main site
          </a>
        </div>

        {/* Security notice */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-100">
          <div className="text-center">
            <div className={`w-8 h-8 ${getBgColor()} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm">
              Secure Access Portal
            </h4>
            <p className="text-gray-600 text-xs">
              This portal is restricted to authorized {userType} personnel only
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="text-center">
            <h4 className="font-semibold text-yellow-800 mb-2 text-sm">
              Demo Credentials
            </h4>
            <div className="text-xs text-yellow-700 space-y-1">
              <p><strong>Email:</strong> {userType}@kini.com</p>
              <p><strong>Password:</strong> {userType}123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAgentLogin;