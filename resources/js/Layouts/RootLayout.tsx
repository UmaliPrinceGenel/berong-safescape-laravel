import React, { Suspense } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { Chatbot } from "@/Components/chatbot";
import { PageLoader } from "@/Components/page-loader";
import { LogoutLoader } from "@/Components/logout-loader";
import { LoginLoader } from "@/Components/login-loader";
import { ProfileCheckWrapper } from "@/Components/profile-check-wrapper";
import { FocusModeManager } from "@/Components/focus-mode-manager";
import { usePage } from '@inertiajs/react';
import { Toaster } from "@/Components/ui/sonner";
import { AlertTriangle } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { url, component, props } = usePage();
  const isAuthPage = url.startsWith('/login') || url.startsWith('/register');
  
  const isMiniGame = url.startsWith('/kids/quiz') || 
                     url.startsWith('/kids/memory-game') || 
                     url.startsWith('/kids/smoke-crawl') || 
                     url.startsWith('/kids/hot-or-not') || 
                     url.startsWith('/kids/hazard-blitz') ||
                     url.startsWith('/assessment') ||
                     url.startsWith('/game');

  const isHighOpacityBg = component === 'ProfessionalDashboard' || component === 'AdultDashboard' || component === 'AdultPageClient';

  const maintenanceAlert = props.maintenanceAlert as { warning_message: string; is_active: boolean } | null;

  return (
    <AuthProvider>
      <div className="antialiased relative min-h-screen font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>

        {/* Background Image Layer */}
        <div
          className={`fixed top-0 left-0 w-full z-0 pointer-events-none transform-gpu ${isHighOpacityBg ? 'opacity-100' : 'opacity-10 sm:opacity-20'}`}
          style={{ height: '100vh', minHeight: '100lvh' }}
        >
          <img 
            src="/web-background-image.webp"
            alt=""
            className="w-full h-full object-cover"
            style={{ 
              objectPosition: 'center 80%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          />
        </div>

        {/* Content Layer - Full opacity */}
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          <ProfileCheckWrapper>
            <div className={maintenanceAlert ? "pb-12" : ""}>
              {children}
            </div>
          </ProfileCheckWrapper>
          {(!isAuthPage && !isMiniGame) && <Chatbot />}
          <LoginLoader />
          <LogoutLoader />
          <FocusModeManager />
        </div>
        <Toaster position="top-right" richColors duration={3000} />

        {/* Global Pre-Maintenance Alert Banner */}
        {maintenanceAlert && (
          <div className="fixed bottom-0 left-0 w-full z-[10001] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 text-xs sm:text-sm font-black py-3 px-4 text-center flex items-center justify-center gap-2 shadow-[0_-4px_20px_rgba(245,158,11,0.25)] select-none">
            <AlertTriangle className="h-4 w-4 shrink-0 text-slate-950 animate-bounce" style={{ animationDuration: '2s' }} />
            <span className="tracking-wide">{maintenanceAlert.warning_message}</span>
          </div>
        )}
      </div>
    </AuthProvider>
  );
}
