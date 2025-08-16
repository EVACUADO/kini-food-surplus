import React from 'react';
import { Link } from 'react-router-dom';

interface AppHeaderProps {
  title: string;
  showBackToMain?: boolean;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBackToMain = false,
  className = ""
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {showBackToMain ? (
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8">
            <img
              src="/Kini white logo.png"
              alt="Kini Logo"
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
          <span className="text-xl font-bold text-[#469b47]">
            Kini Food Surplus
          </span>
        </Link>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8">
            <img
              src="/Kini white logo.png"
              alt="Kini Logo"
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
          <span className="text-xl font-bold text-[#469b47]">
            Kini Food Surplus
          </span>
        </div>
      )}
      <span className="text-gray-400">|</span>
      <span className="text-gray-600 font-medium">{title}</span>
    </div>
  );
};

export default AppHeader;