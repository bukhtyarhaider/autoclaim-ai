import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../features/analysis/components/ImageUploader';
import { geminiService } from '../services/geminiService';
import { authService, reportService } from '../services/storageService';
import { SavedReport, UploadedImage } from '../types';
import { Loader2, AlertOctagon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ScanPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect removed - logic moved to ReportPage

  const handleImageSelected = async (file: File, base64: string) => {
    if (user && user.credits <= 0) {
      setError("You have 0 credits remaining. Please contact support to top up.");
      return;
    }

    setCurrentImage({
      id: Math.random().toString(36).substr(2, 9),
      file,
      base64,
      previewUrl: base64
    });
    // setResult(null); // Removed
    setError(null);
    setIsLoading(true);

    // Deduct Credit
    // Deduct Credit
    if (user) {
      const success = await authService.deductCredit(user.id);
      if (success) {
        // Optimistic update - though AuthContext handles real updates via snapshot
        updateUser({ ...user, credits: user.credits - 1 });
      } else {
         setError("Insufficient credits.");
         setIsLoading(false);
         return;
      }
    }

    try {
      const data = await geminiService.processImage(base64);
      // setResult(data); // No longer setting local state
      
      if (user) {
        const reportToSave: SavedReport = {
          ...data,
          imageUrl: base64,
          userId: user.id
        };
        const newReportId = await reportService.saveReport(reportToSave);
        navigate(`/report/${newReportId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setError(null);
    // navigate('/scan', { replace: true, state: {} }); // Not needed, we are already here
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-2xl shadow-sm border border-surface-200">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-brand-600 animate-pulse" />
          </div>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-surface-900">Analyzing Vehicle...</h3>
        <p className="text-surface-500 mt-2 animate-pulse">Our AI is inspecting damages and calculating costs.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm border border-red-100 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-surface-900 mb-2">Analysis Failed</h3>
        <p className="text-surface-600 mb-8 max-w-md mx-auto">{error}</p>
        <button 
          onClick={handleReset}
          className="px-6 py-2.5 bg-surface-900 text-white rounded-lg hover:bg-surface-800 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }



  return (
    <div className="max-w-3xl mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)]">
      <div className="text-center mb-10">
         <div className="inline-block p-4 mb-6 bg-black text-white rounded-2xl shadow-xl">
            <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
         </div>
        <h2 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Upload Vehicle Image</h2>
        <p className="text-zinc-500 text-lg max-w-xl mx-auto">
          Drop a photo here to instantly analyze damage and estimate repair costs.
        </p>
      </div>
      
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-black overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
         <ImageUploader 
           onImageSelected={handleImageSelected} 
           isLoading={false} 
           isAuthenticated={true}
           onRequireLogin={() => {}} 
         />
      </div>
    </div>
  );
};

export default ScanPage;
