import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-surface-500" />
      </div>
      
      <h1 className="text-4xl font-bold text-surface-900 mb-2">Page Not Found</h1>
      <p className="text-surface-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-all shadow-sm active:transform active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;
