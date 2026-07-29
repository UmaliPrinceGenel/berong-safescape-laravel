import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { TOUR_STEPS, TourStep, UserTourRole } from './tour-config';
import { apiFetch } from '@/lib/api-fetch';

interface TourContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  totalSteps: number;
  tourRole: UserTourRole;
  hasCompletedTour: boolean;
  showCelebrationModal: boolean;
  setShowCelebrationModal: (show: boolean) => void;
  startTour: (role?: UserTourRole) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [tourRole, setTourRole] = useState<UserTourRole>('general');
  const [hasCompletedTour, setHasCompletedTour] = useState<boolean>(true);
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);

  // Determine role based on user.role
  const resolveUserRole = useCallback((roleStr?: string): UserTourRole => {
    if (!roleStr) return 'general';
    const r = roleStr.toLowerCase();
    if (r.includes('admin')) return 'admin';
    if (r.includes('kid')) return 'kids';
    if (r.includes('professional') || r.includes('inspector') || r.includes('bfp')) return 'professional';
    if (r.includes('adult') || r.includes('resident')) return 'adult';
    return 'general';
  }, []);

  // Check if tour should auto-start after login for first time user
  useEffect(() => {
    if (!user) {
      setIsActive(false);
      return;
    }

    const roleKey = resolveUserRole(user.role);
    setTourRole(roleKey);

    const storageKey = `safescape_tour_completed_${user.id || 'guest'}`;
    const localCompleted = localStorage.getItem(storageKey) === 'true';

    setHasCompletedTour(localCompleted);

    // Auto start tour if user just logged in and has not completed tour
    if (!localCompleted && !isActive) {
      const timer = setTimeout(() => {
        setIsActive(true);
        setCurrentStepIndex(0);
      }, 1200); // Gentle 1.2s delay after page load so layout settles

      return () => clearTimeout(timer);
    }
  }, [user, resolveUserRole]);

  const activeSteps = TOUR_STEPS[tourRole] || TOUR_STEPS.general;
  const currentStep = activeSteps[currentStepIndex] || null;

  const startTour = useCallback((specifiedRole?: UserTourRole) => {
    const roleToUse = specifiedRole || resolveUserRole(user?.role);
    setTourRole(roleToUse);
    setCurrentStepIndex(0);
    setIsActive(true);
    setShowCelebrationModal(false);
  }, [user, resolveUserRole]);

  const nextStep = useCallback(() => {
    const steps = TOUR_STEPS[tourRole] || TOUR_STEPS.general;
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStepIndex, tourRole]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const completeTour = useCallback(() => {
    setIsActive(false);
    setHasCompletedTour(true);

    if (user?.id) {
      const storageKey = `safescape_tour_completed_${user.id}`;
      localStorage.setItem(storageKey, 'true');

      // Award engagement points for tour completion
      apiFetch('/api/user/award-engagement-points', {
        method: 'POST',
        body: JSON.stringify({ points: 50, reason: 'Completed Onboarding Tour' })
      }).catch(() => {});
    }

    setShowCelebrationModal(true);
  }, [user?.id]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setHasCompletedTour(true);
    if (user?.id) {
      const storageKey = `safescape_tour_completed_${user.id}`;
      localStorage.setItem(storageKey, 'true');
    }
  }, [user?.id]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        totalSteps: activeSteps.length,
        tourRole,
        hasCompletedTour,
        showCelebrationModal,
        setShowCelebrationModal,
        startTour,
        nextStep,
        previousStep,
        skipTour,
        completeTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
