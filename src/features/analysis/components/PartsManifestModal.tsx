import React from 'react';
import { X, Wrench, AlertTriangle, FileText } from 'lucide-react';
import { AssessmentResult, Currency } from '../../../types';
import { formatCurrency } from '../../../utils/currencyUtils';

interface PartsManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AssessmentResult;
  currency: Currency;
}

const PartsManifestModal: React.FC<PartsManifestModalProps> = ({ isOpen, onClose, result, currency }) => {
  if (!isOpen) return null;

  // Filter damages that actually have parts identified
  const partsNeeded = result.damages.filter(d => 
    d.repairCosts && d.repairCosts.parts && d.repairCosts.parts.length > 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-surface-200 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-surface-200 flex justify-between items-center bg-surface-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900">Parts Manifest</h2>
              <p className="text-sm text-surface-500">Predicted replacement parts required for repair</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {partsNeeded.length === 0 ? (
            <div className="text-center py-12">
               <div className="w-16 h-16 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <FileText className="w-8 h-8 text-surface-400" />
               </div>
               <h3 className="text-lg font-semibold text-surface-900">No Parts Identified</h3>
               <p className="text-surface-500 mt-2 max-w-md mx-auto">
                 The analysis primarily identified repairs that may not require part replacements (e.g. Dent Repair, Paint). 
                 Labor costs are still applicable.
               </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-surface-200">
              <table className="min-w-full divide-y divide-surface-200">
                <thead className="bg-surface-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                      Required Item / Part
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                      Associated Damage
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                      Available Options
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-surface-200">
                  {partsNeeded.map((damage) => (
                    <tr key={damage.id} className="hover:bg-surface-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <div className="text-sm font-bold text-surface-900 group flex items-center gap-2">
                           {damage.requiredPart || damage.type}
                           {!damage.requiredPart && <span className="text-[10px] text-surface-400 font-normal border border-surface-200 px-1 rounded">Generic</span>}
                        </div>
                        <div className="text-xs text-surface-500 mt-1 line-clamp-2 w-64" title={damage.description}>
                          {damage.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${damage.severity === 'Low' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                            damage.severity === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                          {damage.severity} Severity
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top">
                         <div className="space-y-2">
                           {damage.repairCosts?.parts.map((part, idx) => (
                             <div key={idx} className="flex items-center justify-between text-sm p-2 rounded border border-surface-100 bg-surface-50">
                               <span className="font-medium text-surface-700">
                                 {part.type === 'Used' ? 'Used / Kabli' : part.type}
                               </span>
                               <span className="font-mono text-surface-600">{formatCurrency(part.price)}</span>
                             </div>
                           ))}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl">
             <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <div className="text-sm leading-relaxed">
               <p className="font-semibold mb-1">Important Note</p>
               <p>
                 This list is generated based on visual damage analysis. Internal components (radiator, condenser, suspension) 
                 may also be damaged but not visible. A physical inspection is required for a complete parts list.
               </p>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-200 bg-surface-50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-surface-300 shadow-sm text-surface-700 font-medium rounded-lg hover:bg-surface-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartsManifestModal;
