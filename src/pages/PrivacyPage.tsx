import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-50 p-6 md:p-12 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-surface-200 p-8 md:p-12">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-surface-100 pb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-surface-400 hover:text-surface-900 hover:bg-surface-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
             <div className="flex items-center gap-2 text-brand-600 mb-1">
                <Shield className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Privacy</span>
             </div>
             <h1 className="text-3xl font-bold text-surface-900">Privacy Policy</h1>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-zinc max-w-none text-surface-600">
          <p className="lead">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
             <li>Account information (name, email, profile picture) from Google Sign-In.</li>
             <li>Images of vehicles uploaded for analysis.</li>
             <li>Usage data and interactions with the Service.</li>
          </ul>

          <h3>2. How We Use Information</h3>
          <p>Your data is used to:</p>
          <ul>
             <li>Provide and maintain the Service.</li>
             <li>Generate damage assessment reports.</li>
             <li>Improve our AI algorithms (using anonymized visuals).</li>
             <li>Communicate with you regarding your account.</li>
          </ul>

          <h3>3. Data Storage & Security</h3>
          <p>We use industry-standard encryption and security measures to protect your data. Images and reports are stored securely via Firebase Storage and Firestore.</p>

          <h3>4. Third-Party Services</h3>
          <p>We use Google Firebase for authentication and database services. Their use of your data is governed by their respective privacy policies.</p>

          <h3>5. Contact Us</h3>
          <p>If you have questions about this Privacy Policy, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
