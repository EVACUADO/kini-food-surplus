import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/demo" 
            element={
              <div className="p-8 space-y-8">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-8">Brand Title Demo</h1>
                  
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-4">Header Variant (with Marketplace)</h3>
                      <div>
                        <div className="text-xl font-bold text-[#469b47]">
                          Kini Food Surplus
                        </div>
                        <div className="text-sm font-normal text-[#469b47] opacity-80">
                          Marketplace
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-4">Form Variant (without Marketplace)</h3>
                      <span className="text-xl font-bold text-[#469b47]">
                        Kini Food Surplus
                      </span>
                    </div>
                    
                    <div className="bg-green-600 p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold mb-4 text-white">Header on Dark Background</h3>
                      <div>
                        <div className="text-xl font-bold text-white">
                          Kini Food Surplus
                        </div>
                        <div className="text-sm font-normal text-white opacity-80">
                          Marketplace
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;