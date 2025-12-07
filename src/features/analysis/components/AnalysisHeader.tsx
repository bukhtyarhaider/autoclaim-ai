import React from 'react';
import { Printer, Download, ArrowLeft, Loader2, ClipboardList } from 'lucide-react';

interface AnalysisHeaderProps {
  onReset: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onShowParts: () => void;
  isGeneratingPdf: boolean;
}

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  onReset,
  onPrint,
  onDownloadPdf,
  onShowParts,
  isGeneratingPdf
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 no-print">
      <button 
        onClick={onReset}
        className="group flex items-center text-surface-500 hover:text-surface-900 transition-colors px-3 py-2 rounded-lg hover:bg-surface-100/50"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        <span className="font-medium text-sm">Back to Dashboard</span>
      </button>

      <div className="flex items-center gap-2">
        <button 
          onClick={onShowParts}
          className="flex items-center justify-center px-4 py-2 border border-surface-200 shadow-sm text-sm font-medium rounded-lg text-surface-700 bg-white hover:bg-surface-50 hover:border-surface-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-surface-200"
        >
          <ClipboardList className="w-4 h-4 mr-2 text-surface-500" />
          Parts List
        </button>

        <button 
          onClick={onPrint}
          className="flex items-center justify-center px-4 py-2 border border-surface-200 shadow-sm text-sm font-medium rounded-lg text-surface-700 bg-white hover:bg-surface-50 hover:border-surface-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-surface-200"
        >
          <Printer className="w-4 h-4 mr-2 text-surface-500" />
          Print
        </button>
        
        <button 
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className={`
            flex items-center justify-center px-4 py-2 shadow-sm text-sm font-medium rounded-lg text-white transition-all
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
