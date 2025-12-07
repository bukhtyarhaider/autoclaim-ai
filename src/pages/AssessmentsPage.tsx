import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../hooks/useReports';
import { useUI } from '../context/UIContext';
import {
  Calendar, Shield, Search, ArrowLeft, Plus, Filter, ArrowRight
} from 'lucide-react';
import { formatCurrency } from '../utils/currencyUtils';

const AssessmentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openScanModal } = useUI();
  const { data: reports = [], isLoading } = useReports(user?.id);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(r =>
    r.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
           <button 
             onClick={() => navigate('/')}
             className="flex items-center gap-2 text-zinc-500 hover:text-black mb-4 transition-colors"
           >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
           </button>
           <h1 className="text-3xl font-bold text-zinc-900">All Assessments</h1>
           <p className="text-zinc-500 mt-1">View and manage your vehicle reports.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <div className="relative group flex-1 sm:w-64">
             <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-800 transition-colors" />
             <input 
               type="text" 
               placeholder="Search..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
             />
           </div>
           
           <button 
             onClick={openScanModal}
             className="px-4 py-2 bg-black text-white rounded-xl shadow-lg shadow-black/20 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 font-medium whitespace-nowrap"
           >
             <Plus className="w-4 h-4" />
             <span>New Scan</span>
           </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-20 text-center">
           <div className="w-8 h-8 mx-auto border-2 border-zinc-200 border-t-black rounded-full animate-spin"></div>
           <p className="text-zinc-500 mt-4">Loading reports...</p>
        </div>
      ) : filteredReports.length === 0 ? (
         <div className="bg-zinc-50 border border-zinc-200 dashed rounded-2xl p-12 text-center">
            <p className="text-zinc-500">No assessments found matching your criteria.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {filteredReports.map((report) => (
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
  );
};

export default AssessmentsPage;
