import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf,
  Coins,
  Upload,
  ShoppingBag,
  TrendingUp,
  Users,
  MessageCircle,
  Settings,
  Bell,
  Plus,
  Calendar,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  Utensils,
  LogOut,
  Menu,
  Search,
} from 'lucide-react';

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [merchant, setMerchant] = useState<any>({
    business_name: 'Green Restaurant',
    tokens_balance: 5,
    total_sales: 1250,
    total_orders: 23,
    waste_reduced_kg: 45,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    quantity: '',
    expiryDate: '',
    image: null as File | null,
  });

  React.useEffect(() => {
    loadMerchantData();
  }, []);

  const loadMerchantData = async () => {
    try {
      // Get user data from localStorage (mock implementation)
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        setUser(userData);

        // Mock data loading - replace with actual API calls
        setMerchant({
          business_name: userData.name || 'Green Restaurant',
          tokens_balance: 5,
          total_sales: 1250,
          total_orders: 23,
          waste_reduced_kg: 45,
        });

        // Mock products and orders
        setProducts([]);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const uploadProduct = async () => {
      try {
        setLoading(true);

        // Mock product upload - replace with actual API call
        const newProduct = {
          id: Date.now().toString(),
          name: productData.name,
          description: productData.description || 'Fresh surplus food',
          original_price: Number(productData.originalPrice),
          discounted_price: calculateDiscount(
            Number(productData.originalPrice)
          ),
          quantity: Number(productData.quantity),
          available_quantity: Number(productData.quantity),
          expiry_date: productData.expiryDate,
          status: 'active',
          created_at: new Date().toISOString(),
        };

        setProducts((prev) => [...prev, newProduct]);
        alert('Product uploaded successfully!');
        setShowUploadModal(false);
        setProductData({
          name: '',
          description: '',
          originalPrice: '',
          quantity: '',
          expiryDate: '',
          image: null,
        });

        // Update merchant tokens (mock)
        setMerchant((prev) => ({
          ...prev,
          tokens_balance: Math.max(0, prev.tokens_balance - 1),
        }));
      } catch (error) {
        console.error('Error uploading product:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    uploadProduct();
  };

  const handleTokenPurchase = async (amount: number, price: number) => {
    try {
      // Mock token purchase - replace with actual payment integration
      setMerchant((prev) => ({
        ...prev,
        tokens_balance: prev.tokens_balance + amount,
      }));

      alert(`Successfully purchased ${amount} tokens!`);
      setShowTokenModal(false);
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const calculateDiscount = (originalPrice: number) => {
    return Math.round(originalPrice * 0.3); // 70% off
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="bg-white h-full w-4/5 max-w-sm p-4">
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/Kini white logo.png"
                  alt="Kini Logo"
                  className="h-8 w-8 object-cover rounded-xl"
                />
                <span className="text-lg font-bold text-[#469b47]">Kini</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                  activeTab === 'overview'
                    ? 'bg-[#469b47]/10 text-[#469b47]'
                    : 'text-gray-700'
                }`}
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Overview
              </button>
              <button
                onClick={() => {
                  setActiveTab('products');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                  activeTab === 'products'
                    ? 'bg-[#469b47]/10 text-[#469b47]'
                    : 'text-gray-700'
                }`}
              >
                <Package className="w-5 h-5 mr-3" />
                Products
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                  activeTab === 'orders'
                    ? 'bg-[#469b47]/10 text-[#469b47]'
                    : 'text-gray-700'
                }`}
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                Orders
              </button>
              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                  activeTab === 'analytics'
                    ? 'bg-[#469b47]/10 text-[#469b47]'
                    : 'text-gray-700'
                }`}
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Analytics
              </button>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 rounded-lg flex items-center text-gray-700"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-600"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link to="/" className="flex items-center space-x-3">
                <div className="h-10 w-10">
                  <img
                    src="/Kini green.png"
                    alt="Kini Logo"
                    className="h-full w-full object-cover rounded-xl"
                  />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-[#469b47]">
                    Kini Food Surplus
                  </span>
                  <p className="text-xs text-gray-600 -mt-1">
                    Merchant Dashboard
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Token Balance - Responsive */}
              <div className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-[#469b47]/10 to-[#469b47]/5 px-2 sm:px-4 py-1 sm:py-2 rounded-xl border border-[#469b47]/20">
                <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-[#469b47]" />
                <span className="text-xs sm:text-sm font-medium text-[#469b47]">
                  {merchant?.tokens_balance || 0}
                </span>
                <button
                  onClick={() => setShowTokenModal(true)}
                  className="text-xs bg-[#469b47] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg hover:bg-[#3A7D44] transition-all duration-300 transform hover:scale-105"
                >
                  Buy
                </button>
              </div>

              <button className="hidden sm:block p-2 text-gray-600 hover:text-[#469b47] transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#469b47] rounded-full flex items-center justify-center">
                  <Users className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {merchant?.business_name || 'Merchant'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="hidden sm:block p-1 text-gray-500 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Navigation Tabs - Desktop */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium text-sm transition-all duration-300 flex items-center ${
                activeTab === 'overview'
                  ? 'text-[#469b47] border-b-2 border-[#469b47] bg-[#469b47]/5'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-4 font-medium text-sm transition-all duration-300 flex items-center ${
                activeTab === 'products'
                  ? 'text-[#469b47] border-b-2 border-[#469b47] bg-[#469b47]/5'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-4 h-4 mr-2" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 font-medium text-sm transition-all duration-300 flex items-center ${
                activeTab === 'orders'
                  ? 'text-[#469b47] border-b-2 border-[#469b47] bg-[#469b47]/5'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 font-medium text-sm transition-all duration-300 flex items-center ${
                activeTab === 'analytics'
                  ? 'text-[#469b47] border-b-2 border-[#469b47] bg-[#469b47]/5'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Total Sales
                    </p>
                    <p className="text-lg sm:text-3xl font-bold text-gray-900">
                      ₱{merchant?.total_sales || 0}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-[#469b47]/20 to-[#469b47]/10 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-[#469b47]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-gray-600">Orders</p>
                    <p className="text-lg sm:text-3xl font-bold text-gray-900">
                      {merchant?.total_orders || 0}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-[#469b47]/20 to-[#469b47]/10 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6 text-[#469b47]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Waste Reduced
                    </p>
                    <p className="text-lg sm:text-3xl font-bold text-gray-900">
                      {merchant?.waste_reduced_kg || 0} kg
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-[#469b47]/20 to-[#469b47]/10 rounded-xl flex items-center justify-center">
                    <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-[#469b47]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Customers
                    </p>
                    <p className="text-lg sm:text-3xl font-bold text-gray-900">
                      {orders.length}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-[#469b47]/20 to-[#469b47]/10 rounded-xl flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-6 sm:h-6 text-[#469b47]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center justify-center space-x-2 sm:space-x-3 bg-[#469b47] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl hover:bg-[#3A7D44] transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">
                    Upload Product
                  </span>
                </button>
                <button
                  onClick={() => setShowTokenModal(true)}
                  className="flex items-center justify-center space-x-2 sm:space-x-3 bg-yellow-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">
                    Buy Tokens
                  </span>
                </button>
                <button className="flex items-center justify-center space-x-2 sm:space-x-3 bg-blue-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">
                    View Messages
                  </span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
                Recent Activity
              </h3>
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#469b47]/10 to-[#469b47]/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-[#469b47]" />
                </div>
                <p className="text-gray-600 font-medium text-sm sm:text-base">
                  No recent activity
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  Start uploading products to see activity here
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <h3 className="text-base sm:text-lg font-semibold">
                Your Products
              </h3>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center justify-center space-x-2 bg-[#469b47] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-[#3A7D44] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">
                  Add Product
                </span>
              </button>
            </div>

            <div className="text-center py-8 sm:py-16">
              {products.length === 0 ? (
                <div>
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#469b47]/10 to-[#469b47]/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Package className="w-8 h-8 sm:w-12 sm:h-12 text-[#469b47]" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-medium text-gray-700 mb-2 sm:mb-3">
                    No products yet
                  </h4>
                  <p className="text-gray-500 text-sm mb-6 sm:mb-8">
                    Start by uploading your first surplus product
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center space-x-2 sm:space-x-3 bg-[#469b47] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-[#3A7D44] transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">
                      Upload Product
                    </span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gray-50 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300"
                    >
                      <div className="text-center mb-3 sm:mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#469b47]/10 to-[#469b47]/20 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 text-lg sm:text-2xl">
                          🍽️
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                          {product.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {product.description}
                        </p>
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Original Price:</span>
                          <span className="line-through text-gray-500">
                            ₱{product.original_price}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Sale Price:</span>
                          <span className="font-medium text-[#469b47]">
                            ₱{product.discounted_price}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Available:</span>
                          <span>
                            {product.available_quantity}/{product.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Expires:</span>
                          <span>
                            {new Date(product.expiry_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {getStatusIcon(product.status)}
                          <span className="ml-1 capitalize">
                            {product.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
              Orders
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-8 sm:py-16">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#469b47]/10 to-[#469b47]/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-[#469b47]" />
                </div>
                <h4 className="text-lg sm:text-xl font-medium text-gray-700 mb-2 sm:mb-3">
                  Waiting for your first customer!
                </h4>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Upload products to start receiving orders
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#469b47]/10 to-[#469b47]/20 rounded-xl flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#469b47]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                            {order.products?.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {order.profiles?.full_name}
                          </p>
                          <div className="flex items-center flex-wrap gap-1 sm:gap-2 mt-1">
                            <span className="text-xs sm:text-sm text-gray-500">
                              Qty: {order.quantity}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-[#469b47]">
                              ₱{order.total_amount}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
              Waste Reduction Analytics
            </h3>

            <div className="text-center py-8 sm:py-16">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Leaf className="w-8 h-8 sm:w-12 sm:h-12 text-green-500" />
              </div>
              <h4 className="text-lg sm:text-xl font-medium text-gray-700 mb-2 sm:mb-3">
                Last month's waste reduction: 0%
              </h4>
              <p className="text-gray-500 text-xs sm:text-sm">
                Thank you for joining the fight against food waste!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Product Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
              Upload Product
            </h3>
            <form
              onSubmit={handleProductSubmit}
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) =>
                    setProductData({ ...productData, name: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#469b47] focus:border-[#469b47] transition-all duration-300 text-sm sm:text-base"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#469b47] focus:border-[#469b47] transition-all duration-300 text-sm sm:text-base"
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (₱)
                </label>
                <input
                  type="number"
                  value={productData.originalPrice}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      originalPrice: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#469b47] focus:border-[#469b47] transition-all duration-300 text-sm sm:text-base"
                  placeholder="Enter original price"
                  required
                />
                {productData.originalPrice && (
                  <div className="mt-2 p-2 sm:p-3 bg-[#469b47]/10 rounded-lg">
                    <p className="text-xs sm:text-sm text-[#469b47] font-medium">
                      AI-Assisted Pricing: ₱
                      {calculateDiscount(Number(productData.originalPrice))}{' '}
                      (70% off)
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={productData.quantity}
                  onChange={(e) =>
                    setProductData({ ...productData, quantity: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#469b47] focus:border-[#469b47] transition-all duration-300 text-sm sm:text-base"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={productData.expiryDate}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      expiryDate: e.target.value,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#469b47] focus:border-[#469b47] transition-all duration-300 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center hover:border-[#469b47] transition-all duration-300 cursor-pointer">
                  <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2 sm:mb-3" />
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG up to 5MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        image: e.target.files?.[0] || null,
                      })
                    }
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex space-x-3 sm:space-x-4 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-[#469b47] text-white rounded-xl hover:bg-[#3A7D44] transition-all duration-300 transform hover:scale-105 shadow-lg font-medium disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? 'Uploading...' : 'Upload Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Token Purchase Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
              Buy Tokens
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-gradient-to-r from-[#469b47]/10 to-[#469b47]/5 p-4 sm:p-6 rounded-xl border border-[#469b47]/20">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-base sm:text-lg">
                    5 Tokens
                  </span>
                  <span className="text-[#469b47] font-bold text-lg sm:text-xl">
                    ₱25
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                  Each token allows you to post one product
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#469b47]/10 to-[#469b47]/5 p-4 sm:p-6 rounded-xl border border-[#469b47]/20">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-base sm:text-lg">
                    10 Tokens
                  </span>
                  <span className="text-[#469b47] font-bold text-lg sm:text-xl">
                    ₱50
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                  Best value for active merchants
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-yellow-800">
                  <strong>Note:</strong> Tokens expire in 30 days from purchase
                  date
                </p>
              </div>

              <div className="flex space-x-3 sm:space-x-4 pt-2 sm:pt-4">
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTokenPurchase(3, 10)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-[#469b47] text-white rounded-xl hover:bg-[#3A7D44] transition-all duration-300 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base"
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;
