import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Coins, Bell, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {}

const TopBar: React.FC<TopBarProps> = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Helper for active link styles
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive 
        ? 'bg-zinc-800 text-white' 
        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
    }`;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <>
      <div className="flex items-center gap-8">
        {/* Brand */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img src="/logo.png" alt="Carscube" className="h-8 w-auto" />
          <span className="text-xl font-bold text-white tracking-tight group-hover:text-zinc-300 transition-colors">
            Carscube
          </span>
        </div>

        {/* Navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-1">
            <button onClick={() => navigate('/')} className={getLinkClass('/')}>
              Overview
            </button>
            <button onClick={() => navigate('/scan')} className={getLinkClass('/scan')}>
              Scan
            </button>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
             {/* Credits */}
             <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
                <Coins className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-300">{user.credits} Credits</span>
             </div>

             {/* Notifications */}
             <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-colors">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-black"></span>
             </button>

             {/* User Dropdown */}
             <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 hover:bg-zinc-900 p-1.5 rounded-full pr-3 transition-colors border border-transparent hover:border-zinc-800"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold border border-zinc-700">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                     <p className="text-sm font-medium text-white leading-none">{user.name}</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-zinc-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
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
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-100 text-black rounded-lg text-sm font-medium shadow-sm transition-all"
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
