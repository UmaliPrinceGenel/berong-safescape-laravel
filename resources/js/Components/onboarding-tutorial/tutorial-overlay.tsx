import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTour } from './tour-context';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, X, Sparkles, Touchpad, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TargetBounds {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TutorialOverlay() {
  const {
    isActive,
    currentStepIndex,
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    skipTour
  } = useTour();

  const [targetBounds, setTargetBounds] = useState<TargetBounds | null>(null);
  const [cardPosition, setCardPosition] = useState<{ top?: number; left?: number; bottom?: number; isCentered?: boolean }>({ isCentered: true });
  const animFrameRef = useRef<number | null>(null);

  // Update element coordinates & positioning
  const updateTargetBounds = useCallback(() => {
    if (!currentStep || currentStep.targetSelector === 'body') {
      setTargetBounds(null);
      setCardPosition({ isCentered: true });
      return;
    }

    const element = document.querySelector(currentStep.targetSelector);
    if (element && element instanceof HTMLElement) {
      const rect = element.getBoundingClientRect();
      
      // If target element is visible on screen
      if (rect.width > 0 && rect.height > 0) {
        const bounds: TargetBounds = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
        setTargetBounds(bounds);

        // Calculate card positioning for Mobile vs Desktop
        const isMobile = window.innerWidth < 640;
        if (isMobile) {
          // On mobile screens, place tooltip at bottom or center for optimal view
          setCardPosition({ bottom: 16, left: 16 });
        } else {
          // Desktop positioning based on target position
          const spaceBelow = window.innerHeight - (rect.top + rect.height);
          const spaceAbove = rect.top;

          if (spaceBelow >= 220) {
            setCardPosition({
              top: rect.top + rect.height + 16,
              left: Math.max(16, Math.min(rect.left + rect.width / 2 - 200, window.innerWidth - 420)),
              isCentered: false
            });
          } else if (spaceAbove >= 220) {
            setCardPosition({
              top: Math.max(16, rect.top - 230),
              left: Math.max(16, Math.min(rect.left + rect.width / 2 - 200, window.innerWidth - 420)),
              isCentered: false
            });
          } else {
            setCardPosition({ isCentered: true });
          }
        }
        return;
      }
    }

    // Fallback if target is offscreen or not found
    setTargetBounds(null);
    setCardPosition({ isCentered: true });
  }, [currentStep]);

  useEffect(() => {
    if (!isActive || !currentStep) return;

    updateTargetBounds();

    const handleResizeOrScroll = () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(updateTargetBounds);
    };

    window.addEventListener('resize', handleResizeOrScroll, { passive: true });
    window.addEventListener('scroll', handleResizeOrScroll, { passive: true });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
    };
  }, [isActive, currentStep, updateTargetBounds]);

  // Handle interactive clicks on targeted elements
  useEffect(() => {
    if (!isActive || !currentStep || !currentStep.requiresClick || !targetBounds) return;

    const element = document.querySelector(currentStep.targetSelector);
    if (!element) return;

    const handleTargetClick = () => {
      // Advance step when user interacts with highlighted element
      setTimeout(() => {
        nextStep();
      }, 300);
    };

    element.addEventListener('click', handleTargetClick, { once: true });
    return () => {
      element.removeEventListener('click', handleTargetClick);
    };
  }, [isActive, currentStep, targetBounds, nextStep]);

  if (!isActive || !currentStep) return null;

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999990] pointer-events-auto select-none">
        {/* Fullscreen Dark Overlay with Spotlight Cutout */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="spotlight-mask">
              {/* White background = dim layer */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {/* Black cutout = highlighted clear spot */}
              {targetBounds && (
                <rect
                  x={targetBounds.left - 6}
                  y={targetBounds.top - 6}
                  width={targetBounds.width + 12}
                  height={targetBounds.height + 12}
                  rx="16"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.75)"
            mask="url(#spotlight-mask)"
          />
        </svg>

        {/* Pulsing Glowing Border Ring over Highlighted Target */}
        {targetBounds && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: targetBounds.top - 6,
              left: targetBounds.left - 6,
              width: targetBounds.width + 12,
              height: targetBounds.height + 12,
              borderRadius: 16,
              pointerEvents: 'none',
            }}
            className="border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] ring-4 ring-amber-400/30 animate-pulse"
          />
        )}

        {/* Floating Tooltip Card */}
        <div
          className={cn(
            "fixed z-[999999] p-4 sm:p-5 w-[calc(100%-2rem)] max-w-md",
            "bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-500 rounded-3xl",
            "shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl",
            "transition-all duration-300 ease-out"
          )}
          style={
            cardPosition.isCentered
              ? {
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }
              : {
                  top: cardPosition.top,
                  left: cardPosition.left,
                  bottom: cardPosition.bottom,
                }
          }
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/50 text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Step {currentStepIndex + 1} of {totalSteps}
            </span>

            <button
              onClick={skipTour}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Skip Tutorial"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Title & Content */}
          <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-1.5">
            {currentStep.title}
          </h4>

          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            {currentStep.description}
          </p>

          {/* Interactive Action Badge */}
          {currentStep.actionInstruction && (
            <div className="mb-4 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-800/60 rounded-xl flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Touchpad className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 animate-bounce" />
              <span>{currentStep.actionInstruction}</span>
            </div>
          )}

          {/* Progress Indicator Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            {!isFirstStep ? (
              <button
                onClick={previousStep}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={skipTour}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Skip
              </button>

              <button
                onClick={nextStep}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#d60000] hover:bg-red-600 border-b-2 border-red-900 active:translate-y-0.5 shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                {isLastStep ? (
                  <>
                    Finish <CheckCircle2 className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
