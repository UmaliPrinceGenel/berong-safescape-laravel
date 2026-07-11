import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Label } from "@/Components/ui/label"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from "@/Components/ui/button"
import { AlertCircle, CheckCircle, ShieldAlert, Loader2, Save, Power, Megaphone } from "lucide-react"
import { apiFetch } from "@/lib/api-fetch"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog"

export const AdminSettingsTab: React.FC = () => {
  const [maintenance, setMaintenance] = useState({
    is_active: false,
    message: "",
    warning_active: false,
    warning_message: ""
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tabError, setTabError] = useState("")
  const [tabSuccess, setTabSuccess] = useState("")
  
  // Password Confirmation Dialog
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const fetchSettings = async () => {
    setLoading(true)
    setTabError("")
    try {
      const response = await apiFetch("/api/admin/settings/maintenance")
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.settings) {
          setMaintenance(data.settings)
        }
      } else {
        setTabError("Failed to load maintenance configurations.")
      }
    } catch (err) {
      console.error("Error fetching settings:", err)
      setTabError("Failed to connect to system settings API.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleToggleWarning = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTabError("")
    setTabSuccess("")

    try {
      const response = await apiFetch("/api/admin/settings/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: maintenance.is_active, // Keep existing maintenance mode status
          message: maintenance.message,
          warning_active: !maintenance.warning_active, // Toggle warning status
          warning_message: maintenance.warning_message
        })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        setMaintenance(data.settings)
        setTabSuccess(data.settings.warning_active ? "Warning banner enabled successfully." : "Warning banner disabled successfully.")
      } else {
        setTabError(data.errors?.warning_message?.[0] || data.message || "Failed to update alert configurations.")
      }
    } catch (err) {
      console.error("Error updating settings:", err)
      setTabError("Network error occurred.")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveWarningText = async () => {
    setSaving(true)
    setTabError("")
    setTabSuccess("")

    try {
      const response = await apiFetch("/api/admin/settings/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: maintenance.is_active,
          message: maintenance.message,
          warning_active: maintenance.warning_active,
          warning_message: maintenance.warning_message
        })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        setMaintenance(data.settings)
        setTabSuccess("Warning message content saved successfully.")
      } else {
        setTabError(data.errors?.warning_message?.[0] || data.message || "Failed to save alert content.")
      }
    } catch (err) {
      console.error("Error saving warning text:", err)
      setTabError("Network error occurred.")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleMaintenanceClick = () => {
    setTabError("")
    setTabSuccess("")
    
    // If enabling maintenance mode, prompt for password confirmation
    if (!maintenance.is_active) {
      setAdminPassword("")
      setPasswordError("")
      setShowPasswordDialog(true)
    } else {
      // Disabling maintenance mode can be saved immediately
      saveMaintenanceMode(false)
    }
  }

  const handleConfirmMaintenanceMode = async () => {
    if (!adminPassword) {
      setPasswordError("Please enter your password.")
      return
    }

    setPasswordError("")
    saveMaintenanceMode(true)
  }

  const saveMaintenanceMode = async (isActive: boolean) => {
    setSaving(true)
    
    try {
      const payload: any = {
        is_active: isActive,
        message: maintenance.message,
        warning_active: maintenance.warning_active,
        warning_message: maintenance.warning_message
      }

      if (isActive) {
        payload.password = adminPassword
      }

      const response = await apiFetch("/api/admin/settings/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (response.ok && data.success) {
        setMaintenance(data.settings)
        setTabSuccess(isActive ? "System is now in MAINTENANCE MODE." : "System is now ONLINE.")
        setShowPasswordDialog(false)
      } else {
        if (isActive && data.errors?.password) {
          setPasswordError(data.errors.password[0])
        } else {
          setTabError(data.message || "Failed to update maintenance settings.")
          setShowPasswordDialog(false)
        }
      }
    } catch (err) {
      console.error("Error setting maintenance status:", err)
      setTabError("Network error occurred.")
      setShowPasswordDialog(false)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 animate-pulse">
        <Loader2 className="h-10 w-10 text-[#d60000] animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-bold">Fetching Maintenance settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Alert Feedbacks */}
      {tabSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{tabSuccess}</span>
        </div>
      )}

      {tabError && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 flex items-center gap-3 text-rose-600 dark:text-rose-400 font-bold text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{tabError}</span>
        </div>
      )}

      {/* Grid containing Warning Alert Control & Maintenance Control */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: Warning Alerts Settings */}
        <Card className="bg-white/90 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl sm:rounded-[2rem] border-[3px] border-slate-200 dark:border-slate-700 shadow-[0_6px_0_#cbd5e1] dark:shadow-[0_8px_0_#0f172a] sm:shadow-[0_8px_0_#cbd5e1] transition-all duration-300">
          <CardHeader className="p-6 pb-4 sm:p-8 sm:pb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2.5 rounded-2xl">
                <Megaphone className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Warning Banner</CardTitle>
                <CardDescription className="font-bold text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Alert active users before shutdown</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0 space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Banner Notice Status</span>
                <button
                  onClick={handleToggleWarning}
                  disabled={saving}
                  className={`px-4 py-1.5 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-sm ${
                    maintenance.warning_active 
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950" 
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300"
                  }`}
                >
                  {maintenance.warning_active ? "Enabled" : "Disabled"}
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                When enabled, all users browsing SafeScape will see a warnings header at the bottom of the page in real-time.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="warning-message-text" className="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300">Warning Alert Text</Label>
              <Textarea
                id="warning-message-text"
                rows={4}
                value={maintenance.warning_message}
                onChange={(e) => setMaintenance({ ...maintenance, warning_message: e.target.value })}
                placeholder="Alert message details..."
                className="border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white rounded-xl focus-visible:ring-amber-500 text-xs sm:text-sm"
              />
            </div>

            <button
              onClick={handleSaveWarningText}
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl shadow-[0_4px_0_#b45309] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider text-xs"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Alert Notice
            </button>
          </CardContent>
        </Card>

        {/* CARD 2: Maintenance Mode settings */}
        <Card className={`rounded-2xl sm:rounded-[2rem] border-[3px] shadow-[0_6px_0_#cbd5e1] dark:shadow-[0_8px_0_#0f172a] sm:shadow-[0_8px_0_#cbd5e1] transition-all duration-300 bg-white/90 dark:bg-slate-800/50 ${
          maintenance.is_active 
            ? "border-red-500/50 shadow-red-500/10 dark:border-red-500/30" 
            : "border-slate-200 dark:border-slate-700"
        }`}>
          <CardHeader className="p-6 pb-4 sm:p-8 sm:pb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${maintenance.is_active ? "bg-red-100 dark:bg-red-900/30" : "bg-slate-100 dark:bg-slate-700/50"}`}>
                <ShieldAlert className={`h-6 w-6 ${maintenance.is_active ? "text-red-500" : "text-slate-500 dark:text-slate-400"}`} />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Maintenance Mode</CardTitle>
                <CardDescription className="font-bold text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Toggle live user platform lockout</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0 space-y-4">
            <div className={`border rounded-2xl p-4 space-y-3 ${
              maintenance.is_active 
                ? "bg-red-500/10 border-red-500/20" 
                : "bg-slate-500/5 border-slate-500/15"
            }`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-xs font-black uppercase tracking-wider ${
                  maintenance.is_active ? "text-red-500" : "text-slate-500"
                }`}>System Lockout Status</span>
                <button
                  onClick={handleToggleMaintenanceClick}
                  disabled={saving}
                  className={`px-4 py-1.5 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-sm ${
                    maintenance.is_active 
                      ? "bg-red-600 hover:bg-red-500 text-white" 
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300"
                  }`}
                >
                  {maintenance.is_active ? "Active" : "Offline"}
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                When active, all non-admin users will immediately be blocked and redirected to the Maintenance message.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="maintenance-message-text" className="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300">Lockout Page Display Message</Label>
              <Textarea
                id="maintenance-message-text"
                rows={4}
                value={maintenance.message}
                onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
                placeholder="Lockout message details..."
                className="border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white rounded-xl focus-visible:ring-red-500 text-xs sm:text-sm"
              />
            </div>

            <button
              onClick={handleToggleMaintenanceClick}
              disabled={saving}
              className={`w-full inline-flex items-center justify-center gap-2 font-black py-3 rounded-xl hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider text-xs ${
                maintenance.is_active 
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-[0_4px_0_#94a3b8] dark:shadow-[0_4px_0_#334155]" 
                  : "bg-red-600 hover:bg-red-500 text-white shadow-[0_4px_0_#991b1b]"
              }`}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
              {maintenance.is_active ? "Turn System Online" : "Lock Platform (Enter Maintenance)"}
            </button>
          </CardContent>
        </Card>

      </div>

      {/* Verification Password Confirmation Dialog */}
      <AlertDialog open={showPasswordDialog} onOpenChange={(open) => { if (!open && !saving) setShowPasswordDialog(false) }}>
        <AlertDialogContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-[3px] border-red-500/30 rounded-[2rem] shadow-2xl max-w-md w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-red-600 dark:text-red-500 tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-6 w-6" />
              CONFIRM SYSTEM LOCKOUT
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-2">
              You are about to put the platform into **Maintenance Mode**. All active users will be locked out and unable to use the site. 
              <br/><br/>
              To prevent accidental downtime, please verify your **Administrator Password**:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="maint-admin-password" className="font-bold text-slate-700 dark:text-slate-300 text-sm">Admin Password</Label>
            <Input
              id="maint-admin-password"
              type="password"
              placeholder="Confirm password"
              value={adminPassword}
              autoComplete="new-password"
              onChange={(e) => {
                setAdminPassword(e.target.value)
                setPasswordError("")
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmMaintenanceMode() }}
              autoFocus
              className="border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus-visible:ring-red-500 rounded-xl mt-1.5"
            />
            {passwordError && (
              <p className="text-xs font-black text-red-600 dark:text-red-400 mt-2 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {passwordError}
              </p>
            )}
          </div>
          
          <AlertDialogFooter className="gap-3 mt-2">
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => setShowPasswordDialog(false)}
              className="rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all h-11"
            >
              Cancel
            </Button>
            <button
              onClick={handleConfirmMaintenanceMode}
              disabled={saving || !adminPassword}
              className="rounded-xl font-black h-11 px-6 transition-all shadow-[0_4px_0_#991b1b] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#991b1b] active:translate-y-1 active:shadow-none bg-red-600 text-white hover:bg-red-500 border-none disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Enable Lockout"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
