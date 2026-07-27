import React, { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Search, Users as UsersIcon, Trash2, ChevronLeft, ChevronRight, Filter, ChevronDown, X } from "lucide-react"
import type { UsersTabProps } from "@/types/admin"

const USERS_PER_PAGE = 20

export const AdminUsersTab: React.FC<UsersTabProps> = ({
  users,
  filteredUsers,
  userSearchQuery,
  setUserSearchQuery,
  promptRoleChange
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [permissionFilter, setPermissionFilter] = useState<string>("all")
  const cardRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Filter users by selected permission
  const permissionFilteredUsers = useMemo(() => {
    if (permissionFilter === "all") return filteredUsers
    return filteredUsers.filter((u) => {
      if (permissionFilter === "accessKids") return !!u.permissions?.accessKids
      if (permissionFilter === "accessAdult") return !!u.permissions?.accessAdult
      if (permissionFilter === "accessProfessional") return !!u.permissions?.accessProfessional
      if (permissionFilter === "isAdmin") return !!u.permissions?.isAdmin
      return true
    })
  }, [filteredUsers, permissionFilter])

  // Reset to page 1 when search query or permission filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [userSearchQuery, permissionFilter])

  const totalPages = Math.max(1, Math.ceil(permissionFilteredUsers.length / USERS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * USERS_PER_PAGE
  const paginatedUsers = permissionFilteredUsers.slice(startIdx, startIdx + USERS_PER_PAGE)

  const resetFilters = () => {
    setPermissionFilter("all")
    setUserSearchQuery("")
  }

  return (
    <div ref={cardRef} className="scroll-mt-28">
      <Card className="rounded-[2rem] border-[3px] border-slate-200 dark:border-slate-700 shadow-[0_8px_0_#cbd5e1] dark:shadow-[0_8px_0_#0f172a] overflow-hidden bg-slate-50 dark:bg-slate-800/50 backdrop-blur-md transition-all">
        <CardHeader className="px-6 pt-6 pb-2">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 p-2 rounded-xl shadow-sm">
                <UsersIcon className="h-6 w-6 text-[#d60000]" strokeWidth={2.5} />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">System Users</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Manage user roles and access permissions · {permissionFilteredUsers.length} user{permissionFilteredUsers.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              {/* Permission Filter */}
              <div className="relative group w-full sm:w-52">
                <Filter className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors ${
                  permissionFilter !== "all" ? "text-[#d60000]" : "text-slate-400 group-focus-within:text-[#d60000]"
                }`} />
                <select
                  value={permissionFilter}
                  onChange={(e) => setPermissionFilter(e.target.value)}
                  className={`w-full pl-10 pr-8 h-11 text-sm text-slate-800 dark:text-white border-2 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 font-bold transition-all hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer appearance-none ${
                    permissionFilter !== "all"
                      ? "border-red-500 dark:border-red-500/60 ring-2 ring-red-500/20"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <option value="all" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">All Permissions</option>
                  <option value="accessKids" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Kid Access</option>
                  <option value="accessAdult" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Adult Access</option>
                  <option value="accessProfessional" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Professional Access</option>
                  <option value="isAdmin" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Admin</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Search Bar */}
              <div className="relative group w-full sm:w-64 lg:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#d60000] transition-colors" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 h-11 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 font-bold transition-all hover:border-slate-300 dark:hover:border-slate-600"
                />
                {userSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setUserSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
          <div className="space-y-4">
            {paginatedUsers.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white/30 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 font-bold text-base mb-2">
                  No users found matching your filters.
                </p>
                {(permissionFilter !== "all" || userSearchQuery !== "") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all cursor-pointer"
                  >
                    Reset Filter & Search
                  </button>
                )}
              </div>
            ) : (
              paginatedUsers.map((u) => (
                <div key={u.id} className="group p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-[0_4px_0_#e2e8f0] dark:hover:shadow-[0_4px_0_#0f172a] hover:-translate-y-0.5 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-2 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black text-base sm:text-lg">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-800 dark:text-white truncate text-base sm:text-lg">{u.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 sm:mt-1">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">{u.email}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">@{u.username}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:block" />
                          <span className="text-xs font-black px-2 py-0.5 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 uppercase tracking-wider">
                            {u.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => promptRoleChange(u.id, "accessKids", u.name, u.permissions.accessKids ? "remove" : "add")}
                        className={`inline-flex items-center justify-center font-extrabold px-4 pb-2 pt-2.5 rounded-xl text-xs sm:text-sm transition-all ${
                          u.permissions.accessKids
                            ? "bg-yellow-500 dark:bg-yellow-600 text-white shadow-[0_4px_0_#ca8a04] dark:shadow-[0_4px_0_#0f172a] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#ca8a04] hover:bg-red-600 dark:hover:bg-red-700 hover:shadow-[0_4px_0_#991b1b] active:translate-y-1 active:shadow-[0_0px_0_#991b1b]"
                            : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-[0_4px_0_#e2e8f0] dark:shadow-[0_4px_0_#0f172a] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#e2e8f0] dark:hover:shadow-[0_6px_0_#0f172a] hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 active:translate-y-1 active:shadow-[0_0px_0_#e2e8f0]"
                        }`}
                      >
                        Kid Access {u.permissions.accessKids && <Trash2 className="h-4 w-4 ml-2 inline opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} style={{ opacity: 0.7 }} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => promptRoleChange(u.id, "accessAdult", u.name, u.permissions.accessAdult ? "remove" : "add")}
                        className={`inline-flex items-center justify-center font-extrabold px-4 pb-2 pt-2.5 rounded-xl text-xs sm:text-sm transition-all ${
                          u.permissions.accessAdult
                            ? "bg-teal-700 dark:bg-teal-800 text-white shadow-[0_4px_0_#0f766e] dark:shadow-[0_4px_0_#0f172a] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#0f766e] hover:bg-red-600 dark:hover:bg-red-700 hover:shadow-[0_4px_0_#991b1b] active:translate-y-1 active:shadow-[0_0px_0_#991b1b]"
                            : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-[0_4px_0_#e2e8f0] dark:shadow-[0_4px_0_#0f172a] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#e2e8f0] dark:hover:shadow-[0_6px_0_#0f172a] hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 active:translate-y-1 active:shadow-[0_0px_0_#e2e8f0]"
                        }`}
                      >
                        Adult Access {u.permissions.accessAdult && <Trash2 className="h-4 w-4 ml-2 inline opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} style={{ opacity: 0.7 }} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => promptRoleChange(u.id, "accessProfessional", u.name, u.permissions.accessProfessional ? "remove" : "add")}
                        className={`inline-flex items-center justify-center font-extrabold px-4 pb-2 pt-2.5 rounded-xl text-xs sm:text-sm transition-all ${
                          u.permissions.accessProfessional
                            ? "bg-[#d60000] text-white shadow-[0_4px_0_#991b1b] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#991b1b] hover:bg-red-600 dark:hover:bg-red-700 active:translate-y-1 active:shadow-[0_0px_0_#991b1b]"
                            : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-[0_4px_0_#e2e8f0] dark:shadow-[0_4px_0_#0f172a] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#e2e8f0] dark:hover:shadow-[0_6px_0_#0f172a] hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 active:translate-y-1 active:shadow-[0_0px_0_#e2e8f0]"
                        }`}
                      >
                        Professional Access {u.permissions.accessProfessional && <Trash2 className="h-4 w-4 ml-2 inline opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} style={{ opacity: 0.7 }} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => promptRoleChange(u.id, "isAdmin", u.name, u.permissions.isAdmin ? "remove" : "add")}
                        className={`inline-flex items-center justify-center font-extrabold px-4 pb-2 pt-2.5 rounded-xl text-xs sm:text-sm transition-all ${
                          u.permissions.isAdmin
                            ? "bg-slate-900 dark:bg-black text-white shadow-[0_4px_0_#0f172a] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#0f172a] hover:bg-red-600 dark:hover:bg-red-700 hover:shadow-[0_4px_0_#991b1b] active:translate-y-1 active:shadow-[0_0px_0_#991b1b]"
                            : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-[0_4px_0_#e2e8f0] dark:shadow-[0_4px_0_#0f172a] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#e2e8f0] hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 active:translate-y-1 active:shadow-[0_0px_0_#e2e8f0]"
                        }`}
                      >
                        Admin {u.permissions.isAdmin && <Trash2 className="h-4 w-4 ml-2 inline opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} style={{ opacity: 0.7 }} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {permissionFilteredUsers.length > USERS_PER_PAGE && (
            <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); setTimeout(scrollToTop, 50); }}
                disabled={safePage <= 1}
                className="inline-flex items-center gap-1.5 font-extrabold px-4 pb-2 pt-2.5 rounded-xl text-sm transition-all bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-[0_4px_0_#e2e8f0] dark:shadow-[0_4px_0_#0f172a] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#e2e8f0] dark:hover:shadow-[0_6px_0_#0f172a] active:translate-y-1 active:shadow-[0_0px_0_#e2e8f0] disabled:opacity-40 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-[0_4px_0_#e2e8f0]"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                Previous
              </button>
              <span className="text-sm font-black text-slate-500 dark:text-slate-400 px-2">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); setTimeout(scrollToTop, 50); }}
                disabled={safePage >= totalPages}
                className="inline-flex items-center gap-1.5 font-extrabold px-4 pb-2 pt-2.5 rounded-xl text-sm transition-all bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-[0_4px_0_#e2e8f0] dark:shadow-[0_4px_0_#0f172a] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#e2e8f0] dark:hover:shadow-[0_6px_0_#0f172a] active:translate-y-1 active:shadow-[0_0px_0_#e2e8f0] disabled:opacity-40 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-[0_4px_0_#e2e8f0]"
              >
                Next
                <ChevronRight className="h-4 w-4" strokeWidth={3} />
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
