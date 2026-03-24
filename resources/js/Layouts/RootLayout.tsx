import React, { Suspense } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { Chatbot } from "@/components/chatbot";
import { PageLoader } from "@/components/page-loader";
import { LogoutLoader } from "@/components/logout-loader";
import { LoginLoader } from "@/components/login-loader";
import { ProfileCheckWrapper } from "@/components/profile-check-wrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="antialiased relative min-h-screen font-sans">
      <Suspense fallback={null}>
        <PageLoader />
      </Suspense>

      {/* Background Image Layer - 20% opacity */}
      <div
        className="fixed inset-0 opacity-10 sm:opacity-20 bg-cover z-0 pointer-events-none"
        style={{ backgroundImage: "url('/web-background-image.jpg')", backgroundPosition: 'center 80%' }}
      />

      {/* Content Layer - Full opacity */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <AuthProvider>
          <ProfileCheckWrapper>
            {children}
          </ProfileCheckWrapper>
          {/* <Chatbot /> */ /* Deferred integration per Phase 6 rules */}
          <LoginLoader />
          <LogoutLoader />
        </AuthProvider>
      </div>
    </div>
  );
}
