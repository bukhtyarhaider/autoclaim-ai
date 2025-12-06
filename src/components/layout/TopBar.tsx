import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Coins, Bell, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getTitle = () => {
    switch(location.pathname) {
      case '/': return 'Overview';
      case '/scan': return 'New Assessment';
      case '/profile': return 'Profile';
      default: return 'Overview';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-surface-500 hover:bg-surface-100 rounded-lg md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-surface-800 tracking-tight">{getTitle()}</h2>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
             {/* Credits */}
             <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">{user.credits} Credits</span>
             </div>

             {/* Notifications */}
             <button className="relative p-2 text-surface-500 hover:bg-surface-100 rounded-full transition-colors">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>

             {/* User Dropdown */}
             <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 hover:bg-surface-50 p-1.5 rounded-full pr-3 transition-colors border border-transparent hover:border-surface-200"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border border-brand-200">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                     <p className="text-sm font-medium text-surface-700 leading-none">{user.name}</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-surface-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-4 py-2 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                )}
             </div>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all"
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </>
  );
};

export default TopBar;
