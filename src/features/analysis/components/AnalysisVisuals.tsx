import React from 'react';
import { FileText } from 'lucide-react';
import { AssessmentResult } from '../../../types';
import DamageVisualizer from './DamageVisualizer';

interface AnalysisVisualsProps {
  imageUrl: string;
  result: AssessmentResult;
  visualizerRef: React.RefObject<HTMLDivElement>;
}

const AnalysisVisuals: React.FC<AnalysisVisualsProps> = ({ imageUrl, result, visualizerRef }) => {
  return (
    <div className="space-y-6 print-break-inside">
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-1">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-surface-800">Damage Localization</h2>
        </div>
        {/* Added ref to wrapper for HTML2Canvas capture */}
        <div className="p-4" ref={visualizerRef}>
          <DamageVisualizer imageUrl={imageUrl} damages={result.damages} />
        </div>
      </div>

      {/* AI Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
        <div className="flex items-center gap-2 mb-4">
           <div className="p-2 bg-brand-100 rounded-lg">
             <FileText className="w-5 h-5 text-brand-600" />
           </div>
           <h3 className="text-lg font-semibold text-surface-800">AI Assessment Summary</h3>
        </div>
        <p className="text-surface-600 leading-relaxed text-sm">
          {result.summary}
        </p>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
          <span className="text-surface-500">AI Confidence Score:</span>
          <div className="flex items-center gap-2">
             <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
               <div 
                className="h-full bg-emerald-500" 
                style={{ width: `${result.confidenceScore * 100}%` }}
               />
             </div>
             <span className="font-semibold text-emerald-600">{(result.confidenceScore * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisVisuals;
