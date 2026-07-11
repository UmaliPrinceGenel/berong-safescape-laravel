import React from 'react'
import { Head } from '@inertiajs/react'
import { Hammer, RefreshCw, AlertTriangle } from 'lucide-react'

interface MaintenanceProps {
  message: string
}

export default function Maintenance({ message }: MaintenanceProps) {
  const handleRefresh = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      <Head>
        <title>Under Maintenance - SafeScape</title>
        <meta name="description" content="SafeScape is currently undergoing scheduled maintenance." />
      </Head>

      {/* Modern Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Radial Glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-amber-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-orange-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Main Container Card (Glassmorphic) */}
      <div className="relative z-10 max-w-lg w-full bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] text-center transition-all animate-in zoom-in-95 duration-500">
        
        {/* Pulse Hammer / Warning Icon */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-bounce-slow">
          <Hammer className="h-12 w-12 text-slate-900 animate-pulse" />
          <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 border-2 border-slate-800 shadow-md">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mb-4 leading-none italic">
          SYSTEM <span className="text-amber-400">MAINTENANCE</span>
        </h1>

        {/* Divider */}
        <div className="w-16 h-1 bg-amber-500/50 rounded-full mx-auto mb-6" />

        {/* Dynamic Message */}
        <p className="text-slate-300 dark:text-slate-300 font-bold leading-relaxed text-sm sm:text-base mb-8 max-w-sm mx-auto">
          {message}
        </p>

        {/* Interactive Refresh Button */}
        <button
          onClick={handleRefresh}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl shadow-lg border-b-4 border-amber-700 active:border-b-0 active:mt-1 transition-all uppercase tracking-wider text-sm active:scale-95"
        >
          <RefreshCw className="h-4 w-4" />
          Check Status
        </button>

        {/* Footer logo / notice */}
        <div className="mt-12 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          SafeScape Rescue & Prevention Platform
        </div>
      </div>

      {/* Local keyframes style for slower animation */}
      <style>{`
        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
