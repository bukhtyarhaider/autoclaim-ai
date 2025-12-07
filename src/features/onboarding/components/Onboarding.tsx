import React, { useState } from 'react';
import { UserProfile } from '../../../types';
import { authService } from '../../../services/storageService';
import { Sparkles, Wrench, FileText, ChevronRight, Check, Zap } from 'lucide-react';

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
      title: "Welcome to Carscube",
      description: "Your intelligent partner for vehicle damage assessment. We combine advanced AI with practical repair insights to streamline your workflow.",
      icon: <Sparkles className="w-8 h-8 text-white" />,
      bg: "bg-black",
      accent: "from-zinc-800 to-zinc-600"
    },
    {
      title: "Smart Parts Detection",
      description: "Get a detailed manifest of every part that needs replacement. Our AI identifies specific components like bumpers, fenders, and headlights automatically.",
      icon: <Wrench className="w-8 h-8 text-white" />,
      bg: "bg-zinc-950",
      accent: "from-zinc-700 to-zinc-500"
    },
    {
      title: "Actionable Reports",
      description: "Generate professional PDF reports that serve as practical checklists. Includes labor breakdowns, part options, and spaces for manual inspection notes.",
      icon: <FileText className="w-8 h-8 text-white" />,
      bg: "bg-zinc-900",
      accent: "from-zinc-600 to-zinc-400"
    },
    {
      title: "Ready to Start?",
      description: `You have ${user.credits} free credits to try out Carscube features. Upload your first car image and experience the difference.`,
      icon: <Zap className="w-8 h-8 text-white" />,
      bg: "bg-zinc-800",
      accent: "from-zinc-500 to-zinc-300"
    }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 transition-all duration-500">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-500"></div>

      {/* Main Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row h-[500px] md:h-[450px]">
        
        {/* Left Side: Visuals */}
        <div className={`md:w-5/12 relative transition-colors duration-700 ease-in-out ${steps[step].bg} flex flex-col items-center justify-center p-8 text-white overflow-hidden`}>
          
          {/* Animated Background Blobs */}
          <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${steps[step].accent} opacity-20 blur-3xl rounded-full -mr-16 -mt-16 transition-all duration-700`}></div>
          <div className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr ${steps[step].accent} opacity-20 blur-3xl rounded-full -ml-12 -mb-12 transition-all duration-700`}></div>

          {/* Icon Circle */}
          <div className={`relative z-10 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 shadow-xl transition-all duration-500 transform hover:scale-105 active:scale-95 group`}>
            {steps[step].icon}
          </div>
          
          {/* Step Indicator (Visual) */}
          <div className="relative z-10 flex gap-2 mt-8">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === step ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between bg-white">
          <div className="mt-4 md:mt-0">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 mb-6 uppercase tracking-wider">
               Feature Tour {step + 1}/{steps.length}
             </div>
             
             <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-2 duration-300 key={step}-h2">
               {steps[step].title}
             </h2>
             
             <p className="text-slate-500 text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-300 key={step}-p">
               {steps[step].description}
             </p>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
               onClick={() => {
                 authService.completeOnboarding(user.id);
                 onComplete();
               }}
               className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip
            </button>

            <button
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  handleComplete();
                }
              }}
              className="group relative flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 overflow-hidden"
            >
              <div className={`absolute inset-0 w-full h-full bg-gradient-to-r ${steps[step].accent} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              {step < steps.length - 1 ? (
                <>
                  Next Step
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  Get Started
                  <Check className="w-5 h-5" />
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
