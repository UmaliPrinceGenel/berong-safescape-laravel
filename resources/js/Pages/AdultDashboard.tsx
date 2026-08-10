"use client"

import React, { useState, useEffect, useRef } from "react"
import { router, usePage, Deferred } from '@inertiajs/react';
import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { Navigation } from "@/Components/navigation"
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import { Flame, Search, BookOpen, Calendar, User, ArrowRight, AlertCircle, Maximize2, Clock, Play, X } from "lucide-react"
import type { BlogPost } from "@/lib/mock-data"
import { Link } from '@inertiajs/react';
import { Footer } from "@/Components/footer"
import DashboardLayout from "@/Layouts/DashboardLayout"
import SpotlightCard from "@/Components/ui/spotlight-card"
import "@/Components/ui/spotlight-card.css"

import { AdultWelcomeBanner } from "@/Components/adult-welcome-banner"
import { AdultDashboardSkeleton } from "@/Components/dashboard-skeletons"

interface AdultPageClientProps {
    initialBlogs: BlogPost[]
    initialVideos?: any[]
}

const getYouTubeId = (url: string) => {
    if (!url) return '';
    url = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/|live\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
        return match[2];
    }
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtube-nocookie.com')) {
            const v = parsed.searchParams.get('v');
            if (v && v.length === 11) return v;
            const paths = parsed.pathname.split('/');
            const lastPath = paths[paths.length - 1];
            if (lastPath && lastPath.length === 11) return lastPath;
        } else if (parsed.hostname.includes('youtu.be')) {
            const path = parsed.pathname.substring(1);
            if (path && path.length === 11) return path;
        }
    } catch (e) {}
    return url;
};

const AdultPageClient = ({ initialBlogs, initialVideos }: AdultPageClientProps) => {
    
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedVideo, setSelectedVideo] = useState<any>(null)

    const playerRef = useRef<HTMLDivElement>(null)
    const ytPlayerRef = useRef<any>(null)
    const [isYTReady, setIsYTReady] = useState(false)

    const blogs = initialBlogs || []
    const videos = initialVideos || []

    // Load YouTube API
    useEffect(() => {
        if ((window as any).YT && (window as any).YT.Player) {
            setIsYTReady(true)
            return
        }

        const tag = document.createElement('script')
        tag.src = "https://www.youtube.com/iframe_api"
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

        ;(window as any).onYouTubeIframeAPIReady = () => {
            setIsYTReady(true)
        }
    }, [])

    // Initialize/Update Player
    useEffect(() => {
        if (selectedVideo && isYTReady && (window as any).YT && (window as any).YT.Player) {
            if (ytPlayerRef.current) {
                try {
                    ytPlayerRef.current.destroy()
                } catch (e) {
                    console.error("Error destroying YT player", e)
                }
                ytPlayerRef.current = null
            }

            const containerWrapper = document.getElementById('youtube-player-container')
            if (containerWrapper) {
                containerWrapper.innerHTML = '<div id="youtube-player" class="w-full h-full"></div>'
                
                ytPlayerRef.current = new (window as any).YT.Player('youtube-player', {
                    videoId: getYouTubeId(selectedVideo.youtubeId),
                    width: '100%',
                    height: '100%',
                    playerVars: {
                        autoplay: 1,
                        rel: 0,
                        modestbranding: 1,
                        enablejsapi: 1,
                        origin: window.location.origin
                    }
                })
            }
        }
    }, [selectedVideo, isYTReady])

    useEffect(() => {
        if (selectedVideo) {
            setTimeout(() => {
                playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        }
    }, [selectedVideo])

    const filteredBlogs = blogs.filter(
        (blog) =>
            (blog.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (blog.excerpt?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (blog.content?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
    )

    return (
        <>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 w-full relative min-h-screen">
            {/* Background Overlay - 70% opacity to let background be 30% visible */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-slate-50/70 dark:bg-slate-950/70 transition-colors duration-500" />

            <div className="relative z-10">
                    {/* Welcome Banner */}
                    <AdultWelcomeBanner />

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
                        {/* Fire Safety Articles Feature */}
                        <Link 
                            href="#articles-section" 
                            onClick={(e) => { e.preventDefault(); document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' }) }} 
                            className="block group h-full outline-none md:hidden"
                        >
                            <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 flex items-center gap-3 sm:gap-6 shadow-[0_6px_0_#cbd5e1] dark:shadow-[0_6px_0_#1e293b] sm:shadow-[0_8px_0_#cbd5e1] sm:dark:shadow-[0_8px_0_#1e293b] border-[3px] border-white dark:border-slate-700 h-full hover:translate-y-[2px] active:translate-y-[6px] sm:hover:translate-y-[2px] sm:active:translate-y-[8px] hover:shadow-[0_4px_0_#cbd5e1] dark:hover:shadow-[0_4px_0_#1e293b] sm:hover:shadow-[0_6px_0_#cbd5e1] sm:dark:hover:shadow-[0_6px_0_#1e293b] active:shadow-none transition-all duration-200">
                                {/* Subtle Background Image */}
                                <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.1] group-hover:opacity-[0.08] dark:group-hover:opacity-[0.15] transition-opacity duration-500">
                                    <img src="/Articles Modal.webp" className="w-full h-full object-cover dark:brightness-50" alt="" />
                                </div>

                                {/* Icon Box */}
                                <div className="h-12 w-12 sm:h-20 sm:w-20 rounded-xl sm:rounded-[1.5rem] bg-white dark:bg-slate-900 border-[2px] sm:border-[3px] border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm z-10 group-hover:scale-105 transition-all">
                                    <BookOpen className="h-6 w-6 sm:h-10 sm:w-10 text-orange-500" strokeWidth={2.5} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 z-10 min-w-0">
                                    <h3 className="text-sm sm:text-lg md:text-base lg:text-lg xl:text-2xl font-black text-slate-800 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                        Fire Safety Articles
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] sm:text-sm mt-0.5 sm:mt-1.5 line-clamp-1 transition-colors">
                                        {blogs.length} professional fire safety guides
                                    </p>
                                </div>

                                {/* Arrow */}
                                <div className="h-8 w-8 sm:h-12 sm:w-12 bg-orange-500 dark:bg-orange-600 rounded-full border-[2px] sm:border-[3px] border-orange-400 dark:border-orange-500 flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.8)] group-hover:ring-4 group-hover:ring-orange-500/30 transition-all duration-300 z-10 shrink-0">
                                    <ArrowRight className="h-4 w-4 sm:h-6 sm:w-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" strokeWidth={3} />
                                </div>
                            </div>
                        </Link>

                        {/* EDITH Feature */}
                        <a href="https://edith.bfpscberong.app" target="_blank" rel="noopener noreferrer" className="block group h-full outline-none relative">
                            {/* FLOATING HOVER PREVIEW WINDOW */}
                            <div className="hidden sm:block absolute bottom-[105%] left-1/2 -translate-x-1/2 mb-2 w-[305px] sm:w-[350px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border-2 border-red-100 dark:border-red-500/40 p-3 shadow-2xl shadow-red-100/50 dark:shadow-red-500/25 pointer-events-none opacity-0 scale-95 -translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 z-50">
                                {/* Triangle indicator below preview */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 bg-white dark:bg-slate-900 border-r-2 border-b-2 border-red-100 dark:border-red-500/40 rotate-45" />
                                
                                {/* Preview indicator */}
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <div className="flex items-center gap-1">
                                        <Flame className="h-3 w-3 text-red-600 dark:text-red-500 shrink-0" strokeWidth={2.5} />
                                        <span className="text-[9.5px] sm:text-[10px] font-black text-red-600 dark:text-red-400 tracking-wider uppercase">Simulator Preview</span>
                                    </div>
                                    <span className="text-[8px] sm:text-[8.5px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">Interactive</span>
                                </div>
                                
                                {/* Simulator Frame */}
                                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-inner">
                                    <img src="/EDITH Modal.webp" className="w-full h-full object-cover opacity-80" alt="Simulator Preview" />
                                    
                                    {/* Animated simulated overlays! */}
                                    {/* Fire Outbreak Source (Pulsing Fire Dot) */}
                                    <div className="absolute top-[28%] left-[22%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                                        <span className="absolute inline-flex h-8 w-8 rounded-full bg-red-500/30 animate-ping"></span>
                                        <span className="absolute inline-flex h-5 w-5 rounded-full bg-red-500/40 animate-pulse"></span>
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white"></div>
                                    </div>
                                    <span className="absolute top-[18%] left-[26%] z-20 bg-red-600/90 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide shadow-sm uppercase animate-pulse">FIRE OUTBREAK</span>

                                    {/* Exit Pathway (Glowing Evacuation Arrow and safe indicator) */}
                                    <div className="absolute bottom-[25%] right-[20%] z-20 flex items-center gap-1.5 bg-emerald-500/95 text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded shadow-md tracking-wider uppercase animate-bounce">
                                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-200"></span>
                                        </span>
                                        Safe Exit Egress
                                    </div>

                                    {/* SVG path to represent glowing escape route */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M 30,22 L 55,22 L 55,42 L 72,42" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" className="animate-[dash_2s_linear_infinite]" />
                                    </svg>
                                    
                                    {/* Custom animation stylesheet injection inline */}
                                    <style>{`
                                        @keyframes dash {
                                            to {
                                                stroke-dashoffset: -20;
                                            }
                                        }
                                    `}</style>
                                </div>
                                
                                {/* Info Box */}
                                <div className="mt-2 text-left px-1">
                                    <h4 className="text-[11px] font-black text-slate-800 dark:text-white leading-tight">Floor Plan Escape Routing</h4>
                                    <p className="text-[9.2px] sm:text-[9.8px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                                        Map safe paths under custom fire spread vectors. Test exit delays and fire code egress protocols.
                                    </p>
                                </div>
                            </div>

                            <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 flex items-center gap-3 sm:gap-6 shadow-[0_6px_0_#cbd5e1] dark:shadow-[0_6px_0_#1e293b] sm:shadow-[0_8px_0_#cbd5e1] sm:dark:shadow-[0_8px_0_#1e293b] border-[3px] border-white dark:border-slate-700 h-full hover:translate-y-[2px] active:translate-y-[6px] sm:hover:translate-y-[2px] sm:active:translate-y-[8px] hover:shadow-[0_4px_0_#cbd5e1] dark:hover:shadow-[0_4px_0_#1e293b] sm:hover:shadow-[0_6px_0_#cbd5e1] sm:dark:hover:shadow-[0_6px_0_#1e293b] active:shadow-none transition-all duration-200">
                                {/* Subtle Background Image */}
                                <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.1] group-hover:opacity-[0.08] dark:group-hover:opacity-[0.15] transition-opacity duration-500">
                                    <img src="/EDITH Modal.webp" className="w-full h-full object-cover dark:brightness-50" alt="" />
                                </div>

                                {/* Icon Box */}
                                <div className="h-12 w-12 sm:h-20 sm:w-20 rounded-xl sm:rounded-[1.5rem] bg-white dark:bg-slate-900 border-[2px] sm:border-[3px] border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm z-10 group-hover:scale-105 transition-all">
                                    <Flame className="h-6 w-6 sm:h-10 sm:w-10 text-red-500" strokeWidth={2.5} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 z-10 min-w-0">
                                    <h3 className="text-sm sm:text-lg md:text-base lg:text-lg xl:text-2xl font-black text-slate-800 dark:text-white leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                        Exit Drill (EDITH)
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] sm:text-sm mt-0.5 sm:mt-1.5 line-clamp-1 transition-colors">
                                        Interactive home fire spread simulator
                                    </p>
                                </div>

                                {/* Arrow */}
                                <div className="h-8 w-8 sm:h-12 sm:w-12 bg-red-500 dark:bg-red-600 rounded-full border-[2px] sm:border-[3px] border-red-400 dark:border-red-500 flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] group-hover:ring-4 group-hover:ring-red-500/30 transition-all duration-300 z-10 shrink-0">
                                    <ArrowRight className="h-4 w-4 sm:h-6 sm:w-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" strokeWidth={3} />
                                </div>
                            </div>
                        </a>

                        {/* Fire Safety Videos Feature */}
                        <Link 
                            href="#videos-section" 
                            onClick={(e) => { e.preventDefault(); document.getElementById('videos-section')?.scrollIntoView({ behavior: 'smooth' }) }} 
                            className="block group h-full outline-none"
                        >
                            <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 flex items-center gap-3 sm:gap-6 shadow-[0_6px_0_#cbd5e1] dark:shadow-[0_6px_0_#1e293b] sm:shadow-[0_8px_0_#cbd5e1] sm:dark:shadow-[0_8px_0_#1e293b] border-[3px] border-white dark:border-slate-700 h-full hover:translate-y-[2px] active:translate-y-[6px] sm:hover:translate-y-[2px] sm:active:translate-y-[8px] hover:shadow-[0_4px_0_#cbd5e1] dark:hover:shadow-[0_4px_0_#1e293b] sm:hover:shadow-[0_6px_0_#cbd5e1] sm:dark:hover:shadow-[0_6px_0_#1e293b] active:shadow-none transition-all duration-200">
                                {/* Subtle Background Image */}
                                <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.1] group-hover:opacity-[0.08] dark:group-hover:opacity-[0.15] transition-opacity duration-500">
                                    <img src="/Videos Modal.webp" className="w-full h-full object-cover dark:brightness-50 animate-pulse" alt="" style={{ animationDuration: '4s' }} />
                                </div>

                                {/* Icon Box */}
                                <div className="h-12 w-12 sm:h-20 sm:w-20 rounded-xl sm:rounded-[1.5rem] bg-white dark:bg-slate-900 border-[2px] sm:border-[3px] border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm z-10 group-hover:scale-105 transition-all">
                                    <Play className="h-6 w-6 sm:h-10 sm:w-10 text-orange-500" strokeWidth={2.5} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 z-10 min-w-0">
                                    <h3 className="text-sm sm:text-lg md:text-base lg:text-lg xl:text-2xl font-black text-slate-800 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                        Safety Videos
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] sm:text-sm mt-0.5 sm:mt-1.5 line-clamp-1 transition-colors">
                                        {videos.length} interactive safety videos
                                    </p>
                                </div>

                                {/* Arrow */}
                                <div className="h-8 w-8 sm:h-12 sm:w-12 bg-orange-500 dark:bg-orange-600 rounded-full border-[2px] sm:border-[3px] border-orange-400 dark:border-orange-500 flex items-center justify-center text-white group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.8)] group-hover:ring-4 group-hover:ring-orange-500/30 transition-all duration-300 z-10 shrink-0">
                                    <ArrowRight className="h-4 w-4 sm:h-6 sm:w-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" strokeWidth={3} />
                                </div>
                            </div>
                        </Link>
                    </div>

                {/* Blog Grid */}
                <div id="articles-section">
                    <h2 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6 text-slate-800 dark:text-white tracking-tight">Fire Safety Articles</h2>

                    {/* Search Bar */}
                    <div className="mb-6 relative group max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-orange-500 transition-colors duration-300" />
                        <input
                            type="text"
                            placeholder="Search fire safety articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-[3px] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-[0_4px_0_#cbd5e1] dark:shadow-[0_4px_0_#0f172a] focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 text-sm font-semibold transition-all duration-300"
                        />
                    </div>

                    <Deferred data="initialBlogs" fallback={<AdultDashboardSkeleton />}>
                        {filteredBlogs.length === 0 ? (
                            <div className="relative overflow-hidden bg-white dark:bg-slate-800 border-[4px] border-dashed border-slate-300 dark:border-slate-700 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-sm transition-all duration-300">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 dark:bg-red-900/20 rounded-full blur-3xl opacity-50 -z-10 transform translate-x-1/2 -translate-y-1/2 transition-colors"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -z-10 transform -translate-x-1/2 translate-y-1/2 transition-colors"></div>
                                
                                <div className="bg-slate-100 dark:bg-slate-700 h-20 w-20 rounded-full flex items-center justify-center mb-6 shadow-inner border-[3px] border-white dark:border-slate-600 relative transition-colors">
                                    <Search className="h-8 w-8 text-slate-400 dark:text-slate-500" strokeWidth={3} />
                                    {searchQuery && (
                                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-600 shadow-sm">
                                            !
                                        </div>
                                    )}
                                </div>
                                
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 transition-colors">
                                    {searchQuery ? "No Matches Found" : "No Articles Available"}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 font-bold max-w-md mx-auto leading-relaxed transition-colors">
                                    {searchQuery 
                                        ? `We couldn't find any articles matching "${searchQuery}". Try adjusting your keywords or browse all articles.` 
                                        : "There are no articles published at the moment. Please check back later!"}
                                </p>
                                
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery("")}
                                        className="mt-8 inline-flex items-center gap-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black px-6 py-3 rounded-full border-[3px] border-slate-200 dark:border-slate-600 shadow-[0_4px_0_#cbd5e1] dark:shadow-[0_4px_0_#1e293b] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#cbd5e1] dark:hover:shadow-[0_6px_0_#1e293b] active:translate-y-1 active:shadow-[0_0px_0_#cbd5e1] transition-all uppercase tracking-wide text-sm"
                                    >
                                        Clear Search & View All
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                {filteredBlogs.map((blog) => (
                                    <Link key={blog.id} href={`/adult/blog/${blog.id}`} className="outline-none block w-full group h-full">
                                        <div className="flex flex-col h-full bg-white dark:bg-slate-800/90 rounded-xl sm:rounded-[1.75rem] overflow-hidden relative transition-all duration-300 border-[2px] border-slate-100 dark:border-slate-700/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_12px_32px_rgba(249,115,22,0.15)] group-active:translate-y-0 group-active:shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                                            {/* Image Section */}
                                            <div className="relative h-28 sm:h-52 shrink-0 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                                                <img
                                                    src={blog.imageUrl || "/placeholder.svg?height=300&width=400"}
                                                    alt={blog.title}
                                                    decoding="async"
                                                    loading="lazy"
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                />
                                                {/* Bottom Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-[1]" />
                                                
                                                {/* Read Time / Date on Image */}
                                                <div className="absolute bottom-3 left-3 z-[2] flex items-center gap-2">
                                                    <span className="text-white/90 text-[10px] sm:text-xs font-bold flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" strokeWidth={2.5} />
                                                        {new Date((blog as any).created_at || blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Accent Line */}
                                            <div className="h-[2px] sm:h-[3px] w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-400" />
                                            
                                            {/* Content Area */}
                                            <div className="p-2.5 sm:p-5 flex flex-col flex-1 bg-white dark:bg-slate-800/90 transition-colors">
                                                <h3 className="font-black text-[11px] sm:text-[1.05rem] text-slate-800 dark:text-white line-clamp-2 mb-1.5 sm:mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug tracking-tight">
                                                    {blog.title}
                                                </h3>
                                                
                                                <p className="text-[10px] sm:text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 sm:line-clamp-3 mb-2.5 sm:mb-5 leading-relaxed flex-1 transition-colors">
                                                    {blog.excerpt || ''}
                                                </p>
                                                
                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-2 sm:pt-4 border-t border-slate-100/80 dark:border-slate-700/40 mt-auto transition-colors">
                                                    {/* Author */}
                                                    <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                                                        <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-slate-100 dark:bg-slate-900/80 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                                                            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-500 dark:text-slate-400" strokeWidth={2.5} />
                                                        </div>
                                                        <div className="flex flex-col min-w-0 leading-none">
                                                            <span className="hidden sm:inline text-xs font-extrabold text-slate-700 dark:text-slate-300 truncate transition-colors">
                                                                {typeof blog.author === 'string' ? blog.author : blog.author?.name}
                                                            </span>
                                                            <span className="sm:hidden text-[10px] font-extrabold text-slate-600 dark:text-slate-400 truncate transition-colors">
                                                                {(() => {
                                                                    const name = typeof blog.author === 'string' ? blog.author : blog.author?.name || '';
                                                                    return name.length > 10 ? name.split(' ')[0] : name;
                                                                })()}
                                                            </span>
                                                            <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Publisher</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Read More CTA Pill */}
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-50 dark:bg-slate-900/60 group-hover:bg-orange-500 dark:group-hover:bg-orange-600 border border-slate-200/60 dark:border-slate-700/60 group-hover:border-orange-500/20 dark:group-hover:border-orange-600/20 text-slate-600 dark:text-slate-400 group-hover:text-white dark:group-hover:text-white font-extrabold text-[10px] sm:text-xs transition-all duration-300 shadow-sm shrink-0">
                                                        Read
                                                        <ArrowRight className="h-2.5 w-2.5 sm:h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300" strokeWidth={2.5} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </Deferred>
                </div>

                {/* Video Player */}
                {selectedVideo && (
                    <div ref={playerRef} className="max-w-5xl mx-auto mt-8 sm:mt-12 mb-8 sm:mb-12 scroll-mt-36 sm:scroll-mt-44 pt-2">
                        <Card className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2rem] border-[3px] border-slate-200 dark:border-slate-800 shadow-[0_8px_0_#cbd5e1] dark:shadow-[0_4px_0_#0f172a] sm:shadow-[0_8px_0_#cbd5e1] dark:sm:shadow-[0_8px_0_#0f172a] overflow-hidden p-3.5 sm:p-6 transition-all duration-300 space-y-3.5 sm:space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 font-black bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[10px] tracking-wider uppercase border border-orange-200 dark:border-orange-900/50">
                                            NOW PLAYING
                                        </span>
                                        {selectedVideo.duration && (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                <Clock className="h-3.5 w-3.5 text-orange-500" />
                                                {selectedVideo.duration}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base sm:text-2xl font-black text-slate-800 dark:text-white leading-tight">
                                        {selectedVideo.title}
                                    </h3>
                                    {selectedVideo.description && (
                                        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            {selectedVideo.description}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0 cursor-pointer"
                                    title="Close Player"
                                >
                                    <X className="h-5 w-5" strokeWidth={2.5} />
                                </button>
                            </div>

                            <div className="aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800">
                                <div id="youtube-player-container" className="w-full h-full">
                                    <div id="youtube-player" className="w-full h-full" />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Videos Section */}
                <div id="videos-section" className="mt-16 sm:mt-24">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">Fire Safety Videos</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Watch educational videos designed to help you prepare for emergency situations.</p>
                        </div>
                    </div>
                    
                    <Deferred data="initialVideos" fallback={<AdultDashboardSkeleton />}>
                        {videos.length === 0 ? (
                            <div className="relative overflow-hidden bg-white dark:bg-slate-800 border-[4px] border-dashed border-slate-300 dark:border-slate-700 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-sm">
                                <div className="bg-slate-100 dark:bg-slate-700 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                                    <Play className="h-6 w-6 text-slate-400 dark:text-slate-500" strokeWidth={3} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">No Videos Available</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">Please check back later! Videos are added regularly by the administrator.</p>
                            </div>
                        ) : (
                            <motion.div 
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                {videos.map((video: any, idx: number) => (
                                    <motion.div
                                        key={video.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        className="h-full"
                                    >
                                        <Card
                                            className="flex flex-row sm:flex-col h-full cursor-pointer group bg-white dark:bg-slate-900 rounded-[1.25rem] sm:rounded-[1.5rem] border-[3px] border-slate-200 dark:border-slate-800 shadow-[0_4px_0_#cbd5e1] dark:shadow-[0_4px_0_#0f172a] hover:-translate-y-1 hover:shadow-[0_6px_0_#cbd5e1] dark:hover:shadow-[0_6px_0_#0f172a] active:translate-y-0.5 active:shadow-none transition-all duration-300 overflow-hidden p-2.5 sm:p-0 gap-0"
                                            onClick={() => setSelectedVideo(video)}
                                        >
                                            {/* Thumbnail Box */}
                                            <div className="relative w-[130px] xs:w-[150px] sm:w-full aspect-video bg-slate-900 rounded-xl sm:rounded-none sm:rounded-t-[1.25rem] overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 sm:border-none">
                                                <img
                                                    src={`https://img.youtube.com/vi/${getYouTubeId(video.youtubeId)}/mqdefault.jpg`}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                                {/* Play Icon Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                                    <div className="w-9 h-9 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                        <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" fill="currentColor" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Info Section */}
                                            <CardContent className="p-0 sm:p-5 pl-3 sm:pl-5 flex flex-col justify-between flex-1 min-w-0 py-0.5 sm:py-5">
                                                <div className="flex flex-col justify-start">
                                                    <CardTitle className="text-xs sm:text-base font-black text-slate-800 dark:text-white line-clamp-2 min-h-[2.25rem] sm:min-h-[2.6rem] leading-tight sm:leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center sm:items-start">
                                                        {video.title}
                                                    </CardTitle>
                                                    {video.description ? (
                                                        <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1 sm:line-clamp-2 min-h-[1rem] sm:min-h-[2.25rem] mt-0.5 sm:mt-1.5 leading-tight sm:leading-normal">
                                                            {video.description}
                                                        </p>
                                                    ) : (
                                                        <div className="min-h-[1rem] sm:min-h-[2.25rem] mt-0.5 sm:mt-1.5" />
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-3 pt-1.5 sm:pt-2.5 sm:border-t border-slate-100 dark:border-slate-800/80">
                                                    {video.duration ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500">
                                                            <Clock className="h-3 w-3 text-orange-500" />
                                                            {video.duration}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full px-2 py-0.5 font-extrabold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[9px] tracking-wider uppercase border border-orange-200 dark:border-orange-900/50">
                                                            Adult Education
                                                        </span>
                                                    )}
                                                    <span className="text-[11px] sm:text-xs font-bold text-slate-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 flex items-center gap-1 transition-colors">
                                                        Watch <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </Deferred>
                </div>
            </div>
        </main>
        </>
    )
}

AdultPageClient.layout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>

export default AdultPageClient
