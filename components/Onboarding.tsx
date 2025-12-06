import React, { useState } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/storageService';
import { Sparkles, ScanLine, CreditCard, ChevronRight, Check, X } from 'lucide-react';

interface OnboardingProps {
  user: UserProfile;
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(0);

  const handleComplete = () => {
    authService.completeOnboarding(user.id);
    onComplete();
  };

  const steps = [
    {
      title: "Welcome to AutoClaim AI",
      description: "Experience the future of vehicle damage assessment. Our advanced AI analyzes damages instantly with professional accuracy.",
      icon: <Sparkles className="w-12 h-12 text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "How It Works",
      description: "Simply upload a photo of the vehicle damage. Our AI detects dents, scratches, and cracks, estimating repair costs in seconds.",
      icon: <ScanLine className="w-12 h-12 text-purple-500" />,
      color: "bg-purple-50"
    },
    {
      title: "Free Credits Included",
      description: `We've started you off with ${user.credits} free credits. Each analysis costs 1 credit. Top up anytime to continue using the service.`,
      icon: <CreditCard className="w-12 h-12 text-emerald-500" />,
      color: "bg-emerald-50"
    }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <div 
            className="h-full bg-slate-900 transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8 pt-12">
          {/* Content */}
          <div className="text-center mb-8 min-h-[220px] flex flex-col items-center justify-center">
             <div className={`w-24 h-24 rounded-full ${steps[step].color} flex items-center justify-center mb-6 animate-in zoom-in duration-300`}>
                {steps[step].icon}
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300 key={step}">
               {steps[step].title}
             </h2>
             <p className="text-slate-500 leading-relaxed max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 key={step}-desc">
               {steps[step].description}
             </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-100">
            <div className="flex gap-2">
              {steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${idx === step ? 'bg-slate-900' : 'bg-slate-200'}`}
                ></div>
              ))}
            </div>

            <button
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  handleComplete();
                }
              }}
              className="group flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all hover:pr-5 active:scale-95"
            >
              {step < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  Get Started
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
