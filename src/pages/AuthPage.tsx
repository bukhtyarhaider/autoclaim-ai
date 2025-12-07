import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { authService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // No more email/password form handling

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-surface-50">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="relative z-10">
                   <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-8">
          <img src="/logo.png" alt="Carscube AI" className="w-10 h-10 " />
          <span>Carscube</span>
           </div>
           <h1 className="text-5xl font-bold leading-tight mb-6">
             Smart Damage Assessment
           </h1>
           <p className="text-slate-400 text-lg max-w-md">
             Streamline your workflow with AI-powered vehicle analysis and cost estimation.
           </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
             <div className="p-2 bg-white/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="font-semibold">Instant Analysis</h3>
               <p className="text-sm text-slate-400">Get repair estimates in seconds.</p>
             </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
             <div className="p-2 bg-white/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="font-semibold">Detailed Reports</h3>
               <p className="text-sm text-slate-400">Generate professional-grade damage reports.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-surface-900">
              Welcome to Carscube
            </h2>
            <p className="text-surface-500 mt-2">
              Sign in to start assessing vehicle damage.
            </p>
          </div>
          
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
                 {error}
              </div>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const user = await authService.loginWithGoogle();
                  if (user) {
                    navigate('/');
                  } else {
                    setError('Google sign in failed. Please try again.');
                  }
                } catch (error) {
                  setError('Google sign in failed');
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full bg-white text-slate-900 font-semibold py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
