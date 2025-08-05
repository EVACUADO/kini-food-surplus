import React, { useState, useRef } from 'react';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Camera,
  AlertCircle,
  Check,
  Sparkles,
  Shield,
  Heart,
  Upload,
  X,
  Image as ImageIcon,
} from 'lucide-react';

interface CustomerSignupProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
}

const CustomerSignup: React.FC<CustomerSignupProps> = ({
  onBack,
  onSwitchToLogin,
}) => {
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    location: '',
    useGPS: false,
    profilePicture: null as File | null,
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Smooth scroll to form with offset for better UX
  const scrollToForm = () => {
    if (formRef.current) {
      const offsetTop = formRef.current.offsetTop - 20; // 20px offset from top
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // All handler functions inside the component
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: '' }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const processFile = (file: File | null) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profilePicture: 'File size must be less than 5MB',
      }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        profilePicture: 'Please select a valid image file',
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, profilePicture: file }));

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    if (errors.profilePicture) {
      setErrors((prev) => ({ ...prev, profilePicture: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const removeProfilePicture = () => {
    setFormData((prev) => ({ ...prev, profilePicture: null }));
    setPreviewUrl(null);
    if (errors.profilePicture) {
      setErrors((prev) => ({ ...prev, profilePicture: '' }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            location: `${latitude}, ${longitude}`,
            useGPS: true,
          }));
        },
        (error) => {
          alert('Unable to get your location. Please enter manually.');
          setFormData((prev) => ({ ...prev, useGPS: false }));
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const validateStep1 = () => {
    // Simple check: if ALL main fields are empty, just scroll to top
    const isFormCompletelyEmpty =
      !formData.fullName.trim() &&
      !formData.email.trim() &&
      !formData.mobileNumber.trim();

    if (isFormCompletelyEmpty) {
      // Smooth scroll to form
      scrollToForm();

      // Show a simple general error
      setErrors({ general: 'Please fill in the form to continue!' });
      return false;
    }

    // If at least one field is filled, do normal validation
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^(\+63|0)[0-9]{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid Philippine mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    // Simple check: if ALL main fields are empty, just scroll to top
    const isFormCompletelyEmpty =
      !formData.password.trim() &&
      !formData.confirmPassword.trim() &&
      !formData.location.trim() &&
      !formData.agreeToTerms;

    if (isFormCompletelyEmpty) {
      // Smooth scroll to form
      scrollToForm();

      // Show a simple general error
      setErrors({ general: 'Please fill in the form to continue!' });
      return false;
    }

    // If at least one field is filled, do normal validation
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      console.log('Customer registration:', formData);
      alert('🎉 Welcome to Kini! Your account has been created successfully!');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto" ref={formRef}>
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <button
          onClick={step === 1 ? onBack : () => setStep(1)}
          className="absolute left-0 top-0 inline-flex items-center text-gray-500 hover:text-gray-700 transition-all duration-200 text-sm group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="mt-8 mb-6">
          <div className="relative inline-block">
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Kini Family!
            </h1>
          </div>
          <p className="text-gray-600 text-sm">
            Start saving money and the planet
          </p>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="flex items-center justify-center mt-6 space-x-3">
          <div
            className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= 1
                ? 'bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white shadow-lg'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step > 1 ? <Check className="w-5 h-5" /> : '1'}
            {step >= 1 && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#469b47] to-[#3A7D44] animate-pulse opacity-30"></div>
            )}
          </div>
          <div
            className={`h-2 w-12 rounded-full transition-all duration-500 ${
              step >= 2
                ? 'bg-gradient-to-r from-[#469b47] to-[#3A7D44]'
                : 'bg-gray-200'
            }`}
          ></div>
          <div
            className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= 2
                ? 'bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white shadow-lg'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            2
            {step >= 2 && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#469b47] to-[#3A7D44] animate-pulse opacity-30"></div>
            )}
          </div>
        </div>
      </div>

      {step === 1 ? (
        // Enhanced Step 1: Basic Information
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
          className="space-y-6"
        >
          {/* General Error Message - Enhanced with gentle styling */}
          {errors.general && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-4 animate-gentle-shake">
              <div className="flex items-center justify-center text-orange-700 text-sm font-medium">
                <AlertCircle className="w-5 h-5 mr-2 animate-pulse" />
                {errors.general}
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#469b47] to-[#3A7D44] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Tell us about yourself
            </h3>
            <p className="text-sm text-gray-600">
              We'll need some basic information to get started
            </p>
          </div>

          {/* Enhanced Full Name */}
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-gray-700"
            >
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                  errors.fullName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && (
              <div className="flex items-center text-red-600 text-xs animate-gentle-shake">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.fullName}
              </div>
            )}
          </div>

          {/* Enhanced Email */}
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
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <div className="flex items-center text-red-600 text-xs animate-gentle-shake">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Enhanced Mobile Number */}
          <div className="space-y-2">
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-semibold text-gray-700"
            >
              Mobile Number
            </label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                  errors.mobileNumber
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200'
                }`}
                placeholder="09XXXXXXXXX"
              />
            </div>
            {errors.mobileNumber && (
              <div className="flex items-center text-red-600 text-xs animate-gentle-shake">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.mobileNumber}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white py-4 rounded-2xl hover:from-[#3A7D44] hover:to-[#2d5f30] transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue to Security Setup
          </button>
        </form>
      ) : (
        // Enhanced Step 2: Security & Location
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error Message - Enhanced with gentle styling */}
          {errors.general && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-4 animate-gentle-shake">
              <div className="flex items-center justify-center text-orange-700 text-sm font-medium">
                <AlertCircle className="w-5 h-5 mr-2 animate-pulse" />
                {errors.general}
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Secure your account
            </h3>
            <p className="text-sm text-gray-600">
              Set up your password and location preferences
            </p>
          </div>

          {/* Enhanced Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Create Password
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
                placeholder="Create a strong password"
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
              <div className="flex items-center text-red-600 text-xs animate-gentle-shake">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Enhanced Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center text-red-600 text-xs animate-gentle-shake">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Enhanced Location */}
          <div className="space-y-2">
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-gray-700"
            >
              Your Location
            </label>
            <div className="space-y-3">
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                    errors.location
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200'
                  }`}
                  placeholder="Enter your address or use GPS"
                  readOnly={formData.useGPS}
                />
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Use Current Location (GPS)
              </button>
            </div>
            {errors.location && (
              <div className="flex items-center text-red-600 text-xs animate-gentle-shake">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.location}
              </div>
            )}
          </div>

          {/* Completely Redesigned Profile Picture Section */}
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                Add Profile Photo
              </h4>
              <p className="text-sm text-gray-600">
                Help others recognize you (Optional)
              </p>
            </div>

            {!previewUrl ? (
              <div
                className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 group ${
                  isDragOver
                    ? 'border-[#469b47] bg-green-50 scale-105'
                    : errors.profilePicture
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-[#469b47] hover:bg-green-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                  document.getElementById('profilePicture')?.click()
                }
              >
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="space-y-4">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 ${
                      isDragOver
                        ? 'bg-[#469b47] scale-110'
                        : 'bg-gray-100 group-hover:bg-[#469b47]'
                    }`}
                  >
                    <Upload
                      className={`w-10 h-10 transition-colors ${
                        isDragOver
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <p className="text-base font-semibold text-gray-700 mb-1">
                      {isDragOver
                        ? 'Drop your photo here'
                        : 'Upload Profile Photo'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Drag and drop or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>

                {isDragOver && (
                  <div className="absolute inset-0 bg-[#469b47]/10 rounded-3xl animate-pulse"></div>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="bg-white rounded-3xl p-4 border-2 border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {formData.profilePicture?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formData.profilePicture &&
                          `${(
                            formData.profilePicture.size /
                            1024 /
                            1024
                          ).toFixed(2)} MB`}
                      </p>
                      <div className="flex items-center mt-2 space-x-3">
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById('profilePicture')?.click()
                          }
                          className="text-xs text-[#469b47] hover:text-[#3A7D44] font-semibold hover:underline"
                        >
                          Change Photo
                        </button>
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {errors.profilePicture && (
              <div className="flex items-center justify-center text-red-600 text-sm animate-gentle-shake bg-red-50 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.profilePicture}
              </div>
            )}
          </div>

          {/* Enhanced Terms Agreement */}
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="h-5 w-5 text-[#469b47] focus:ring-[#469b47] border-gray-300 rounded mt-0.5 transition-all duration-200"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                I agree to the{' '}
                <button
                  type="button"
                  className="text-[#469b47] hover:text-[#3A7D44] font-semibold hover:underline"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="text-[#469b47] hover:text-[#3A7D44] font-semibold hover:underline"
                >
                  Privacy Policy
                </button>
                . I understand that payments are handled through third-party
                methods with screenshot verification.
              </span>
            </label>
            {errors.agreeToTerms && (
              <div className="flex items-center text-red-600 text-xs animate-gentle-shake">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.agreeToTerms}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white py-4 rounded-2xl hover:from-[#3A7D44] hover:to-[#2d5f30] transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              '🎉 Create My Account'
            )}
          </button>
        </form>
      )}

      {/* Enhanced Switch to Login */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-600 mb-4">Already have an account?</p>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#469b47] hover:text-[#3A7D44] font-semibold transition-colors hover:underline"
        >
          Sign in instead
        </button>
      </div>

      {/* Benefits Preview */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5 text-[#469b47] mr-2" />
            <h4 className="font-semibold text-gray-900 text-sm">
              What you'll get
            </h4>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="text-center">
              <div className="text-[#469b47] font-bold text-lg">70%</div>
              <div className="text-gray-600">Off Food</div>
            </div>
            <div className="text-center">
              <div className="text-[#469b47] font-bold text-lg">500+</div>
              <div className="text-gray-600">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-[#469b47] font-bold text-lg">🌱</div>
              <div className="text-gray-600">Save Planet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSignup;
