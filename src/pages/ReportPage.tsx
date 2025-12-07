import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReport } from '../hooks/useReports';
import { SavedReport } from '../types';
import AnalysisDashboard from '../features/analysis/components/AnalysisDashboard';
import { useAuth } from '../context/AuthContext';
import { AlertOctagon, ArrowLeft } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: report, isLoading, error: queryError } = useReport(id);


  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
         {/* Title Skeleton */}
         <div className="flex justify-between items-center mb-8">
            <div>
               <Skeleton className="h-8 w-64 mb-2" />
               <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex gap-2">
               <Skeleton className="h-10 w-32" />
               <Skeleton className="h-10 w-32" />
            </div>
         </div>

         {/* Stats Grid Skeleton */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => (
               <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
         </div>

         {/* Main Content Skeleton */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-8">
               <Skeleton className="h-[400px] w-full rounded-2xl" />
               <Skeleton className="h-[200px] w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-5 space-y-6">
               <Skeleton className="h-[600px] w-full rounded-2xl" />
            </div>
         </div>
      </div>
    );
  }

  if (queryError || (!isLoading && !report)) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm border border-red-100 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-2">Report Error</h3>
        <p className="text-zinc-600 mb-8 max-w-md mx-auto">{queryError?.message || "Report not found"}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors font-medium flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <AnalysisDashboard 
      result={report} 
      imageUrl={report.imageUrl} 
      currency={user?.currency || 'PKR'}
      onReset={() => navigate('/')}
    />
  );
};

export default ReportPage;
