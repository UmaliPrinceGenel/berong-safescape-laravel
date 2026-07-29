import React from 'react';
import { useSettings } from '@/lib/settings-context';
import { Sparkles, Eye, Type, BookOpen, ZoomIn, Focus, Zap, Volume2 } from 'lucide-react';
import { playSound } from '@/lib/audio';

export function AccessibilityPreviewSandbox() {
  const {
    textSize,
    isDarkMode,
    dyslexiaFont,
    focusMode,
    colorBlindness,
    magnifyingMouse,
    reduceMotion,
    generalVolume,
    gamesVolume,
    musicVolume,
    notificationVolume
  } = useSettings();

  const handleTestSound = (category: 'general' | 'games' | 'music' | 'notification') => {
    // Play sound sample using central audio utility
    const sounds: Record<string, string> = {
      general: '/sounds/click.mp3',
      games: '/sounds/match.mp3',
      music: '/sounds/game_music.mp3',
      notification: '/sounds/finish.mp3'
    };
    
    // Play synthetic beep if sound file is restricted or muted
    playSound(sounds[category] || '/sounds/click.mp3', category);
  };

  const getTextSizeLabel = () => {
    if (textSize === 'large') return '+12% Large';
    if (textSize === 'xlarge') return '+25% Extra Large';
    return '100% Standard';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 text-white shadow-lg select-none">
      
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-700/60 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
            Live Preview Sandbox
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Real-Time Display
        </span>
      </div>

      {/* Dynamic Text Sample */}
      <div className={`p-3.5 rounded-xl transition-all duration-300 border ${isDarkMode ? 'bg-slate-950/80 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'} ${dyslexiaFont ? 'font-dyslexic' : ''}`}>
        <p className={`font-black leading-snug transition-all ${textSize === 'large' ? 'text-lg sm:text-xl' : textSize === 'xlarge' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
          🔥 SafeScape: Fire Safety is Everyone's Responsibility!
        </p>
        <p className="text-xs opacity-75 mt-1 font-medium">
          Sample text rendering with current typography, sizing, and theme preferences.
        </p>
      </div>

      {/* Interactive Feature Status Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px] font-bold">
        {/* Color Filter */}
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
          <span className="text-slate-400 text-[10px] uppercase tracking-tight flex items-center gap-1">
            <Eye className="h-3 w-3 text-emerald-400" /> Color Filter
          </span>
          <span className="text-emerald-300 truncate capitalize mt-0.5">
            {colorBlindness === 'none' ? 'Default' : colorBlindness}
          </span>
        </div>

        {/* Text Size */}
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
          <span className="text-slate-400 text-[10px] uppercase tracking-tight flex items-center gap-1">
            <Type className="h-3 w-3 text-blue-400" /> Text Size
          </span>
          <span className="text-blue-300 truncate mt-0.5">
            {getTextSizeLabel()}
          </span>
        </div>

        {/* Hover Reader */}
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
          <span className="text-slate-400 text-[10px] uppercase tracking-tight flex items-center gap-1">
            <ZoomIn className="h-3 w-3 text-cyan-400" /> Hover Reader
          </span>
          <span className={`truncate mt-0.5 ${magnifyingMouse ? 'text-cyan-300' : 'text-slate-500'}`}>
            {magnifyingMouse ? 'Active' : 'Disabled'}
          </span>
        </div>

        {/* Performance */}
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
          <span className="text-slate-400 text-[10px] uppercase tracking-tight flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-400" /> Motion
          </span>
          <span className={`truncate mt-0.5 ${reduceMotion ? 'text-amber-300' : 'text-slate-300'}`}>
            {reduceMotion ? '⚡ High Speed' : '60 FPS Smooth'}
          </span>
        </div>
      </div>

      {/* Hover Reader Interactive Test Box */}
      <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
        <span className="text-cyan-200 font-bold flex items-center gap-1.5" data-hover-text="Magining Bubble Test: Hover Reader works perfectly!">
          <ZoomIn className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span>Hover over this test phrase</span>
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold">
          {magnifyingMouse ? 'Hover Test Ready' : 'Enable Below'}
        </span>
      </div>
    </div>
  );
}
