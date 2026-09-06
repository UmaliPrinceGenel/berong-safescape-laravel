"use client"

import React, { useState } from "react"
import ReactDOM, { flushSync } from "react-dom"
import { Head, Link, router } from '@inertiajs/react'
import DashboardLayout from "@/Layouts/DashboardLayout"
import { ArrowLeft, ArrowRight, User, Calendar, Maximize2, X, Flame } from "lucide-react"
import DOMPurify from "dompurify"

interface ArticleNavInfo {
    id: number | string
    title: string
    imageUrl?: string
    category?: string
}

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
    prevArticle?: ArticleNavInfo | null
    nextArticle?: ArticleNavInfo | null
}

const BlogArticleClient = ({ blog, prevArticle, nextArticle }: BlogArticleProps) => {
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [isLightboxToggling, setIsLightboxToggling] = useState(false);

    const toggleImageExpand = (expand: boolean) => {
        if (expand) {
            document.documentElement.classList.add('lightbox-open');
        } else {
            document.documentElement.classList.remove('lightbox-open');
        }

        if (!document.startViewTransition) {
            setIsImageExpanded(expand);
            return;
        }

        // Remove card/title view transition names immediately so only the image morphs
        flushSync(() => {
            setIsLightboxToggling(true);
        });

        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setIsImageExpanded(expand);
            });
        });

        if (transition && transition.finished) {
            transition.finished.finally(() => {
                setIsLightboxToggling(false);
            });
        } else {
            setTimeout(() => setIsLightboxToggling(false), 450);
        }
    };

    // Handle both naming conventions just in case
    const dateString = blog.created_at || blog.createdAt;
    const formattedDate = dateString 
        ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Unknown Date';
        
    const authorName = typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Admin';

    return (
        <div className="min-h-screen selection:bg-red-500 selection:text-white pb-24 relative">
            <Head title={`${blog.title} - SafeScape`} />
            
            {/* Expanded Image Modal Lightbox - rendered via portal to bypass any parent CSS transforms */}
            {isImageExpanded && blog.imageUrl && ReactDOM.createPortal(
                <div 
                    style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        width: '100vw', 
                        height: '100vh', 
                        zIndex: 2147483647, 
                        background: '#000', 
                        overflowY: 'auto', 
                        overflowX: 'hidden', 
                        WebkitOverflowScrolling: 'touch',
                        viewTransitionName: 'lightbox-backdrop'
                    }}
                    onClick={() => toggleImageExpand(false)}
                >
                    <button 
                        style={{ position: 'fixed', top: 16, right: 16, zIndex: 2147483647, background: 'rgba(0,0,0,0.8)', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '50%', padding: 12, color: 'white', cursor: 'pointer', backdropFilter: 'blur(8px)', lineHeight: 0 }}
                        onClick={(e) => { e.stopPropagation(); toggleImageExpand(false); }}
                        aria-label="Close fullscreen preview"
                    >
                        <X className="h-6 w-6" strokeWidth={2.5} />
                    </button>
                    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', overflowX: 'hidden' }}>
                        <img 
                            src={blog.imageUrl} 
                            alt={blog.title} 
                            onClick={(e) => e.stopPropagation()}
                            style={{ display: 'block', width: '175%', maxWidth: 'none', height: 'auto', flexShrink: 0, viewTransitionName: 'article-hero-image' }}
                        />
                    </div>
                </div>,
                document.body
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
                {/* Desktop absolute-positioned navigation (Upper Leftmost corner) */}
                <div className="hidden lg:flex items-center gap-2 lg:absolute lg:top-1.5 lg:left-4 xl:left-6 z-20">
                    <Link 
                        href="/adult#articles-section" 
                        className="group inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-white dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 font-bold hover:text-slate-900 dark:hover:text-white border-2 border-slate-200 dark:border-slate-700 border-b-[4px] dark:border-b-slate-900 active:border-b-2 active:translate-y-[2px] shadow-sm transition-all text-xs sm:text-sm"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={3} />
                        Back to Articles
                    </Link>

                    {prevArticle && (
                        <Link 
                            href={`/adult/blog/${prevArticle.id}`}
                            preserveScroll={false}
                            title={prevArticle.title}
                            className="group inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 font-bold hover:text-slate-900 dark:hover:text-white border-2 border-slate-200 dark:border-slate-700 border-b-[4px] dark:border-b-slate-900 active:border-b-2 active:translate-y-[2px] shadow-sm transition-all text-xs sm:text-sm"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={3} />
                            Previous
                        </Link>
                    )}

                    {nextArticle && (
                        <Link 
                            href={`/adult/blog/${nextArticle.id}`}
                            preserveScroll={false}
                            title={nextArticle.title}
                            className="group inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 font-bold hover:text-slate-900 dark:hover:text-white border-2 border-slate-200 dark:border-slate-700 border-b-[4px] dark:border-b-slate-900 active:border-b-2 active:translate-y-[2px] shadow-sm transition-all text-xs sm:text-sm"
                        >
                            Next
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={3} />
                        </Link>
                    )}
                </div>

                {/* Navigation Bar - Mobile/Tablet */}
                <div className="mb-4 sm:mb-6 flex items-center justify-between lg:hidden gap-2">
                    <Link 
                        href="/adult#articles-section" 
                        className="group inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 font-bold hover:text-slate-900 dark:hover:text-white border-2 border-slate-200 dark:border-slate-700 border-b-[4px] dark:border-b-slate-900 active:border-b-2 active:translate-y-[2px] shadow-sm transition-all text-xs"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={3} />
                        Articles
                    </Link>

                    <div className="flex items-center gap-1.5">
                        {prevArticle && (
                            <Link 
                                href={`/adult/blog/${prevArticle.id}`}
                                preserveScroll={false}
                                title={prevArticle.title}
                                className="group inline-flex items-center gap-1 px-3 py-2 bg-white dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 font-bold hover:text-slate-900 dark:hover:text-white border-2 border-slate-200 dark:border-slate-700 border-b-[4px] dark:border-b-slate-900 active:border-b-2 active:translate-y-[2px] shadow-sm transition-all text-xs"
                            >
                                <ArrowLeft className="h-3 w-3" strokeWidth={3} />
                                Prev
                            </Link>
                        )}
                        {nextArticle && (
                            <Link 
                                href={`/adult/blog/${nextArticle.id}`}
                                preserveScroll={false}
                                title={nextArticle.title}
                                className="group inline-flex items-center gap-1 px-3 py-2 bg-white dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 font-bold hover:text-slate-900 dark:hover:text-white border-2 border-slate-200 dark:border-slate-700 border-b-[4px] dark:border-b-slate-900 active:border-b-2 active:translate-y-[2px] shadow-sm transition-all text-xs"
                            >
                                Next
                                <ArrowRight className="h-3 w-3" strokeWidth={3} />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Main Unified Article Card */}
                <article 
                    style={{ viewTransitionName: isImageExpanded || isLightboxToggling ? 'none' : 'article-card-morph' }}
                    className="max-w-3xl mx-auto bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-[1.5rem] sm:rounded-[2rem] shadow-xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-slate-200/60 dark:border-slate-700/50 overflow-hidden transition-all duration-300"
                >
                    
                    {/* Header Section */}
                    <div className="p-4 sm:p-8 md:p-9 pb-3 sm:pb-5 bg-white dark:bg-transparent transition-colors">
                        <span className="inline-block px-2.5 py-0.5 bg-orange-500/10 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wider rounded-full border border-orange-500/20 mb-3 sm:mb-4 shadow-sm transition-colors">
                            Fire Safety Education
                        </span>
                        
                        <h1 
                            style={{ viewTransitionName: isImageExpanded || isLightboxToggling ? 'none' : 'article-hero-title' }}
                            className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-[1.2] tracking-tight mb-3 sm:mb-4 transition-colors"
                        >
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
                                onClick={() => toggleImageExpand(true)}
                            >
                                <img 
                                    src={blog.imageUrl} 
                                    alt={blog.title} 
                                    className="w-full h-auto object-contain rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-[1.005]"
                                    style={{ viewTransitionName: isImageExpanded ? 'none' : 'article-hero-image' }}
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

                    {/* Article Navigation: Previous & Next Article */}
                    {(prevArticle || nextArticle) && (
                        <div className="border-t border-slate-200/80 dark:border-slate-700/60 p-4 sm:p-7 md:p-8 bg-slate-50/75 dark:bg-slate-900/60 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Continue Reading
                                </span>
                                <Link 
                                    href="/adult#articles-section"
                                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
                                >
                                    All Articles
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Previous Article Card */}
                                {prevArticle ? (
                                    <Link
                                        href={`/adult/blog/${prevArticle.id}`}
                                        preserveScroll={false}
                                        className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-left"
                                    >
                                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400 dark:text-slate-400 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2.5} />
                                            <span>Previous Article</span>
                                        </div>
                                        <div className="font-black text-sm sm:text-base text-slate-800 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                                            {prevArticle.title}
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="hidden sm:flex flex-col justify-center p-4 sm:p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800/80 text-slate-400 dark:text-slate-500">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">First Article</span>
                                        <span className="text-xs font-semibold text-slate-400/80 dark:text-slate-500/80 mt-1">You are reading the first article</span>
                                    </div>
                                )}

                                {/* Next Article Card */}
                                {nextArticle ? (
                                    <Link
                                        href={`/adult/blog/${nextArticle.id}`}
                                        preserveScroll={false}
                                        className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-left sm:text-right"
                                    >
                                        <div className="flex items-center sm:justify-end gap-1.5 text-xs font-extrabold text-slate-400 dark:text-slate-400 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                            <span>Next Article</span>
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                                        </div>
                                        <div className="font-black text-sm sm:text-base text-slate-800 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                                            {nextArticle.title}
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="hidden sm:flex flex-col justify-center items-end p-4 sm:p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 text-right">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Latest Article</span>
                                        <span className="text-xs font-semibold text-slate-400/80 dark:text-slate-500/80 mt-1">You have reached the latest article</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
