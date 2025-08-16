import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UnifiedAuth from './components/UnifiedAuth';
import CustomerDashboard from './components/CustomerDashboard';
import MerchantDashboard from './components/MerchantDashboard';
import AdminPanel from './components/AdminPanel';
import AgentPanel from './components/AgentPanel';
import AdminAgentLogin from './components/AdminAgentLogin';

// Define types for our protected route props
type ProtectedRouteProps = {
  element: React.ComponentType;
  requiredRole: 'admin' | 'agent' | 'customer' | 'merchant';
  [key: string]: any; // For any additional props
};

// Secure hidden route configuration
const HIDDEN_ROUTES = {
  ADMIN: '/AdminDashboard',
  AGENT: '/AgentPanel',
};

// Authentication wrapper component with TypeScript
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element: Element, 
  requiredRole,
  ...rest 
}) => {
  // Check if user is authenticated from localStorage
  const currentUser = localStorage.getItem('currentUser');
  const isAuthenticated = !!currentUser;
  
  if (!isAuthenticated) {
    // Redirect to appropriate login based on required role
    if (requiredRole === 'admin') {
      return <Navigate to="/AdminDashboard" replace />;
    } else if (requiredRole === 'agent') {
      return <Navigate to="/AgentPanel" replace />;
    }
    return <Navigate to="/auth" replace />;
  }

  // Parse user data and check role
  try {
    const userData = JSON.parse(currentUser);
    const userRole = userData.role;
    
    if (userRole === requiredRole) {
      return <Element {...rest} />;
    } else {
      // User has wrong role, redirect to appropriate login
      if (requiredRole === 'admin') {
        return <Navigate to="/AdminDashboard" replace />;
      } else if (requiredRole === 'agent') {
        return <Navigate to="/AgentPanel" replace />;
      }
      return <Navigate to="/auth" replace />;
    }
  } catch (error) {
    // Invalid user data, redirect to login
    if (requiredRole === 'admin') {
      return <Navigate to="/AdminDashboard" replace />;
    } else if (requiredRole === 'agent') {
      return <Navigate to="/AgentPanel" replace />;
    }
    return <Navigate to="/auth" replace />;
  }
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<UnifiedAuth />} />
          <Route path="/CustomerDashboard" element={<CustomerDashboard />} />
          <Route path="/MerchantDashboard" element={<MerchantDashboard />} />
          
          {/* Hidden login routes for Admin and Agent */}
          <Route 
            path={HIDDEN_ROUTES.ADMIN} 
            element={<AdminAgentLogin userType="admin" />} 
          />
          <Route 
            path={HIDDEN_ROUTES.AGENT} 
            element={<AdminAgentLogin userType="agent" />} 
          />

          {/* Admin and Agent Panel routes (accessed after login) */}
          <Route 
            path="/AdminPanel" 
            element={<ProtectedRoute element={AdminPanel} requiredRole="admin" />} 
          />
          <Route 
            path="/AgentPanel" 
            element={<ProtectedRoute element={AgentPanel} requiredRole="agent" />} 
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;