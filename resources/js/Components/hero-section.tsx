import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useInView, AnimatePresence } from "motion/react";
import { ChevronDown, Flame, Shield, Smartphone, X, ChevronLeft, ChevronRight } from "lucide-react";
import Particles from "@/Components/ui/particles";

export function HeroSection() {
    const prefersReducedMotion = useReducedMotion();
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true });
    const [isMobile, setIsMobile] = useState(false);
    const [showShortcutGuide, setShowShortcutGuide] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const reduceMotion = Boolean(prefersReducedMotion || isMobile);

    // Parallax scroll tracking
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 150]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.6], [0, reduceMotion ? 0 : 80]);

    // Staggered word animation
    const headlineWords = ["Learn", "Fire", "Safety.", "Save", "Lives."];

    const tutorialSteps = [
        {
            title: "Step 1: Open Chrome",
            desc: "Launch the Google Chrome browser on your mobile device and navigate to bfpscberong.app.",
            image: "/tutorial/step_1.jpg"
        },
        {
            title: "Step 2: Access Menu",
            desc: "Tap the three vertical dots located in the top-right corner of the Chrome interface.",
            image: "/tutorial/step_2.jpg"
        },
        {
            title: "Step 3: Add to Home Screen",
            desc: "Scroll down the menu list and tap 'Add to Home screen' or 'Install app'.",
            image: "/tutorial/step_3.jpg"
        },
        {
            title: "Step 4: Install SafeScape",
            desc: "When the 'Install app' prompt appears on your screen, tap 'Install'.",
            image: "/tutorial/step_4.jpg"
        },
        {
            title: "Step 5: Process Completion",
            desc: "Wait for the installation to finish and navigate to your phone's home screen.",
            image: "/tutorial/step_5.jpg"
        },
        {
            title: "Step 6: Launch Directly",
            desc: "Open the newly created SafeScape shortcut to access the application instantly.",
            image: "/tutorial/step_6.jpg"
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-[50vh] sm:min-h-[70vh] flex flex-col items-center justify-center overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] mb-8 sm:mb-12"
        >
            {/* === Animated Background === */}
            <motion.div
                className="absolute inset-0 z-0 bg-slate-50 dark:bg-[#0B1120] transition-colors duration-500"
                style={{ y: bgY }}
            >
                {/* Modern Glow Effects */}
                <motion.div
                    className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-600/20 rounded-full blur-[120px]"
                    animate={reduceMotion ? {} : {
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-500/15 rounded-full blur-[100px]"
                    animate={reduceMotion ? {} : {
                        x: [0, -20, 0],
                        y: [0, 15, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.05]">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: "radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)",
                            backgroundSize: "32px 32px",
                        }}
                    />
                </div>
            </motion.div>

            {/* === Fire Particles (desktop only) === */}
            {!isMobile && !reduceMotion && (
                <Particles
                    className="!absolute !inset-0 z-[1]"
                    quantity={35}
                    color={["#fbbf24"]}
                    size={2}
                    staticity={30}
                    ease={60}
                />
            )}

            {/* === Main Content === */}
            <motion.div
                className="relative z-10 flex flex-col items-center text-center px-4 sm:px-10 py-10 sm:py-24 max-w-4xl mx-auto"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6 sm:mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-sm leading-snug">
                        <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-red-500" strokeWidth={2.5} />
                        <span className="sm:hidden">BFP — Sta. Cruz</span>
                        <span className="hidden sm:inline">Bureau of Fire Protection - Sta. Cruz, Laguna</span>
                    </span>
                </motion.div>

                {/* Animated Headline */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tight mb-6 sm:mb-8 drop-shadow-md dark:drop-shadow-xl transition-colors duration-500">
                    {headlineWords.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                            transition={{
                                duration: 0.5,
                                delay: 0.2 + i * 0.1,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                            className={`inline-block mr-[0.25em] ${
                                word === "Safety." || word === "Lives."
                                    ? "text-red-500 dark:text-yellow-300 drop-shadow-[0_2px_10px_rgba(239,68,68,0.3)] dark:drop-shadow-[0_4px_20px_rgba(253,224,71,0.4)]"
                                    : ""
                            }`}
                        >
                            {word}
                        </motion.span>
                    ))}
                </h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-base sm:text-xl md:text-2xl text-slate-700 dark:text-white/90 font-medium max-w-2xl leading-relaxed mb-8 sm:mb-10 px-2 transition-colors duration-500"
                >
                    Empowering every Filipino with interactive fire safety education - 
                    from kids to professionals.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="flex justify-center"
                >
                    <button
                        onClick={() => {
                            document.getElementById("featured-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="group px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-xs sm:text-sm rounded-full shadow-lg hover:shadow-[0_10px_20px_rgba(220,38,38,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-[0.15em] flex items-center gap-2"
                    >
                        <Flame className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                        Get Started
                    </button>
                </motion.div>
            </motion.div>

            {/* Mobile Shortcut Button (Available for mobile screens only, bottom left side) */}
            {isMobile && (
                <div className="absolute bottom-4 left-4 z-20">
                    <button
                        onClick={() => {
                            setCurrentStep(0);
                            setShowShortcutGuide(true);
                        }}
                        className="px-4 py-2.5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-black text-[11px] uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                        <Smartphone className="h-4 w-4" />
                        Create Shortcut
                    </button>
                </div>
            )}

            {/* Step-by-Step Tutorial Dialog (Mobile Screens Only) */}
            <AnimatePresence>
                {showShortcutGuide && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 border-[4px] border-red-500 rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="bg-red-500 p-5 text-center relative shrink-0">
                                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                                    Create Mobile Shortcut
                                </h3>
                                <button
                                    onClick={() => setShowShortcutGuide(false)}
                                    className="absolute top-4 right-4 p-1 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-5 flex-grow overflow-y-auto flex flex-col justify-between">
                                <div className="space-y-4">
                                    {/* Image Container */}
                                    <div className="h-[280px] w-full bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-200 dark:border-slate-850">
                                        <img
                                            src={tutorialSteps[currentStep].image}
                                            alt={tutorialSteps[currentStep].title}
                                            className="h-full w-full object-contain rounded-lg"
                                        />
                                    </div>

                                    {/* Step Text Details */}
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-wide">
                                            {tutorialSteps[currentStep].title}
                                        </h4>
                                        <p className="text-xs font-semibold text-slate-650 dark:text-slate-400 leading-relaxed">
                                            {tutorialSteps[currentStep].desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Slide Navigation & Indicators */}
                                <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                                    {/* Previous Button */}
                                    {currentStep > 0 ? (
                                        <button
                                            onClick={() => setCurrentStep((prev) => prev - 1)}
                                            className="p-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <div className="w-[34px]" />
                                    )}

                                    {/* Step Counter */}
                                    <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                        Step {currentStep + 1} of {tutorialSteps.length}
                                    </span>

                                    {/* Next or Finish Button */}
                                    {currentStep < tutorialSteps.length - 1 ? (
                                        <button
                                            onClick={() => setCurrentStep((prev) => prev + 1)}
                                            className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors cursor-pointer"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setShowShortcutGuide(false)}
                                            className="px-3.5 py-2 bg-red-500 hover:bg-red-600 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                                        >
                                            Finish
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
