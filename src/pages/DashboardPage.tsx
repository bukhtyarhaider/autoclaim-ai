import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../hooks/useReports';
import { useUI } from '../context/UIContext';


import {
  Calendar, ArrowRight, Shield, Zap, Plus, Search, Cuboid
} from 'lucide-react';
import { formatCurrency } from '../utils/currencyUtils';
import Onboarding from '../features/onboarding/components/Onboarding';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const { openScanModal } = useUI();
  const { data: reports = [], isLoading: isLoadingReports } = useReports(user?.id);
  const [searchTerm, setSearchTerm] = useState('');



  const filteredReports = reports.filter(r =>
    r.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id?.includes(searchTerm)
  );

  const displayedReports = filteredReports.slice(0, 3);
  const showSeeAll = filteredReports.length > 3;


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
        
        <button 
          onClick={openScanModal}
          className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 rounded-3xl bg-black text-white p-8 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden ring-1 ring-zinc-800 shadow-2xl"
        >

          {/* Cubic Grind/Pattern Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
          
          {/* Half Logo - Bottom Right */}
          <div className="absolute -bottom-12 -right-12 w-64 h-64 opacity-10 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
             <img src="/logo.png" alt="" className="w-full h-full object-contain brightness-100" />
          </div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-lg shadow-white/10 group-hover:rotate-90 transition-transform duration-500">
              <Plus className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-4xl font-bold max-w-xs leading-none tracking-tight">
              Start <br/>
              <span className="text-zinc-500">Assessment</span>
            </h2>
            <p className="text-zinc-400 mt-4 max-w-xs text-lg font-light">
              AI-powered damage analysis and cost estimation.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 mt-8">
             <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-sm font-semibold group-hover:bg-white group-hover:text-black transition-colors">
               Launch Scanner
             </span>
             <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:translate-x-2 transition-transform">
               <ArrowRight className="w-4 h-4 text-white" />
             </div>
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
                {displayedReports.map((report) => (
                  <div 
                    key={report.id} 
                    onClick={() => navigate(`/report/${report.id}`)}
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
                
                {/* See All Card */}
                {showSeeAll && (
                  <button
                    onClick={() => navigate('/assessments')} 
                    className="group bg-zinc-50 border border-zinc-200 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-zinc-100 hover:border-zinc-300 transition-all text-center"
                  >
                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-black transition-colors" />
                     </div>
                     <span className="font-bold text-zinc-900">View All Assessments</span>
                     <span className="text-sm text-zinc-500 mt-1">{filteredReports.length - 3} more reports</span>
                  </button>
                )}
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
