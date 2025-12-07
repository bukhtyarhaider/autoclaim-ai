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
    <div className="w-full h-full">
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-96 transition-all duration-200 ease-in-out cursor-pointer group
          ${dragActive ? 'bg-zinc-100' : 'bg-white hover:bg-zinc-50'}
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
        
        <div className="flex flex-col items-center justify-center p-8 text-center px-4">
          <div className="mb-6 p-6 rounded-2xl bg-zinc-50 border border-zinc-200 group-hover:border-black group-hover:scale-110 transition-all duration-300">
            <UploadCloud className="w-12 h-12 text-black" />
          </div>
          <p className="mb-2 text-xl font-bold text-zinc-900">
            Click to upload or drag and drop
          </p>
          <p className="text-zinc-500 max-w-sm">
            Upload high-quality photos (JPEG, PNG). Max 10MB.
          </p>
          
          <div className="mt-8 px-6 py-2 bg-black text-white text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Select Photo
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default ImageUploader;