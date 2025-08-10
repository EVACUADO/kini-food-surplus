import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authFunctions, productFunctions, orderFunctions, messageFunctions } from '../lib/supabase';
import {
  MapPin,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  Send,
  Leaf,
  User,
  ShoppingBag,
  Search,
  Bell,
  Settings,
  LogOut,
  Utensils,
  Paperclip,
  Menu,
} from 'lucide-react';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { user: currentUser } = await authFunctions.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);

        // Load user profile
        const { data: profile } = await authFunctions.getUserProfile(
          currentUser.id
        );
        if (profile) {
          setUser({ ...currentUser, ...profile });
        }

        // Load products
        const { data: productsData } =
          await productFunctions.getActiveProducts();
        setProducts(productsData || []);

        // Load orders
        const { data: ordersData } = await orderFunctions.getCustomerOrders(
          currentUser.id
        );
        setOrders(ordersData || []);

        // Load conversations
        const { data: conversationsData } =
          await messageFunctions.getConversations(currentUser.id);
        setChats(conversationsData || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const selectedChatData = chats.find((chat) => chat.id === selectedChat);
      if (selectedChatData) {
        messageFunctions.sendMessage(
          selectedChatData.recipient_id,
          message.trim()
        );
      }
      setMessage('');
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem('currentUser');
    // Mock navigation - replace with actual router navigation
    window.location.href = '/';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'completed':
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
                  setActiveTab('map');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                  activeTab === 'map'
                    ? 'bg-[#469b47]/10 text-[#469b47]'
                    : 'text-gray-700'
                }`}
              >
                <MapPin className="w-5 h-5 mr-3" />
                Nearby Deals
              </button>
              <button
                onClick={() => {
                  setActiveTab('chat');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                  activeTab === 'chat'
                    ? 'bg-[#469b47]/10 text-[#469b47]'
                    : 'text-gray-700'
                }`}
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Messages
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
                Order History
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
                </div>
              </Link>

              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Cebu City, Philippines</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Mobile Search Button */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden p-2 text-gray-600"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search Bar - Desktop */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#469b47] focus:border-transparent w-64"
                />
              </div>

              <button className="hidden sm:block p-2 text-gray-600 hover:text-[#469b47] transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#469b47] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user?.full_name || 'Customer'}
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

          {/* Mobile Search Bar - Shows when toggled */}
          {showSearch && (
            <div className="md:hidden py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#469b47] focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Navigation Tabs - Desktop */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-6 py-4 font-medium text-sm transition-all duration-300 flex items-center ${
                activeTab === 'map'
                  ? 'text-[#469b47] border-b-2 border-[#469b47] bg-[#469b47]/5'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Nearby Deals
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-4 font-medium text-sm transition-all duration-300 flex items-center ${
                activeTab === 'chat'
                  ? 'text-[#469b47] border-b-2 border-[#469b47] bg-[#469b47]/5'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
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
              Order History
            </button>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Nearby Merchants</h3>
              <div className="bg-gradient-to-br from-[#469b47]/5 to-[#469b47]/10 rounded-xl h-64 sm:h-80 md:h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#469b47]/20 to-[#469b47]/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-[#469b47]" />
                  </div>
                  <p className="text-gray-600 font-medium text-base sm:text-lg">
                    No merchants in your area
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                    We're working to bring Kini to your neighborhood!
                  </p>
                </div>
              </div>
            </div>

            {/* Deals Feed */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Available Deals</h3>
              <div className="space-y-3 sm:space-y-4">
                {loading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#469b47] mx-auto"></div>
                    <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">
                      Loading deals...
                    </p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#469b47]/10 to-[#469b47]/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-[#469b47]" />
                    </div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                      Check back soon for surplus deals!
                    </h4>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Local merchants will post their surplus food here
                    </p>
                  </div>
                ) : (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#469b47]/10 to-[#469b47]/20 rounded-xl flex items-center justify-center text-xl sm:text-2xl">
                            �
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                              {product.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {product.merchants?.business_name}
                            </p>
                            <div className="flex items-center flex-wrap gap-1 sm:gap-2 mt-1">
                              <span className="text-xs sm:text-sm text-gray-500 line-through">
                                ₱{product.original_price}
                              </span>
                              <span className="text-xs sm:text-sm font-medium text-[#469b47]">
                                ₱{product.discounted_price}
                              </span>
                              <span className="text-[10px] sm:text-xs bg-[#469b47] text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                                {Math.round(
                                  ((product.original_price -
                                    product.discounted_price) /
                                    product.original_price) *
                                    100
                                )}
                                % OFF
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="bg-[#469b47] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#3A7D44] transition-colors text-sm sm:text-base">
                          Order Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] md:h-96">
              {/* Chat List */}
              <div className="border-r border-gray-200 p-3 sm:p-4 overflow-y-auto">
                <h3 className="font-semibold mb-3 sm:mb-4">Messages</h3>
                <div className="space-y-2 sm:space-y-3">
                  {chats.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-1 sm:mb-2" />
                      <p className="text-gray-500 text-xs sm:text-sm">
                        No conversations yet
                      </p>
                    </div>
                  ) : (
                    chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                        className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedChat === chat.id
                            ? 'bg-[#469b47]/10 border border-[#469b47]/20'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#469b47] rounded-full flex items-center justify-center text-white text-sm sm:text-base">
                            �
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-xs sm:text-sm truncate">
                                {chat.sender?.full_name ||
                                  chat.recipient?.full_name}
                              </h4>
                              <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap ml-2">
                                {new Date(chat.created_at).toLocaleTimeString(
                                  [],
                                  { hour: '2-digit', minute: '2-digit' }
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              {chat.content}
                            </p>
                          </div>
                          {!chat.is_read && (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#469b47] rounded-full flex items-center justify-center">
                              <span className="text-[8px] sm:text-xs text-white">
                                •
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Window */}
              <div className="col-span-2 flex flex-col">
                {selectedChat ? (
                  <>
                    <div className="border-b border-gray-200 p-3 sm:p-4 bg-gray-50">
                      <h3 className="font-semibold">Green Café</h3>
                      <p className="text-xs sm:text-sm text-green-600">
                        ● Online
                      </p>
                    </div>
                    <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50">
                      <div className="space-y-3">
                        <div className="flex justify-start">
                          <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 max-w-xs shadow-sm">
                            <p className="text-xs sm:text-sm">
                              Hi! I have fresh sandwiches available at 70% off.
                              Interested?
                            </p>
                            <span className="text-[10px] sm:text-xs text-gray-500 mt-1">
                              2:30 PM
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-[#469b47] text-white rounded-xl sm:rounded-2xl p-2 sm:p-3 max-w-xs">
                            <p className="text-xs sm:text-sm">
                              Yes! How many do you have?
                            </p>
                            <span className="text-[10px] sm:text-xs text-white/70 mt-1">
                              2:32 PM
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 p-3 sm:p-4 bg-white">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#469b47] focus:border-transparent text-sm"
                          onKeyPress={(e) =>
                            e.key === 'Enter' && handleSendMessage()
                          }
                        />
                        <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 transition-colors">
                          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={handleSendMessage}
                          className="p-1.5 sm:p-2 bg-[#469b47] text-white rounded-xl hover:bg-[#3A7D44] transition-colors"
                        >
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                        <button className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors">
                          Sent via GCash! 📱
                        </button>
                        <button className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors">
                          On my way!
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-2 sm:mb-4" />
                      <p className="text-gray-600 text-sm sm:text-base">
                        Select a conversation to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4 sm:mb-6">
                Order History
              </h3>

              {/* Order Tabs */}
              <div className="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
                <nav className="flex space-x-4 sm:space-x-8 min-w-max">
                  <button className="border-b-2 border-[#469b47] py-2 px-1 text-xs sm:text-sm font-medium text-[#469b47]">
                    All Orders
                  </button>
                  <button className="py-2 px-1 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                    Active
                  </button>
                  <button className="py-2 px-1 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                    Completed
                  </button>
                  <button className="py-2 px-1 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                    Cancelled
                  </button>
                </nav>
              </div>

              {/* Orders List */}
              <div className="space-y-3 sm:space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#469b47]/10 to-[#469b47]/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-[#469b47]" />
                    </div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                      No orders yet
                    </h4>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Start saving food (and money) by ordering from nearby
                      merchants!
                    </p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#469b47]/10 to-[#469b47]/20 rounded-xl flex items-center justify-center text-xl sm:text-2xl">
                            �
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                              {order.products?.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {order.merchants?.business_name}
                            </p>
                            <div className="flex items-center flex-wrap gap-1 sm:gap-2 mt-1">
                              <span className="text-xs sm:text-sm font-medium text-[#469b47]">
                                ₱{order.total_amount}
                              </span>
                              <span className="text-xs text-gray-500">
                                Qty: {order.quantity}
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
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
