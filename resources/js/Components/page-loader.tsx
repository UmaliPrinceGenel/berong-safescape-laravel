'use client';

import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Image from '@/components/Image';

export function PageLoader() {
    const pathname = usePage().url;
    const searchParams = new URLSearchParams(window.location.search);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Set loading to false after navigation completes
        setIsLoading(false);
    }, [pathname, searchParams]);

    useEffect(() => {
        // Listen for route change start and finish via Inertia events
        const removeStart = router.on('start', () => setIsLoading(true));
        const removeFinish = router.on('finish', () => setIsLoading(false));
        const removeNavigate = router.on('navigate', () => setIsLoading(false));

        return () => {
            removeStart();
            removeFinish();
            removeNavigate();
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gradient-to-br from-red-700 via-red-600 to-orange-600">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('/web-background-image.jpg')] bg-cover" style={{ backgroundPosition: 'center 80%' }} />
            </div>

            {/* Loader content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Berong Logo Spinner */}
                <div className="relative">
                    {/* Outer spinning ring */}
                    <div className="absolute -inset-4 border-4 border-yellow-400/30 rounded-full"></div>
                    <div className="absolute -inset-4 border-4 border-transparent border-t-yellow-400 border-r-orange-500 rounded-full animate-spin"></div>

                    {/* Glow effect behind logo */}
                    <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-xl animate-pulse"></div>

                    {/* Berong Logo */}
                    <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-2xl border-4 border-yellow-400/50">
                        <img
                            src="/berong-official-logo.jpg"
                            alt="Berong - Loading"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Loading text */}
                <div className="mt-8 text-center">
                    <p className="text-white font-semibold text-lg">Loading</p>
                    <div className="flex gap-1 justify-center mt-1">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
