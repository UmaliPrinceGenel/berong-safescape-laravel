"use client"

import { useState, useEffect, useRef } from "react"
import { Head, router } from '@inertiajs/react'
import axios from 'axios'
import { Button } from "@/Components/ui/button"
import { Card, CardContent } from "@/Components/ui/card"
import { Label } from "@/Components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group"
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Loader2, Shield, Star, Trophy, Flame, Award, Timer, Sparkles, MessageSquare, Rocket } from "lucide-react"
import { motion, AnimatePresence } from 'motion/react'
import { getScoreRating } from "@/lib/constants"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { playSound } from '@/lib/audio'

interface AssessmentQuestion {
    id: number
    question: string
    options: string[]
    correctAnswer: number
    category: string
}

interface AssessmentProps {
    type: 'preTest' | 'postTest'
}

export default function Assessment({ type }: AssessmentProps) {
    const { user, isAuthenticated, refreshUser } = useAuth()
    const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [result, setResult] = useState<{
        success: boolean
        score?: number
        maxScore?: number
    } | null>(null)
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [showWarningModal, setShowWarningModal] = useState(() => {
        if (type === 'postTest') {
            const hasCompleted = user?.postTestScore !== undefined && user?.postTestScore !== null
            return !hasCompleted
        }
        return false
    })

    const answersRef = useRef<Record<number, number>>({})

    const isPreTest = type === 'preTest'
    const title = isPreTest ? "Pre-Test Assessment" : "Post-Test Assessment"
    const description = isPreTest 
        ? "Let's establish your baseline knowledge before you start learning."
        : "Show us what you've learned! This is your final assessment."
    const isTestStarted = !loading && questions.length > 0 && !result && !showWarningModal

    useEffect(() => {
        answersRef.current = answers
    }, [answers])

    // Auto Focus Mode for Post-Test
    useEffect(() => {
        if (type === 'postTest' && !loading && questions.length > 0 && !result && !showWarningModal) {
            // Auto enter focus mode
            document.documentElement.classList.add("module-focus-mode")
        }

        return () => {
            document.documentElement.classList.remove("module-focus-mode")
        }
    }, [type, loading, questions.length, !!result, showWarningModal])

    // Countdown Timer (20 Minutes) for Post-Test
    useEffect(() => {
        if (type !== 'postTest' || loading || questions.length === 0 || result || showWarningModal) return

        // 20 minutes = 1200 seconds
        setTimeLeft(1200)

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null) return null
                if (prev <= 1) {
                    clearInterval(timer)
                    handleAutoSubmit()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [type, loading, questions.length, !!result, showWarningModal])

    // Prevent Refresh / Navigation when Test is in progress
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isTestStarted) {
                e.preventDefault()
                e.returnValue = "Are you sure you want to leave? Your progress on this assessment will be lost."
                return e.returnValue
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [isTestStarted])



    // Embedded feedback state
    const [feedbackRating, setFeedbackRating] = useState(0)
    const [feedbackHover, setFeedbackHover] = useState(0)
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
    const [feedbackSuccess, setFeedbackSuccess] = useState(false)
    const [feedbackComment, setFeedbackComment] = useState("")



    useEffect(() => {
        if (!isAuthenticated) return

        const fetchQuestions = async () => {
            try {
                setLoading(true)
                const role = (user?.age && user.age < 18) || user?.role === 'kid' ? "kid" : "adult"
                const response = await axios.get(`/api/assessments/questions?role=${role}&type=${type}`)
                if (response.status === 200) {
                    const fetchedQuestions = response.data.questions || []
                    setQuestions(fetchedQuestions)
                    
                    // If the user has already completed this assessment, show the results screen directly
                    const existingScore = isPreTest ? user?.preTestScore : user?.postTestScore
                    if (existingScore !== null && existingScore !== undefined) {
                        setResult({
                            success: true,
                            score: existingScore,
                            maxScore: fetchedQuestions.length
                        })
                        setShowWarningModal(false)
                    }
                } else {
                    setError("Failed to load assessment questions")
                }
            } catch (err) {
                setError("Failed to load assessment questions. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchQuestions()
    }, [isAuthenticated, user, type])

    const handleAnswerQuestion = (questionId: number, answerIndex: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }))

        // Auto-advance to the next question
        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(prev => {
                    if (questions[prev]?.id === questionId) {
                        return prev + 1
                    }
                    return prev
                })
            }, 500)
        }
    }

    const submitAssessment = async (currentAnswers: Record<number, number>) => {
        setSubmitting(true)
        setError("")

        try {
            // Format answers for the API, default to "-1" for unanswered ones
            const formattedAnswers = questions.map(q => ({
                questionId: q.id,
                selectedAnswer: currentAnswers[q.id] !== undefined ? String(currentAnswers[q.id]) : "-1"
            }))

            const endpoint = isPreTest ? "/api/assessments/pre-test" : "/api/assessments/post-test"
            const response = await axios.post(endpoint, { answers: formattedAnswers })

            if (response.status === 200) {
                // Play win sound
                playSound('/sounds/win.mp3', 'notification');

                // Refresh the global user state
                await refreshUser()
                
                setResult({
                    success: true,
                    score: response.data.score,
                    maxScore: response.data.maxScore
                })

                // Turn off Focus Mode
                document.documentElement.classList.remove("module-focus-mode")
                if (document.fullscreenElement && document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {})
                }
            } else {
                setError("Failed to submit assessment")
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Submission failed. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleAutoSubmit = () => {
        submitAssessment(answersRef.current)
    }

    const handleSubmit = async () => {
        // Validate all questions answered
        if (Object.keys(answers).length < questions.length) {
            setError("Please answer all questions before submitting.")
            return
        }
        await submitAssessment(answers)
    }

    const handleFeedbackSubmit = async () => {
        if (feedbackRating === 0) return
        setFeedbackSubmitting(true)
        try {
            await axios.post('/api/feedback', {
                featureName: isPreTest ? 'Pre-Test Assessment' : 'Post-Test Assessment',
                featureType: 'quiz',
                rating: feedbackRating,
                comments: feedbackComment
            })
            setFeedbackSuccess(true)
        } catch(err) {
            console.error('Failed to submit post-test feedback', err)
        } finally {
            setFeedbackSubmitting(false)
        }
    }

    const handleContinue = () => {
        if (user?.role === "kid") router.visit("/kids/safescape")
        else if (user?.role === "adult") router.visit("/adult")
        else router.visit("/")
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center p-8">
                    <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Login Required</h2>
                    <p className="text-slate-600 mb-6">You must be logged in to take this assessment.</p>
                    <Button onClick={() => router.visit('/login')} className="w-full">Go to Login</Button>
                </Card>
            </div>
        )
    }

    // Results View
    if (result?.success) {
        const percentage = result.maxScore ? Math.round((result.score! / result.maxScore) * 100) : 0
        const rating = getScoreRating(percentage)

        const getRatingBadgeStyle = (label: string) => {
            switch(label.toLowerCase()) {
                case 'excellent':
                    return 'bg-emerald-500 text-white border-emerald-600 shadow-[0_3px_0_#047857]'
                case 'very good':
                    return 'bg-blue-600 text-white border-blue-700 shadow-[0_3px_0_#1d4ed8]'
                case 'good':
                    return 'bg-amber-500 text-white border-amber-600 shadow-[0_3px_0_#b45309]'
                case 'fair':
                    return 'bg-orange-500 text-white border-orange-600 shadow-[0_3px_0_#c2410c]'
                default:
                    return 'bg-rose-500 text-white border-rose-600 shadow-[0_3px_0_#be123c]'
            }
        }

        const getFeedbackReaction = (star: number) => {
            switch (star) {
                case 5: return "🌟 Outstanding Experience!"
                case 4: return "👍 Great & Informative!"
                case 3: return "👌 Good & Helpful"
                case 2: return "🤔 Could Be Better"
                case 1: return "⚠️ Needs Improvement"
                default: return "Tap a star to rate your experience"
            }
        }

        return (
            <div className="min-h-screen bg-slate-100/80 dark:bg-slate-950 py-6 sm:py-12 px-3 sm:px-6 selection:bg-orange-500 selection:text-white transition-colors duration-500 flex items-center justify-center">
                <Head title={`${title} Results - SafeScape`} />

                <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full max-w-3xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] border-[3px] sm:border-[4px] border-slate-900 dark:border-slate-700 shadow-[0_10px_0_#0f172a] dark:shadow-[0_10px_0_#020617] overflow-hidden bg-white dark:bg-slate-900 transition-all flex flex-col"
                >
                    {/* Header Banner */}
                    <div className="relative bg-gradient-to-b from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 p-6 sm:p-8 text-center border-b-[3px] sm:border-b-[4px] border-slate-900 dark:border-slate-800 overflow-hidden">
                        {/* Decorative subtle background pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                        <div className="relative z-10 flex flex-col items-center">
                            <motion.div 
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                                className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-3 sm:mb-4 border-[3px] border-slate-900 dark:border-slate-700 shadow-[0_4px_0_#0f172a] dark:shadow-[0_4px_0_#020617]"
                            >
                                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" strokeWidth={2.5} />
                            </motion.div>

                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 dark:bg-black/25 backdrop-blur-sm text-white text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] border border-white/30 mb-2">
                                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                                <span>{isPreTest ? "Pre-Test Evaluation" : "Post-Test Completed"}</span>
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)] uppercase">
                                Assessment Complete!
                            </h1>
                            <p className="text-orange-100 text-xs sm:text-sm font-bold mt-1 max-w-md mx-auto">
                                {isPreTest 
                                    ? "Your initial baseline knowledge has been recorded."
                                    : "You've successfully completed your final fire safety evaluation!"}
                            </p>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                            
                            {/* Score Showcase Card (Left on desktop, Top on mobile) */}
                            <div className="md:col-span-6 bg-amber-50/90 dark:bg-slate-800/80 rounded-[1.75rem] border-[3px] border-amber-300 dark:border-amber-900/50 p-6 flex flex-col justify-between items-center text-center shadow-[0_6px_0_#fcd34d] dark:shadow-[0_6px_0_#0f172a] relative overflow-hidden transition-all">
                                
                                <div className="w-full">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-3">
                                        <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                        <span>Final Score</span>
                                    </div>

                                    {/* Big Score Display */}
                                    <div className="my-2">
                                        <div className="flex items-baseline justify-center gap-1.5">
                                            <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                                                {result.score}
                                            </span>
                                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-400 dark:text-slate-500">
                                                /{result.maxScore}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Rating Badge */}
                                    <div className="my-3">
                                        <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider border-2 ${getRatingBadgeStyle(rating.label)}`}>
                                            <Award className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                                            <span>{rating.label}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mini Stats Summary Pills */}
                                <div className="grid grid-cols-2 gap-2.5 w-full mt-4 pt-4 border-t-2 border-amber-200/80 dark:border-slate-700/80">
                                    <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-2.5 border border-amber-200 dark:border-slate-700 text-center">
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Accuracy</p>
                                        <p className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-200 mt-0.5">{percentage}%</p>
                                    </div>
                                    <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-2.5 border border-amber-200 dark:border-slate-700 text-center">
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">XP Earned</p>
                                        <p className="text-sm sm:text-base font-black text-orange-600 dark:text-orange-400 mt-0.5">+{isPreTest ? 20 : 30} XP</p>
                                    </div>
                                </div>

                                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
                                    {isPreTest 
                                        ? "Baseline score recorded. Complete learning missions to boost your knowledge!" 
                                        : "Congratulations on finishing your fire safety training with Berong SafeScape!"}
                                </p>
                            </div>

                            {/* Right Column: Feedback / Learning Mission Card */}
                            <div className="md:col-span-6 flex flex-col">
                                {!isPreTest ? (
                                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-[1.75rem] border-[3px] border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between text-center shadow-[0_6px_0_#e2e8f0] dark:shadow-[0_6px_0_#0f172a] h-full transition-all">
                                        {feedbackSuccess ? (
                                            <div className="flex flex-col items-center justify-center py-6 h-full space-y-3">
                                                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl border-2 border-emerald-400 dark:border-emerald-600 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-[0_3px_0_#059669]">
                                                    <Check className="h-7 w-7" strokeWidth={3} />
                                                </div>
                                                <h3 className="text-lg font-black text-slate-800 dark:text-white">Feedback Submitted!</h3>
                                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                                                    Thank you for helping us make Berong SafeScape better for everyone in our community.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col h-full justify-between space-y-4">
                                                <div>
                                                    <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider mb-2">
                                                        <MessageSquare className="w-3 h-3 text-orange-500" />
                                                        <span>User Feedback</span>
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white">Help Us Improve</h3>
                                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">How would you rate this test?</p>
                                                </div>

                                                {/* Interactive 5-Star Row */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 py-2.5 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 w-fit mx-auto shadow-inner">
                                                        {[1, 2, 3, 4, 5].map((star) => {
                                                            const active = (feedbackHover || feedbackRating) >= star;
                                                            return (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => !feedbackSubmitting && setFeedbackRating(star)}
                                                                    onMouseEnter={() => !feedbackSubmitting && setFeedbackHover(star)}
                                                                    onMouseLeave={() => !feedbackSubmitting && setFeedbackHover(0)}
                                                                    className="p-1 transition-transform hover:scale-125 active:scale-95 outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-orange-500"
                                                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                                                >
                                                                    <Star 
                                                                        className={`h-6 w-6 sm:h-7 sm:w-7 transition-all ${
                                                                            active
                                                                                ? "text-amber-400 fill-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.4)]" 
                                                                                : "text-slate-300 dark:text-slate-600 fill-slate-100 dark:fill-slate-800"
                                                                        }`} 
                                                                        strokeWidth={2}
                                                                    />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    <p className="text-[11px] font-black text-orange-600 dark:text-orange-400 h-4">
                                                        {getFeedbackReaction(feedbackHover || feedbackRating)}
                                                    </p>
                                                </div>

                                                {/* Optional Comments & Submit */}
                                                {feedbackRating > 0 && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        className="space-y-2.5 pt-1"
                                                    >
                                                        <textarea
                                                            className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-all resize-none font-bold text-slate-700 dark:text-slate-300 placeholder:text-slate-400 shadow-inner"
                                                            rows={2}
                                                            placeholder="Any suggestions for us? (optional)..."
                                                            value={feedbackComment}
                                                            onChange={(e) => setFeedbackComment(e.target.value)}
                                                            disabled={feedbackSubmitting}
                                                        />
                                                        <Button 
                                                            type="button"
                                                            onClick={handleFeedbackSubmit}
                                                            disabled={feedbackSubmitting}
                                                            className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl font-black text-xs sm:text-sm py-2.5 border-2 border-slate-950 dark:border-orange-600 shadow-[0_3px_0_#0f172a] dark:shadow-[0_3px_0_#c2410c] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                                                        >
                                                            {feedbackSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Submit Feedback"}
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-orange-50/80 dark:bg-orange-950/30 rounded-[1.75rem] border-[3px] border-orange-200 dark:border-orange-900/50 p-6 flex flex-col justify-center items-center text-center shadow-[0_6px_0_#fed7aa] dark:shadow-[0_6px_0_#0f172a] h-full transition-all space-y-3">
                                        <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl border-2 border-orange-300 dark:border-orange-700 flex items-center justify-center text-orange-500 shadow-[0_3px_0_#f97316]">
                                            <Rocket className="w-7 h-7 text-orange-500" strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Ready for Safety Missions?</h3>
                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                                            Interactive modules, quizzes, and simulations await you. Complete missions to unlock your official certification!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom CTA Action Button */}
                        <div className="pt-2 max-w-lg mx-auto w-full">
                            <Button 
                                type="button"
                                onClick={handleContinue}
                                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-4 sm:py-5 rounded-2xl border-[3px] border-orange-700 shadow-[0_5px_0_#c2410c] hover:shadow-[0_6px_0_#9a3412] hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-wider"
                            >
                                <span>{isPreTest ? "Start Learning Missions" : "Return to Dashboard"}</span>
                                <ChevronRight className="h-5 w-5 stroke-[3]" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-[100dvh] bg-background p-3 sm:p-6 lg:p-8 flex flex-col justify-center transition-colors duration-500 selection:bg-orange-500 selection:text-white">
            <Head title={`${title} - SafeScape`} />
            
            {/* Post-Test Hero Challenge Modal */}
            {showWarningModal && (
                <div className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border-[3px] sm:border-[4px] border-amber-300 dark:border-amber-500/50 rounded-[1.75rem] sm:rounded-[2.25rem] p-6 sm:p-9 max-w-md w-full text-center shadow-[0_12px_0_#fcd34d] dark:shadow-[0_12px_0_#78350f] space-y-4 sm:space-y-5 select-none my-auto transition-colors">
                        <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center bg-amber-50 dark:bg-amber-950/40 rounded-2xl sm:rounded-3xl border-[2.5px] border-amber-200 dark:border-amber-800/60 mb-1 shadow-inner">
                            <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-amber-500" strokeWidth={2.5} />
                        </div>
                        
                        <div className="space-y-1.5">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                Ready for the Final Challenge?
                            </h2>
                            <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 leading-snug">
                                Show off what you've learned and complete your final fire safety training!
                            </p>
                        </div>

                        <div className="bg-amber-50/70 dark:bg-slate-950/60 p-4 rounded-2xl border-2 border-amber-100 dark:border-slate-800 text-left space-y-3 shadow-inner">
                            <div className="flex items-start gap-2.5">
                                <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">
                                    <strong className="text-slate-900 dark:text-white">Plenty of Time:</strong> You have 20 minutes to answer all 15 questions at your own comfortable pace.
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5 pt-2.5 border-t border-amber-200/50 dark:border-slate-800/80">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">
                                    <strong className="text-slate-900 dark:text-white">No Pressure:</strong> Read each question carefully and pick your best answer. You've got this!
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                            <Button
                                onClick={() => handleContinue()}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black py-3 sm:py-4.5 rounded-2xl border-[2px] sm:border-[2.5px] border-slate-200 dark:border-slate-700 shadow-[0_3px_0_#cbd5e1] dark:shadow-[0_3px_0_#0f172a] active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-wider text-xs sm:text-sm"
                            >
                                Review Lessons
                            </Button>
                            <Button
                                onClick={() => setShowWarningModal(false)}
                                className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-black py-3 sm:py-4.5 rounded-2xl border-[2px] sm:border-[2.5px] border-orange-700 shadow-[0_3px_0_#c2410c] active:translate-y-[3px] active:shadow-none transition-all uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center"
                            >
                                Let's Start!
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            

            
            <div className="max-w-3xl mx-auto mb-4 md:mb-6 flex items-center gap-3 md:gap-4 w-full shrink-0">
                {!isTestStarted && (
                    <button 
                        onClick={handleContinue}
                        className="h-9 w-9 sm:h-12 sm:w-12 bg-white dark:bg-slate-800 rounded-full border-2 border-slate-200 dark:border-slate-700 border-b-[4px] active:border-b-2 active:translate-y-[2px] shadow-sm flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shrink-0"
                    >
                        <ArrowLeft className="h-4 w-4 sm:h-6 sm:w-6 text-slate-700 dark:text-slate-300" strokeWidth={3} />
                    </button>
                )}
                <div>
                    <h1 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">{title}</h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{description}</p>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto flex flex-col min-h-0 border-[3px] md:border-[4px] border-slate-200 dark:border-slate-800 shadow-[0_6px_0_#e2e8f0] dark:shadow-[0_6px_0_#0f172a] md:shadow-[0_8px_0_#e2e8f0] md:dark:shadow-[0_8px_0_#0f172a] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-500">
                {loading ? (
                    <div className="flex flex-col items-center justify-center flex-1 py-12 md:py-24">
                        <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-orange-500 mb-4" />
                        <span className="text-slate-600 dark:text-slate-400 font-bold text-sm md:text-base">Loading questions...</span>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="text-center flex-1 flex flex-col justify-center items-center py-12 md:py-24 px-4">
                        <Shield className="h-10 w-10 md:h-12 md:w-12 text-slate-300 dark:text-slate-700 mb-4" />
                        <h2 className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Questions Found</h2>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6">We couldn't find any questions for this assessment.</p>
                        <Button onClick={() => router.visit('/')} variant="outline" className="border-2 rounded-full font-bold h-9 md:h-10 dark:border-slate-700 dark:text-slate-300">
                            Return Home
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Progress Header */}
                        <div className="bg-slate-50 dark:bg-slate-900/80 px-4 py-3 sm:px-5 md:px-6 md:pb-5 md:pt-6 border-b-[3px] border-slate-100 dark:border-slate-800 shrink-0">
                            <div className="flex flex-wrap justify-between items-center mb-2.5 md:mb-4 gap-2">
                                <span className="font-black text-slate-500 dark:text-slate-400 text-sm sm:text-base uppercase tracking-wider">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </span>
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    {timeLeft !== null && (
                                        <span className={cn(
                                            "font-black px-2.5 py-1 rounded-full text-sm sm:text-base border flex items-center gap-1 transition-all",
                                            timeLeft < 120 
                                                ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-900 text-red-600 dark:text-red-400"
                                                : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400"
                                        )}>
                                            ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60) < 10 ? '0' : ''}{timeLeft % 60}
                                        </span>
                                    )}
                                    <span className="font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-full text-sm sm:text-base border border-green-200 dark:border-green-900/50">
                                        {Math.round(((currentQuestionIndex) / questions.length) * 100)}% Completed
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 md:h-4 overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question Content */}
                        <CardContent className="p-4 sm:p-5 md:p-8 pt-3 sm:pt-4 bg-white dark:bg-slate-900 flex flex-col justify-start">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/30 rounded-2xl flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-red-700 dark:text-red-400 font-bold">{error}</p>
                                </div>
                            )}

                            <div className="mb-4 md:mb-6 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 rounded-[1rem] md:rounded-[1.5rem] border-[2.5px] md:border-[3px] border-orange-600 dark:border-orange-800 shadow-[0_3px_0_#c2410c] md:shadow-[0_4px_0_#c2410c] relative mt-3 md:mt-2 shrink-0">
                                <span className="absolute -top-3 md:-top-4 left-4 md:left-6 px-2.5 py-0.5 md:px-3 md:py-1 bg-yellow-400 text-orange-800 font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-full border-[1.5px] md:border-[2px] border-yellow-500 shadow-sm">
                                    {questions[currentQuestionIndex].category}
                                </span>
                                <h3 className="text-base sm:text-lg md:text-xl font-black text-white leading-snug mt-1 drop-shadow-sm">
                                    {questions[currentQuestionIndex].question}
                                </h3>
                            </div>

                            <RadioGroup
                                key={questions[currentQuestionIndex].id}
                                value={answers[questions[currentQuestionIndex].id]?.toString() || ""}
                                onValueChange={(value) => handleAnswerQuestion(questions[currentQuestionIndex].id, parseInt(value))}
                                className="space-y-2.5 md:space-y-4"
                            >
                                {questions[currentQuestionIndex].options.map((option, index) => {
                                    const isSelected = answers[questions[currentQuestionIndex].id] === index
                                    return (
                                        <div 
                                            key={`${questions[currentQuestionIndex].id}-${index}`} 
                                            className={`
                                                flex items-center p-3 md:p-4 rounded-xl md:rounded-2xl border-[2px] md:border-[3px] transition-all cursor-pointer group outline-none focus:outline-none
                                                ${isSelected 
                                                    ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500 dark:border-yellow-600 shadow-[0_3px_0_#eab308] dark:shadow-[0_4px_0_#ca8a04] -translate-y-[2px] md:-translate-y-1' 
                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-[0_3px_0_#e2e8f0] dark:shadow-[0_4px_0_#0f172a] md:hover:border-orange-300 dark:md:hover:border-orange-700 md:hover:bg-orange-50 dark:md:hover:bg-slate-700/50 md:hover:-translate-y-1 md:hover:shadow-[0_4px_0_#fed7aa] dark:md:hover:shadow-[0_4px_0_#431407] active:shadow-none active:translate-y-[2px]'
                                                }
                                            `}
                                            onClick={() => handleAnswerQuestion(questions[currentQuestionIndex].id, index)}
                                        >
                                            <RadioGroupItem 
                                                value={index.toString()} 
                                                id={`q-${questions[currentQuestionIndex].id}-opt-${index}`} 
                                                className="hidden"
                                            />
                                            <Label 
                                                htmlFor={`q-${questions[currentQuestionIndex].id}-opt-${index}`}
                                                className={`text-sm sm:text-base font-black cursor-pointer w-full leading-snug ${
                                                    isSelected ? 'text-yellow-800 dark:text-yellow-500' : 'text-slate-700 dark:text-slate-300 md:group-hover:text-slate-900 dark:md:group-hover:text-white'
                                                }`}
                                            >
                                                {option}
                                            </Label>
                                        </div>
                                    )
                                })}
                            </RadioGroup>
                        </CardContent>

                        {/* Navigation Footer */}
                        <div className="px-4 py-3 md:px-6 md:py-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900/50">
                            <Button 
                                variant="outline" 
                                disabled={currentQuestionIndex === 0 || submitting} 
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                className={`rounded-full font-black px-4 md:px-5 border-[2px] active:translate-y-[2px] transition-all shadow-[0_2px_0_#cbd5e1] dark:shadow-[0_2px_0_#0f172a] active:shadow-none h-9 md:h-10 text-xs md:text-sm ${
                                    currentQuestionIndex === 0 || submitting ? 'opacity-50 border-slate-200 dark:border-slate-700 shadow-none' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                                }`}
                            >
                                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 mr-1" /> {currentQuestionIndex === 0 ? "Back" : `Question ${currentQuestionIndex}`}
                            </Button>

                            {currentQuestionIndex === questions.length - 1 ? (
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={submitting || answers[questions[currentQuestionIndex].id] === undefined}
                                    className={`rounded-full font-black px-4 md:px-5 border-[2px] active:translate-y-[2px] transition-all text-white relative h-9 md:h-10 text-xs md:text-sm ${
                                        answers[questions[currentQuestionIndex].id] === undefined
                                            ? 'bg-slate-300 dark:bg-slate-700 border-slate-400 dark:border-slate-600 opacity-50 cursor-not-allowed shadow-none'
                                            : 'bg-green-500 hover:bg-green-400 dark:bg-emerald-600 dark:hover:bg-emerald-500 border-green-600 dark:border-emerald-700 shadow-[0_2px_0_#16a34a] dark:shadow-[0_2px_0_#059669] active:shadow-none'
                                    }`}
                                >
                                    {submitting ? (
                                        <><Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin mr-1" /> Submitting...</>
                                    ) : (
                                        <><Check className="h-4 w-4 md:h-5 md:w-5 mr-1" strokeWidth={4} /> Submit</>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    disabled={answers[questions[currentQuestionIndex].id] === undefined}
                                    className={`rounded-full font-black px-4 md:px-5 border-[2px] active:translate-y-[2px] transition-all shadow-[0_2px_0_#cbd5e1] dark:shadow-[0_2px_0_#0f172a] active:shadow-none h-9 md:h-10 text-xs md:text-sm ${
                                        answers[questions[currentQuestionIndex].id] === undefined
                                            ? 'opacity-50 border-slate-200 dark:border-slate-700 shadow-none'
                                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                                    }`}
                                >
                                    Next <ChevronRight className="h-4 w-4 md:h-5 md:w-5 ml-1" />
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </Card>
        </div>
    )
}
