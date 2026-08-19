import React from "react"
import { Skeleton } from "@/Components/ui/skeleton"
import { cn } from "@/lib/utils"

export function KidsWelcomeBannerSkeleton() {
  return (
    <div className="relative bg-slate-200 dark:bg-slate-900/80 rounded-2xl sm:rounded-[2.5rem] shadow-xl mb-6 sm:mb-8 border-[3px] sm:border-[6px] border-white/90 dark:border-slate-800 overflow-hidden animate-pulse transition-colors">
      <div className="relative z-10 px-4 sm:px-10 pt-6 sm:pt-8 lg:pt-10 pb-4 sm:pb-6 lg:pb-4 flex flex-col items-center">
        
        {/* Header Skeleton */}
        <div className="text-center mb-6 lg:mb-8 flex flex-col items-center gap-3">
          <Skeleton className="sm:hidden h-16 w-16 rounded-full bg-white/20" />
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-10 sm:h-16 lg:h-20 w-64 sm:w-[500px] bg-white/20 rounded-xl" />
            <Skeleton className="h-4 sm:h-6 w-48 sm:w-80 bg-white/10 rounded-lg" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
           {/* Card 1 Identity */}
           <div className="hidden lg:flex bg-white/5 dark:bg-white/5 rounded-[2rem] p-6 border border-white/10 items-center gap-6">
              <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/10" />
              <div className="flex-1 space-y-3">
                 <Skeleton className="h-3 w-24 bg-white/10" />
                 <Skeleton className="h-10 w-48 bg-white/20" />
                 <Skeleton className="h-6 w-20 bg-white/10 rounded-full" />
              </div>
           </div>

           {/* Card 2 Badges */}
           <div className="bg-white/5 dark:bg-white/5 rounded-[2rem] p-6 border border-white/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32 bg-white/10" />
                <Skeleton className="h-8 w-24 bg-white/20 rounded-xl" />
              </div>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/10" />
                ))}
              </div>
              <div className="space-y-2 mt-2">
                <Skeleton className="h-2 w-full bg-white/5 rounded-full" />
                <Skeleton className="h-3 w-full bg-white/10 rounded-full" />
              </div>
           </div>
        </div>

        {/* Motto Tags Skeleton */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-1 sm:mt-2">
           <Skeleton className="h-10 sm:h-14 w-24 sm:w-40 rounded-xl sm:rounded-2xl bg-white/20" />
           <Skeleton className="h-10 sm:h-14 w-24 sm:w-40 rounded-xl sm:rounded-2xl bg-white/20" />
           <Skeleton className="h-10 sm:h-14 w-24 sm:w-40 rounded-xl sm:rounded-2xl bg-white/20" />
        </div>
      </div>
    </div>
  )
}

export function ContentCardSkeleton() {
  return (
    <div className="flex flex-col h-full w-full rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse transition-colors">
      {/* Visual Header Skeleton */}
      <Skeleton className="h-40 sm:h-52 w-full" />
      
      {/* Text Content Skeleton */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4 sm:mb-6" />
        
        {/* Footer Skeleton */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-slate-50 dark:border-slate-800">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-24 rounded-xl sm:rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export function ContentGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <ContentCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HeroCarouselSkeleton() {
  return (
    <div className="w-full h-[300px] sm:h-[450px] md:h-[500px] rounded-[2rem] sm:rounded-[3rem] bg-slate-200 dark:bg-slate-800 animate-pulse relative overflow-hidden border-[4px] border-white dark:border-slate-700 shadow-xl transition-colors">
      <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 md:px-24">
        <Skeleton className="h-10 sm:h-16 w-3/4 mb-4 rounded-xl" />
        <Skeleton className="h-6 sm:h-8 w-1/2 mb-8 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>
      {/* Dots skeleton */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-2 w-8 rounded-full" />
        ))}
      </div>
    </div>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border-2 sm:border-[4px] border-white dark:border-slate-700 overflow-hidden relative shadow-[0_4px_0_#cbd5e1] dark:shadow-[0_4px_0_#1e293b] sm:shadow-[0_6px_0_#cbd5e1] sm:dark:shadow-[0_6px_0_#1e293b] animate-pulse transition-colors">
      <Skeleton className="h-28 sm:h-48 w-full bg-slate-200 dark:bg-slate-700" />
      <div className="p-3 sm:p-5 flex flex-col flex-1 gap-3">
        <Skeleton className="h-5 sm:h-7 w-3/4 bg-slate-200 dark:bg-slate-700" />
        <div className="hidden sm:flex flex-col gap-2">
          <Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="mt-auto pt-4 border-t-2 border-dashed border-slate-100 dark:border-slate-700 flex justify-between transition-colors">
          <Skeleton className="h-6 w-24 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-6 w-24 rounded-lg bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  )
}

export function AdultDashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Banner Skeleton */}
      <Skeleton className="h-32 sm:h-48 w-full rounded-[2rem] bg-slate-200 dark:bg-slate-800" />
      
      {/* Notice Skeleton */}
      <Skeleton className="h-16 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
      
      {/* Feature Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Skeleton className="h-32 w-full rounded-[2rem] bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-32 w-full rounded-[2rem] bg-slate-200 dark:bg-slate-800" />
      </div>
      
      {/* Search Skeleton */}
      <Skeleton className="h-14 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
      
      {/* Grid Header Skeleton */}
      <Skeleton className="h-8 w-48 mb-6 bg-slate-200 dark:bg-slate-800" />
      
      {/* Blog Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function FeaturedCardsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Mobile skeleton */}
      <div className="md:hidden space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-[0_6px_0_#cbd5e1] dark:shadow-[0_6px_0_#1e293b] animate-pulse flex items-center gap-4 transition-colors">
             <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
             <div className="flex-1 space-y-2">
               <Skeleton className="h-5 w-1/2" />
               <Skeleton className="h-4 w-3/4" />
             </div>
          </div>
        ))}
      </div>
      
      {/* Desktop skeleton */}
      <div className="hidden md:grid grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-[0_8px_0_#cbd5e1] dark:shadow-[0_8px_0_#1e293b] animate-pulse h-[380px] transition-colors">
            <Skeleton className="h-[200px] w-full bg-slate-200 dark:bg-slate-800" />
            <div className="p-6 space-y-4">
               <div className="flex justify-between items-start">
                  <Skeleton className="h-7 w-1/2 bg-slate-200 dark:bg-slate-800" />
                  <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-700 -mt-10 z-10" />
               </div>
               <Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-800" />
               <Skeleton className="h-10 w-full rounded-full mt-auto bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HotOrNotSkeleton() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center pt-6 md:pt-10 animate-pulse px-4">
      {/* Robot Hint Skeleton */}
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 px-6 py-4 rounded-[2rem] shadow-sm flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      </div>

      {/* Progress Bar Skeleton */}
      <div className="w-full max-w-sm bg-white/80 dark:bg-slate-900/80 p-4 rounded-3xl border-2 border-slate-100 dark:border-slate-800 shadow-sm mb-12">
        <div className="flex justify-between mb-3">
          <Skeleton className="h-2 w-20" />
          <Skeleton className="h-2 w-8" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Main Card Skeleton */}
      <div className="w-[18rem] md:w-[22rem] h-[26rem] md:h-[30rem] bg-white dark:bg-slate-900 border-[4px] md:border-[6px] border-slate-50 dark:border-slate-800 rounded-[2.5rem] md:rounded-[4rem] shadow-xl flex flex-col items-center justify-center p-8">
        <Skeleton className="h-40 w-40 md:h-56 md:w-56 rounded-3xl mb-8" />
        <Skeleton className="h-8 w-3/4 rounded-xl" />
      </div>
    </div>
  )
}

export function UserRowSkeleton() {
  return (
    <div className="p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-700/80 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Skeleton className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton className="h-5 w-40 sm:w-56 bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-20 sm:w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-9 w-20 sm:w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-9 w-20 sm:w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  )
}

export function UserListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <UserRowSkeleton key={i} />
      ))}
    </div>
  )
}

export function ScoreCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 animate-pulse">
      {[1, 2].map((i) => (
        <div 
          key={i} 
          className="border-[3px] border-slate-200 dark:border-slate-800 rounded-[1.25rem] sm:rounded-[1.75rem] p-4 sm:p-6 bg-white dark:bg-slate-950 shadow-[0_4px_0_#cbd5e1] dark:shadow-[0_4px_0_#0f172a]"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Skeleton className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-6 w-32 bg-slate-200 dark:bg-slate-800" />
              </div>
              <Skeleton className="h-3 w-full bg-slate-200 dark:bg-slate-800" />
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <Skeleton className="h-2.5 w-16 bg-slate-200 dark:bg-slate-800" />
                  <Skeleton className="h-5 w-20 bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-2.5 w-16 bg-slate-200 dark:bg-slate-800" />
                  <Skeleton className="h-5 w-20 bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function FireCodeViewerSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      {/* Sidebar TOC Skeleton */}
      <div className="lg:col-span-1 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <Skeleton className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800 mb-4" />
        <Skeleton className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <Skeleton className="h-5 w-10 rounded bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>

      {/* Reader Content Skeleton */}
      <div className="lg:col-span-2 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-3">
          <Skeleton className="h-8 w-2/3 bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-5 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-32 w-full rounded-2xl bg-slate-100 dark:bg-slate-800/50 my-4" />
          <Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  )
}

export function AnalyticsOverviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-[0_8px_0_#cbd5e1] dark:shadow-[0_8px_0_#0f172a] space-y-4"
          >
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
            <Skeleton className="h-10 sm:h-12 w-28 bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>

      {/* Chart Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 p-6 shadow-[0_8px_0_#cbd5e1] dark:shadow-[0_8px_0_#0f172a] space-y-4">
          <Skeleton className="h-6 w-48 bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-64 w-full rounded-xl bg-slate-100 dark:bg-slate-900/50" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-[2rem] border-2 border-slate-200 dark:border-slate-700 p-6 shadow-[0_8px_0_#cbd5e1] dark:shadow-[0_8px_0_#0f172a] space-y-4">
          <Skeleton className="h-6 w-48 bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-64 w-full rounded-xl bg-slate-100 dark:bg-slate-900/50" />
        </div>
      </div>
    </div>
  )
}

export function AssessmentCardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton className="h-6 w-48 bg-slate-200 dark:bg-slate-700" />
      <Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-700" />
      <Skeleton className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700" />
      <div className="p-4 bg-slate-100 dark:bg-slate-900/70 rounded-xl space-y-3 mt-4">
        <Skeleton className="h-4 w-36 bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-4 w-44 bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-700 mt-4" />
    </div>
  )
}

export function AdminTableSkeleton({ rows = 4, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 p-4 sm:p-6 border-2 border-slate-200 dark:border-slate-700/80 rounded-2xl bg-white dark:bg-slate-900/80 shadow-sm animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
        <Skeleton className="h-7 w-44 bg-slate-200 dark:bg-slate-700" />
        <Skeleton className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className={`h-4 bg-slate-200 dark:bg-slate-700 ${c === 0 ? 'w-1/3' : 'flex-1'}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen relative p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 sm:h-14 w-12 sm:w-14 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-6 sm:h-7 w-40 sm:w-56 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-3.5 sm:h-4 w-56 sm:w-80 bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <Skeleton className="h-10 sm:h-11 w-36 sm:w-48 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
      </div>

      {/* Tabs Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 bg-slate-200/50 dark:bg-slate-800/40 p-2.5 rounded-[1.75rem]">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <AdminTableSkeleton rows={5} cols={4} />
    </div>
  )
}

