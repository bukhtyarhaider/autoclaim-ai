import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../services/storageService';
import { SavedReport } from '../types';
import { formatCurrency } from '../utils/currencyUtils';
import { Calendar, Car, ArrowRight, Shield, TrendingUp, Zap, Plus, Search, Cuboid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Onboarding from '../features/onboarding/components/Onboarding';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      if (user) {
        const data = await reportService.getUserReports(user.id);
        setReports(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      }
    };
    fetchReports();
  }, [user]);

  const filteredReports = reports.filter(r => 
    r.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id?.includes(searchTerm)
  );

  const stats = [
    { label: 'Total Scans', value: reports.length.toString(), icon: Cuboid },
    { label: 'Credit Balance', value: user?.credits.toString() || '0', icon: Zap },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header section with Greeting and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500">
            Overview
          </h1>
          <p className="text-zinc-500 mt-1">Manage your fleet and assessments.</p>
        </div>
        
        <div className="relative w-full md:w-auto group">
           <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 transition-colors" />
           <input 
             type="text" 
             placeholder="Search report ID..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm w-full md:w-64 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
           />
        </div>
      </div>

      {/* Main Grid Layout (Bento Grid) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* 1. Hero Action Cube (Span 2 cols, 2 rows on large) */}
        <button 
          onClick={() => navigate('/scan')}
          className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 rounded-2xl bg-black text-white p-8 flex flex-col justify-between group hover:shadow-2xl hover:shadow-zinc-500/20 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/30 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-zinc-700/30 transition-colors"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold max-w-xs leading-tight">Start New Assessment</h2>
            <p className="text-zinc-400 mt-2 max-w-xs">Upload images to get instant AI damage analysis.</p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm font-medium mt-8 group-hover:translate-x-1 transition-transform">
             <span>Launch Scanner</span>
             <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* 2. Stats Cubes */}
        {stats.map((stat, i) => (
          <div key={i} className="col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between hover:border-black transition-colors group">
             <div className="flex justify-between items-start">
               <span className="text-zinc-500 text-sm font-medium">{stat.label}</span>
               <stat.icon className="w-5 h-5 md:w-8 md:h-8 text-zinc-300 group-hover:text-black transition-colors" />
             </div>
             <div className="mt-4">
               <span className="text-3xl font-bold text-zinc-900">{stat.value}</span>
             </div>
          </div>
        ))}

        {/* 3. Recent History Cubes (Fill remaining grid) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 mt-4">
           <h3 className="font-bold text-lg text-zinc-900 mb-4 flex items-center gap-2">
             <Cuboid className="w-5 h-5" />
             Recent Assessments
           </h3>
           
           {filteredReports.length === 0 ? (
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-12 text-center border-dashed">
                 <p className="text-zinc-400">No assessments found.</p>
              </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredReports.map((report) => (
                  <div 
                    key={report.id} 
                    onClick={() => navigate('/scan', { state: { report } })}
                    className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-xl transition-all cursor-pointer flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
                       <img src={report.imageUrl} alt={report.vehicleType} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md">
                         {formatCurrency(report.totalEstimatedCost)}
                       </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-zinc-900 truncate">{report.vehicleType}</h4>
                          {/* <span className="text-xs text-zinc-400 font-mono">#{report.id.slice(0,4)}</span> */}
                       </div>
                       
                       <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4 mt-auto">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(report.timestamp).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {report.damages.length} issues</span>
                       </div>

                       <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-sm group-hover:text-black transition-colors">
                          <span className="font-medium text-zinc-500 group-hover:text-black">View Details</span>
                          <ArrowRight className="w-4 h-4 -ml-2 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all text-black" />
                       </div>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>

      </div>

      {/* Mandatory Onboarding Overlay */}
      {user && !user.hasCompletedOnboarding && (
        <Onboarding user={user} onComplete={() => {}} />
      )}
    </div>
  );
};

export default DashboardPage;
