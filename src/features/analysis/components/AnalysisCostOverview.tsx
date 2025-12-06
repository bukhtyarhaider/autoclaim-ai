import React from 'react';
import { AssessmentResult, Severity, Currency } from '../../../types';
import { formatCurrency } from '../../../utils/currencyUtils';

interface AnalysisCostOverviewProps {
  result: AssessmentResult;
  currency: Currency;
}

const AnalysisCostOverview: React.FC<AnalysisCostOverviewProps> = ({ result, currency }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
      <div className="bg-surface-50 p-6 border-b border-surface-200">
        <span className="text-surface-500 text-sm font-medium uppercase tracking-wider">Total Estimated Repair Cost</span>
        <div className="flex items-baseline mt-1 gap-2">
          <span className="text-4xl font-bold text-surface-900">
            {formatCurrency(result.totalEstimatedCost)}
          </span>
          <span className="text-sm text-surface-500">{currency}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-semibold text-surface-800">Identified Damages ({result.damages.length})</h3>
           <span className="text-xs bg-slate-100 text-surface-600 px-2 py-1 rounded border border-surface-200">{result.vehicleType}</span>
        </div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {result.damages.map((damage) => (
            <div key={damage.id} className="flex justify-between items-start p-3 rounded-lg bg-surface-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-surface-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-surface-900 text-sm">{damage.type}</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                    damage.severity === Severity.LOW ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    damage.severity === Severity.MEDIUM ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {damage.severity}
                  </span>
                </div>
                <p className="text-xs text-surface-500 mt-1 line-clamp-1">{damage.description}</p>
                {damage.repairCosts && (
                  <div className="mt-2 text-xs bg-white p-2 rounded border border-surface-200">
                    <div className="flex justify-between text-surface-600 mb-1">
                       <span>Labor:</span>
                       <span>{formatCurrency(damage.repairCosts.labor)}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-surface-700 text-[10px] uppercase">Parts Options:</p>
                      {damage.repairCosts.parts.map((part, idx) => (
                        <div key={idx} className="flex justify-between text-surface-500 pl-2">
                          <span>{part.type === 'Used' ? 'Used/Kabli' : part.type}</span>
                          <span>{formatCurrency(part.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="font-semibold text-surface-700 text-sm">{formatCurrency(damage.estimatedCost)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisCostOverview;
