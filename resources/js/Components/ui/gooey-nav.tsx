'use client';

import React, { useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { router, usePage } from '@inertiajs/react';
import './gooey-nav.css';

export interface GooeyNavItem {
    label: string;
    href: string;
}

interface GooeyNavProps {
    items: GooeyNavItem[];
    particleCount?: number;
    animationTime?: number;
    className?: string;
}

export default function GooeyNav({
    items,
    particleCount = 10,
    animationTime = 600,
    className = ''
}: GooeyNavProps) {
    const pathname = usePage().url;
    const containerRef = useRef<HTMLDivElement>(null);

    // Determine active index based on current pathname
    const activeIndex = items.findIndex(item => {
        if (item.href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(item.href);
    });

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
        if (index === activeIndex) return;
    };

    return (
        <div className={`gooey-nav-container ${className}`} ref={containerRef}>
            <nav>
                <ul>
                    {items.map((item, index) => (
                        <li
                            key={item.href}
                            className={index === activeIndex ? 'active' : ''}
                        >
                            <Link
                                href={item.href}
                                prefetch={false}
                                onClick={(e) => handleClick(e, index)}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
