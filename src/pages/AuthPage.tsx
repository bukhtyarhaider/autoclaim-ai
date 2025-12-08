import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Cpu, ScanLine } from 'lucide-react';
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

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Visual Side - Technical/Dark */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white relative overflow-hidden">
        
        {/* Cubic Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        
        {/* Animated Scanner Effect */}
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
           <div className="flex items-center gap-3 font-bold text-2xl tracking-tight mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                 <img src="/logo.png" alt="" className="w-8 h-8 " />
              </div>
              <span className="text-white">Carscube</span>
           </div>
           
           <div className="relative">
             <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
             <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
               Precision Damage <br/>
               <span className="text-zinc-500">Assessment AI</span>
             </h1>
             <p className="text-zinc-400 text-lg max-w-md font-light leading-relaxed">
               Enterprise-grade visual analysis for fleet management and claim processing.
             </p>
           </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
             <ScanLine className="w-6 h-6 text-white mb-4" />
             <h3 className="font-semibold text-lg mb-1">Visual Analysis</h3>
             <p className="text-xs text-zinc-400">Computer vision breakdown of exterior damage.</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
             <Cpu className="w-6 h-6 text-white mb-4" />
             <h3 className="font-semibold text-lg mb-1">Cost Estimation</h3>
             <p className="text-xs text-zinc-400">Real-time market value parts and labor calculation.</p>
          </div>
        </div>
      </div>

      {/* Form Side - Clean/Minimal */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-surface-50 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 mb-6 border border-zinc-200">
               <ShieldCheck className="w-3 h-3 text-zinc-500" />
               <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">Authorized Access Only</span>
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-zinc-500 mt-2">
              Please authenticate to access your dashboard.
            </p>
          </div>
          
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
                 <div className="w-1 h-full bg-red-400 rounded-full"></div>
                 {error}
              </div>
            )}

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
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
                      setError('Authentication handshake failed. Please retry.');
                    }
                  } catch (error) {
                    setError('Connection to identity provider failed.');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full group relative bg-zinc-900 text-white font-semibold py-4 rounded-xl border border-zinc-900 hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]"></div>
                
                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#fff" // Changed to white for contrast on black button
                    fillOpacity="0.9"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#fff"
                    fillOpacity="0.7"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#fff"
                    fillOpacity="0.5"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#fff"
                    fillOpacity="0.7"
                  />
                </svg>
                <span className="relative z-10">Sign in with Google</span>
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-zinc-400">
                  By continuing, you agree to the <a href="#" className="underline hover:text-zinc-600">Terms of Service</a> & <a href="#" className="underline hover:text-zinc-600">Privacy Policy</a>.
                </p>
              </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
