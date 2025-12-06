import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisDashboard from './components/AnalysisDashboard';
import AuthModal from './components/AuthModal';
import Profile from './components/Profile';
import ReportHistory from './components/ReportHistory';
import { geminiService } from './services/geminiService';
import { authService, reportService } from './services/storageService';
import { AssessmentResult, UploadedImage, UserProfile, SavedReport } from './types';
import { Loader2, AlertOctagon, CheckCircle, Zap, Target, BadgeDollarSign } from 'lucide-react';

type ViewState = 'home' | 'profile' | 'history' | 'dashboard';

function App() {
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auth & View State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('home');

  useEffect(() => {
    // Check for existing session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleImageSelected = async (file: File, base64: string) => {
    setCurrentImage({
      id: Math.random().toString(36).substr(2, 9),
      file,
      base64,
      previewUrl: base64
    });
    setResult(null);
    setError(null);
    setIsLoading(true);
    setCurrentView('dashboard');

    try {
      const data = await geminiService.processImage(base64);
      setResult(data);
      
      // Auto-save if logged in
      if (user) {
        const reportToSave: SavedReport = {
          ...data,
          imageUrl: base64,
          userId: user.id
        };
        reportService.saveReport(reportToSave);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setResult(null);
    setError(null);
    setCurrentView('home');
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    // If we have a result pending but weren't logged in, save it now
    if (result && currentImage) {
      const reportToSave: SavedReport = {
        ...result,
        imageUrl: currentImage.base64,
        userId: loggedInUser.id
      };
      reportService.saveReport(reportToSave);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView('home');
    handleReset();
  };

  const renderContent = () => {
    if (currentView === 'profile' && user) {
      return <Profile user={user} onUpdate={setUser} />;
    }

    if (currentView === 'history' && user) {
      return (
        <ReportHistory 
          user={user} 
          onViewReport={(report) => {
            setResult(report);
            setCurrentImage({
              id: report.id || 'history',
              file: new File([], 'history'),
              previewUrl: report.imageUrl,
              base64: report.imageUrl
            });
            setCurrentView('dashboard');
          }} 
        />
      );
    }

    if (currentView === 'dashboard') {
      if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-brand-600 animate-pulse" />
              </div>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-800">Analyzing Vehicle...</h3>
            <p className="text-surface-500 mt-2 animate-pulse">Detecting damages, calculating costs...</p>
          </div>
        );
      }

      if (error) {
        return (
          <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-sm border border-red-100 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertOctagon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 mb-2">Analysis Failed</h3>
            <p className="text-surface-600 mb-6">{error}</p>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      }

      if (result && currentImage) {
        return (
          <AnalysisDashboard 
            result={result} 
            imageUrl={currentImage.previewUrl} 
            currency={user?.currency || 'PKR'}
            onReset={handleReset}
          />
        );
      }
    }

    // Default: Home View
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-500">
        <div className="text-center mb-12">
          {!user && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-6 animate-bounce">
              <CheckCircle className="w-4 h-4" />
              Now available in Pakistan (PKR)
            </div>
          )}
          <h2 className="text-4xl md:text-5xl font-bold text-surface-900 mb-6 tracking-tight">
            AI-Powered Vehicle<br />Damage Assessment
          </h2>
          <p className="text-lg text-surface-600 max-w-2xl mx-auto leading-relaxed">
            Upload a photo of any vehicle damage. Our advanced AI detects scratches, dents, and cracks, 
            classifies severity, and provides instant repair estimates.
          </p>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/50">
          <ImageUploader onImageSelected={handleImageSelected} isLoading={false} />
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
          {[ 
            {
              title: 'Instant Detection', 
              desc: 'Identifies damages in seconds using advanced Computer Vision models.',
              icon: <Zap className="w-10 h-10 text-brand-600" />
            },
            { 
              title: 'Severity Scoring', 
              desc: 'Classifies damage as Low, Medium, or High severity automatically.',
              icon: <Target className="w-10 h-10 text-brand-600" />
            },
            { 
              title: 'Cost Estimation', 
              desc: 'Provides preliminary repair cost estimates localized to your currency.',
              icon: <BadgeDollarSign className="w-10 h-10 text-brand-600" />
            }
          ].map((feature, idx) => (
            <div key={idx} className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">{feature.icon}</div>
              <h3 className="text-lg font-bold text-surface-900 mb-3">{feature.title}</h3>
              <p className="text-surface-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header 
        user={user} 
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        onLoginClick={() => setIsAuthModalOpen(true)}
      />
      
      <main className="flex-grow relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {renderContent()}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-surface-500">
          <p>© 2024 AutoClaim AI. All rights reserved.</p>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
