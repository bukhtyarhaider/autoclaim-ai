
import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, LogOut, LayoutDashboard, History, Settings, Coins, ShieldCheck, CarFront } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  onNavigate: (view: 'home' | 'profile' | 'history') => void;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLogout, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 no-print transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
              <CarFront className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">AutoClaim AI</h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Professional Assessment</p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
              <span>Secure & Encrypted</span>
            </div>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center justify-end gap-1.5 mb-0.5">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-full border border-amber-100">
                        <Coins className="w-3 h-3 text-amber-500" />
                        <span className="text-xs font-bold text-amber-700">{user.credits}</span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.companyName || 'Individual'}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-md border-2 border-white ring-1 ring-slate-100">
                    <span className="font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div 
                    className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setIsMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Account</p>
                    </div>
                    
                    <button 
                      onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profile & Currency
                    </button>
                    
                    <button 
                      onClick={() => { onNavigate('history'); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center transition-colors"
                    >
                      <History className="w-4 h-4 mr-3" />
                      Assessment History
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>
                    
                    <button 
                      onClick={() => { onLogout(); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="flex items-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
