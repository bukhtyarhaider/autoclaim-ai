import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File, base64: string) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  onRequireLogin: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading, isAuthenticated, onRequireLogin }) => {
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size too large. Please upload an image under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onImageSelected(file, reader.result);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (!isAuthenticated) {
      onRequireLogin();
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onButtonClick = () => {
    if (!isAuthenticated) {
      onRequireLogin();
      return;
    }
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out cursor-pointer
          ${dragActive ? 'border-blue-500 bg-brand-50' : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="mb-4 p-3 rounded-full bg-brand-100 text-brand-600">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="mb-2 text-lg font-semibold text-slate-700">
            <span className="font-bold">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-slate-500 max-w-sm">
            Upload photos of the damaged vehicle (JPEG, PNG). Our AI will analyze damages and estimate costs.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;