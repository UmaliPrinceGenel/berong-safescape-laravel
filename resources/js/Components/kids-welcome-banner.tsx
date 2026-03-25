"use client"

import { useAuth } from "@/lib/auth-context"
import { Flame, Sparkles, Gamepad2, BookOpen, Trophy } from "lucide-react"

export function KidsWelcomeBanner() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'Fire Hero'

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 rounded-[2rem] shadow-lg shadow-orange-500/20 mb-8 border-4 border-white text-center">
      {/* Abstract background graphics */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-15 mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 sm:px-8 py-10 sm:py-12 flex flex-col items-center">
        {/* Avatar */}
        <div className="mb-4 inline-flex items-center justify-center rounded-full ring-8 ring-pink-400/40 bg-pink-100 shadow-xl backdrop-blur-md animate-bounce-slow">
          <div className="bg-pink-200 rounded-full h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center border-4 border-pink-300">
             <span className="text-4xl sm:text-5xl drop-shadow-md">🐶</span>
          </div>
        </div>

        {/* Welcome text */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-3 drop-shadow-xl tracking-tight">
          Welcome, {firstName}!
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-yellow-100 mb-10 drop-shadow-md max-w-lg leading-relaxed">
          Ready to become a Fire Safety Hero?
        </p>

        {/* 3D Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full border-none shadow-[0_6px_0_0_#15803d] hover:shadow-[0_4px_0_0_#15803d] active:translate-y-[6px] active:shadow-none transition-all duration-200 active:duration-75 cursor-pointer">
            <Gamepad2 className="h-6 w-6 sm:h-7 sm:w-7 text-white fill-white" />
            <span className="font-black text-lg sm:text-xl tracking-wide">PLAY</span>
          </button>
          
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full border-none shadow-[0_6px_0_0_#1d4ed8] hover:shadow-[0_4px_0_0_#1d4ed8] active:translate-y-[6px] active:shadow-none transition-all duration-200 active:duration-75 cursor-pointer">
            <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-white fill-white" />
            <span className="font-black text-lg sm:text-xl tracking-wide">LEARN</span>
          </button>
          
          <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-amber-900 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full border-none shadow-[0_6px_0_0_#d97706] hover:shadow-[0_4px_0_0_#d97706] active:translate-y-[6px] active:shadow-none transition-all duration-200 active:duration-75 cursor-pointer">
            <Trophy className="h-6 w-6 sm:h-7 sm:w-7 text-amber-900 fill-amber-900" />
            <span className="font-black text-lg sm:text-xl tracking-wide">WIN</span>
          </button>
        </div>
      </div>
    </div>
  )
}
