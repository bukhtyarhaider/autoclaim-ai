import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, User, LogOut, ShieldCheck, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/scan', label: 'New Assessment', icon: UploadCloud },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <aside className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-slate-300 transition-all duration-300 z-50">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <ShieldCheck className="w-6 h-6 text-brand-500" />
          <span>AutoClaim<span className="text-brand-500">.ai</span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'
                }`}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section / Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        {user ? (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800 border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default Sidebar;
