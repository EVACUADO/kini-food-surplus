// Authentication utility functions
export interface User {
  email: string;
  role: 'admin' | 'agent' | 'customer' | 'merchant';
  name: string;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const currentUser = localStorage.getItem('currentUser');
  return !!currentUser;
};

// Get current user data
export const getCurrentUser = (): User | null => {
  try {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return null;
    return JSON.parse(currentUser) as User;
  } catch (error) {
    // Invalid user data, clear it
    localStorage.removeItem('currentUser');
    return null;
  }
};

// Check if user has specific role
export const hasRole = (requiredRole: User['role']): boolean => {
  const user = getCurrentUser();
  return user?.role === requiredRole;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('currentUser');
  // Redirect to home page
  window.location.href = '/';
};

// Login user (store user data)
export const login = (user: User): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

// Get redirect path based on user role
export const getRedirectPath = (role: User['role']): string => {
  switch (role) {
    case 'admin':
      return '/AdminPanel';
    case 'agent':
      return '/AgentPanel';
    case 'customer':
      return '/CustomerDashboard';
    case 'merchant':
      return '/MerchantDashboard';
    default:
      return '/';
  }
};