import React from 'react';
import { Printer, Download, ArrowLeft, Loader2 } from 'lucide-react';

interface AnalysisHeaderProps {
  onReset: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
}

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  onReset,
  onPrint,
  onDownloadPdf,
  isGeneratingPdf
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 no-print">
      <button 
        onClick={onReset}
        className="flex items-center text-surface-500 hover:text-surface-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Upload
      </button>
      <div className="flex space-x-3">
        <button 
          onClick={onPrint}
          className="flex items-center justify-center px-4 py-2 border border-surface-300 shadow-sm text-sm font-medium rounded-md text-surface-700 bg-white hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Report
        </button>
        <button 
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className={`flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${isGeneratingPdf ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AnalysisHeader;
