"use client"

import type React from "react"

import { useState, Suspense, lazy } from "react"
import { router, usePage } from '@inertiajs/react';
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Label } from "@/Components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import { Shield, AlertCircle, Loader2, KeyRound, Eye, EyeOff, ArrowLeft, CheckCircle2, XCircle, Lock, User, MapPin, Mail, FileText, Flame, Award, ShieldCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Link } from '@inertiajs/react';
import Image from '@/Components/Image';
import { motion } from "motion/react"

const RegistrationWizard = lazy(() => import("@/Components/registration-wizard").then(m => ({ default: m.RegistrationWizard })))

function AuthContent() {
  
  const searchParams = new URLSearchParams(window.location.search)
  const isSessionExpired = searchParams.get("session_expired") === "1"
  const { login, register, isAuthenticating, getRedirectPath } = useAuth()
  const [error, setError] = useState("")
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showRegistrationWizard, setShowRegistrationWizard] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const defaultTab = searchParams.get("tab") || "login"
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Reset password state
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetUsername, setResetUsername] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [resetStep, setResetStep] = useState(1) // 1 = username, 2 = code, 3 = new password, 4 = success
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [resetToken, setResetToken] = useState("") // one-time token from step 2
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Password strength checker
  const getPasswordStrength = (pw: string) => {
    const checks = {
      length: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      lowercase: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      symbol: /[^A-Za-z0-9]/.test(pw),
    }
    const passed = Object.values(checks).filter(Boolean).length
    return { checks, passed, total: 5 }
  }

  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    age: "",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!loginData.username) {
      errors.username = "Username is required"
    } else if (loginData.username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    }

    if (!loginData.password) {
      errors.password = "Password is required"
    } else if (loginData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!isLogin) {
      if (!registerData.name) {
        errors.name = "Name is required"
      }
      if (!registerData.username) {
        errors.username = "Username is required"
      } else if (registerData.username.length < 3 || registerData.username.length > 20) {
        errors.username = "Username must be 3-20 characters"
      } else if (!/^[a-zA-Z0-9_]+$/.test(registerData.username)) {
        errors.username = "Username can only contain letters, numbers, and underscores"
      }
      if (!registerData.age) {
        errors.age = "Age is required"
      } else if (Number.parseInt(registerData.age) < 1 || Number.parseInt(registerData.age) > 99) {
        errors.age = "Please enter a valid age (1-99)"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    const result = await login(loginData.username, loginData.password)

    if (result.success) {
      // Determine redirect from the returned user (not stale React state)
      let redirectPath = '/'
      if (result.user) {
        const roles = (result.user.role ?? '').split(',').map(r => r.trim());
        if (roles.includes('admin')) redirectPath = '/admin'
        else if (roles.includes('professional')) redirectPath = '/professional'
        else if (roles.includes('adult')) redirectPath = '/adult'
        else if (roles.includes('kid')) redirectPath = '/kids'
      }
      // Small delay to ensure cookie is fully set and let loading animation play out
      await new Promise(resolve => setTimeout(resolve, 1500))
      // Use full page navigation to clear Next.js router cache
      window.location.href = redirectPath
      return // Ensure we don't setLoading(false) so loader persists
    } else if (result.requiresConfirmation) {
      setLoading(false)
      setShowOverwriteConfirm(true)
    } else {
      setError(result.error || "Invalid username or password")
      setLoading(false)
    }
  }

  const handleConfirmOverwrite = async () => {
    setShowOverwriteConfirm(false)
    setLoading(true)
    setError("")

    const result = await login(loginData.username, loginData.password, true)

    if (result.success) {
      let redirectPath = '/'
      if (result.user) {
        const roles = (result.user.role ?? '').split(',').map(r => r.trim());
        if (roles.includes('admin')) redirectPath = '/admin'
        else if (roles.includes('professional')) redirectPath = '/professional'
        else if (roles.includes('adult')) redirectPath = '/adult'
        else if (roles.includes('kid')) redirectPath = '/kids'
      }
      await new Promise(resolve => setTimeout(resolve, 1500))
      window.location.href = redirectPath
    } else {
      setError(result.error || "Invalid username or password")
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (resetStep === 1) {
      // Step 1: Send verification code
      if (!resetUsername.trim()) {
        setResetMessage({ type: 'error', text: 'Please enter your username or email address.' })
        return
      }

      setResetLoading(true)
      setResetMessage(null)

      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ username: resetUsername.trim(), step: 1 }),
        })
        const result = await response.json().catch(() => null)

        if (response.ok && result?.success) {
          setResetStep(2)
          setResetMessage({ type: 'success', text: result.message })
        } else {
          setResetMessage({ type: 'error', text: result?.error || result?.message || 'Unable to send code. Please try again.' })
        }
      } catch (err) {
        setResetMessage({ type: 'error', text: 'Network connection issue. Please check your connection and try again.' })
      } finally {
        setResetLoading(false)
      }
    } else if (resetStep === 2) {
      // Step 2: Verify code — get one-time reset token
      if (!resetCode.trim()) {
        setResetMessage({ type: 'error', text: 'Please enter the verification code.' })
        return
      }

      setResetLoading(true)
      setResetMessage(null)

      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ username: resetUsername.trim(), step: 2, code: resetCode.trim() }),
        })
        const result = await response.json().catch(() => null)

        if (response.ok && result?.success) {
          setResetToken(result.resetToken)
          setResetStep(3) // Move to new password step
          setResetMessage({ type: 'success', text: result.message })
        } else {
          setResetMessage({ type: 'error', text: result?.error || result?.message || 'Invalid verification code.' })
        }
      } catch (err) {
        setResetMessage({ type: 'error', text: 'Network connection issue. Please try again.' })
      } finally {
        setResetLoading(false)
      }
    } else if (resetStep === 3) {
      // Step 3: Set new password
      const strength = getPasswordStrength(newPassword)
      if (strength.passed < 5) {
        setResetMessage({ type: 'error', text: 'Password does not meet all requirements.' })
        return
      }
      if (newPassword !== confirmNewPassword) {
        setResetMessage({ type: 'error', text: 'Passwords do not match.' })
        return
      }

      setResetLoading(true)
      setResetMessage(null)

      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({
            username: resetUsername.trim(),
            step: 3,
            resetToken: resetToken,
            newPassword: newPassword,
            confirmPassword: confirmNewPassword,
          }),
        })
        const result = await response.json().catch(() => null)

        if (response.ok && result?.success) {
          setResetMessage({ type: 'success', text: result.message })
          setResetStep(4) // Done state
        } else {
          setResetMessage({ type: 'error', text: result?.error || result?.message || 'Unable to reset password.' })
        }
      } catch (err) {
        setResetMessage({ type: 'error', text: 'Network connection issue. Please try again.' })
      } finally {
        setResetLoading(false)
      }
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!registerData.age || Number.parseInt(registerData.age) < 1) {
      setError("Please enter a valid age")
      return
    }

    setLoading(true)

    const result = await register(
      registerData.username,
      registerData.password,
      registerData.name,
      Number.parseInt(registerData.age),
    )

    if (result.success) {
      // Redirect based on user role
      const redirectPath = getRedirectPath()
      
      // Small delay to let the loading screen animation play out smoothly
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Use full page navigation to clear Next.js router cache
      window.location.href = redirectPath
      return // Ensure we don't setLoading(false) so loader persists
    } else {
      setError(result.error || "Registration failed. Username may already be taken.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-white dark:bg-slate-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] flex flex-col items-center p-4 sm:p-6 relative transition-colors duration-500">


      {/* Registration Wizard Modal - Full screen overlay */}
      {showRegistrationWizard && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 overflow-hidden sm:bg-slate-50 dark:sm:bg-slate-950 sm:bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:sm:bg-[radial-gradient(#1e293b_1px,transparent_1px)] sm:[background-size:16px_16px] sm:flex sm:items-center sm:justify-center sm:p-4 transition-colors duration-500">
          <div className="w-full max-w-3xl flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center p-8 h-64 my-auto">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-2" />
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Loading Registration Wizard...</p>
              </div>
            }>
              <RegistrationWizard onBackToLogin={() => setShowRegistrationWizard(false)} />
            </Suspense>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl z-10 relative flex flex-col lg:flex-row items-center gap-6 sm:gap-10 lg:gap-16 my-auto py-4 sm:py-8">
        {/* Left Side — Branding & Highlights */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex justify-center lg:justify-start gap-3 sm:gap-4 mb-3 sm:mb-6">
            <div className="h-14 w-14 sm:h-20 sm:w-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center p-2 flex-shrink-0 transition-colors">
              <img src="/bfp-logo-red.webp" alt="BFP Logo" width="72" height="72" className="object-contain w-full h-full" />
            </div>
            <div className="h-14 w-14 sm:h-20 sm:w-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center p-2 flex-shrink-0 transition-colors">
              <img
                src="/philippine-flag-seal.webp"
                alt="Philippine Seal"
                width="72"
                height="72"
                className="object-contain w-full h-full"
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-[#d60000] dark:text-red-500 mb-2 sm:mb-3 tracking-tight transition-colors">Berong E-Learning</h1>
          <div className="inline-flex items-center justify-center px-4 sm:px-5 py-1.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-full shadow-sm transition-colors">
            <p className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-center leading-tight">BFP Sta Cruz Fire Safety Education</p>
          </div>

          {/* Desktop Feature Highlights */}
          <div className="hidden lg:flex flex-col gap-3 mt-8 w-full max-w-md">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-sm transition-colors">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5 text-[#d60000] dark:text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Interactive Safety Drills</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Master emergency response and fire prevention methods.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-sm transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">BFP Certified Curriculum</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Official modules aligned with Bureau of Fire Protection guidelines.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-sm transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Badges & Achievements</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Complete quizzes and track your fire safety certifications.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — Login Card */}
        <div className="w-full max-w-md flex-shrink-0">
        <Card className="border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl bg-white dark:bg-slate-900 overflow-hidden relative pb-2 sm:pb-4 mx-auto w-full transition-colors duration-500">

          <CardHeader className="pt-6 sm:pt-8 pb-0 sm:pb-2 relative z-10 px-5 sm:px-8">
            <div className="flex flex-col items-center mb-1 sm:mb-2">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 transition-colors">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-[#d60000] dark:text-red-500" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight text-center transition-colors">Access your Account</CardTitle>
            </div>
            <CardDescription className="text-center text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm transition-colors mt-1">Sign in or create an account to access learning materials</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 px-5 sm:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl h-11 sm:h-14 mb-4 sm:mb-6 transition-colors relative border border-slate-200/70 dark:border-slate-700/70">
                <TabsTrigger value="login" className="relative z-10 w-full h-full rounded-xl font-black text-slate-700 dark:text-slate-200 text-xs sm:text-sm data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:shadow-none border-transparent outline-none transition-colors duration-300 hover:text-slate-900 dark:hover:text-white">
                  {activeTab === 'login' && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-[#d60000] dark:bg-red-600 shadow-[0_3px_0_#991b1b] dark:shadow-[0_3px_0_#7f1d1d] rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  Log In
                </TabsTrigger>
                <TabsTrigger value="register" className="relative z-10 w-full h-full rounded-xl font-black text-slate-700 dark:text-slate-200 text-xs sm:text-sm data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:shadow-none border-transparent outline-none transition-colors duration-300 hover:text-slate-900 dark:hover:text-white">
                  {activeTab === 'register' && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-[#d60000] dark:bg-red-600 shadow-[0_3px_0_#991b1b] dark:shadow-[0_3px_0_#7f1d1d] rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  Register
                </TabsTrigger>
              </TabsList>


              {/* Login Tab */}
              <TabsContent value="login" className="min-h-[300px] sm:min-h-[340px] flex flex-col justify-center mt-0 animate-in fade-in-0 slide-in-from-left-4 duration-300">
                <form onSubmit={handleLogin} className="space-y-2 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="login-username" className="text-xs font-black text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider transition-colors">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Enter your username"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                      autoComplete="off"
                      className="h-11 sm:h-12 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 sm:px-4 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-0 focus-visible:border-[#d60000] dark:focus-visible:border-red-500 transition-all font-semibold text-slate-800 dark:text-slate-200"
                    />
                    {validationErrors.username && (
                      <p className="mt-1 text-[11px] sm:text-sm font-bold text-red-600">{validationErrors.username}</p>
                    )}
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="login-password" className="text-xs font-black text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider transition-colors">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        autoComplete="new-password"
                        className="h-11 sm:h-12 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 sm:px-4 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-0 focus-visible:border-[#d60000] dark:focus-visible:border-red-500 transition-all pr-10 sm:pr-12 font-semibold text-slate-800 dark:text-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 p-1 sm:p-1.5 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="mt-1 text-[11px] sm:text-sm font-bold text-red-600">{validationErrors.password}</p>
                    )}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        className="text-[11px] sm:text-xs font-bold text-slate-500 hover:text-[#d60000] dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                        onClick={() => {
                          setShowResetDialog(true)
                          setResetMessage(null)
                          setResetUsername("")
                          setResetCode("")
                          setResetStep(1)
                          setResetToken("")
                          setNewPassword("")
                          setConfirmNewPassword("")
                          setShowNewPassword(false)
                        }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  {isSessionExpired && !error && (
                    <Alert className="rounded-xl py-2 bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-200 dark:border-yellow-900/50 text-yellow-700 dark:text-yellow-400">
                      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <AlertDescription className="text-xs sm:text-sm font-semibold">
                        Your session expired because you logged in on another device. Please sign in again.
                      </AlertDescription>
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="destructive" className="rounded-xl py-2 border-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs sm:text-sm font-semibold">{error}</AlertDescription>
                    </Alert>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#d60000] hover:bg-[#b80000] dark:bg-red-600 dark:hover:bg-red-700 text-white font-extrabold h-12 sm:h-13 rounded-2xl text-sm sm:text-base mt-2 shadow-[0_4px_0_#8a0000] dark:shadow-[0_4px_0_#7f1d1d] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {loading ? "Signing in..." : "Log In"}
                  </button>

                  <div className="flex flex-col items-center gap-0 sm:gap-2 pt-2 sm:pt-6 pb-0 sm:pb-2">
                    <Link href="/">
                      <Button variant="ghost" className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md sm:rounded-lg h-7 sm:h-8 px-2 sm:px-3 transition-colors">
                        <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 text-slate-400 dark:text-slate-500" />
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register" className="min-h-[300px] sm:min-h-[340px] flex flex-col justify-center mt-0 animate-in fade-in-0 slide-in-from-right-4 duration-300">
                <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white mb-1 tracking-tight transition-colors">Create Your Account</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mb-3 sm:mb-4 transition-colors">
                      Join our fire safety community and help protect Santa Cruz, Laguna
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold h-12 sm:h-13 rounded-2xl text-sm sm:text-base shadow-[0_4px_0_#1e3a8a] active:translate-y-1 active:shadow-none transition-all"
                    onClick={() => setShowRegistrationWizard(true)}
                  >
                    Start Registration
                  </button>

                  <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 font-medium mt-3 px-2 leading-relaxed transition-colors">
                    Registration includes a quick fire safety assessment to personalize your learning experience.
                  </p>
                  
                  <div className="flex flex-col items-center pt-2">
                    <Link href="/">
                      <Button variant="ghost" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg h-8 px-3 transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5 mr-1.5 text-slate-400 dark:text-slate-500" />
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent className="top-[8%] translate-y-0 sm:top-[50%] sm:translate-y-[-50%] sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl p-0 overflow-y-auto max-h-[85dvh] sm:max-h-none transition-all duration-300">
            <div className="bg-slate-50 dark:bg-slate-950 border-b-2 border-slate-100 dark:border-slate-800 p-6 sm:p-8 transition-colors">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl font-black text-slate-800 dark:text-white transition-colors">
                  <div className="bg-red-100 dark:bg-red-950/60 p-2.5 rounded-2xl border border-red-200 dark:border-red-900/50 transition-colors">
                    <KeyRound className="h-6 w-6 text-[#d60000] dark:text-red-400" strokeWidth={2.5} />
                  </div>
                  Reset Password
                </DialogTitle>
                <DialogDescription className="text-slate-500 dark:text-slate-400 font-bold mt-2 ml-1 text-sm transition-colors">
                  {resetStep === 1 && 'Enter your username or email address. A verification code will be sent to your email.'}
                  {resetStep === 2 && 'Enter the 6-digit verification code sent to your email.'}
                  {resetStep === 3 && 'Create a strong new password for your account.'}
                  {resetStep === 4 && 'Your password has been changed successfully!'}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Step 1: Username or Email */}
              {resetStep === 1 && (
                <div className="space-y-3">
                  <Label htmlFor="reset-username" className="font-black text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-widest text-[10px] transition-colors">Username or Email</Label>
                  <Input
                    id="reset-username"
                    placeholder="Enter your username or email"
                    value={resetUsername}
                    onChange={(e) => {
                      setResetUsername(e.target.value)
                      setResetMessage(null)
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleResetPassword() }}
                    className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-6 focus-visible:ring-0 focus-visible:border-[#d60000] dark:focus-visible:border-red-500 font-bold text-slate-700 dark:text-white transition-all"
                  />
                </div>
              )}

              {/* Step 2: Verification Code */}
              {resetStep === 2 && (
                <div className="space-y-4 text-center">
                  <Label htmlFor="reset-code" className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs sm:text-sm transition-colors">Verification Code</Label>
                  <Input
                    id="reset-code"
                    placeholder="000000"
                    value={resetCode}
                    onChange={(e) => {
                      setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                      setResetMessage(null)
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && resetCode.length === 6) handleResetPassword() }}
                    maxLength={6}
                    style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: '1', letterSpacing: 'clamp(0.3em, 2vw, 0.5em)' }}
                    className="text-center font-mono h-16 sm:h-28 rounded-[1.5rem] border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-white dark:placeholder:text-slate-700 placeholder:text-slate-300 transition-all focus-visible:ring-0 focus-visible:border-[#d60000] dark:focus-visible:border-red-500 font-bold"
                  />
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Code was sent to your associated email</p>
                </div>
              )}

              {/* Step 3: Set New Password */}
              {resetStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-new-password" className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest text-[10px] transition-colors">New Password</Label>
                    <div className="relative">
                      <Input
                        id="reset-new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setResetMessage(null) }}
                        className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-5 pr-12 focus-visible:ring-0 focus-visible:border-[#d60000] dark:focus-visible:border-red-500 font-bold text-slate-700 dark:text-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 transition-colors"
                        tabIndex={-1}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (() => {
                    const strength = getPasswordStrength(newPassword)
                    const percent = (strength.passed / strength.total) * 100
                    const barColor = percent <= 40 ? '#ef4444' : percent <= 60 ? '#f59e0b' : percent <= 80 ? '#3b82f6' : '#22c55e'
                    return (
                      <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Strength</span>
                          <span className="text-[10px] font-bold" style={{ color: barColor }}>
                            {percent <= 40 ? 'Weak' : percent <= 60 ? 'Fair' : percent <= 80 ? 'Good' : 'Strong'}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, background: barColor }} />
                        </div>
                        <div className="grid grid-cols-1 gap-1 mt-1">
                          {[
                            { key: 'length', label: 'At least 8 characters' },
                            { key: 'uppercase', label: 'Uppercase letter (A-Z)' },
                            { key: 'lowercase', label: 'Lowercase letter (a-z)' },
                            { key: 'number', label: 'Number (0-9)' },
                            { key: 'symbol', label: 'Symbol (!@#$...)' },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center gap-1.5">
                              {strength.checks[key as keyof typeof strength.checks]
                                ? <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                                : <XCircle className="h-3 w-3 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                              }
                              <span className={`text-[10px] font-semibold ${strength.checks[key as keyof typeof strength.checks] ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  <div className="space-y-2">
                    <Label htmlFor="reset-confirm-password" className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest text-[10px] transition-colors">Confirm Password</Label>
                    <Input
                      id="reset-confirm-password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={confirmNewPassword}
                      onChange={(e) => { setConfirmNewPassword(e.target.value); setResetMessage(null) }}
                      onKeyDown={(e) => { if (e.key === 'Enter' && newPassword && confirmNewPassword) handleResetPassword() }}
                      className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-5 focus-visible:ring-0 focus-visible:border-[#d60000] dark:focus-visible:border-red-500 font-bold text-slate-700 dark:text-white transition-all"
                    />
                    {confirmNewPassword && confirmNewPassword !== newPassword && (
                      <p className="text-[10px] font-bold text-red-500 ml-1">Passwords do not match</p>
                    )}
                    {confirmNewPassword && confirmNewPassword === newPassword && newPassword.length > 0 && (
                      <p className="text-[10px] font-bold text-green-500 ml-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Passwords match</p>
                    )}
                  </div>
                </div>
              )}

              {resetMessage && (
                <Alert variant="default"
                  className={resetMessage.type === 'success'
                    ? 'border-green-500 dark:border-green-400/50 bg-green-50 dark:bg-green-500/10 text-green-800 dark:text-green-300 transition-colors [&>svg]:text-green-600 dark:[&>svg]:text-green-300'
                    : 'border-red-400 dark:border-red-400/60 bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-white transition-colors [&>svg]:text-red-500 dark:[&>svg]:text-red-300'
                  }
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-semibold text-sm">{resetMessage.text}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="px-6 sm:p-8 pt-0 pb-8 flex flex-col gap-3">
              {resetStep === 4 ? (
                <Button 
                  onClick={() => setShowResetDialog(false)} 
                  className="w-full bg-slate-900 dark:bg-slate-700 text-white rounded-2xl h-14 font-black uppercase tracking-wider shadow-lg hover:bg-slate-800 transition-all"
                >
                  Back to Sign In
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-2xl h-12 sm:h-14 font-bold text-slate-500 dark:text-slate-400 border-2 border-slate-200 dark:border-slate-700 shadow-[0_4px_0_#e2e8f0] dark:shadow-[0_4px_0_#334155] hover:bg-slate-50 dark:hover:bg-slate-800 active:translate-y-1 active:shadow-none transition-all" 
                    onClick={() => {
                      if (resetStep === 3) {
                        // Can't go back from password step (token is one-time)
                        setShowResetDialog(false)
                      } else if (resetStep === 2) {
                        setResetStep(1)
                        setResetCode("")
                        setResetMessage(null)
                      } else {
                        setShowResetDialog(false)
                      }
                    }}
                  >
                    {resetStep === 2 ? 'Back' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleResetPassword}
                    disabled={
                      resetLoading ||
                      (resetStep === 1 && !resetUsername) ||
                      (resetStep === 2 && resetCode.length !== 6) ||
                      (resetStep === 3 && (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword || getPasswordStrength(newPassword).passed < 5))
                    }
                    className="flex-[1.5] bg-[#d60000] hover:bg-[#b80000] dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-2xl h-12 sm:h-14 font-black uppercase tracking-wider shadow-[0_4px_0_#8a0000] dark:shadow-[0_4px_0_#7f1d1d] active:translate-y-1 active:shadow-none transition-all"
                  >
                    {resetLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      resetStep === 1 ? 'Send Code' : resetStep === 2 ? 'Verify Code' : 'Set Password'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showOverwriteConfirm} onOpenChange={setShowOverwriteConfirm}>
          <DialogContent showCloseButton={false} className="max-w-[90vw] sm:max-w-md bg-white dark:bg-slate-900 border-none rounded-[2rem] p-0 overflow-hidden shadow-2xl transition-colors duration-500">
            <div className="bg-amber-500 dark:bg-amber-600 p-6 text-center border-b-[6px] border-white/20 dark:border-black/20">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl transform rotate-3 overflow-hidden p-2 transition-colors">
                <Shield className="h-10 w-10 text-amber-600 dark:text-amber-500 animate-pulse" strokeWidth={2.5} />
              </div>
              <DialogTitle className="text-2xl font-black text-white uppercase tracking-tight italic drop-shadow-md">Active Session Detected</DialogTitle>
            </div>
            <div className="p-6 sm:p-8 text-center">
              <DialogDescription className="text-slate-500 dark:text-slate-400 font-bold text-base sm:text-lg leading-relaxed mb-6 transition-colors">
                This account is currently logged in on another device. Logging in here will automatically sign you out of the other device.
                <br/><br/>
                Do you want to proceed?
              </DialogDescription>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full mt-6 px-2 sm:px-0">
                <button
                  type="button"
                  onClick={() => setShowOverwriteConfirm(false)}
                  className="w-full sm:flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-extrabold text-sm sm:text-base h-13 sm:h-14 rounded-2xl transition-all border-2 border-slate-200 dark:border-slate-700 shadow-[0_4px_0_#cbd5e1] dark:shadow-[0_4px_0_#1e293b] active:translate-y-0.5 active:shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOverwrite}
                  className="w-full sm:flex-1 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-extrabold text-sm sm:text-base h-13 sm:h-14 rounded-2xl transition-all shadow-[0_4px_0_#d97706] dark:shadow-[0_4px_0_#78350f] active:translate-y-0.5 active:shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none"
                >
                  Yes, Log In Here
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  )
}

function AuthLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center p-4 transition-colors duration-500">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading platform...</p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthContent />
    </Suspense>
  )
}

