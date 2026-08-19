import { useState, useEffect, useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Button } from "@/Components/ui/button"
import { Progress } from "@/Components/ui/progress"
import {
    ArrowRight,
    Check,
    Lock,
    Trophy,
    Loader2,
    LogIn,
    X,
    Download,
    Shield,
    Sparkles,
    FileText,
    Award
} from "lucide-react"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/Components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { LottiePlayer } from "@/Components/ui/lottie-player"
import trophyBadgeAnimation from "@/assets/lottie/trophy-badge.json"

interface EligibilityData {
    eligible: boolean
    alreadyCompleted?: boolean
    reason: string
    requirements?: {
        minEngagementPoints: number
        minModulesCompleted: number
        minQuizzesCompleted: number
    }
    current?: {
        engagementPoints: number
        modulesCompleted: number
        quizzesCompleted: number
    }
    progress?: {
        engagementPoints: number
        modulesCompleted: number
        quizzesCompleted: number
    }
    preTestScore?: number
    postTestScore?: number
    completedAt?: string
    isAdult?: boolean
}

interface ServerUser {
    id: number
    name: string
    age?: number
    role: string
}

interface LandingAssessmentProps {
    serverUser?: ServerUser | null
}

export function LandingAssessmentSection({ serverUser }: LandingAssessmentProps = {}) {
    const { user: clientUser, isAuthenticated: clientIsAuthenticated, isLoading } = useAuth()

    // Use server-provided user when available (avoids waiting for client auth check)
    const user = clientUser || (serverUser ? {
        ...serverUser,
        username: '',
        permissions: { accessKids: false, accessAdult: false, accessProfessional: false, isAdmin: false },
        isActive: true,
        createdAt: '',
    } as any : null)
    const isAuthenticated = clientIsAuthenticated || !!serverUser

    
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [eligibility, setEligibility] = useState<EligibilityData | null>(null)
    const [showCertificate, setShowCertificate] = useState(false)
    const certificateRef = useRef<HTMLDivElement>(null)
    const sectionRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
    const prefersReducedMotion = useReducedMotion()

    // Format date properly
    const formatDate = (dateString?: string) => {
        if (!dateString) return ""
        const d = new Date(dateString)
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const day = d.getDate()
        const getOrdinal = (n: number) => {
            const s = ["th", "st", "nd", "rd"]
            const v = n % 100
            return n + (s[(v - 20) % 10] || s[v] || s[0])
        }
        return `Given this ${getOrdinal(day)} day of ${monthNames[d.getMonth()]}, ${d.getFullYear()}`
    }

    useEffect(() => {
        // If server already told us the user is authenticated, check immediately
        if (isAuthenticated) {
            checkEligibility()
        } else if (!isLoading && !isAuthenticated) {
            setLoading(false);
        }
    }, [isLoading, isAuthenticated])

    const checkEligibility = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/api/assessments/post-test-eligibility")
            setEligibility(response.data)
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                // Silently ignore 401 Unauthorized errors
                return;
            }
            console.error("Failed to check eligibility", err)
        } finally {
            setLoading(false)
        }
    }

    const downloadPDF = async () => {
        if (!certificateRef.current) return;

        try {
            setDownloading(true);
            const [{ toPng }, { default: JsPDF }] = await Promise.all([
                import("html-to-image"),
                import("jspdf"),
            ]);

            // html-to-image handles modern CSS like Tailwind v4 oklch() colors much better
            const dataUrl = await toPng(certificateRef.current, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                filter: (node) => {
                    // Filter out elements that might cause serialization issues
                    // like elements with specific oklch styles or external SVGs if they fail
                    return true;
                },
                style: {
                    // Force a consistent rendering context
                    transform: 'none',
                    margin: '0',
                }
            });

            // A4 size in mm: 297 x 210 (Landscape)
            const pdf = new JsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`SafeScape_Certificate_${user?.name?.replace(/\s+/g, '_') || 'Hero'}.pdf`);
        } catch (error) {
            console.error("Error generating PDF", error);
        } finally {
            setDownloading(false);
        }
    }

    const handleStartClick = () => {
        if (!isAuthenticated) {
            router.visit("/login")
        } else {
            router.visit("/assessment/post-test")
        }
    }

    if (isLoading) {
        return (
            <div className="py-12 bg-transparent flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <motion.div
            ref={sectionRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-[1.75rem] sm:rounded-[2.25rem] py-7 sm:py-9 lg:py-10 px-4 sm:px-8 lg:px-10 border border-slate-200/80 dark:border-slate-700/50 shadow-sm relative overflow-hidden transition-colors duration-500"
        >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 dark:bg-orange-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-200/20 dark:bg-red-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.4) 1px, transparent 0)",
                backgroundSize: "24px 24px",
            }} />
            
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-6 sm:mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="inline-flex items-center gap-2 px-4 py-1 sm:py-1.5 rounded-full bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] border-2 border-red-200 dark:border-red-900/50 shadow-[0_3px_0_#fca5a5] dark:shadow-[0_3px_0_#7f1d1d] mb-2.5 sm:mb-3 select-none hover:-translate-y-0.5 hover:shadow-[0_4px_0_#fca5a5] dark:hover:shadow-[0_4px_0_#7f1d1d] active:translate-y-1 active:shadow-none transition-all duration-150 cursor-default"
                    >
                        <Trophy className="h-3.5 w-3.5 text-red-600 dark:text-red-500" strokeWidth={2.5} />
                        <span>Certification</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white mb-2 sm:mb-2.5 tracking-tight"
                    >
                        Become a SafeScape Hero
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="text-xs sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Complete the official post-test to validate your life-saving fire safety knowledge and claim your BFP Santa Cruz-recognized Certificate of Completion.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    className="max-w-3xl mx-auto shadow-xl rounded-[1.5rem] sm:rounded-[1.75rem] hover:shadow-2xl transition-shadow duration-300 border-2 border-slate-200 dark:border-slate-700/80 overflow-hidden"
                >
                    <div className="overflow-hidden bg-white dark:bg-slate-800">
                        <div className="md:flex">
                            {/* Left Credential Pillar */}
                            <div className="md:w-5/12 bg-gradient-to-br from-red-600 via-red-500 to-orange-600 p-6 sm:p-7 md:p-8 text-white flex flex-col justify-center items-center text-center relative z-10 shadow-[0_4px_24px_rgba(0,0,0,0.15)] md:shadow-[4px_0_24px_rgba(0,0,0,0.15)] overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-950/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
                                
                                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-1 relative z-10 shrink-0 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]">
                                    <LottiePlayer animationData={trophyBadgeAnimation} loop={true} className="w-full h-full" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black mb-0.5 tracking-tight drop-shadow-sm relative z-10">Final Assessment</h3>
                                <div className="bg-white/20 px-3 py-0.5 rounded-full border border-white/25 backdrop-blur-sm relative z-10 mt-1 mb-3 sm:mb-4">
                                    <p className="text-white text-[9px] sm:text-[10px] font-black tracking-widest uppercase drop-shadow-sm">BFP Verified Credential</p>
                                </div>

                                {/* Credential Specs Pills */}
                                <div className="flex flex-wrap md:flex-col justify-center gap-1.5 sm:gap-2 w-full max-w-xs relative z-10">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 text-xs font-semibold text-white/90">
                                        <FileText className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                                        <span className="text-[10px] sm:text-xs">20 Questions</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 text-xs font-semibold text-white/90">
                                        <Award className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                                        <span className="text-[10px] sm:text-xs">80% Passing Mark</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Interactive State Container */}
                            <div className="md:w-7/12 p-6 sm:p-7 md:p-8 flex flex-col justify-center bg-white dark:bg-slate-900 z-0">
                            {!isAuthenticated ? (
                                <div className="space-y-3.5 sm:space-y-4">
                                    <div>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold text-[10px] uppercase tracking-wider mb-2">
                                            <Lock className="w-3 h-3" /> Account Required
                                        </span>
                                        <h4 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">Ready for the Challenge?</h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed mt-1">
                                            Log in to unlock the final assessment. Complete your learning modules to validate eligibility!
                                        </p>
                                    </div>
                                    <button onClick={handleStartClick} className="w-full h-11 sm:h-12 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black rounded-xl border-2 border-orange-300 dark:border-orange-500/40 shadow-[0_4px_0_#991b1b] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#991b1b] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs sm:text-sm cursor-pointer select-none">
                                        <Shield className="h-4 w-4" /> Login to Start
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3.5 sm:space-y-4">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-6 text-slate-500 dark:text-slate-400 gap-2 font-semibold text-xs sm:text-sm">
                                            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-orange-500" /> Checking eligibility status...
                                        </div>
                                    ) : eligibility?.alreadyCompleted ? (
                                        <div className="space-y-3.5 sm:space-y-4">
                                            <div>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-2">
                                                    <Check className="w-3 h-3" strokeWidth={3} /> Certified Hero
                                                </span>
                                                <h4 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">Official Certification Earned! 🎉</h4>
                                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed mt-1">
                                                    You have successfully passed the post-test assessment. View your scores or open your certificate.
                                                </p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                                                <button onClick={handleStartClick} className="flex-1 h-11 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-black rounded-xl border-2 border-slate-200 dark:border-slate-700 border-b-[3px] active:border-b-2 active:translate-y-[2px] shadow-sm transition-all flex items-center justify-center uppercase tracking-wider text-xs cursor-pointer">
                                                    View Results
                                                </button>
                                                <button onClick={() => setShowCertificate(true)} className="flex-1 h-11 text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 font-black rounded-xl border-2 border-orange-300 dark:border-orange-500/40 shadow-[0_3px_0_#991b1b] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider text-xs cursor-pointer">
                                                    <Download className="w-3.5 h-3.5" /> View Certificate
                                                </button>
                                            </div>
                                        </div>
                                    ) : eligibility?.eligible ? (
                                        <div className="space-y-3.5 sm:space-y-4">
                                            <div>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-2">
                                                    <Sparkles className="w-3 h-3" /> Requirements Fully Met
                                                </span>
                                                <h4 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">You're Ready for Certification!</h4>
                                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed mt-1">
                                                    You have completed all prerequisite modules. Take the final exam now to generate your official BFP credential.
                                                </p>
                                            </div>
                                            <button onClick={handleStartClick} className="w-full h-11 sm:h-12 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black rounded-xl border-2 border-orange-300 dark:border-orange-500/50 shadow-[0_4px_0_#991b1b] hover:-translate-y-0.5 hover:shadow-[0_5px_0_#991b1b] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs sm:text-sm cursor-pointer select-none">
                                                Start Assessment <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3.5 sm:space-y-4">
                                            <div className="bg-slate-50/80 dark:bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md transition-all">
                                                <h5 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
                                                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                                                    Unlock Requirements
                                                </h5>

                                                <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                                                    {/* Pre-Test Requirement */}
                                                    <div className="flex items-start gap-2.5 sm:gap-3">
                                                        <div className={`mt-0.5 rounded-full p-0.5 ${typeof eligibility?.preTestScore === 'number' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600'}`}>
                                                            <Check className="h-3 w-3" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className={`font-semibold ${typeof eligibility?.preTestScore === 'number' ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>
                                                                Complete Pre-Test Assessment
                                                            </p>
                                                            {typeof eligibility?.preTestScore !== 'number' && (
                                                                <Button
                                                                    variant="link"
                                                                    className="h-auto p-0 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 text-xs font-bold mt-0.5"
                                                                    onClick={() => router.visit('/assessment/pre-test')}
                                                                >
                                                                    Take Pre-Test Now →
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Modules Requirement (Kids Only) */}
                                                    {!eligibility?.isAdult && eligibility?.requirements && (
                                                        <div className="flex items-start gap-2.5 sm:gap-3">
                                                            <div className={`mt-0.5 rounded-full p-0.5 ${(eligibility.current?.modulesCompleted || 0) >= (eligibility.requirements.minModulesCompleted || 0) ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600'}`}>
                                                                <Check className="h-3 w-3" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className={`font-semibold ${(eligibility.current?.modulesCompleted || 0) >= (eligibility.requirements.minModulesCompleted || 0) ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>
                                                                    Complete Learning Modules
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Progress value={eligibility.progress?.modulesCompleted || 0} className="h-1.5 w-24 bg-slate-200 dark:bg-slate-700" />
                                                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                                                        {eligibility.current?.modulesCompleted}/{eligibility.requirements.minModulesCompleted}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <button onClick={() => router.visit(user?.age && user.age < 18 ? "/kids" : "/adult")} className="w-full h-11 sm:h-12 bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 font-black rounded-xl border-2 border-slate-950 dark:border-slate-700 border-b-[4px] active:border-b-2 active:translate-y-[2px] shadow-sm transition-all flex items-center justify-center uppercase tracking-wider text-xs sm:text-sm cursor-pointer">
                                                Continue Learning Activities
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        </div>
                    </div>
                </motion.div>
            
            {/* End of max-w-4xl wrapper */}
            </div>

            {/* Certificate Modal */}
            <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
                <DialogContent aria-describedby={undefined} className="max-w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
                    <DialogTitle className="sr-only">Certificate of Completion</DialogTitle>
                    <div className="relative w-full max-w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col items-center">
                        <DialogClose asChild>
                            <button className="absolute top-4 right-4 z-20 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors shadow-lg disabled:opacity-50" disabled={downloading}>
                                <X className="h-5 w-5" />
                            </button>
                        </DialogClose>

                        <div ref={certificateRef} className="relative w-full select-none" style={{ aspectRatio: '1123/794' }}>
                            <img src="/safescape_certificate.svg" alt="Certificate Template" className="absolute inset-0 w-full h-full object-contain" crossOrigin="anonymous" />

                            <div className="absolute inset-x-0 text-center flex justify-center items-center" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                                <h2 className="text-[clamp(1rem,3vw,2.5rem)] font-bold text-[#1a1a2e] uppercase tracking-widest" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                                    {user?.name || "Future Hero"}
                                </h2>
                            </div>

                            <div className="absolute inset-x-0 text-center flex justify-center items-center" style={{ top: '78%', transform: 'translateY(-50%)' }}>
                                <p className="text-[clamp(0.6rem,1.5vw,1rem)] text-[#333]" style={{ fontFamily: "'Alice', 'Georgia', serif" }}>
                                    {formatDate(eligibility?.completedAt)}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 dark:bg-slate-900 w-full p-4 border-t border-slate-200 dark:border-slate-800 flex justify-center items-center transition-colors">
                            <Button
                                onClick={downloadPDF}
                                disabled={downloading}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-bold transition-colors flex items-center gap-2"
                            >
                                {downloading ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating PDF...</>
                                ) : (
                                    <><Download className="h-4 w-4" /> Download Certificate</>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
        // </section>
    )
}
