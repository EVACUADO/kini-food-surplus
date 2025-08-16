import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ShoppingBag,
  Store,
  Users,
  TrendingDown,
  Heart,
  Shield,
  Award,
  Phone,
  MapPin,
  Check,
  ArrowRight,
  Leaf,
  Target,
  MessageCircle,
  Star,
  BarChart3,
  Search,
} from 'lucide-react';
import UnifiedAuth from './UnifiedAuth';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [address, setAddress] = useState('');

  // Color definitions
  const colors = {
    primary: '#469b47', // Main green
    primaryDark: '#3A7D44', // Darker green
    light: '#f8faf8', // Very light greenish white
    offWhite: '#f5f7f5', // Slightly darker off-white
    textDark: '#1a2e1a', // Dark greenish text
    textLight: '#e8f5e9', // Light greenish text
    overlay: 'rgba(0,0,0,0.5)', // Dark overlay
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthType(type);
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  const handleAddressSearch = () => {
    // Handle address search functionality
    console.log('Searching for address:', address);
  };

  // Navigation items data
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'mission', label: 'Mission' },
    { id: 'help', label: 'Help Center' },
    { id: 'partner', label: 'Partner' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      {/* Unified Auth Modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ backgroundColor: colors.overlay }}
        >
          <div
            className="rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
            style={{ backgroundColor: colors.offWhite }}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 z-10"
              style={{ color: colors.primary }}
            >
              <X size={24} />
            </button>
            <UnifiedAuth initialType={authType} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
        style={{
          backgroundColor: colors.primary,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src="Kini white logo.png"
                alt="Kini Logo"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <span
                className="text-xl font-bold"
                style={{ color: colors.textLight }}
              >
                Kini Food Surplus
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium ${
                    activeSection === item.id ? 'border-b-2 pb-1' : ''
                  }`}
                  style={{
                    color: colors.textLight,
                    borderColor: colors.textLight,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleAuthClick('login')}
                className="font-medium text-sm"
                style={{
                  color: colors.textLight,
                }}
              >
                Log In
              </button>
              <button
                onClick={() => handleAuthClick('signup')}
                className="px-6 py-2 rounded-lg font-medium text-sm shadow-md"
                style={{
                  backgroundColor: colors.offWhite,
                  color: colors.primary,
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  color: colors.textLight,
                }}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: colors.overlay }}
              onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Menu Content - Always green background */}
            <div
              className="absolute top-0 left-0 w-3/4 h-full shadow-lg"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left py-2 px-3 rounded-lg ${
                      activeSection === item.id
                        ? 'bg-white text-green-600'
                        : 'text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div
                  className="pt-3 space-y-2 border-t"
                  style={{
                    borderColor: `${colors.textLight}33`,
                  }}
                >
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="block w-full text-left py-2 px-3 rounded-lg text-white"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="block w-full text-left py-2 px-3 rounded-lg bg-white text-green-600"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Responsive Banner */}
      <section
        id="home"
        className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          {/* Responsive Banner Image */}
          <div className="mb-12">
            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
              <picture>
                {/* Mobile Banner */}
                <source 
                  media="(max-width: 768px)" 
                  srcSet="/Banners/LandingTopBanner_Phone.png"
                />
                {/* Desktop Banner */}
                <img
                  src="/banners/LandingTopBanner.png"
                  alt="Kini Food Surplus Banner"
                  className="w-full h-auto object-cover object-center"
                  style={{
                    maxHeight: '500px',
                    minHeight: '200px',
                  }}
                  onError={(e) => {
                    // Fallback in case the specific filename doesn't exist
                    const target = e.target as HTMLImageElement;
                    // Try with different case
                    if (target.src.includes('LandingTopBanner.png')) {
                      target.src = '/Banners/LandingTopBanner.png';
                      return;
                    }
                    // Last fallback - show text banner
                    target.style.display = 'none';
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'bg-gradient-to-r from-[#469b47] to-[#3A7D44] text-white p-12 rounded-2xl text-center';
                    fallbackDiv.innerHTML = `
                      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                        Save Money, <span class="text-green-200">Save Food</span>, Save the Planet
                      </h1>
                      <p class="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto">
                        Discover surplus food from local restaurants and stores at up to 70% off
                      </p>
                    `;
                    target.parentNode?.appendChild(fallbackDiv);
                  }}
                />
              </picture>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - CTA Section */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Join our mission to reduce food waste while enjoying delicious
                  meals at incredible prices. Every purchase makes a difference!
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#469b47] text-white px-8 py-4 rounded-xl hover:bg-[#3A7D44] transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                  Start Saving Today
                </button>
                <button className="border-2 border-[#469b47] text-[#469b47] px-8 py-4 rounded-xl hover:bg-[#469b47] hover:text-white transition-all duration-200 font-semibold text-lg">
                  For Merchants
                </button>
              </div>

              {/* Address Input Section */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-[#469b47]" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Find deals near you
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address or area (e.g., Makati, BGC, Ortigas)"
                      className="w-full px-4 py-3 pl-12 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#469b47] focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <button
                    onClick={handleAddressSearch}
                    className="bg-[#469b47] text-white px-6 py-3 rounded-xl hover:bg-[#3A7D44] transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Get personalized food deals from restaurants and stores in your area
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#469b47]">
                    70%
                  </div>
                  <div className="text-sm text-gray-600">Average Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#469b47]">
                    500+
                  </div>
                  <div className="text-sm text-gray-600">Partner Stores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#469b47]">
                    10K+
                  </div>
                  <div className="text-sm text-gray-600">Meals Saved</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#469b47] to-[#3A7D44] rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Today's Deals
                    </h3>
                    <span className="text-[#469b47] text-sm font-medium">
                      Near you
                    </span>
                  </div>

                  {/* Sample Deal Cards */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        🍕
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Pizza Palace</div>
                        <div className="text-xs text-gray-500">
                          Fresh pizza slices
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#469b47] font-bold text-sm">
                          ₱150
                        </div>
                        <div className="text-xs text-gray-400 line-through">
                          ₱500
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        🥗
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Green Cafe</div>
                        <div className="text-xs text-gray-500">
                          Healthy salad bowls
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#469b47] font-bold text-sm">
                          ₱120
                        </div>
                        <div className="text-xs text-gray-400 line-through">
                          ₱400
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              About Kini Food Surplus
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're on a mission to create a sustainable food ecosystem that
              benefits everyone - customers save money, merchants reduce waste,
              and our planet gets a helping hand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sustainability Card */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#469b47] to-[#3A7D44] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Environmental Impact
              </h3>
              <p className="text-gray-600 mb-6">
                Every meal saved through our platform prevents food waste and
                reduces environmental impact. Together, we're building a more
                sustainable future.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Check className="w-4 h-4 text-[#469b47] mr-2" />
                  Reduce food waste by 40%
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check className="w-4 h-4 text-[#469b47] mr-2" />
                  Lower carbon footprint
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check className="w-4 h-4 text-[#469b47] mr-2" />
                  Support circular economy
                </div>
              </div>
            </div>

            {/* Community Card */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Community Building
              </h3>
              <p className="text-gray-600 mb-6">
                We connect conscious consumers with local businesses, creating a
                community that values sustainability and smart spending.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Check className="w-4 h-4 text-blue-500 mr-2" />
                  Support local businesses
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check className="w-4 h-4 text-blue-500 mr-2" />
                  Build food-conscious community
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check className="w-4 h-4 text-blue-500 mr-2" />
                  Share sustainability values
                </div>
              </div>
            </div>

            {/* Social Impact Card */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Social Responsibility
              </h3>
              <p className="text-gray-600 mb-6">
                Beyond saving money and reducing waste, we're committed to
                making quality food more accessible and supporting social
                causes.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Check className="w-4 h-4 text-purple-500 mr-2" />
                  Make food more accessible
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check className="w-4 h-4 text-purple-500 mr-2" />
                  Support food security initiatives
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check className="w-4 h-4 text-purple-500 mr-2" />
                  Promote conscious consumption
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        id="mission"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Our Mission & Vision
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  To create a world where no good food goes to waste, where
                  everyone has access to quality meals at affordable prices, and
                  where businesses can turn surplus into success.
                </p>
              </div>

              {/* Mission Points */}
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-[#469b47] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Reduce Food Waste
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Transform surplus food into opportunities for savings and
                      sustainability
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-[#469b47] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Empower Local Businesses
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Help merchants monetize excess inventory and reach new
                      customers
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-[#469b47] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Make Food Accessible
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Provide quality meals at affordable prices for everyone
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-[#469b47] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Build Sustainable Communities
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Foster environmental consciousness and responsible
                      consumption
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Stats Grid */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-[#469b47] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    40%
                  </div>
                  <div className="text-sm text-gray-600">
                    Food Waste Reduction
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    500+
                  </div>
                  <div className="text-sm text-gray-600">Partner Merchants</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    25K+
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ₱2M+
                  </div>
                  <div className="text-sm text-gray-600">Customer Savings</div>
                </div>
              </div>

              {/* Goal Progress */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h4 className="font-semibold text-gray-900 mb-4">2025 Goals</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Meals Saved</span>
                      <span className="font-medium">75K / 100K</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#469b47] h-2 rounded-full"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Partner Growth</span>
                      <span className="font-medium">500 / 750</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: '67%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Center Section */}
      <section id="help" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions and get the support you need to
              make the most of Kini Food Surplus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Customer Help */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-[#469b47] rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                For Customers
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-[#469b47] mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    How to find and purchase surplus food
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-[#469b47] mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Understanding pickup times and locations
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-[#469b47] mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Payment methods and refund policies
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-[#469b47] mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Account management and preferences
                  </span>
                </div>
              </div>
              <button className="w-full bg-[#469b47] text-white py-3 rounded-lg hover:bg-[#3A7D44] transition-colors font-medium">
                Customer FAQ
              </button>
            </div>

            {/* Merchant Help */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                For Merchants
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Setting up your merchant account
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Listing surplus food and setting prices
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Managing orders and customer communication
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Analytics and performance tracking
                  </span>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Merchant Guide
              </button>
            </div>

            {/* Safety & Quality */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Safety & Quality
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Food safety standards and guidelines
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Quality assurance processes
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Reporting quality issues
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    Health and safety certifications
                  </span>
                </div>
              </div>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Safety Guidelines
              </button>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-[#469b47] to-[#3A7D44] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you with any questions or issues
              you might have. Get in touch and we'll respond as quickly as
              possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#469b47] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center justify-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Call Support</span>
              </button>
              <button className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors font-medium flex items-center justify-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Live Chat</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section
        id="partner"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Partner With Kini
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join our growing network of merchants and turn your surplus food
              into revenue while making a positive impact on the environment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Why Partner With Us?
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-[#469b47] rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Increase Revenue
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Turn surplus inventory into additional income streams
                        instead of losses
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Reach New Customers
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Connect with conscious consumers who value
                        sustainability and savings
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Environmental Impact
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Reduce food waste and contribute to a more sustainable
                        future
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Brand Recognition
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Showcase your commitment to sustainability and social
                        responsibility
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="bg-[#469b47] text-white px-8 py-4 rounded-xl hover:bg-[#3A7D44] transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                Become a Partner
              </button>
            </div>

            {/* Right Content - Stats */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-3xl font-bold text-[#469b47] mb-2">
                    ₱500K+
                  </div>
                  <div className="text-sm text-gray-600">
                    Average Monthly Revenue
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Per active merchant
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    85%
                  </div>
                  <div className="text-sm text-gray-600">Waste Reduction</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Average improvement
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    2.5K+
                  </div>
                  <div className="text-sm text-gray-600">New Customers</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Monthly average
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    4.8★
                  </div>
                  <div className="text-sm text-gray-600">Partner Rating</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Customer satisfaction
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-gradient-to-br from-[#469b47] to-[#3A7D44] p-6 rounded-2xl text-white">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-300">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-green-100 mb-4 text-sm">
                  "Kini has transformed how we handle surplus food. We've
                  reduced waste by 80% and gained hundreds of new customers who
                  love our commitment to sustainability."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Maria Santos</div>
                    <div className="text-green-200 text-xs">
                      Green Cafe Owner
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src="Kini white logo.png"
                  alt="Kini Logo"
                  className="h-10 w-10 rounded-lg"
                />
                <span className="text-xl font-bold">Kini Food Surplus</span>
              </div>
              <p className="text-gray-400 text-sm">
                Reducing food waste, one meal at a time through our surplus food
                marketplace.
              </p>

              {/* Social Media */}
              <div className="flex space-x-4 pt-2">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('home')}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('mission')}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Mission
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('partner')}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Merchants
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('help')}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* For Customers */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">For Customers</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Browse Deals
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            {/* For Merchants */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">For Merchants</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Partner With Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Merchant Portal
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Resources
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="max-w-2xl mx-auto text-center">
              <h4 className="text-lg font-semibold mb-4">
                Subscribe to our newsletter
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest updates on food deals and sustainability tips
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#469b47] text-sm"
                />
                <button className="px-4 py-2 bg-[#469b47] text-white rounded-lg hover:bg-[#3A7D44] transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Legal & Copyright */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-4 mb-4 md:mb-0">
                <a href="#" className="text-gray-400 hover:text-white text-xs">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-xs">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-xs">
                  Cookie Policy
                </a>
              </div>
              <p className="text-gray-500 text-xs">
                &copy; {new Date().getFullYear()} Kini Food Surplus. All rights
                reserved.
              </p>
            </div>
          </div>

          {/* Development Team */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="text-center">
              <h4 className="text-sm font-medium text-[#469b47] mb-2">
                Development Team
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs text-gray-400">
                <p>Clark Gil A. Evacuado</p>
                <p>Arjay Emmanuel B. Lar</p>
                <p>Jerecho O. Rebusio</p>
                <p>Melchor Jr. F. Resuello</p>
                <p>Dave D. Santiago</p>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Bachelor of Science in Information Technology - 3rd Year
                <br />
                College of PHINMA St. Jude
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;