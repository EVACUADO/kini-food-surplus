import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UnifiedAuth from './components/UnifiedAuth';
import CustomerDashboard from './components/CustomerDashboard';
import MerchantDashboard from './components/MerchantDashboard';
import AdminDashboard from './components/AdminDashboard';
import AgentPanel from './components/AgentPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<UnifiedAuth />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/agent/panel" element={<AgentPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
