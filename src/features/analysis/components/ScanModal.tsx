import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import { geminiService } from '../../../services/geminiService';
import { authService } from '../../../services/storageService';
import { useSaveReport } from '../../../hooks/useReports';
import { SavedReport, UploadedImage } from '../../../types';
import { compressImage } from '../../../utils/imageUtils';
import { AlertOctagon } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/ui/Modal';
import BrandLoader from '../../../components/common/BrandLoader';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const saveReportMutation = useSaveReport();
  
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (file: File, base64: string) => {
    if (user && user.credits <= 0) {
      setError("You don't have enough credits for this assessment.");
      return;
    }

    try {
      setIsLoading(true);
      setLoadingText("Compressing Image...");
      
      // Compress image before doing anything else
      // This solves the Firestore 1MB limit issue and optimizes API usage
      const compressedBase64 = await compressImage(file);
      
      setCurrentImage({
        id: Math.random().toString(36).substr(2, 9),
        file,
        base64: compressedBase64, // Use compressed version
        previewUrl: compressedBase64
      });
      setError(null);

      // Simulation steps
      setLoadingText("Encrypting & Uploading...");
      setTimeout(() => setLoadingText("Analyzing Vehicle Geometry..."), 1500);
      setTimeout(() => setLoadingText("Detecting Damage Patterns..."), 3500);
      setTimeout(() => setLoadingText("Calculating Regional Repair Costs..."), 5500);
      setTimeout(() => setLoadingText("Finalizing Assessment..."), 7500);

      // Deduct Credit within flow
      if (user) {
        const success = await authService.deductCredit(user.id);
        if (success) {
          updateUser({ ...user, credits: user.credits - 1 });
        } else {
           setError("Insufficient credits.");
           setIsLoading(false);
           setCurrentImage(null);
           return;
        }
      }

      const data = await geminiService.processImage(compressedBase64);
      
      if (user) {
        const reportToSave: SavedReport = {
          ...data,
          imageUrl: compressedBase64, // Save the compressed string
          userId: user.id
        };
        const newReportId = await saveReportMutation.mutateAsync(reportToSave);
        
        onClose(); // Close modal
        setCurrentImage(null); // Reset
        navigate(`/report/${newReportId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      console.error("Scanning error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setError(null);
    // Don't close, just reset form
  };

  // If loading, show overlay content inside modal
  const renderContent = () => {
    if (isLoading) {
      return <BrandLoader statusText={loadingText} />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertOctagon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">Analysis Failed</h3>
          <p className="text-zinc-600 mb-8 max-w-md">{error}</p>
          <button 
            onClick={handleReset}
            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl mb-4 shadow-lg shadow-black/20">
             <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
               <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
               <polyline points="14 2 14 8 20 8" />
               <line x1="12" y1="18" x2="12" y2="12" />
               <line x1="9" y1="15" x2="15" y2="15" />
             </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">New Assessment</h2>
          <p className="text-zinc-500">
            Upload a photo to instantly analyze damage.
          </p>
        </div>
        
        <div className="bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-black/20 transition-colors">
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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      disableClickOutside={isLoading} // Disable closing while loading
    >
      {renderContent()}
    </Modal>
  );
};

export default ScanModal;
