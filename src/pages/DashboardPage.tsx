import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../services/storageService';
import { SavedReport } from '../types';
import { formatCurrency } from '../utils/currencyUtils';
import { Calendar, Car, ArrowRight, FileText, Search, Shield, TrendingUp, Zap, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      const data = reportService.getUserReports(user.id);
      setReports(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }
  }, [user]);

  const filteredReports = reports.filter(r => 
    r.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id?.includes(searchTerm)
  );

  const stats = [
    { label: 'Total Reports', value: reports.length.toString(), icon: Shield, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Recent Value', value: reports.length > 0 ? formatCurrency(reports[0].totalEstimatedCost) : '0', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Credits Left', value: user?.credits.toString() || '0', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Overview
          </h1>
          <p className="text-surface-500 mt-1">Welcome back, here's your activity summary.</p>
        </div>
        <button 
            onClick={() => navigate('/scan')}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Assessment
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-surface-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-surface-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-surface-900 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          ))}
      </div>

      {/* Main Content: History List with Search */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-surface-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h3 className="font-bold text-lg text-surface-900">Assessment History</h3>
           <div className="relative">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-surface-400" />
             <input 
               type="text" 
               placeholder="Search vehicle or ID..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 pr-4 py-2 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 w-full sm:w-64 outline-none transition-all"
             />
           </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900">No Reports Found</h3>
            <p className="text-surface-500 mt-2">
              {searchTerm ? "No reports match your search." : "You haven't generated any damage assessments yet."}
            </p>
            {!searchTerm && (
               <button onClick={() => navigate('/scan')} className="text-brand-600 font-medium hover:underline mt-4">Start your first scan</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-surface-100">
             {filteredReports.map((report) => (
               <div key={report.id} className="p-4 sm:p-6 hover:bg-surface-50 transition-colors group flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-24 h-48 sm:h-24 bg-surface-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={report.imageUrl} alt={report.vehicleType} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0 w-full">
                     <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-surface-900 text-lg truncate">{report.vehicleType}</h4>
                        <span className="text-xs font-mono text-surface-400 bg-surface-100 px-2 py-0.5 rounded">#{report.id}</span>
                     </div>
                     <div className="flex items-center gap-4 text-sm text-surface-500 mb-2">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(report.timestamp).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" /> {report.damages.length} Damages</span>
                     </div>
                     <p className="text-sm text-surface-600 line-clamp-1">{report.summary}</p>
                  </div>

                  <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2">
                     <span className="text-lg font-bold text-brand-600 block">{formatCurrency(report.totalEstimatedCost)}</span>
                     <button 
                        onClick={() => navigate('/scan', { state: { report } })}
                        className="text-sm font-medium text-surface-600 hover:text-brand-600 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-surface-200"
                     >
                        View Report <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
