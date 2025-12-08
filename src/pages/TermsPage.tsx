import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';

const TermsPage: React.FC = () => {
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
                <Scale className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Legal</span>
             </div>
             <h1 className="text-3xl font-bold text-surface-900">Terms of Service</h1>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-zinc max-w-none text-surface-600">
          <p className="lead">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using Carscube ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h3>2. AI Analysis Disclaimer</h3>
          <p>The Service utilizes artificial intelligence to estimate vehicle damage costs. These estimates are generated automatically and <strong>do not constitute a guaranteed repair quote</strong>. You acknowledge that:</p>
          <ul>
             <li>Results may vary based on image quality and lighting.</li>
             <li>Hidden damages cannot be detected by visual analysis.</li>
             <li>Final repair costs must be verified by a certified professional.</li>
          </ul>

          <h3>3. User Accounts</h3>
          <p>You are responsible for maintaining the security of your account credentials. The Service is intended for authorized use only.</p>

          <h3>4. Data Usage</h3>
          <p>Images uploaded to the Service are processed for damage analysis. We may use anonymized data to improve our machine learning models, as detailed in our Privacy Policy.</p>

          <h3>5. Limitation of Liability</h3>
          <p>Carscube shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the Service.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
