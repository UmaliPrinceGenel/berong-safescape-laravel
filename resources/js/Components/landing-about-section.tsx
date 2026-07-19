"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, useReducedMotion, useSpring, AnimatePresence } from "motion/react";
import { Link } from '@inertiajs/react';
import {
    Github,
    Linkedin,
    Instagram,
    Globe,
    Flame,
    GraduationCap,
    Shield,
    BookOpen,
    Cpu,
    Gamepad2,
    Code,
    Database,
    Brain,
    Palette,
    Music,
    ChevronLeft,
    ChevronRight,
    X
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { FireExtinguishedText } from "./fire-extinguished-text";

// Team member data
const teamMembers = [
    {
        name: "John Kervin D. Evangelista",
        roles: ["Project Head", "DevOps", "AI/ML Engineer", "Developer"],
        image: "/evangelista_1x1.webp",
        socials: [
            { icon: Github, url: "https://github.com/Toneejake", label: "GitHub" },
            { icon: Globe, url: "https://toneejake.tech", label: "Portfolio" },
            { icon: Linkedin, url: "https://www.linkedin.com/in/jkevangelista/", label: "LinkedIn" },
        ],
        color: "from-red-500 to-orange-500",
        roleIcons: [Shield, Code, Brain, Cpu],
    },
    {
        name: "Aedran Gabriel R. Teaño",
        roles: ["Game Developer", "3D/2D Artist", "Sound Designer"],
        image: "/teano_1x1.webp",
        socials: [
            { icon: Github, url: "https://github.com/Izect", label: "GitHub" },
            { icon: Instagram, url: "https://www.instagram.com/aedraaann/", label: "Instagram" },
            { icon: Linkedin, url: "https://www.linkedin.com/in/aedran-gabriel-teano-76b38a257/", label: "LinkedIn" },
        ],
        color: "from-purple-500 to-pink-500",
        roleIcons: [Gamepad2, Palette, Music],
    },
    {
        name: "Keinji C. Velina",
        roles: ["Developer", "Data Scientist", "AI Engineer"],
        image: "/velina_1x1.webp",
        socials: [
            { icon: Github, url: "https://github.com/sitol2", label: "GitHub" },
            { icon: Linkedin, url: "https://www.linkedin.com/in/keinji-velina-423736326/", label: "LinkedIn" },
        ],
        color: "from-blue-500 to-cyan-500",
        roleIcons: [Code, Database, Brain],
    },
    {
        name: "Kean Gabriel E. Salvahan",
        roles: ["Developer", "UI Designer", "UX Designer"],
        image: "/salvahan_pr.webp",
        socials: [
            { icon: Github, url: "https://github.com/kenji0011", label: "GitHub" },
            { icon: Globe, url: "https://kenji-v2-beta-green.vercel.app/#about", label: "Portfolio" },
            { icon: Linkedin, url: "https://www.linkedin.com/in/salvahan-kean-gabriel-e-06760537b", label: "LinkedIn" },
        ],
        color: "from-emerald-500 to-teal-500",
        roleIcons: [Cpu, GraduationCap, Palette],
    },
    {
        name: "Prince Genel R. Umali",
        roles: ["AI Engineer", "Developer", "Data Scientist"],
        image: "/umali_pr.webp",
        socials: [
            { icon: Github, url: "https://github.com/UmaliPrinceGenel", label: "GitHub" },
            { icon: Linkedin, url: "https://www.linkedin.com/in/umali-prince-genel-r-66a60637b/", label: "LinkedIn" },
        ],
        color: "from-amber-500 to-yellow-500",
        roleIcons: [Brain, Cpu, Database],
    },
    {
        name: "Justin Angelo A. Luzande",
        roles: ["Developer", "UI Designer", "UX Designer"],
        image: "/luzande_pr.webp",
        socials: [
            { icon: Github, url: "#", label: "GitHub" },
            { icon: Linkedin, url: "#", label: "LinkedIn" },
        ],
        color: "from-rose-500 to-pink-500",
        roleIcons: [Cpu, GraduationCap, Palette],
    },
    {
        name: "Aeron Jhed V. Lachano",
        roles: ["Game Designer", "Game Developer","Task Master"],
        image: "/lachano_pr.webp",
        socials: [
            { icon: Github, url: "#", label: "GitHub" },
            { icon: Linkedin, url: "#", label: "LinkedIn" },
        ],
        color: "from-indigo-500 to-blue-500",
        roleIcons: [Palette, Gamepad2],
    },
    {
        name: "Axcel Andrei V. Delos Reyes",
        roles: ["Game Designer", "Game Developer","Task Master"],
        image: "/delosreyes_pr.webp",
        socials: [
            { icon: Github, url: "#", label: "GitHub" },
            { icon: Linkedin, url: "#", label: "LinkedIn" },
        ],
        color: "from-violet-500 to-purple-500",
        roleIcons: [Palette, Gamepad2],
    },
    {
        name: "Zyril G. Dela Paz",
        roles: ["Game Designer", "Game Developer","The Right Call"],
        image: "/delapaz_pr.webp",
        socials: [
            { icon: Github, url: "#", label: "GitHub" },
            { icon: Linkedin, url: "#", label: "LinkedIn" },
        ],
        color: "from-orange-500 to-red-500",
        roleIcons: [Palette, Gamepad2],
    },
    {
        name: "Allain A. Kumar",
        roles: ["EDITH Simulation"],
        image: "/kumar_pr.webp",
        socials: [
            { icon: Github, url: "#", label: "GitHub" },
            { icon: Linkedin, url: "#", label: "LinkedIn" },
        ],
        color: "from-cyan-500 to-blue-500",
        roleIcons: [Cpu],
    },
    {
        name: "Aron Gabriel L. Ogayon",
        roles: ["AI", "Backend Developer", "EDITH Simulation"],
        image: "/ogayon_pr.webp",
        socials: [
            { icon: Github, url: "#", label: "GitHub" },
            { icon: Linkedin, url: "#", label: "LinkedIn" },
        ],
        color: "from-fuchsia-500 to-purple-500",
        roleIcons: [Cpu, Code, Cpu],
    },
    {
        name: "Janvher Lucas J. Sarmiento",
        roles: ["UI Designer", "EDITH Simulation"],
        image: "/sarmiento_pr.webp",
        socials: [
            { icon: Github, url: "#", label: "GitHub" },
            { icon: Linkedin, url: "#", label: "LinkedIn" },
        ],
        color: "from-lime-500 to-green-500",
        roleIcons: [GraduationCap, Cpu],
    },
    {
        name: "Francis Neil M. Mistica",
        roles: ["AI/ML Engineer"],
        image: "/mistica_pr.webp",
        socials: [
            { icon: Github, url: "https://github.com/Kiko915", label: "GitHub" },
            { icon: Globe, url: "https://francismistica.me", label: "Portfolio" },
            { icon: Linkedin, url: "https://www.linkedin.com/in/devkaiko/", label: "LinkedIn" },
        ],
        color: "from-orange-500 to-amber-500",
        roleIcons: [Cpu],
    },
    {
        name: "Ian Patrick Z. Mesias",
        roles: ["Research & Communications"],
        image: "/mesias_pr.webp",
        socials: [
            { icon: Github, url: "https://github.com/imPickleRiick", label: "GitHub" },
            { icon: Linkedin, url: "https://www.linkedin.com/in/ian-patrick-mesias-6a935421b/", label: "LinkedIn" },
        ],
        color: "from-pink-500 to-rose-500",
        roleIcons: [Code],
    },
    {
        name: "Dheyn Michael Orlanda",
        roles: ["Software Engineer"],
        image: "/orlanda_pr.webp",
        socials: [
            { icon: Github, url: "https://github.com/Necookie", label: "GitHub" },
            { icon: Globe, url: "https://necookie.dev", label: "Portfolio" },
            { icon: Linkedin, url: "https://www.linkedin.com/in/dheyn-michael-orlanda-35b6b931b/", label: "LinkedIn" },
        ],
        color: "from-violet-500 to-indigo-500",
        roleIcons: [Code],
    },
];

// Feature Data
const features = [
    {
        icon: BookOpen,
        title: "E-Learning Modules",
        description: "Interactive courses for kids tailored to different learning needs.",
        color: "bg-blue-600 text-white",
    },
    {
        icon: Brain,
        title: "AI-Powered Chatbot",
        description: "Ask Berong, our AI fire safety assistant, any question about fire prevention, emergency preparedness, and BFP guidelines.",
        color: "bg-purple-600 text-white",
    },
    {
        icon: Flame, // Or generic icon, change if needed
        title: "Fire Simulation",
        description: "Practice your home fire escape plan with a realistic 3D fire spread simulation (EDITH).",
        color: "bg-emerald-600 text-white",
    },
    {
        icon: Gamepad2,
        title: "Educational Games",
        description: "Play interactive mini-games like Task Master, Hazard Blitz, and more to test your fire safety knowledge.",
        color: "bg-orange-500 text-white",
    },
];

// Animated Counter Component
function AnimatedCounter({ value, suffix = "", label, icon: Icon, delay = 0 }: { value: number; suffix?: string; label: string; icon: any; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        const timer = setTimeout(() => {
            const duration = 1500;
            const steps = 40;
            const increment = value / steps;
            let current = 0;
            const interval = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(interval);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timer);
    }, [isInView, value, delay]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: delay / 1000 }}
            className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6"
        >
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-1">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" strokeWidth={2.5} />
            </div>
            <span className="text-3xl sm:text-5xl font-black text-white tabular-nums">
                {count}{suffix}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-widest text-center">
                {label}
            </span>
        </motion.div>
    );
}



// Animated Feature Card Component
function FeatureCard({
    feature,
    index,
    reduceMotion
}: {
    feature: { icon: any; title: string; description: string; color: string };
    index: number;
    reduceMotion: boolean;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { 
                opacity: 1, 
                y: 0
            } : {}}
            transition={{
                opacity: { duration: 0.5, delay: index * 0.1 },
                y: { duration: 0.5, delay: index * 0.1 }
            }}
            whileHover={reduceMotion ? {} : { 
                scale: 1.05,
                y: -12,
                transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            whileTap={reduceMotion ? {} : { 
                scale: 0.98,
                y: 4,
                transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            className="group bg-white dark:bg-slate-800 rounded-[2rem] sm:rounded-3xl p-5 sm:p-8 shadow-[0_6px_0_#b45309] sm:shadow-[0_8px_0_#b45309] dark:shadow-[0_6px_0_#0f172a] sm:dark:shadow-[0_8px_0_#0f172a] hover:shadow-[0_10px_0_#b45309] sm:hover:shadow-[0_12px_0_#b45309] dark:hover:shadow-[0_10px_0_#000] border-[3px] sm:border-[4px] border-white dark:border-slate-700 relative overflow-hidden h-full cursor-pointer"
        >
            {/* Playful Background Blob */}
            <div className={`absolute -top-10 -right-10 w-24 h-24 ${feature.color.split(' ')[0]} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700`} />
            
            <div className={`${feature.color} w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-inner border-2 border-white/50`}>
                <feature.icon className="w-7 h-7 sm:w-10 sm:h-10 text-white drop-shadow-sm" strokeWidth={2.5} />
            </div>
            
            <h3 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white mb-2 sm:mb-3 tracking-tight transition-colors">{feature.title}</h3>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 font-bold leading-relaxed transition-colors">{feature.description}</p>
        </motion.div>
    );
}

const getGlowColor = (colorStr: string) => {
    if (colorStr.includes("red-500")) return "rgba(239, 68, 68, 0.35)";
    if (colorStr.includes("purple-500")) return "rgba(168, 85, 247, 0.35)";
    if (colorStr.includes("blue-500")) return "rgba(59, 130, 246, 0.35)";
    if (colorStr.includes("emerald-500")) return "rgba(16, 185, 129, 0.35)";
    if (colorStr.includes("amber-500")) return "rgba(245, 158, 11, 0.35)";
    if (colorStr.includes("rose-500")) return "rgba(244, 63, 94, 0.35)";
    if (colorStr.includes("indigo-500")) return "rgba(99, 102, 241, 0.35)";
    if (colorStr.includes("violet-500")) return "rgba(139, 92, 246, 0.35)";
    if (colorStr.includes("orange-500")) return "rgba(249, 115, 22, 0.35)";
    return "rgba(239, 68, 68, 0.3)";
};

const getBorderGlowColor = (colorStr: string) => {
    if (colorStr.includes("red-500")) return "rgb(239, 68, 68)";
    if (colorStr.includes("purple-500")) return "rgb(168, 85, 247)";
    if (colorStr.includes("blue-500")) return "rgb(59, 130, 246)";
    if (colorStr.includes("emerald-500")) return "rgb(16, 185, 129)";
    if (colorStr.includes("amber-500")) return "rgb(245, 158, 11)";
    if (colorStr.includes("rose-500")) return "rgb(244, 63, 94)";
    if (colorStr.includes("indigo-500")) return "rgb(99, 102, 241)";
    if (colorStr.includes("violet-500")) return "rgb(139, 92, 246)";
    if (colorStr.includes("orange-500")) return "rgb(249, 115, 22)";
    return "rgb(239, 68, 68)";
};

// Static Team Card Component for Mobile / Tablet Viewports
function StaticTeamCard({ member, index }: { member: typeof teamMembers[0]; index: number }) {
    return (
        <div className="h-full w-full">
            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-3 border border-slate-200 dark:border-slate-700 h-full flex flex-col cursor-pointer transition-all duration-300">
                {/* Gradient Header */}
                <div className={`h-32 bg-gradient-to-r ${member.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20" />
                    {/* Decorative circles */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 rounded-full" />
                </div>

                {/* Profile Image */}
                <div className="relative -mt-16 flex justify-center">
                    <div className="relative p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-xl">
                        <div className="absolute inset-0 bg-slate-400 rounded-full opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
                            <img
                                src={member.image}
                                alt={member.name}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-4 text-center flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 transition-colors">{member.name}</h3>

                    {/* Roles */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4 flex-grow content-start min-h-[70px]">
                        {member.roles.map((role, roleIndex) => (
                            <span
                                key={roleIndex}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 h-fit transition-colors"
                            >
                                {member.roleIcons[roleIndex] && (
                                    <span className="w-3 h-3">
                                        {(() => {
                                            const Icon = member.roleIcons[roleIndex];
                                            return <Icon className="w-3 h-3" />;
                                        })()}
                                    </span>
                                )}
                                {role}
                            </span>
                        ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto transition-colors">
                        {member.socials.map((social, socialIndex) => (
                            <a
                                key={socialIndex}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/social"
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10 rounded-full dark:bg-slate-700 dark:border-slate-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 group-hover/social:scale-110"
                                >
                                    <social.icon className="w-5 h-5" />
                                </Button>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Animated Team Card Component
function TeamCard({ member, index, reduceMotion, progress, totalCards = 9 }: { key?: React.Key; member: typeof teamMembers[0]; index: number; reduceMotion: boolean; progress: any; totalCards?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const centerProgress = totalCards > 1 ? index / (totalCards - 1) : 0;
    const distance = useTransform(progress, (p: number) => {
        return (p - centerProgress) * (totalCards - 1);
    });

    // Perfect circular wheel math (R=4000px, Card+Gap=412px)
    // We map the full range from -8 to 8 to cover all cards in the carousel
    const inputRange = [
        -8, -7, -6, -5, -4, -3, -2, -1, 0,
         1,  2,  3,  4,  5,  6,  7,  8
    ];
    
    // Exact Y translation for the circle edge, enhanced for a deeper arc
    const cardY = useTransform(distance, inputRange, [
        2200, 1500, 1000, 650, 380, 190, 80, 20, 0,
        20, 80, 190, 380, 650, 1000, 1500, 2200
    ]);
    
    // Enhanced tangent rotation angles for a more dramatic fan effect
    const cardRotateZ = useTransform(distance, inputRange, [
        65, 55, 45, 36, 27, 19, 12, 6, 0,
        -6, -12, -19, -27, -36, -45, -55, -65
    ]);
    
    // Depth scaling based on cosine of the rotation angle
    const cardScale = useTransform(distance, inputRange, [
        0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.1,
        0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.6, 0.5
    ]);
    


    // Avatar dynamic popping
    const avatarScale = useTransform(distance, [-2, -1, 0, 1, 2], [0.8, 0.9, 1.25, 0.9, 0.8]);
    const avatarY = useTransform(distance, [-2, -1, 0, 1, 2], [10, 5, -20, 5, 10]);
    const nameScale = useTransform(distance, [-1, 0, 1], [0.9, 1.1, 0.9]);
    
    // New opacity fading for distant cards to enhance the 3D depth illusion
    const cardOpacity = useTransform(distance, inputRange, [
        0, 0, 0.1, 0.3, 0.6, 0.85, 0.95, 1, 1,
        1, 0.95, 0.85, 0.6, 0.3, 0.1, 0, 0
    ]);

    // Enhanced hover animation wrapper
    return (
        <motion.div
            style={reduceMotion ? {} : { 
                y: cardY, 
                rotate: cardRotateZ, 
                scale: cardScale, 
                opacity: cardOpacity, 
                transformOrigin: "bottom center"
            }}
            className="h-full w-full transform-gpu will-change-transform"
        >
            <motion.div
                ref={ref}
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0 }}
                animate={reduceMotion ? { opacity: 1, y: 0 } : (isInView ? { opacity: 1 } : {})}
                transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: reduceMotion ? index * 0.05 : 0
                }}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-3 border border-slate-200 dark:border-slate-700 h-full flex flex-col cursor-pointer transition-all duration-300"
            >
            {/* Gradient Header */}
            <div className={`h-32 bg-gradient-to-r ${member.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                {/* Decorative circles */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 rounded-full" />
            </div>

            {/* Profile Image - Now Animated on Scroll */}
            <div className="relative -mt-16 flex justify-center">
                <div
                    className="relative p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-xl"
                >
                    <div className={`absolute inset-0 bg-slate-400 rounded-full opacity-50 group-hover:opacity-75 transition-opacity`} />
                    <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
                        <img
                            src={member.image}
                            alt={member.name}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-4 text-center flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 transition-colors">{member.name}</h3>

                {/* Roles */}
                <div className="flex flex-wrap justify-center gap-2 mb-4 flex-grow content-start min-h-[70px]">
                    {member.roles.map((role, roleIndex) => (
                        <motion.span
                            key={roleIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: (reduceMotion ? index * 0.1 : 0) + roleIndex * 0.05 + 0.15 }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 h-fit transition-colors"
                        >
                            {member.roleIcons[roleIndex] && (
                                <span className="w-3 h-3">
                                    {(() => {
                                        const Icon = member.roleIcons[roleIndex];
                                        return <Icon className="w-3 h-3" />;
                                    })()}
                                </span>
                            )}
                            {role}
                        </motion.span>
                    ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto transition-colors">
                    {member.socials.map((social, socialIndex) => (
                        <a
                            key={socialIndex}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/social"
                        >
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-full dark:bg-slate-700 dark:border-slate-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 group-hover/social:scale-110"
                            >
                                <social.icon className="w-5 h-5" />
                            </Button>
                        </a>
                    ))}
                </div>
            </div>
            </motion.div>
        </motion.div>
    );
}

// Partnership Card Component
function PartnershipCard({ children, delay = 0, reduceMotion = false }: { children: React.ReactNode; delay?: number; reduceMotion?: boolean }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: delay * 0.1
            }}
            whileHover={reduceMotion ? undefined : {
                scale: 1.02,
                transition: { duration: 0.15, ease: "easeOut" }
            }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-full flex flex-col transform-gpu will-change-transform relative overflow-hidden group/partner text-slate-800 dark:text-white shadow-sm dark:shadow-none"
            style={{ backfaceVisibility: "hidden" }}
        >
            {/* Animated gradient glow on hover */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 opacity-0 group-hover/partner:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}

export function LandingAboutSection({ carouselNode }: { carouselNode?: React.ReactNode }) {
    const prefersReducedMotion = useReducedMotion();
    const [isMobileViewport, setIsMobileViewport] = useState(false);
    const [isLaptopOrSmaller, setIsLaptopOrSmaller] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const laptopQuery = window.matchMedia("(max-width: 1540px)");
        
        const updateViewport = () => {
            setIsMobileViewport(mediaQuery.matches);
            setIsLaptopOrSmaller(laptopQuery.matches);
        };

        updateViewport();

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", updateViewport);
            laptopQuery.addEventListener("change", updateViewport);
            return () => {
                mediaQuery.removeEventListener("change", updateViewport);
                laptopQuery.removeEventListener("change", updateViewport);
            };
        }

        mediaQuery.addListener(updateViewport);
        laptopQuery.addListener(updateViewport);
        return () => {
            mediaQuery.removeListener(updateViewport);
            laptopQuery.removeListener(updateViewport);
        };
    }, []);

    const reduceMotion = Boolean(prefersReducedMotion || isMobileViewport);

    // Hero section scroll animation
    const heroRef = useRef(null);
    const { scrollYProgress: heroScrollProgress } = useScroll({
        target: heroRef,
        offset: ["start end", "end start"]
    });
    const mascotRotateY = useTransform(heroScrollProgress, [0, 1], [0, 15]);
    const mascotScale = useTransform(heroScrollProgress, [0, 0.5], [1, 0.9]);
    const heroTextY = useTransform(heroScrollProgress, [0, 1], [0, reduceMotion ? 0 : 80]);
    const heroOpacity = useTransform(heroScrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const heroScale = useTransform(heroScrollProgress, [0, 0.8], [1, 0.95]);

    // Platform Overview section scroll animation
    const platformRef = useRef(null);
    const { scrollYProgress: platformScrollProgress } = useScroll({
        target: platformRef,
        offset: ["start end", "end start"]
    });
    const platformOpacity = useTransform(platformScrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const platformScale = useTransform(platformScrollProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

    // Partnership section scroll animation
    const partnershipRef = useRef(null);
    const { scrollYProgress: partnershipScrollProgress } = useScroll({
        target: partnershipRef,
        offset: ["start end", "end start"]
    });
    const partnershipOpacity = useTransform(partnershipScrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const partnershipScale = useTransform(partnershipScrollProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

    // Team section scroll animation
    const teamRef = useRef(null);
    const { scrollYProgress: teamScrollProgress } = useScroll({
        target: teamRef,
        offset: ["start end", "end start"]
    });
    const teamOpacity = useTransform(teamScrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const teamScale = useTransform(teamScrollProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

    const { scrollYProgress: teamEnterProgress } = useScroll({
        target: teamRef,
        offset: ["start end", "start center"]
    });
    const patternOpacity = useTransform(teamEnterProgress, [0, 1], [0, 1]);

    // Horizontal Scroll Pinning Logic
    const [carouselWidth, setCarouselWidth] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Firefighter Carousel State
    const firefighterImages = [
        "/firefighters_1.webp",
        "/firefighters_2.webp",
        "/firefighters_3.webp",
        "/firefighters_4.webp"
    ];
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % firefighterImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isHovered]);

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev + 1) % firefighterImages.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev - 1 + firefighterImages.length) % firefighterImages.length);
    };

    useEffect(() => {
        const updateWidth = () => {
            if (carouselRef.current) {
                // We scroll exactly until the end of the carousel
                // Centering padding handles the rest natively
                setCarouselWidth(carouselRef.current.scrollWidth - document.documentElement.clientWidth);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const { scrollYProgress: horizontalScrollProgress } = useScroll({
        target: teamRef,
        offset: ["start 72px", "end end"]
    });
    
    // Create dead zones at the start and end of the scroll
    // 0% to 5%: hold first card centered
    // 85% to 100%: hold last card centered before unlocking the page
    const carouselProgress = useTransform(horizontalScrollProgress, [0.05, 0.85], [0, 1]);
    
    // Direct transform without spring physics for 60fps performance
    const teamX = useTransform(carouselProgress, [0, 1], [0, -carouselWidth]);

    return (
        <div className="space-y-10 sm:space-y-20 mt-10 sm:mt-20">
            {/* Meet Berong Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
                <motion.section
                    ref={heroRef}
                    className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-[#0B1120] py-12 sm:py-20 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800/80 shadow-2xl mx-2 sm:mx-0 transition-colors duration-500 transform-gpu will-change-transform"
                    style={{ opacity: heroOpacity, scale: heroScale }}
                >
                    {/* Modern Glow Effects */}
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-500/10 dark:bg-red-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/10 dark:bg-orange-500/10 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

                    {/* Subtle Dot Pattern */}
                    <motion.div
                        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
                        style={{ y: useTransform(heroScrollProgress, [0, 1], [0, 50]) }}
                    >
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                            backgroundSize: "32px 32px",
                        }} />
                    </motion.div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-6 xl:gap-8 max-w-6xl mx-auto">
                            {/* Berong Mascot - 3D Rotation on Scroll */}
                            <motion.div
                                className="flex-shrink-0 flex justify-center lg:justify-end lg:w-[45%]"
                                style={{
                                    rotateY: mascotRotateY,
                                    scale: mascotScale,
                                }}
                            >
                                <div className="relative w-48 h-48 sm:w-80 sm:h-80 lg:w-[320px] lg:h-[320px] xl:w-[400px] xl:h-[400px]">
                                    <motion.div
                                        className="relative w-full h-full"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        animate={reduceMotion ? { y: 0 } : { 
                                            y: [-12, 12, -12]
                                        }}
                                        transition={reduceMotion ? { duration: 0.6 } : {
                                            y: { duration: 4, ease: "easeInOut", repeat: Infinity },
                                            opacity: { duration: 0.6 },
                                            scale: { duration: 0.6 }
                                        }}
                                    >
                                        <img
                                            src="/berong-official-logo.webp"
                                            alt="Berong's E-Learning - Official Logo"
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)] transition-all"
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                            {/* Hero Content - Parallax Text */}
                            <motion.div
                                className="text-center lg:text-left flex-grow lg:w-[55%] pb-1 sm:pb-0 flex flex-col justify-center lg:-ml-4"
                                style={reduceMotion ? undefined : { y: heroTextY }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4 }}
                                    className="mb-6 flex justify-center lg:justify-start"
                                >
                                    <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] px-5 py-2 rounded-full inline-block border border-red-200/50 dark:border-red-500/20 shadow-sm transition-colors">
                                        About SafeScape
                                    </span>
                                </motion.div>
                                
                                <motion.h1
                                    className="text-4xl sm:text-6xl xl:text-7xl font-black mb-3 sm:mb-4 text-slate-800 dark:text-white tracking-tight transition-colors flex flex-wrap justify-center lg:justify-start"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={{
                                        hidden: { opacity: 1 },
                                        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
                                    }}
                                >
                                    <span className="flex mr-3 sm:mr-4">
                                        {Array.from("Meet").map((char, i) => (
                                            <motion.span key={i} variants={{ hidden: { opacity: 0, y: 30, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 12, stiffness: 200 } } }}>
                                                {char}
                                            </motion.span>
                                        ))}
                                    </span>
                                    <span className="flex text-red-500 drop-shadow-sm">
                                        {Array.from("Berong").map((char, i) => (
                                            <motion.span key={i} variants={{ hidden: { opacity: 0, y: 30, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 12, stiffness: 200 } } }}>
                                                {char}
                                            </motion.span>
                                        ))}
                                    </span>
                                </motion.h1>
                                
                                <motion.div
                                    className="text-xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-orange-500 tracking-tight flex flex-wrap justify-center lg:justify-start"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={{
                                        hidden: { opacity: 1 },
                                        visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.6 } }
                                    }}
                                >
                                    {"Your Fire Safety Companion".split(" ").map((word, wIdx) => (
                                        <span key={wIdx} className="flex mr-2 sm:mr-3 last:mr-0">
                                            {Array.from(word).map((char, cIdx) => (
                                                <motion.span key={cIdx} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 15, stiffness: 200 } } }}>
                                                    {char}
                                                </motion.span>
                                            ))}
                                        </span>
                                    ))}
                                </motion.div>
                                
                                <motion.p
                                    className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 sm:px-0 transition-colors"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.15 }}
                                >
                                    <strong className="text-slate-900 dark:text-slate-100 font-bold">SafeScape</strong>, locally known as <strong className="text-slate-900 dark:text-slate-100 font-bold">&quot;Berong E-Learning&quot;</strong>, is named after the official mascot of the Bureau of Fire Protection.
                                    Berong represents our commitment to making fire safety education accessible, engaging, and effective for every Filipino.
                                </motion.p>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>
            </div>

            {/* Animated Stats Counter Strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <motion.section
                    className="py-8 sm:py-12 bg-gradient-to-r from-red-700 via-red-600 to-orange-600 dark:from-red-950 dark:via-red-900 dark:to-orange-900 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm mx-2 sm:mx-0 relative overflow-hidden transition-colors duration-500"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
                            backgroundSize: "24px 24px",
                        }} />
                    </div>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                            <AnimatedCounter value={5} suffix="+" label="Learning Modules" icon={BookOpen} delay={0} />
                            <AnimatedCounter value={3} suffix="" label="User Roles" icon={Shield} delay={150} />
                            <AnimatedCounter value={6} suffix="+" label="Mini Games" icon={Gamepad2} delay={300} />
                            <AnimatedCounter value={1} suffix="" label="AI Chatbot" icon={Brain} delay={450} />
                        </div>
                    </div>
                </motion.section>
            </div>

            {/* Platform Overview Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
                <motion.section
                    ref={platformRef}
                    className="py-10 sm:py-14 bg-red-600 dark:bg-[#0B1120] text-white relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] shadow-sm dark:shadow-2xl border border-transparent dark:border-slate-800/80 mx-2 sm:mx-0 transition-colors duration-500 transform-gpu will-change-transform"
                    style={{ opacity: platformOpacity, scale: platformScale }}
                >
                    {/* Modern Glow Effects for Dark Mode */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none hidden dark:block" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none hidden dark:block" />

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 dark:opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            className="text-center mb-10 sm:mb-16"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <h2 className="text-3xl sm:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-6 drop-shadow-lg uppercase tracking-tight italic">
                                What is <span className="text-yellow-400 drop-shadow-[0_4px_0_#b45309]">SafeScape 2.0</span>?
                            </h2>
                            <p className="text-white font-bold max-w-2xl mx-auto text-sm sm:text-xl xl:text-2xl px-4 leading-relaxed opacity-95">
                                A comprehensive fire safety education platform designed to empower communities with knowledge and skills.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" style={{ perspective: 1000 }}>
                            {features.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} index={index} reduceMotion={reduceMotion} />
                            ))}
                        </div>
                    </div>
                </motion.section>
            </div>

            {/* Carousel Injection (Between Sections) */}
            {carouselNode && (
                <div className="w-full">
                    {carouselNode}
                </div>
            )}

            {/* Partnership Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
                <motion.section
                    ref={partnershipRef}
                    className="py-10 sm:py-14 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden rounded-[2.5rem] shadow-xl dark:shadow-md border border-slate-200 dark:border-transparent transition-colors duration-500 transform-gpu will-change-transform"
                    style={{ opacity: partnershipOpacity, scale: partnershipScale }}
                >
                    {/* Animated Background decoration */}
                    <motion.div
                        className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full"
                        animate={reduceMotion ? undefined : {
                            x: [0, 30, 0],
                            y: [0, -20, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full"
                        animate={reduceMotion ? undefined : {
                            x: [0, -30, 0],
                            y: [0, 20, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity }}
                    />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            className="text-center mb-8 sm:mb-10"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 inline-block border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-yellow-500/10">
                                Collaborative Initiative
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3">
                                LSPU & BFP Sta. Cruz Partnership
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 font-medium max-w-4xl mx-auto text-sm sm:text-base leading-relaxed">
                                SafeScape is a collaborative research initiative between the <strong className="text-slate-900 dark:text-white">College of Computer Studies (CCS)</strong> at
                                <strong className="text-slate-900 dark:text-white"> Laguna State Polytechnic University (LSPU) - Santa Cruz Campus</strong> and the
                                <strong className="text-slate-900 dark:text-white"> Bureau of Fire Protection (BFP) Santa Cruz</strong>. This partnership was formalized through a
                                Memorandum of Agreement to address local fire safety challenges by leveraging advanced digital technologies.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ perspective: 1500 }}>
                            {/* LSPU Card */}
                            <PartnershipCard delay={0} reduceMotion={reduceMotion}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                                        <img
                                            src="/lspu logo.webp"
                                            alt="LSPU Logo"
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">LSPU - Santa Cruz Campus</h3>
                                        <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm">College of Computer Studies</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                                    The university provided technological expertise in AI, machine learning, and software development.
                                    Computer Science researchers majoring in Intelligent Systems designed and developed the platform under academic supervision.
                                </p>
                                <div className="bg-slate-100 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-white/10 mt-auto">
                                    <div className="flex items-center gap-3">
                                        <GraduationCap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        <div>
                                            <p className="text-yellow-600 dark:text-yellow-400 font-semibold text-[10px] sm:text-xs">Project Initiation & Thesis Adviser</p>
                                            <p className="text-slate-800 dark:text-white font-medium text-sm">Dr. Mia V. Villarica, DIT</p>
                                            <p className="text-slate-500 dark:text-gray-400 text-[10px] sm:text-xs">CCS Dean, LSPU Santa Cruz</p>
                                        </div>
                                    </div>
                                </div>
                            </PartnershipCard>

                            {/* BFP Card */}
                            <PartnershipCard delay={1} reduceMotion={reduceMotion}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                                        <img
                                            src="/bfp logo.webp"
                                            alt="BFP Logo"
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">BFP Santa Cruz Fire Station</h3>
                                        <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm">Bureau of Fire Protection</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                                    BFP Santa Cruz reached out to LSPU-CCS to find innovative ways to enhance community fire preparedness.
                                    They provided the official knowledge base, including manuals and protocols, used to train the Berong AI chatbot and develop educational modules.
                                </p>
                                <div className="bg-slate-100 dark:bg-white/5 rounded-lg p-3 border border-slate-200 dark:border-white/10 mt-auto">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        <div>
                                            <p className="text-yellow-600 dark:text-yellow-400 font-semibold text-[10px] sm:text-xs">Project Initiator & Guide</p>
                                            <p className="text-slate-800 dark:text-white font-medium text-sm">FSINSP Cesar A. Morfe Jr.</p>
                                            <p className="text-slate-500 dark:text-gray-400 text-[10px] sm:text-xs">Initiated the partnership and provided constant guidance</p>
                                        </div>
                                    </div>
                                </div>
                            </PartnershipCard>
                        </div>
                    </div>
                </motion.section>
            </div>

            {/* Meet Your Firefighters Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24">
                <motion.section
                    className="py-10 sm:py-14 bg-gradient-to-br from-orange-600 to-red-700 dark:from-orange-900 dark:to-red-950 text-white relative overflow-hidden rounded-[2.5rem] shadow-xl dark:shadow-md border border-red-500/30 transition-colors duration-500"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Animated Background Decoration */}
                    <motion.div
                        className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none"
                        animate={reduceMotion ? undefined : {
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl pointer-events-none"
                        animate={reduceMotion ? undefined : {
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity }}
                    />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
                        <motion.div
                            className="text-center mb-10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="mb-6 flex justify-center">
                                <span className="bg-yellow-500/20 text-yellow-300 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full inline-block border border-yellow-500/30 shadow-sm backdrop-blur-sm">
                                    Our Heroes
                                </span>
                            </div>
                            <FireExtinguishedText 
                                text="Meet Your Firefighters" 
                                className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 drop-shadow-md" 
                            />
                            <p className="text-orange-100 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed opacity-90">
                                The brave men and women of BFP Santa Cruz dedicated to keeping our community safe.
                            </p>
                        </motion.div>

                        <motion.div
                            className="w-full max-w-5xl aspect-[4/3] xs:aspect-[16/10] sm:aspect-video bg-white/10 dark:bg-black/20 rounded-3xl border-2 border-white/20 overflow-hidden relative group backdrop-blur-sm shadow-2xl cursor-pointer"
                            onClick={() => setIsLightboxOpen(true)}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            whileHover={reduceMotion ? undefined : {
                                scale: 1.01,
                                border: "2px solid rgba(255, 255, 255, 0.4)",
                                transition: { duration: 0.3 }
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {/* Slide Display using framer-motion */}
                            <div className="absolute inset-0 w-full h-full overflow-hidden bg-black/40 rounded-3xl">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentSlide}
                                        src={firefighterImages[currentSlide]}
                                        alt={`BFP Firefighters ${currentSlide + 1}`}
                                        className="w-full h-full object-cover select-none rounded-3xl"
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.6 }}
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white transition-all active:scale-90 hover:scale-105 z-20"
                            >
                                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white transition-all active:scale-90 hover:scale-105 z-20"
                            >
                                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>

                            {/* Caption Overlay */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent pt-12 pb-6 px-6 text-white flex flex-col justify-end z-10 pointer-events-none select-none">
                                <p className="font-black text-lg sm:text-2xl uppercase tracking-wider drop-shadow-md text-yellow-400">
                                    BFP Santa Cruz Team
                                </p>
                                <p className="text-xs sm:text-sm text-slate-200 mt-1 drop-shadow font-semibold opacity-90">
                                    Protecting and serving our community with honor and bravery.
                                </p>
                            </div>

                            {/* Slide Indicator Dots */}
                            <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-20">
                                {firefighterImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentSlide(index);
                                        }}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            currentSlide === index 
                                                ? "w-6 bg-yellow-400" 
                                                : "w-1.5 bg-white/40 hover:bg-white/70"
                                        }`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Lightbox / Click-to-Expand Modal */}
                    <AnimatePresence>
                        {isLightboxOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10 select-none"
                                onClick={() => setIsLightboxOpen(false)}
                            >
                                {/* Close Button */}
                                <button
                                    className="absolute top-6 right-6 z-[110] w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all active:scale-95 hover:scale-105"
                                    onClick={() => setIsLightboxOpen(false)}
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {/* Lightbox Image & Controls */}
                                <div className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center">
                                    <motion.img
                                        key={currentSlide}
                                        src={firefighterImages[currentSlide]}
                                        alt={`BFP Firefighters ${currentSlide + 1}`}
                                        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        onClick={() => setIsLightboxOpen(false)}
                                    />

                                    {/* Slider Controls */}
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-2 sm:left-4 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-90 hover:scale-105 z-20"
                                    >
                                        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-2 sm:right-4 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-90 hover:scale-105 z-20"
                                    >
                                        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                                    </button>

                                    {/* Caption / Navigation Indicator */}
                                    <div className="absolute bottom-[-40px] inset-x-0 text-center text-slate-300 font-semibold text-sm">
                                        {currentSlide + 1} / {firefighterImages.length} — BFP Santa Cruz Team
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.section>
            </div>

            {/* Research Team Section */}
            {reduceMotion || isLaptopOrSmaller ? (
                <div id="meet-the-developers" className="w-full">
                    <section className="pt-10 sm:pt-12 pb-20 sm:pb-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500">
                        {/* Dynamic Dotted Pattern Background */}
                        <div className="absolute inset-0 pointer-events-none z-[0] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />
                        
                        <div className="relative z-10 px-4 sm:px-8">
                            <div className="text-center mb-10 sm:mb-16 shrink-0 w-full">
                                <div className="mb-6 flex justify-center">
                                    <span className="bg-red-100 dark:bg-red-950/30 text-red-500 dark:text-red-400 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full inline-block border border-red-200 dark:border-red-900/30 transition-colors">
                                        The Research Team
                                    </span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white mb-4 transition-colors">
                                    <BinaryScrambleText text="Meet the Developers" />
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto text-lg transition-colors">
                                    Computer Science researchers majoring in Intelligent Systems who designed and developed SafeScape and SafeScape 2.0.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
                                {teamMembers.map((member, index) => (
                                    <StaticTeamCard 
                                        key={index} 
                                        member={member} 
                                        index={index} 
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <div ref={teamRef} id="meet-the-developers" className="w-full">
                    <motion.section
                        className="bg-transparent relative h-[400vh] transform-gpu will-change-transform"
                        style={{ opacity: teamOpacity }}
                    >
                        <div className="w-full relative z-10 sticky top-0 h-screen flex flex-col justify-start pt-[60px] sm:pt-[80px] overflow-hidden">
                            {/* Dynamic Dotted Pattern Background using Tailwind classes */}
                            <motion.div 
                                className="absolute inset-0 pointer-events-none z-[-1] bg-white dark:bg-slate-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"
                                style={{ opacity: patternOpacity }}
                            />
                            <motion.div
                                className="text-center mb-10 sm:mb-16 shrink-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                            >
                                <div className="mb-6 flex justify-center">
                                    <span className="bg-red-100 dark:bg-red-950/30 text-red-500 dark:text-red-400 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full inline-block border border-red-200 dark:border-red-900/30 transition-colors">
                                        The Research Team
                                    </span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white mb-4 transition-colors">
                                    <BinaryScrambleText text="Meet the Developers" />
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto text-lg transition-colors">
                                    Computer Science researchers majoring in Intelligent Systems who designed and developed SafeScape and SafeScape 2.0.
                                </p>
                            </motion.div>

                            <div className="flex w-full items-center relative py-10 -my-10">
                                <motion.div 
                                    ref={carouselRef}
                                    style={{ x: teamX }}
                                    className="flex gap-6 sm:gap-8 px-[calc(50vw_-_150px)] sm:px-[calc(50vw_-_190px)] py-10 w-max perspective-[1000px]"
                                >
                                    {teamMembers.map((member, index) => (
                                        <div key={index} className="w-[300px] sm:w-[380px] shrink-0 h-[420px]">
                                            <TeamCard 
                                                member={member} 
                                                index={index} 
                                                reduceMotion={reduceMotion}
                                                progress={carouselProgress}
                                                totalCards={teamMembers.length}
                                            />
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </motion.section>
                </div>
            )}
        </div>
    );
}

const BINARY_CHARS = "01";

function BinaryScrambleText({ text, className = "" }: { text: string, className?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <span ref={ref} className={className}>
            {text.split("").map((char, index) => {
                if (char === " ") return <span key={index}> </span>;
                return (
                    <BinaryScrambleLetter 
                        key={index} 
                        char={char} 
                        trigger={isInView} 
                        delay={index * 0.05} 
                    />
                );
            })}
        </span>
    );
}

function BinaryScrambleLetter({ char, trigger, delay }: { char: string, trigger: boolean, delay: number }) {
    const [displayChar, setDisplayChar] = useState("0");
    const [isDecoded, setIsDecoded] = useState(false);
    
    useEffect(() => {
        if (!trigger) return;
        
        let iterations = 0;
        const maxIterations = 15;
        let timeoutId: any;
        
        const startDelay = setTimeout(() => {
            const interval = setInterval(() => {
                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    setDisplayChar(char);
                    setIsDecoded(true);
                } else {
                    setDisplayChar(BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]);
                    iterations++;
                }
            }, 30);
            timeoutId = interval;
        }, delay * 1000);
        
        return () => {
            clearTimeout(startDelay);
            clearInterval(timeoutId);
        };
    }, [trigger, char, delay]);

    return (
        <span className={isDecoded ? "" : "text-slate-400 dark:text-slate-600 font-mono opacity-80"}>
            {trigger ? displayChar : "0"}
        </span>
    );
}

