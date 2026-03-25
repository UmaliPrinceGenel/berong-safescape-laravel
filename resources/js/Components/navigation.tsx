"use client"

import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User, Menu, X, Home, Users, Briefcase, Baby, Shield, Info, Settings } from "lucide-react"
import { NotificationPopover } from "@/components/ui/notification-popover"
import GooeyNav from "@/components/ui/gooey-nav"

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth()
  const { url } = usePage();
  const isDashboard = url === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>("")

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="bg-gradient-to-r from-red-600 via-orange-500 to-[#f97316] sticky top-0 z-50 shadow-md relative">
      {/* Background Image Layer - 10% opacity */}
      <div
        className="absolute inset-0 opacity-5 bg-cover bg-center"
        style={{ backgroundImage: "url('/web-background-image.jpg')" }}
      />

      {/* Content Layer - Full opacity */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4 relative">

            {/* LEFT SECTION: Logo + Branding */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 hover:opacity-90 transition-opacity cursor-pointer">
              {/* Logos */}
              <div className="flex items-center gap-1 sm:gap-2">
                <img
                  src="/bfp logo.png"
                  alt="Bureau of Fire Protection Logo"
                  width={48}
                  height={48}
                  className="rounded-full bg-white p-0.5 object-contain shadow-md w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12"
                />
                <img
                  src="/berong-official-logo.jpg"
                  alt="Berong E-Learning Logo"
                  width={48}
                  height={48}
                  className="rounded-full object-cover shadow-md w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 border-yellow-400/50"
                />
              </div>

              {/* Branding - Compact on mobile */}
              <div className="min-w-0 max-w-[170px] sm:max-w-none">
                <p className="text-white font-bold text-[12px] leading-none sm:text-sm">Berong E-Learning</p>
                <h1 className="text-yellow-400 font-bold leading-tight text-[10px] xl:text-xs hidden sm:block">
                  Fire Safety Education Platform
                </h1>
                <p className="text-white text-[9px] xl:text-[10px] hidden sm:block opacity-90 uppercase tracking-widest mt-0.5">
                  <span className="hidden xl:inline">BUREAU OF FIRE PROTECTION STA CRUZ LAGUNA</span>
                  <span className="xl:hidden">BFP Sta. Cruz</span>
                </p>
              </div>
            </Link>

            {/* CENTER SECTION: GooeyNav Links - Desktop - Absolutely positioned for true center */}
            <div className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2">
              {!isAuthenticated ? (
                <Link href="/">
                  <div className={`font-extrabold text-sm tracking-wide uppercase transition-all ${
                    isDashboard 
                      ? "px-6 py-1.5 rounded-full border-[3px] border-white bg-yellow-400 text-red-600 shadow-[0_4px_0_#b45309] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-[0_0px_0_#b45309]"
                      : "text-white hover:text-white/80"
                  }`}>
                    DASHBOARD
                  </div>
                </Link>
              ) : (
                <GooeyNav
                  items={[
                    { label: 'DASHBOARD', href: '/' },
                    ...(isAuthenticated && user?.permissions.accessProfessional
                      ? [{ label: 'PROFESSIONAL', href: '/professional' }]
                      : []),
                    ...(isAuthenticated && user?.permissions.accessAdult
                      ? [{ label: 'ADULTS', href: '/adult' }]
                      : []),
                    ...(isAuthenticated && user?.permissions.accessKids
                      ? [{ label: 'KIDS', href: '/kids' }]
                      : []),
                    ...(isAuthenticated && user?.role === 'admin'
                      ? [{ label: 'ADMIN', href: '/admin' }]
                      : []),
                  ]}
                  particleCount={12}
                />
              )}
            </div>

            {/* RIGHT SECTION: Time + User Info + Icon Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Time + User Info Column */}
              <div className="text-right hidden md:block mr-2">
                <p className="text-white text-xs whitespace-nowrap font-medium opacity-90">
                  {currentTime}
                </p>
                {isAuthenticated && (
                  <>
                    <p className="text-white font-semibold text-sm">{user?.name}</p>
                    <p className="text-yellow-400 text-xs capitalize">{user?.role}</p>
                  </>
                )}
              </div>

              {/* Icon Buttons with hover animations */}
              {isAuthenticated ? (
                <div className="hidden sm:flex gap-2">
                  <div className="relative group">
                    {/* <Link href="/about">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 border-white/50 text-white bg-transparent hover:bg-white hover:text-red-700 hover:border-white transition-all hover:scale-110"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </Link> */}
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999] pointer-events-none">
                      About
                    </span>
                  </div>
                  <div className="relative group">
                    <NotificationPopover />
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999] pointer-events-none">
                      Notifications
                    </span>
                  </div>
                  <div className="relative group">
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-white/50 text-white bg-transparent hover:bg-white hover:text-red-700 hover:border-white transition-all hover:scale-110"
                    >
                      <Link href="/profile">
                        <User className="h-4 w-4" />
                      </Link>
                    </Button>
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999] pointer-events-none">
                      Profile
                    </span>
                  </div>
                  <div className="relative group">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={logout}
                      className="h-9 w-9 border-white text-white hover:bg-red-600 hover:border-white bg-transparent transition-transform hover:scale-110"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999] pointer-events-none">
                      Logout
                    </span>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="relative group flex items-center">
                    <Link href="/about" className="p-2 flex items-center justify-center rounded-full bg-[#e11d48] border-[3px] border-white text-white shadow-[0_4px_0_#9f1239] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#9f1239] active:translate-y-1 active:shadow-[0_0px_0_#9f1239] transition-all">
                      <Settings className="h-5 w-5" strokeWidth={2.5} />
                    </Link>
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999] pointer-events-none">
                      About
                    </span>
                  </div>
                  <Link href="/login" className="bg-yellow-400 border-[3px] border-white text-red-600 font-extrabold px-6 py-1.5 rounded-full shadow-[0_4px_0_#b45309] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-[0_0px_0_#b45309] transition-all text-sm tracking-wide">
                    Sign In
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <div className="sm:hidden">
                  <NotificationPopover />
                </div>
              )}

              {/* Mobile Menu Button - More prominent */}
              <Button
                variant="ghost"
                size="icon"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-menu"
                className={`lg:hidden h-10 w-10 rounded-xl shrink-0 border border-white/60 transition-all duration-200 ${mobileMenuOpen
                  ? "!bg-white !text-red-700 !border-white shadow-md"
                  : "!bg-transparent !text-white hover:!bg-white hover:!text-red-700 hover:!border-white"
                  }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div id="mobile-nav-menu" className="lg:hidden border-t border-red-600 bg-red-800">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-3 rounded-md text-white font-semibold hover:bg-red-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>

              <Link
                href="/about"
                className="flex items-center gap-3 px-3 py-3 rounded-md text-white font-semibold hover:bg-red-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Info className="h-5 w-5" />
                About
              </Link>

              {isAuthenticated && user?.permissions.accessProfessional && (
                <Link
                  href="/professional"
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-white font-semibold hover:bg-red-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Briefcase className="h-5 w-5" />
                  Professional
                </Link>
              )}

              {isAuthenticated && user?.permissions.accessAdult && (
                <Link
                  href="/adult"
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-white font-semibold hover:bg-red-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  Adults
                </Link>
              )}

              {isAuthenticated && user?.permissions.accessKids && (
                <Link
                  href="/kids"
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-white font-semibold hover:bg-red-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Baby className="h-5 w-5" />
                  Kids
                </Link>
              )}

              {isAuthenticated && user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-white font-semibold hover:bg-red-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-5 w-5" />
                  Admin
                </Link>
              )}

              {/* Mobile User Info */}
              {isAuthenticated && (
                <div className="px-3 py-3 border-t border-red-600 mt-4">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-3 mb-3 rounded-md text-white font-semibold hover:bg-red-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{user?.name}</p>
                      <p className="text-yellow-400 text-sm capitalize">{user?.role}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={logout}
                      className="border-white text-white hover:bg-red-600 bg-transparent"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
