import React from 'react';
import { Download, ArrowLeft, Loader2, ClipboardList } from 'lucide-react';

interface AnalysisHeaderProps {
  onDownloadPdf: () => void;
  onShowParts: () => void;
  isGeneratingPdf: boolean;
}

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  onDownloadPdf,
  onShowParts,
  isGeneratingPdf
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4 no-print">

      <div className="flex items-center gap-2 w-full md:w-auto">
        <button 
          onClick={onShowParts}
          className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 border border-surface-200 shadow-sm text-sm font-medium rounded-lg text-surface-700 bg-white hover:bg-surface-50 hover:border-surface-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-surface-200"
        >
          <ClipboardList className="w-4 h-4 mr-2 text-surface-500" />
          Parts List
        </button>
        <button 
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className={`
            flex-1 md:flex-none flex items-center justify-center px-4 py-2 shadow-sm text-sm font-medium rounded-lg text-white transition-all
            ${isGeneratingPdf 
              ? 'bg-surface-400 cursor-not-allowed opacity-75' 
              : 'bg-brand-600 hover:bg-brand-700 active:transform active:scale-95 focus:ring-2 focus:ring-offset-1 focus:ring-brand-500'
            }
          `}
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              <span>Export PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AnalysisHeader;
