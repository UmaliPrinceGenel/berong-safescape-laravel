"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

interface FireExtinguishedTextProps {
    text: string;
    className?: string;
}

// Cartoon flame SVG shape — a teardrop/flame silhouette
function CartoonFlame({ size = 20, color = "#F97316", delay = 0, duration = 0.6, xDrift = 0 }: {
    size?: number;
    color?: string;
    delay?: number;
    duration?: number;
    xDrift?: number;
}) {
    return (
        <motion.svg
            viewBox="0 0 24 32"
            width={size}
            height={size * 1.4}
            className="absolute pointer-events-none"
            style={{ bottom: "70%", left: "50%", marginLeft: -size / 2 }}
            animate={{
                y: [0, -(size * 1.2 + Math.random() * 10)],
                x: [0, xDrift],
                scale: [1, 1.3, 0.3],
                opacity: [1, 0.85, 0],
                rotate: [0, xDrift > 0 ? 12 : -12, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "easeOut",
            }}
        >
            <path
                d="M12 0C12 0 2 12 2 20C2 26 6.5 32 12 32C17.5 32 22 26 22 20C22 12 12 0 12 0Z"
                fill={color}
            />
            {/* Inner bright core */}
            <path
                d="M12 10C12 10 7 17 7 22C7 26 9 28 12 28C15 28 17 26 17 22C17 17 12 10 12 10Z"
                fill="#FDE047"
                opacity={0.85}
            />
        </motion.svg>
    );
}

// Cartoon water droplet SVG
function CartoonDrop({ size = 10, delay = 0 }: { size?: number; delay?: number }) {
    const xDir = (Math.random() - 0.5) * 40;
    const yDir = -20 + Math.random() * 40;
    return (
        <motion.svg
            viewBox="0 0 16 22"
            width={size}
            height={size * 1.4}
            className="absolute pointer-events-none"
            initial={{ x: 0, y: 0, scale: 0.6, opacity: 0.95 }}
            animate={{
                x: [0, xDir],
                y: [0, yDir],
                scale: [0.6, 1.2, 0.3],
                opacity: [0.95, 0.7, 0],
                rotate: [0, xDir > 0 ? 20 : -20],
            }}
            transition={{
                duration: 0.5 + Math.random() * 0.3,
                repeat: Infinity,
                delay,
                ease: "easeOut",
            }}
        >
            <path
                d="M8 0C8 0 0 9 0 14C0 18.4 3.6 22 8 22C12.4 22 16 18.4 16 14C16 9 8 0 8 0Z"
                fill="#38BDF8"
            />
            <ellipse cx="6" cy="12" rx="2" ry="2.5" fill="#BAE6FD" opacity={0.7} />
        </motion.svg>
    );
}

// Cartoon steam puff
function CartoonSteam({ delay = 0 }: { delay?: number }) {
    const xDrift = (Math.random() - 0.5) * 30;
    return (
        <motion.div
            className="absolute rounded-full bg-white/60 dark:bg-slate-300/50"
            style={{
                width: 16 + Math.random() * 12,
                height: 16 + Math.random() * 12,
                bottom: "80%",
                left: `${30 + Math.random() * 40}%`,
            }}
            animate={{
                y: [0, -40 - Math.random() * 20],
                x: [0, xDrift],
                scale: [0.6, 2.5, 1],
                opacity: [0.7, 0.35, 0],
            }}
            transition={{
                duration: 0.8 + Math.random() * 0.4,
                ease: "easeOut",
                delay,
            }}
        />
    );
}

export function FireExtinguishedText({ text, className = "" }: FireExtinguishedTextProps) {
    const ref = useRef<HTMLHeadingElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [state, setState] = useState<"on-fire" | "extinguishing" | "clean">("on-fire");
    const [sprayProgress, setSprayProgress] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        // Start extinguishing process after 1.5 seconds of being in view
        const startExtinguishing = setTimeout(() => {
            setState("extinguishing");
            
            const duration = 1800;
            let start: number | null = null;
            
            const animate = (timestamp: number) => {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                setSprayProgress(progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setState("clean");
                }
            };
            requestAnimationFrame(animate);
        }, 1500);

        return () => clearTimeout(startExtinguishing);
    }, [isInView]);

    const letters = text.split("");

    // Flame colors palette (cartoonish bright)
    const flameColors = ["#EF4444", "#F97316", "#FBBF24", "#F59E0B", "#EF4444"];

    return (
        <h2 ref={ref} className={`relative inline-block select-none ${className}`}>
            {/* Bouncy background glow */}
            {state !== "clean" && isInView && (
                <motion.div 
                    className="absolute -inset-4 bg-gradient-to-t from-red-500/25 via-orange-400/20 to-yellow-300/15 rounded-3xl z-0 pointer-events-none"
                    animate={{
                        opacity: [0.4, 0.8, 0.5, 0.9, 0.4],
                        scale: [0.97, 1.04, 0.98, 1.03, 0.97],
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "mirror",
                    }}
                />
            )}

            {/* Extinguisher Water Spray */}
            {state === "extinguishing" && (
                <div 
                    className="absolute top-0 bottom-0 pointer-events-none z-20 flex items-center"
                    style={{ 
                        left: `${sprayProgress * 100}%`,
                        transform: "translateX(-50%)",
                    }}
                >
                    <div className="relative w-12 h-24 flex flex-col justify-center">
                        {[...Array(8)].map((_, i) => (
                            <CartoonDrop
                                key={i}
                                size={8 + Math.random() * 8}
                                delay={Math.random() * 0.3}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* The Text */}
            <span className="flex flex-wrap justify-center relative z-10">
                {letters.map((char, idx) => {
                    if (char === " ") return <span key={idx} className="w-3 sm:w-4" />;

                    const charProgress = idx / letters.length;
                    const isExtinguished = state === "clean" || (state === "extinguishing" && sprayProgress > charProgress);
                    const isBeingExtinguished = state === "extinguishing" && Math.abs(sprayProgress - charProgress) < 0.1;

                    return (
                        <span key={idx} className="relative inline-block overflow-visible">
                            {/* Cartoon flames on each burning letter */}
                            {!isExtinguished && isInView && (
                                <span className="absolute -top-2 left-0 right-0 bottom-0 pointer-events-none z-10 overflow-visible">
                                    {/* Big main flame */}
                                    <CartoonFlame
                                        size={14 + Math.random() * 6}
                                        color={flameColors[idx % flameColors.length]}
                                        delay={Math.random() * 0.2}
                                        duration={0.55 + Math.random() * 0.25}
                                        xDrift={(Math.random() - 0.5) * 8}
                                    />
                                    {/* Smaller side flame */}
                                    <CartoonFlame
                                        size={8 + Math.random() * 5}
                                        color="#FBBF24"
                                        delay={0.15 + Math.random() * 0.2}
                                        duration={0.45 + Math.random() * 0.2}
                                        xDrift={(Math.random() - 0.5) * 14}
                                    />
                                </span>
                            )}

                            {/* Steam puffs when being extinguished */}
                            {isBeingExtinguished && (
                                <span className="absolute -top-4 left-0 right-0 bottom-0 pointer-events-none z-15 overflow-visible">
                                    {[...Array(3)].map((_, sIdx) => (
                                        <CartoonSteam key={sIdx} delay={sIdx * 0.12} />
                                    ))}
                                </span>
                            )}

                            {/* The letter itself */}
                            <motion.span
                                className="inline-block"
                                animate={
                                    isExtinguished
                                        ? { 
                                            color: "#ffffff",
                                            textShadow: "0px 2px 6px rgba(0,0,0,0.35)",
                                            scale: [1.15, 1],
                                            y: 0,
                                            rotate: 0,
                                          }
                                        : {
                                            color: ["#EF4444", "#F97316", "#FBBF24", "#F97316", "#EF4444"],
                                            textShadow: [
                                                "0 0 8px rgba(239,68,68,0.8), 0 0 20px rgba(249,115,22,0.5)",
                                                "0 0 12px rgba(251,191,36,0.9), 0 0 25px rgba(245,158,11,0.6)",
                                                "0 0 8px rgba(239,68,68,0.8), 0 0 20px rgba(249,115,22,0.5)",
                                            ],
                                            scale: [1, 1.12, 0.92, 1.08, 1],
                                            y: [0, -3, 2, -2, 0],
                                            rotate: [0, -3, 3, -2, 0],
                                          }
                                }
                                transition={
                                    isExtinguished
                                        ? { duration: 0.35, type: "spring", stiffness: 200, damping: 12 }
                                        : { 
                                            duration: 0.45 + (idx % 3) * 0.08,
                                            repeat: Infinity,
                                            repeatType: "mirror",
                                          }
                                }
                            >
                                {char}
                            </motion.span>
                        </span>
                    );
                })}
            </span>
        </h2>
    );
}
