"use client"

import { useState } from "react"
import { Gamepad2, Video, Sparkles, BookOpen, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export type ContentCategory = "all" | "games" | "videos" | "activities" | "modules"

interface KidsNavBarProps {
  activeCategory: ContentCategory
  onCategoryChange: (category: ContentCategory) => void
}

export function KidsNavBar({ activeCategory, onCategoryChange }: KidsNavBarProps) {
  const categories = [
    { id: "all" as ContentCategory, label: "All", icon: Home, color: "bg-slate-500 hover:bg-slate-400", shadow: "shadow-[0_4px_0_0_#334155] hover:shadow-[0_6px_0_0_#334155]" },
    { id: "videos" as ContentCategory, label: "Videos", icon: Video, color: "bg-purple-500 hover:bg-purple-400", shadow: "shadow-[0_4px_0_0_#7e22ce] hover:shadow-[0_6px_0_0_#7e22ce]" },
    { id: "games" as ContentCategory, label: "Games", icon: Gamepad2, color: "bg-green-500 hover:bg-green-400", shadow: "shadow-[0_4px_0_0_#15803d] hover:shadow-[0_6px_0_0_#15803d]" },
    { id: "activities" as ContentCategory, label: "Activities", icon: Sparkles, color: "bg-yellow-400 hover:bg-yellow-300", shadow: "shadow-[0_4px_0_0_#b45309] hover:shadow-[0_6px_0_0_#b45309]" },
    { id: "modules" as ContentCategory, label: "My Lessons", icon: BookOpen, color: "bg-blue-500 hover:bg-blue-400", shadow: "shadow-[0_4px_0_0_#1d4ed8] hover:shadow-[0_6px_0_0_#1d4ed8]" },
  ]

  return (
    <div className="mb-8">
      {/* Desktop Navigation - Horizontal */}
      <div className="hidden md:flex justify-center gap-4 flex-wrap">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = activeCategory === category.id

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center gap-2.5 px-8 py-3.5 rounded-full font-black text-sm uppercase transition-all duration-200 active:duration-75 border-2",
                isActive
                  ? `${category.color} text-white border-transparent ${category.shadow} active:translate-y-[4px] active:shadow-none hover:-translate-y-0.5`
                  : "bg-white text-slate-700 border-transparent shadow-[0_4px_0_0_#cbd5e1] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#cbd5e1] hover:text-blue-600 active:translate-y-[4px] active:shadow-none"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2.5} />
              <span className="tracking-wide">{category.label}</span>
            </button>
          )
        })}
      </div>

      {/* Mobile Navigation - Fit all 5 buttons */}
      <div className="md:hidden">
        <div className="flex justify-between gap-2 overflow-x-auto pb-4 px-1 snap-x scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-2xl font-black text-[10px] sm:text-xs uppercase transition-all duration-200 active:duration-75 min-w-[80px] snap-center shrink-0",
                  isActive
                    ? `${category.color} text-white ${category.shadow} active:translate-y-[2px] active:shadow-none`
                    : "bg-white text-slate-700 shadow-[0_2px_0_0_#cbd5e1] active:translate-y-[2px] active:shadow-none hover:text-blue-600"
                )}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
                <span className="tracking-wider">{category.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
