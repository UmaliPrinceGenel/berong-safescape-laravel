"use client"

import { useAuth } from "@/lib/auth-context"
import { Shield, FileText, CheckCircle, Clock } from "lucide-react"

export function ProfessionalWelcomeBanner() {
    const { user } = useAuth()
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 rounded-[2rem] shadow-xl mb-8 border border-slate-700 text-center pt-8 pb-10 px-6 sm:px-12">
            {/* Abstract background graphics */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 inline-flex items-center justify-center p-3 bg-slate-800 rounded-2xl ring-1 ring-red-500 shadow-lg shadow-red-900/20">
                    <Shield className="h-8 w-8 text-red-400" strokeWidth={2} />
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-cyan-200">{user?.name || 'Officer'}</span>
                </h1>

                <p className="text-slate-300/80 text-sm md:text-base max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
                    Ready to continue your professional development? <br className="hidden sm:block" /> Access the latest protocols and training modules.
                </p>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2">
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-800 border-2 border-b-[3px] border-slate-950 text-slate-200 text-xs font-bold tracking-wide shadow-md">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {currentDate}
                    </span>
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-800 border-2 border-b-[3px] border-slate-950 text-slate-200 text-xs font-bold tracking-wide shadow-md">
                        <CheckCircle className="h-4 w-4 text-green-400 stroke-[3px]" />
                        System Operational
                    </span>
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-800 border-2 border-b-[3px] border-slate-950 text-slate-200 text-xs font-bold tracking-wide shadow-md">
                        <FileText className="h-4 w-4 text-blue-400 stroke-[3px]" />
                        New Protocols Available
                    </span>
                </div>
            </div>
        </div>
    )
}
