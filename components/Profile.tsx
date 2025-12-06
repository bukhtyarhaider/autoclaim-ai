import React, { useState } from 'react';
import { UserProfile, Currency } from '../types';
import { authService } from '../services/storageService';
import { User, Building, Mail, CreditCard, Save, Check } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState(user);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateProfile(formData);
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Profile Settings</h2>
        <p className="text-slate-500 mt-1">Manage your account information and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-8 border-b border-slate-200 flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
            <p className="text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Company Name (Optional)</label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  placeholder="Insurance Co."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Currency</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <select
                  value={formData.currency}
                  onChange={e => setFormData({...formData, currency: e.target.value as Currency})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                >
                  <option value="PKR">PKR (Pakistani Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-1">Default reporting currency.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Available Credits</label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 h-5 w-5 flex items-center justify-center">
                  <span className="text-amber-500 font-bold text-lg">©</span>
                </div>
                <input
                  type="text"
                  value={`${user.credits} Credits`}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-amber-50/50 text-amber-900 font-bold rounded-lg cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Contact support to purchase more.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className={`flex items-center px-6 py-2.5 rounded-lg font-medium shadow-md transition-all ${
              isSaved 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved Successfully
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
