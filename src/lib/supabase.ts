// Mock functions to replace Supabase functionality
// This provides the same interface without requiring Supabase

// Mock authentication functions
export const authFunctions = {
  getCurrentUser: async () => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      return { user };
    }
    return { user: null };
  },

  getUserProfile: async (_userId: string) => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      return { data: user };
    }
    return { data: null };
  },

  signOut: async () => {
    localStorage.removeItem('currentUser');
    return { error: null };
  }
};

// Mock product functions
export const productFunctions = {
  getActiveProducts: async () => {
    // Return empty array for now - can be populated with mock data later
    return { data: [] };
  }
};

// Mock order functions
export const orderFunctions = {
  getCustomerOrders: async (_customerId: string) => {
    // Return empty array for now - can be populated with mock data later
    return { data: [] };
  }
};

// Mock message functions
export const messageFunctions = {
  getConversations: async (_userId: string) => {
    // Return empty array for now - can be populated with mock data later
    return { data: [] };
  },

  sendMessage: async (_recipientId: string, _content: string) => {
    // Mock send message functionality
    return { data: null, error: null };
  }
};