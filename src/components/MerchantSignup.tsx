import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Building,
  MapPin,
  Upload,
  Phone,
  Mail,
  CreditCard,
  Image,
  AlertCircle,
  Check,
  Clock,
  Coins,
  FileText,
  Shield,
  Star,
  Award,
  TrendingUp,
  Users,
  MessageSquare,
  RefreshCw,
  Lock,
  CheckCircle,
  History,
  Bell,
  Zap,
  Gift,
  Search,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

interface MerchantSignupProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
}

const MerchantSignup: React.FC<MerchantSignupProps> = ({
  onBack,
  onSwitchToLogin,
}) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [showEmptyFormError, setShowEmptyFormError] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    businessBranch: '',
    businessLocation: '',
    useGPS: false,
    phoneNumber: '',
    businessEmail: '',
    lineOfBusiness: [] as string[],
    eWalletProvider: '', // 'gcash' or 'maya'
    eWallet: '',
    otpCode: '',
    dtiSec: null as File | null,
    birCertificate: null as File | null,
    businessPermit: null as File | null,
    governmentId: null as File | null,
    sanitaryPermit: null as File | null,
    businessLogo: null as File | null,
    storefrontPhoto: null as File | null,
    agreeToTerms: false,
    agreeFoodSafety: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // New state for searchable dropdown
  const [businessSearchTerm, setBusinessSearchTerm] = useState('');
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);

  const lineOfBusinessOptions = [
    // Farmers & Producers
    'Crop Farmers (Fruits, Vegetables, Grains)',
    'Livestock/Poultry Raisers (Eggs, Meat)',
    'Fishermen & Aquaculture (Fresh/Processed Seafood)',
    
    // Food Manufacturers & Processors
    'Bakery & Pastry Producers (Bread, Cakes, Overruns)',
    'Snack & Packaged Food Makers (Chips, Biscuits, Noodles)',
    'Dairy & Cheese Producers',
    'Canned/Jarred Food Makers',
    
    // Retailers & Sellers with Physical Stores
    'Sari-Sari Stores / Small Groceries (Surplus Packaged Goods)',
    'Supermarkets / Hypermarkets (Excess Stock)',
    'Palengke (Wet Market) Vendors (Near-Expiry Fresh Food)',
    'Warehouse Sellers (Bulk Surplus)',
    
    // Restaurants & Food Service
    'Fast Food Chains (Excess Ingredients/Prepared Food)',
    'Carinderias / Turo-Turo (Leftover Meals)',
    'Bakeshops (Day-Old Bread/Pastries)',
    'Cafés / Milk Tea Shops (Extra Ingredients)',
    
    // Specialty Surplus Sellers
    'Organic/Natural Food Sellers (Imperfect Produce)',
    'Halal Food Suppliers',
    'Importers/Exporters (Overstocked Goods)',
    
    // Beverage Sellers
    'Drink Manufacturers (Overstocked Bottles/Cans)',
    'Coffee/Tea Suppliers',
  ];

  // Filter business options based on search term
  const filteredBusinessOptions = lineOfBusinessOptions.filter(business =>
    business.toLowerCase().includes(businessSearchTerm.toLowerCase())
  );

  // Scroll to top function
  const scrollToTop = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Check if form is completely empty
  const isFormCompletelyEmpty = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return (
          !formData.businessName.trim() &&
          !formData.businessBranch.trim() &&
          !formData.businessLocation.trim() &&
          !formData.phoneNumber.trim() &&
          !formData.businessEmail.trim() &&
          formData.lineOfBusiness.length === 0
        );
      case 2:
        return (
          !formData.dtiSec &&
          !formData.birCertificate &&
          !formData.businessPermit &&
          !formData.governmentId &&
          !formData.sanitaryPermit &&
          !formData.businessLogo &&
          !formData.storefrontPhoto
        );
      case 3:
        return (
          !formData.eWalletProvider &&
          !formData.eWallet.trim() &&
          !formData.otpCode.trim() &&
          !formData.agreeToTerms &&
          !formData.agreeFoodSafety
        );
      default:
        return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Hide empty form error when user starts typing
    if (showEmptyFormError) {
      setShowEmptyFormError(false);
    }
  };

  const handleLineOfBusinessChange = (business: string) => {
    setFormData((prev) => ({
      ...prev,
      lineOfBusiness: prev.lineOfBusiness.includes(business)
        ? prev.lineOfBusiness.filter((b) => b !== business)
        : [...prev.lineOfBusiness, business],
    }));

    // Hide empty form error when user makes selection
    if (showEmptyFormError) {
      setShowEmptyFormError(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrors((prev) => ({
          ...prev,
          [fieldName]: 'File size must be less than 10MB',
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
      if (errors[fieldName]) {
        setErrors((prev) => ({ ...prev, [fieldName]: '' }));
      }

      // Hide empty form error when user uploads file
      if (showEmptyFormError) {
        setShowEmptyFormError(false);
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            businessLocation: `${latitude}, ${longitude}`,
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

  const handleSendOTP = async () => {
    if (!formData.eWallet || !formData.eWalletProvider) {
      setErrors((prev) => ({
        ...prev,
        eWallet:
          'Please select an e-wallet provider and enter your mobile number',
      }));
      return;
    }

    if (!/^(\+63|0)[0-9]{10}$/.test(formData.eWallet)) {
      setErrors((prev) => ({
        ...prev,
        eWallet: 'Please enter a valid Philippine mobile number',
      }));
      return;
    }

    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setOtpTimer(120); // 2 minutes
      setIsLoading(false);

      // Start countdown
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (!formData.otpCode || formData.otpCode.length !== 6) {
      setErrors((prev) => ({
        ...prev,
        otpCode: 'Please enter the 6-digit OTP code',
      }));
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      // In real implementation, verify with backend
      if (formData.otpCode === '123456' || formData.otpCode.length === 6) {
        setOtpVerified(true);
        setErrors((prev) => ({ ...prev, otpCode: '' }));
      } else {
        setErrors((prev) => ({
          ...prev,
          otpCode: 'Invalid OTP code. Please try again.',
        }));
      }
      setIsLoading(false);
    }, 1000);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.businessLocation.trim()) {
      newErrors.businessLocation = 'Business location is required';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^(\+63|0)[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Philippine phone number';
    }

    if (!formData.businessEmail) {
      newErrors.businessEmail = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) {
      newErrors.businessEmail = 'Please enter a valid email address';
    }

    if (formData.lineOfBusiness.length === 0) {
      newErrors.lineOfBusiness =
        'Please select at least one line of business';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.dtiSec) {
      newErrors.dtiSec = 'DTI/SEC Registration is required';
    }

    if (!formData.birCertificate) {
      newErrors.birCertificate = 'BIR Certificate is required';
    }

    if (!formData.businessPermit) {
      newErrors.businessPermit = 'Business Permit is required';
    }

    if (!formData.governmentId) {
      newErrors.governmentId = 'Valid Government ID is required';
    }

    if (!formData.sanitaryPermit) {
      newErrors.sanitaryPermit = 'Sanitary/Health Permit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.eWalletProvider) {
      newErrors.eWalletProvider =
        'Please select your preferred e-wallet provider';
    }

    if (!formData.eWallet) {
      newErrors.eWallet = 'Please enter your mobile number';
    } else if (!/^(\+63|0)[0-9]{10}$/.test(formData.eWallet)) {
      newErrors.eWallet = 'Please enter a valid Philippine mobile number';
    }

    if (!otpVerified) {
      newErrors.otpVerification = 'Please verify your mobile number with OTP';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the platform terms';
    }

    if (!formData.agreeFoodSafety) {
      newErrors.agreeFoodSafety = 'You must agree to the food safety policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Check if form is completely empty first
    if (isFormCompletelyEmpty(step)) {
      setShowEmptyFormError(true);
      scrollToTop();
      return;
    }

    // Then do normal validation
    if (step === 1 && validateStep1()) {
      setStep(2);
      scrollToTop();
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      scrollToTop();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if form is completely empty first
    if (isFormCompletelyEmpty(step)) {
      setShowEmptyFormError(true);
      scrollToTop();
      return;
    }

    if (!validateStep3()) return;

    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      console.log('Merchant registration:', formData);
      alert(
        '🎉 Application submitted successfully! Your e-wallet has been verified and saved for future transactions. Please wait 24 hours for verification. You will receive an email with further instructions.'
      );
      setIsLoading(false);
    }, 2000);
  };

  const FileUploadField = ({
    fieldName,
    label,
    required = true,
    accept = 'image/*,.pdf,.doc,.docx',
    icon = FileText,
    description,
  }: {
    fieldName: string;
    label: string;
    required?: boolean;
    accept?: string;
    icon?: React.ElementType;
    description?: string;
  }) => {
    const IconComponent = icon;
    const file = formData[fieldName as keyof typeof formData] as File | null;
    const isImage = file && file.type.startsWith('image/');

    return (
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                file
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : 'bg-gradient-to-br from-[#469b47] to-[#3A7D44]'
              }`}
            >
              {file ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <IconComponent className="w-6 h-6 text-white" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
              </h4>
              {description && (
                <p className="text-xs text-gray-600">{description}</p>
              )}
            </div>

            {/* File Preview */}
            {file && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3">
                  {isImage ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview of ${label}`}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, [fieldName]: null }));
                      if (errors[fieldName]) {
                        setErrors((prev) => ({ ...prev, [fieldName]: '' }));
                      }
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="Remove file"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="relative">
              <input
                type="file"
                id={fieldName}
                accept={accept}
                onChange={(e) => handleFileChange(e, fieldName)}
                className="hidden"
              />
              <label
                htmlFor={fieldName}
                className={`block w-full border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                  errors[fieldName]
                    ? 'border-red-300 bg-red-50 hover:border-red-400'
                    : file
                    ? 'border-green-300 bg-green-50 hover:border-green-400'
                    : 'border-gray-300 hover:border-[#469b47] hover:bg-gray-100'
                }`}
              >
                <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                <span className="text-sm text-gray-600 font-medium">
                  {file ? 'Change File' : 'Click to Upload'}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, JPG, PNG (max 10MB)
                </p>
              </label>
            </div>

            {errors[fieldName] && (
              <div className="flex items-center text-red-600 text-xs mt-2">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors[fieldName]}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto" ref={formRef}>
        {/* Fixed Header with Better Positioning */}
        <div className="relative mb-8">
          <button
            onClick={step === 1 ? onBack : () => setStep(step - 1)}
            className="absolute left-0 top-0 inline-flex items-center text-gray-500 hover:text-gray-700 transition-all duration-200 text-sm group bg-white rounded-lg px-3 py-2 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="text-center pt-12">
            <div className="relative inline-block mb-4">
              <div className="absolute -top-2 -right-2 animate-bounce">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Become a Partner!
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-8">
              Join our merchant network and start earning
            </p>

            {/* Enhanced Progress Indicator */}
            <div className="flex items-center justify-center space-x-4">
              <div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= 1
                    ? 'bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > 1 ? <Check className="w-6 h-6" /> : '1'}
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
                className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= 2
                    ? 'bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > 2 ? <Check className="w-6 h-6" /> : '2'}
                {step >= 2 && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#469b47] to-[#3A7D44] animate-pulse opacity-30"></div>
                )}
              </div>
              <div
                className={`h-2 w-12 rounded-full transition-all duration-500 ${
                  step >= 3
                    ? 'bg-gradient-to-r from-[#469b47] to-[#3A7D44]'
                    : 'bg-gray-200'
                }`}
              ></div>
              <div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= 3
                    ? 'bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white shadow-lg'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                3
                {step >= 3 && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#469b47] to-[#3A7D44] animate-pulse opacity-30"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Empty Form Error Alert */}
        {showEmptyFormError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h4 className="text-red-800 font-semibold text-sm">
                  Please fill in the form!
                </h4>
                <p className="text-red-600 text-xs">
                  Start by filling in at least one field to continue with your
                  application.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          {step === 1 ? (
            // Step 1: Business Information
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#469b47] to-[#3A7D44] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Building className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Business Information
                </h3>
                <p className="text-gray-600">Tell us about your business</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Business Name */}
                <div className="lg:col-span-2">
                  <div className="space-y-3">
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Business Name
                    </label>
                    <div className="relative group">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                          errors.businessName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200'
                        }`}
                        placeholder="Enter your business name"
                      />
                    </div>
                    {errors.businessName && (
                      <div className="flex items-center text-red-600 text-xs animate-pulse">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.businessName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Branch */}
                <div className="lg:col-span-2">
                  <div className="space-y-3">
                    <label
                      htmlFor="businessBranch"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Branch <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative group">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
                      <input
                        type="text"
                        id="businessBranch"
                        name="businessBranch"
                        value={formData.businessBranch}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                          errors.businessBranch
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200'
                        }`}
                        placeholder="Enter branch name (e.g., Main Branch, Makati Branch)"
                      />
                    </div>
                    {errors.businessBranch && (
                      <div className="flex items-center text-red-600 text-xs animate-pulse">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.businessBranch}
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Location */}
                <div className="lg:col-span-2">
                  <div className="space-y-3">
                    <label
                      htmlFor="businessLocation"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Business Location
                    </label>
                    <div className="space-y-3">
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
                        <input
                          type="text"
                          id="businessLocation"
                          name="businessLocation"
                          value={formData.businessLocation}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                            errors.businessLocation
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                              : 'border-gray-200'
                          }`}
                          placeholder="Enter your business address"
                          readOnly={formData.useGPS}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="w-full bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white py-3 px-4 rounded-2xl hover:from-[#3A7D44] hover:to-[#2d5f30] transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Use Current Location (GPS)
                      </button>
                    </div>
                    {errors.businessLocation && (
                      <div className="flex items-center text-red-600 text-xs animate-pulse">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.businessLocation}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                        errors.phoneNumber
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-200'
                      }`}
                      placeholder="09XXXXXXXXX"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <div className="flex items-center text-red-600 text-xs animate-pulse">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phoneNumber}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="businessEmail"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Business Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
                    <input
                      type="email"
                      id="businessEmail"
                      name="businessEmail"
                      value={formData.businessEmail}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                        errors.businessEmail
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-200'
                      }`}
                      placeholder="business@email.com"
                    />
                  </div>
                  {errors.businessEmail && (
                    <div className="flex items-center text-red-600 text-xs animate-pulse">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.businessEmail}
                    </div>
                  )}
                </div>
              </div>

              {/* Searchable Line of Business */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Line of Business{' '}
                  <span className="text-gray-500 font-normal">
                    (Select all that apply)
                  </span>
                </label>
                
                {/* Selected Items Display */}
                {formData.lineOfBusiness.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">
                        Selected ({formData.lineOfBusiness.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.lineOfBusiness.map((business) => (
                        <div
                          key={business}
                          className="bg-white border border-green-300 rounded-xl px-3 py-2 flex items-center space-x-2 text-sm"
                        >
                          <span className="text-gray-700">{business}</span>
                          <button
                            type="button"
                            onClick={() => handleLineOfBusinessChange(business)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Searchable Dropdown */}
                <div className="relative">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
                    <input
                      type="text"
                      value={businessSearchTerm}
                      onChange={(e) => setBusinessSearchTerm(e.target.value)}
                      onFocus={() => setIsBusinessDropdownOpen(true)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-gray-50 focus:bg-white ${
                        errors.lineOfBusiness
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-200'
                      }`}
                      placeholder="Search for your line of business..."
                    />
                    <button
                      type="button"
                      onClick={() => setIsBusinessDropdownOpen(!isBusinessDropdownOpen)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#469b47] transition-colors"
                    >
                      {isBusinessDropdownOpen ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Dropdown List */}
                  {isBusinessDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
                      {filteredBusinessOptions.length > 0 ? (
                        <div className="p-2">
                          {filteredBusinessOptions.map((business) => (
                            <label
                              key={business}
                              className="flex items-center space-x-3 cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-200"
                            >
                              <input
                                type="checkbox"
                                checked={formData.lineOfBusiness.includes(business)}
                                onChange={() => handleLineOfBusinessChange(business)}
                                className="h-5 w-5 text-[#469b47] focus:ring-[#469b47] border-gray-300 rounded transition-all duration-200 flex-shrink-0"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
                                {business}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No matches found</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Try searching with different keywords
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {errors.lineOfBusiness && (
                  <div className="flex items-center text-red-600 text-xs animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.lineOfBusiness}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white py-4 rounded-2xl hover:from-[#3A7D44] hover:to-[#2d5f30] transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue to Documents
              </button>
            </form>
          ) : step === 2 ? (
            // Step 2: Required Documents - Improved Layout
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#469b47] to-[#3A7D44] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Required Documents
                </h3>
                <p className="text-gray-600">
                  Upload your business documents for verification
                </p>
              </div>

              <div className="space-y-8">
                {/* Required Documents Section */}
                <div>
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-3 bg-red-50 px-6 py-3 rounded-2xl border border-red-200">
                      <FileText className="w-5 h-5 text-red-600" />
                      <span className="text-red-800 font-semibold text-sm">
                        Required Business Documents
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <FileUploadField
                      fieldName="dtiSec"
                      label="DTI / SEC Registration"
                      description="Department of Trade Registration or Securities and Exchange Commission certificate"
                      icon={FileText}
                    />
                    <FileUploadField
                      fieldName="birCertificate"
                      label="BIR Certificate (Form 2303)"
                      description="Bureau of Internal Revenue certificate for tax registration"
                      icon={FileText}
                    />
                    <FileUploadField
                      fieldName="businessPermit"
                      label="Business Permit"
                      description="Local government unit permit to operate your business"
                      icon={FileText}
                    />
                    <FileUploadField
                      fieldName="governmentId"
                      label="Government ID"
                      description="Valid government-issued identification (Driver's License, Passport, etc.)"
                      icon={FileText}
                    />
                    <FileUploadField
                      fieldName="sanitaryPermit"
                      label="Sanitary / Health Permit"
                      description="Health department permit for food handling establishments"
                      icon={Shield}
                    />
                  </div>
                </div>

                {/* Optional Documents Section */}
                <div>
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-3 bg-blue-50 px-6 py-3 rounded-2xl border border-blue-200">
                      <Image className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 font-semibold text-sm">
                        Optional Documents (Recommended)
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <FileUploadField
                      fieldName="businessLogo"
                      label="Business Logo"
                      description="Your business logo for better brand recognition"
                      required={false}
                      accept="image/*"
                      icon={Image}
                    />
                    <FileUploadField
                      fieldName="storefrontPhoto"
                      label="Storefront Photo"
                      description="Photo of your business location or storefront"
                      required={false}
                      accept="image/*"
                      icon={Image}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white py-4 rounded-2xl hover:from-[#3A7D44] hover:to-[#2d5f30] transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue to Payment Setup
              </button>
            </form>
          ) : (
            // Step 3: E-wallet & Verification Setup
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#469b47] to-[#3A7D44] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Secure Payment Setup
                </h3>
                <p className="text-gray-600 text-sm">
                  Link your e-wallet for account verification - Your payments are always
                  encrypted
                </p>
              </div>

              {/* Security Badge */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-8">
                <div className="flex items-center justify-center space-x-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <span className="text-green-800 font-semibold text-sm">
                    Bank-level Security • 256-bit Encryption • Your payments are
                    always encrypted
                  </span>
                </div>
              </div>

              {/* E-wallet Provider Selection */}
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Choose Your E-wallet Provider
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Link your e-wallet for account verification and future transactions
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {/* GCash Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        eWalletProvider: 'gcash',
                      }));
                      if (showEmptyFormError) {
                        setShowEmptyFormError(false);
                      }
                    }}
                    className={`w-full p-6 border-2 rounded-2xl transition-all duration-300 ${
                      formData.eWalletProvider === 'gcash'
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center overflow-hidden">
                        <img
                          src="/Apps_logo/Gcash.jpeg"
                          alt="GCash Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          GCash
                        </div>
                        <div className="text-blue-600 text-sm font-semibold">
                          Globe Fintech
                        </div>
                        <div className="text-gray-500 text-xs">
                          Most popular in Philippines
                        </div>
                      </div>
                      {formData.eWalletProvider === 'gcash' && (
                        <CheckCircle className="w-6 h-6 text-blue-500 mx-auto" />
                      )}
                    </div>
                  </button>

                  {/* Maya Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        eWalletProvider: 'maya',
                      }));
                      if (showEmptyFormError) {
                        setShowEmptyFormError(false);
                      }
                    }}
                    className={`w-full p-6 border-2 rounded-2xl transition-all duration-300 ${
                      formData.eWalletProvider === 'maya'
                        ? 'border-[#469b47] bg-green-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-[#469b47] hover:bg-green-50'
                    }`}
                  >
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center overflow-hidden">
                        <img
                          src="/Apps_logo/Maya.jpeg"
                          alt="Maya Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          Maya
                        </div>
                        <div className="text-[#469b47] text-sm font-semibold">
                          Voyager Innovations
                        </div>
                        <div className="text-gray-500 text-xs">
                          Fast & secure payments
                        </div>
                      </div>
                      {formData.eWalletProvider === 'maya' && (
                        <CheckCircle className="w-6 h-6 text-[#469b47] mx-auto" />
                      )}
                    </div>
                  </button>
                </div>

                {errors.eWalletProvider && (
                  <div className="flex items-center justify-center text-red-600 text-xs animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.eWalletProvider}
                  </div>
                )}
              </div>

              {/* Mobile Number Input and OTP Verification */}
              {formData.eWalletProvider && (
                <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Verify Your {formData.eWalletProvider.toUpperCase()}{' '}
                      Number
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Link this number to your account for verification and future transactions
                    </p>
                  </div>

                  {/* Mobile Number Input */}
                  <div className="space-y-3">
                    <label
                      htmlFor="eWallet"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      {formData.eWalletProvider.toUpperCase()} Mobile Number
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#469b47] transition-colors" />
                      <input
                        type="text"
                        id="eWallet"
                        name="eWallet"
                        value={formData.eWallet}
                        onChange={handleInputChange}
                        disabled={otpVerified}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-white ${
                          otpVerified
                            ? 'bg-green-50 border-green-500 text-green-800'
                            : errors.eWallet
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200'
                        }`}
                        placeholder="09XXXXXXXXX"
                      />
                      {otpVerified && (
                        <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                      )}
                    </div>
                    {errors.eWallet && (
                      <div className="flex items-center text-red-600 text-xs animate-pulse">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.eWallet}
                      </div>
                    )}
                  </div>

                  {/* Send OTP Button */}
                  {!otpSent && !otpVerified && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={isLoading || !formData.eWallet}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending OTP...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>Send OTP to Verify</span>
                        </div>
                      )}
                    </button>
                  )}

                  {/* OTP Input */}
                  {otpSent && !otpVerified && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-blue-800 font-semibold text-sm">
                              OTP Sent Successfully!
                            </p>
                            <p className="text-blue-700 text-xs">
                              Enter the 6-digit code sent to {formData.eWallet}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label
                          htmlFor="otpCode"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Enter OTP Code
                        </label>
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            id="otpCode"
                            name="otpCode"
                            value={formData.otpCode}
                            onChange={handleInputChange}
                            maxLength={6}
                            className={`flex-1 py-4 px-4 border-2 rounded-2xl focus:ring-4 focus:ring-[#469b47]/20 focus:border-[#469b47] transition-all duration-200 text-sm bg-white text-center font-mono text-lg ${
                              errors.otpCode
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200'
                            }`}
                            placeholder="Enter 6 Digit Code"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOTP}
                            disabled={
                              isLoading || formData.otpCode.length !== 6
                            }
                            className="px-6 py-4 bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white rounded-2xl hover:from-[#3A7D44] hover:to-[#2d5f30] transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                          >
                            {isLoading ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              'Verify'
                            )}
                          </button>
                        </div>

                        {otpTimer > 0 && (
                          <p className="text-gray-500 text-xs text-center">
                            Resend OTP in {Math.floor(otpTimer / 60)}:
                            {(otpTimer % 60).toString().padStart(2, '0')}
                          </p>
                        )}

                        {errors.otpCode && (
                          <div className="flex items-center text-red-600 text-xs animate-pulse">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.otpCode}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* OTP Verified Status */}
                  {otpVerified && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-green-800 font-semibold text-sm">
                            Number Verified Successfully!
                          </p>
                          <p className="text-green-700 text-xs">
                            {formData.eWallet} is now linked to your account
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Account Verification Notice */}
              {otpVerified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <Lock className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        Account Verification Setup
                      </h4>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>
                          • Your {formData.eWalletProvider.toUpperCase()} number
                          ({formData.eWallet}) is now linked to your account
                        </li>
                        <li>
                          • This is saved for account verification and future transactions
                        </li>
                        <li>
                          • No auto top up - you maintain full control of your payments
                        </li>
                        <li>
                          • All transactions require your manual approval
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Free 5 Tokens Welcome Bonus - Updated */}
              <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#469b47] to-[#3A7D44] rounded-2xl flex items-center justify-center shadow-lg">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <h4 className="text-xl font-bold text-gray-900">
                        Welcome Bonus
                      </h4>
                      <div className="bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white px-3 py-1 rounded-full text-xs font-bold">
                        FREE
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-3xl font-bold text-[#469b47] mb-1">
                        5 Tokens
                      </div>
                      <p className="text-gray-600 text-sm">
                        For first-time merchants • Worth ₱125
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Tokens deduct per sale (1 token = 1 transaction) </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Post products (free)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>No upfront payment</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Instant activation</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Start earning immediately</span>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-green-800 text-xs">
                        <strong>Note:</strong> Free tokens will be credited
                        within 24 hours after approval. Free tokens expire after 30 days of inactivity. Additional tokens can be
                        purchased using your verified e-wallet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Benefits */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="text-center mb-6">
                  <Shield className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <h4 className="font-bold text-xl text-gray-900">
                    Security Features
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 text-center border border-green-200">
                    <Lock className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="font-semibold text-sm mb-1 text-gray-900">
                      256-bit Encryption
                    </div>
                    <div className="text-xs text-green-600">
                      Bank-level security
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-green-200">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="font-semibold text-sm mb-1 text-gray-900">
                      OTP Verified
                    </div>
                    <div className="text-xs text-green-600">
                      Mobile authenticated
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-green-700 text-sm">
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Your payments are always encrypted and secure</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>
                      E-wallet linked for secure account verification
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Real-time transaction monitoring and alerts</span>
                  </div>
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 sm:space-x-4 cursor-pointer group px-2 sm:px-0">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-5 w-5 sm:h-6 sm:w-6 text-[#469b47] focus:ring-[#469b47] border-gray-300 rounded mt-1 transition-all duration-200 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors leading-relaxed">
                      I agree to the{' '}
                      <button
                        type="button"
                        className="text-[#469b47] hover:text-[#3A7D44] font-semibold hover:underline"
                      >
                        Platform Terms and Conditions
                      </button>{' '}
                      including the e-wallet verification setup and
                      manual payment processing.
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <div className="flex items-center text-red-600 text-xs animate-pulse ml-8 sm:ml-10 px-2 sm:px-0">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.agreeToTerms}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3 sm:space-x-4 cursor-pointer group px-2 sm:px-0">
                    <input
                      type="checkbox"
                      name="agreeFoodSafety"
                      checked={formData.agreeFoodSafety}
                      onChange={handleInputChange}
                      className="h-5 w-5 sm:h-6 sm:w-6 text-[#469b47] focus:ring-[#469b47] border-gray-300 rounded mt-1 transition-all duration-200 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors leading-relaxed">
                      I agree to follow the{' '}
                      <button
                        type="button"
                        className="text-[#469b47] hover:text-[#3A7D44] font-semibold hover:underline"
                      >
                        Food Safety Policy
                      </button>{' '}
                      and maintain quality standards for all surplus food items.
                    </span>
                  </label>
                  {errors.agreeFoodSafety && (
                    <div className="flex items-center text-red-600 text-xs animate-pulse ml-8 sm:ml-10 px-2 sm:px-0">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.agreeFoodSafety}
                    </div>
                  )}
                </div>
              </div>

              {/* OTP Verification Error */}
              {errors.otpVerification && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {errors.otpVerification}
                  </div>
                </div>
              )}

              {/* Verification Notice */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="w-10 h-10 bg-yellow-500 rounded-xl p-2 text-white flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-3 text-base">
                      Verification Process:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Your application will be reviewed within 24 hours</li>
                      <li>
                        Your verified e-wallet is saved for future transactions
                      </li>
                      <li>
                        Once approved, you can manually purchase tokens using
                        your {formData.eWalletProvider.toUpperCase()}
                      </li>
                      <li>
                        You'll receive notifications for token expiry and payment
                        confirmations
                      </li>
                      <li>
                        Access your transaction history anytime in the dashboard
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !otpVerified}
                className="w-full bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white py-5 rounded-2xl hover:from-[#3A7D44] hover:to-[#2d5f30] transition-all duration-300 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Secure Application...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Shield className="w-5 h-5" />
                    <span>Complete Secure Registration</span>
                  </div>
                )}
              </button>
            </form>
          )}

          {/* Switch to Login */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Already have an account?
            </p>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#469b47] hover:text-[#3A7D44] font-semibold transition-colors hover:underline text-base"
            >
              Sign in instead
            </button>
          </div>
        </div>

        {/* Partner Benefits Preview */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-[#469b47] mr-3" />
              <h4 className="font-bold text-gray-900 text-xl">
                Partner Benefits
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-[#469b47] font-bold text-3xl mb-2">
                ₱500K+
              </div>
              <div className="text-gray-600 font-medium text-sm">
                Average Revenue
              </div>
            </div>
            <div>
              <div className="text-[#469b47] font-bold text-3xl mb-2">85%</div>
              <div className="text-gray-600 font-medium text-sm">
                Waste Reduction
              </div>
            </div>
            <div>
              <div className="text-[#469b47] font-bold text-3xl mb-2">
                2.5K+
              </div>
              <div className="text-gray-600 font-medium text-sm">
                New Customers
              </div>
            </div>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {isBusinessDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsBusinessDropdownOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <MerchantSignup
      onBack={() => console.log('Back clicked')}
      onSwitchToLogin={() => console.log('Switch to login clicked')}
    />
  );
}

export default App;