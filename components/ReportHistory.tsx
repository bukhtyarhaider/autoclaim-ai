import React, { useEffect, useState } from 'react';
import { reportService } from '../services/storageService';
import { SavedReport, UserProfile } from '../types';
import { formatCurrency } from '../utils/currencyUtils';
import { Calendar, Car, AlertTriangle, ArrowRight, FileText, Search } from 'lucide-react';

interface ReportHistoryProps {
  user: UserProfile;
  onViewReport: (report: SavedReport) => void;
}

const ReportHistory: React.FC<ReportHistoryProps> = ({ user, onViewReport }) => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const data = reportService.getUserReports(user.id);
    // Sort by newest
    setReports(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, [user.id]);

  const filteredReports = reports.filter(r => 
    r.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id?.includes(searchTerm)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Assessment History</h2>
          <p className="text-slate-500 mt-1">View and manage your past vehicle damage reports.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search vehicle type or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64 outline-none"
          />
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No Reports Found</h3>
          <p className="text-slate-500 mt-2">You haven't generated any damage assessment reports yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div 
              key={report.id} 
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col"
            >
              {/* Image Preview */}
              <div className="h-40 w-full bg-slate-100 relative overflow-hidden">
                <img 
                  src={report.imageUrl} 
                  alt={report.vehicleType} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm">
                  {(report.confidenceScore * 100).toFixed(0)}% Conf.
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Car className="w-4 h-4 text-slate-500" />
                      {report.vehicleType}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">#{report.id?.substr(-6)}</span>
                </div>

                <div className="space-y-3 mb-4 flex-1">
                  <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                    <span className="text-slate-500">Damages Found</span>
                    <span className="font-medium text-slate-900">{report.damages.length}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                    <span className="text-slate-500">Total Estimate</span>
                    <span className="font-bold text-emerald-600">
                      {formatCurrency(report.totalEstimatedCost, user.currency)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => onViewReport(report)}
                  className="w-full mt-auto py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportHistory;
