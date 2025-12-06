import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, CheckCircle } from 'lucide-react';
import { authService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Assuming useAuth has a login function to update state
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        const user = authService.login(formData.email, formData.password);
        if (user) {
          // If using Context, update it here. For now we assume App reads from storage on mount/update
          // But to be safe, we might need to force a reload or use context updater if available
          // App.tsx uses authService.getCurrentUser() on mount, so simple navigation might not trigger re-render of user state in App main.
          // Ideally we should use the context method.
          // For this step I will reload or rely on App structure update later.
          // Let's assume we simply navigate to default route, and the layout checks auth.
          navigate('/');
          window.location.reload(); // Quick fix to ensure App state updates until we fully wire Context
        } else {
          setError('Invalid email or password');
        }
      } else {
        const result = authService.register(formData.name, formData.email, formData.password);
        if (typeof result === 'string') {
          setError(result);
        } else {
          navigate('/');
          window.location.reload();
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-surface-50">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="relative z-10">
           <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-8">
             <ShieldCheck className="w-8 h-8 text-brand-500" />
             <span>AutoClaim<span className="text-brand-500">.ai</span></span>
           </div>
           <h1 className="text-5xl font-bold leading-tight mb-6">
             Intelligent Damage Assessment for the Modern Era.
           </h1>
           <p className="text-slate-400 text-lg max-w-md">
             Join thousands of adjusters and repair shops streamlining their workflow with our AI-powered vehicle analysis platform.
           </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
             <div className="p-2 bg-brand-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-brand-500" />
             </div>
             <div>
               <h3 className="font-semibold">Instant Analysis</h3>
               <p className="text-sm text-slate-400">Get repair estimates in under 30 seconds.</p>
             </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
             <div className="p-2 bg-brand-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-brand-500" />
             </div>
             <div>
               <h3 className="font-semibold">Professional Reports</h3>
               <p className="text-sm text-slate-400">Generate PDF reports with your branding.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-surface-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-surface-500 mt-2">
              {isLogin ? 'Enter your details to access your workspace.' : 'Start your 14-day free trial. No credit card required.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-surface-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-surface-400"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-surface-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-surface-400"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-surface-400" />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-surface-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
                 {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In to Workspace' : 'Get Started'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500">
            {isLogin ? "New to AutoClaim? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-brand-600 font-semibold hover:text-brand-700 hover:underline"
            >
              {isLogin ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
