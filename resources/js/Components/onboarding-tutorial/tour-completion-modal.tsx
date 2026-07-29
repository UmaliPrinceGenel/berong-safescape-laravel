import React from 'react';
import { useTour } from './tour-context';
import { Trophy, Award, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export function TourCompletionModal() {
  const { showCelebrationModal, setShowCelebrationModal } = useTour();

  if (!showCelebrationModal) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-[3px] border-amber-400 dark:border-amber-500 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-center">
        
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Icon Header */}
        <div className="flex justify-center mb-4">
          <div className="relative p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl text-slate-950 shadow-lg animate-bounce">
            <Trophy className="h-10 w-10 stroke-[2.5]" />
            <div className="absolute -top-1 -right-1 p-1 bg-yellow-300 rounded-full text-slate-950 shadow">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/50 text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
          <CheckCircle className="h-3.5 w-3.5" />
          Onboarding Tour Complete!
        </span>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
          You're Ready to Explore!
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
          Great job completing the interactive tour! You have unlocked your first fire safety explorer reward.
        </p>

        {/* Rewards Box */}
        <div className="mt-4 p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300/60 dark:border-amber-700/50 flex items-center justify-around text-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400 tracking-wider">Reward</span>
            <span className="text-sm font-black text-amber-600 dark:text-amber-300">+50 Points</span>
          </div>
          <div className="h-8 w-px bg-amber-300/50 dark:bg-amber-700/50" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400 tracking-wider">Badge Unlocked</span>
            <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              SafeScape Explorer
            </span>
          </div>
        </div>

        {/* Close Action */}
        <div className="mt-6">
          <button
            onClick={() => setShowCelebrationModal(false)}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm text-white bg-[#d60000] hover:bg-red-600 border-b-4 border-red-900 active:translate-y-1 active:border-b-0 shadow-lg transition-all cursor-pointer"
          >
            Start Exploring Berong SafeScape
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
