import React from 'react';
import { AssessmentResult, Severity, Currency } from '../../../types';
import { formatCurrency } from '../../../utils/currencyUtils';
import { Wrench, Tag, AlertCircle, Info } from 'lucide-react';

interface AnalysisCostOverviewProps {
  result: AssessmentResult;
  currency: Currency;
}

const AnalysisCostOverview: React.FC<AnalysisCostOverviewProps> = ({ result, currency }) => {
  
  // Calculate totals for breakdown if available, otherwise just use totalEstimatedCost
  const hasDetailedCosts = result.damages.some(d => d.repairCosts);
  
  // Helper to get color by severity
  const getSeverityColor = (severity: Severity) => {
    switch(severity) {
      case Severity.LOW: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case Severity.MEDIUM: return 'bg-orange-50 text-orange-700 border-orange-200';
      case Severity.HIGH: return 'bg-red-50 text-red-700 border-red-200';
      case Severity.CRITICAL: return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-surface-200 bg-surface-50/50 flex justify-between items-center">
        <h3 className="font-bold text-surface-900 text-lg">Cost Estimate Breakdown</h3>
        <div className="text-right">
           <p className="text-xs text-surface-500 uppercase tracking-widest font-semibold mb-1">Grand Total</p>
           <p className="text-2xl font-bold text-brand-600 leading-none">{formatCurrency(result.totalEstimatedCost)}</p>
        </div>
      </div>

      {/* Warning/Disclaimer */}
      <div className="px-6 py-3 bg-brand-50/50 border-b border-brand-100 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-brand-800 leading-relaxed">
          This estimate is based on visual analysis. Actual repair costs may vary depending on hidden damages, local labor rates ({currency}), and parts availability.
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
        {result.damages.map((damage, index) => (
          <div key={damage.id} className="group border border-surface-200 rounded-xl p-4 hover:border-brand-200 hover:shadow-sm transition-all bg-white">
            {/* Item Header */}
            <div className="flex justify-between items-start mb-3">
               <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-100 text-surface-500 text-xs font-bold font-mono">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-surface-900 text-sm">{damage.type}</h4>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getSeverityColor(damage.severity)}`}>
                      {damage.severity} Severity
                    </span>
                  </div>
               </div>
               <span className="font-bold text-surface-900">{formatCurrency(damage.estimatedCost)}</span>
            </div>

            {/* Description */}
            <p className="text-xs text-surface-500 ml-9 mb-3 leading-relaxed">{damage.description}</p>

            {/* Detailed Cost Breakdown if available */}
            {damage.repairCosts && (
              <div className="ml-9 bg-surface-50 rounded-lg p-3 border border-surface-100 text-xs">
                 {/* Labor */}
                 <div className="flex justify-between items-center mb-2 pb-2 border-b border-surface-200 border-dashed">
                    <div className="flex items-center gap-2 text-surface-600">
                      <Wrench className="w-3 h-3" />
                      <span>Est. Labor</span>
                    </div>
                    <span className="font-mono text-surface-700">{formatCurrency(damage.repairCosts.labor)}</span>
                 </div>

                 {/* Parts Options */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-surface-600 mb-1">
                      <Tag className="w-3 h-3" />
                      <span>Parts Options:</span>
                    </div>
                    {damage.repairCosts.parts.map((part, pIdx) => (
                      <div key={pIdx} className="flex justify-between items-center pl-5 relative">
                        <div className="absolute left-1 top-1/2 w-2 h-px bg-surface-300"></div>
                        <span className={`px-1.5 rounded ${part.price === damage.repairCosts?.bestOptionTotal ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-surface-500'}`}>
                           {part.type === 'Used' ? 'Used / Kabli' : part.type}
                        </span>
                        <span className="font-mono text-surface-600">{formatCurrency(part.price)}</span>
                      </div>
                    ))}
                  </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer Actions or Info can go here */}
      <div className="p-4 border-t border-surface-100 bg-surface-50 text-center text-xs text-surface-400">
         Values estimated in {currency}. Prices are subject to market change.
      </div>
    </div>
  );
};

export default AnalysisCostOverview;
