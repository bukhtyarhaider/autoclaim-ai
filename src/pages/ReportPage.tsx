import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportService } from '../services/storageService';
import { SavedReport } from '../types';
import AnalysisDashboard from '../features/analysis/components/AnalysisDashboard';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertOctagon, ArrowLeft } from 'lucide-react';

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState<SavedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      
      try {
        const data = await reportService.getReportById(id);
        if (data) {
          setReport(data);
        } else {
          setError("Report not found");
        }
      } catch (err) {
        setError("Failed to load report");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-black animate-spin mb-4" />
        <p className="text-zinc-500">Loading Report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm border border-red-100 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-2">Report Error</h3>
        <p className="text-zinc-600 mb-8 max-w-md mx-auto">{error || "Report not found"}</p>
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
