"use client"

import React, { useState } from "react"
import { Head, Link } from '@inertiajs/react'
import DashboardLayout from "@/Layouts/DashboardLayout"
import { ArrowLeft, User, Calendar, Maximize2, X, Flame } from "lucide-react"
import DOMPurify from "dompurify"

interface BlogArticleProps {
    blog: {
        id: number
        title: string
        content: string
        excerpt: string
        imageUrl: string
        author?: {
            name: string
        } | string
        created_at: string
        createdAt?: string
    }
}

const BlogArticleClient = ({ blog }: BlogArticleProps) => {
    const [isImageExpanded, setIsImageExpanded] = useState(false);

    // Handle both naming conventions just in case
    const dateString = blog.created_at || blog.createdAt;
    const formattedDate = dateString 
        ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Unknown Date';
        
    const authorName = typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Admin';

    return (
        <div className="min-h-screen selection:bg-red-500 selection:text-white pb-24 relative">
            <Head title={`${blog.title} - SafeScape`} />
            
            {/* Expanded Image Modal Lightbox */}
            {isImageExpanded && blog.imageUrl && (
                <div 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, background: 'rgba(0,0,0,0.97)', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}
                    onClick={() => setIsImageExpanded(false)}
                >
                    <button 
                        style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000000, background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', padding: 12, color: 'white', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
                        onClick={(e) => { e.stopPropagation(); setIsImageExpanded(false); }}
                        aria-label="Close fullscreen preview"
                    >
                        <X className="h-6 w-6" strokeWidth={2.5} />
                    </button>
                    <img 
                        src={blog.imageUrl} 
                        alt={blog.title} 
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'block', width: '100%', height: 'auto' }}
                    />
                </div>
            )}

            {/* Exact same background scaling string as RootLayout.tsx for perfect consistency, but at full opacity */}
            <div 
                className="fixed top-0 left-0 w-full -z-10 pointer-events-none"
                style={{ height: '100vh', minHeight: '100lvh' }}
            >
                <img 
                    src="/web-background-image.webp"
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 80%' }}
                />
            </div>

            {/* Frosting overlay to ensure text readability */}
            <div className="fixed inset-0 bg-background/90 -z-10 pointer-events-none transition-colors duration-500"></div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 relative z-10">
                {/* Desktop absolute-positioned Back to Articles button (Upper Leftmost corner) */}
                <div className="hidden lg:block lg:absolute lg:top-1.5 lg:left-4 xl:left-6 z-20">
                    <Link 
                        href="/adult" 
                        className="group inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-white dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 font-bold hover:text-slate-900 dark:hover:text-white border-2 border-slate-200 dark:border-slate-700 border-b-[4px] dark:border-b-slate-900 active:border-b-2 active:translate-y-[2px] shadow-sm transition-all text-xs sm:text-sm"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={3} />
                        Back to Articles
                    </Link>
                </div>

                {/* Navigation Bar - Mobile/Tablet only to avoid overlaps */}
                <div className="mb-4 sm:mb-6 flex lg:hidden">
                    <Link 
                        href="/adult" 
                        className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 font-bold hover:text-slate-900 dark:hover:text-white border-2 border-slate-200 dark:border-slate-700 border-b-[4px] dark:border-b-slate-900 active:border-b-2 active:translate-y-[2px] shadow-sm transition-all text-xs sm:text-sm"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={3} />
                        Back to Articles
                    </Link>
                </div>

                {/* Main Unified Article Card */}
                <article className="max-w-3xl mx-auto bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-[1.5rem] sm:rounded-[2rem] shadow-xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-slate-200/60 dark:border-slate-700/50 overflow-hidden transition-all duration-300">
                    
                    {/* Header Section */}
                    <div className="p-4 sm:p-8 md:p-9 pb-3 sm:pb-5 bg-white dark:bg-transparent transition-colors">
                        <span className="inline-block px-2.5 py-0.5 bg-orange-500/10 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wider rounded-full border border-orange-500/20 mb-3 sm:mb-4 shadow-sm transition-colors">
                            Fire Safety Education
                        </span>
                        
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-[1.2] tracking-tight mb-3 sm:mb-4 transition-colors">
                            {blog.title}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 transition-colors">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200/50 dark:border-slate-800/80 shadow-inner shrink-0 transition-colors">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 dark:text-slate-400" />
                                </div>
                                <div className="text-left py-0.5">
                                    <div className="font-extrabold text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-tight transition-colors">{authorName}</div>
                                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5 transition-colors">
                                        <Calendar className="h-3 w-3" />
                                        {formattedDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expandable Image Section */}
                    {blog.imageUrl && (
                        <div className="px-3 sm:px-8 md:px-9">
                            <div 
                                className="w-full relative group cursor-zoom-in rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-700/90 bg-slate-50 dark:bg-slate-900 shadow-sm transition-all hover:border-orange-500/50 hover:shadow-lg active:scale-[0.995]"
                                onClick={() => setIsImageExpanded(true)}
                            >
                                <img 
                                    src={blog.imageUrl} 
                                    alt={blog.title} 
                                    className="w-full h-auto object-contain rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-[1.005]"
                                />
                                
                                {/* Expand Overlay Hint */}
                                <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 z-20 transition-all duration-200 pointer-events-none">
                                    <div className="bg-slate-950/85 text-white font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl text-[10px] sm:text-xs border border-white/20 backdrop-blur-md">
                                        <Maximize2 className="h-3 w-3 text-orange-400" strokeWidth={2.5} />
                                        <span>Tap to expand full size</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="p-4 sm:p-8 md:p-9 pt-5 sm:pt-8 relative">
                        <div 
                            className="prose prose-slate dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:text-slate-800 dark:prose-headings:text-white prose-headings:tracking-tight 
                                prose-h2:text-base sm:prose-h2:text-xl prose-h2:mt-5 sm:prose-h2:mt-7 prose-h2:mb-2.5 sm:prose-h2:mb-3
                                prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:font-medium prose-p:leading-[1.7] sm:prose-p:leading-[1.8] prose-p:mb-5 prose-p:text-[13px] sm:prose-p:text-sm md:prose-p:text-base
                                prose-a:text-orange-600 dark:prose-a:text-orange-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                                prose-strong:font-black prose-strong:text-slate-800 dark:prose-strong:text-white
                                prose-ul:marker:text-orange-400 dark:prose-ul:marker:text-orange-500 prose-li:font-medium prose-li:text-[13px] sm:prose-li:text-sm md:prose-li:text-base
                                prose-img:rounded-xl sm:prose-img:rounded-2xl prose-img:shadow-md border-slate-100 dark:border-slate-700"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content || '') }}
                        />
                    </div>
                </article>

                {/* Emergency Protocol */}
                <div className="max-w-3xl mx-auto mt-6 sm:mt-8 overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-red-500/[0.02] dark:bg-red-500/[0.03] backdrop-blur-md border border-red-500/20 dark:border-red-500/25 p-5 sm:p-8 shadow-sm transition-colors">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-md animate-pulse" />
                            <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 shadow-sm transition-colors">
                                <Flame className="h-5 w-5 sm:h-7 sm:w-7 text-red-500 dark:text-red-400" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[1.1rem] sm:text-[1.35rem] font-black text-red-600 dark:text-red-400 mb-1.5 transition-colors">Emergency Protocol</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-[13px] sm:text-base transition-colors">
                                In case of a fire emergency, do not hesitate. Call <strong className="font-extrabold text-red-600 dark:text-red-400">911</strong> immediately. Never put yourself at risk trying to fight a large fire. <strong className="font-extrabold text-red-500 dark:text-red-400">Evacuate first</strong>, then call for help.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

BlogArticleClient.layout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>

export default BlogArticleClient
