export interface TourStep {
  id: string;
  targetSelector: string; // e.g. '[data-tour="nav-accessibility"]'
  title: string;
  description: string;
  actionInstruction?: string; // e.g. "Click this icon to try it out!"
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  requiresClick?: boolean; // If true, user clicking the target advances to the next step
}

export type UserTourRole = 'kids' | 'adult' | 'professional' | 'admin' | 'general';

export const TOUR_STEPS: Record<UserTourRole, TourStep[]> = {
  general: [
    {
      id: 'welcome',
      targetSelector: 'body',
      title: 'Welcome to Berong SafeScape! 🚀',
      description: 'Your interactive fire safety education platform. Let’s take a quick 1-minute guided tour to explore key features!',
      placement: 'center'
    },
    {
      id: 'accessibility',
      targetSelector: '[data-tour="nav-accessibility"]',
      title: 'Accessibility Center 👁️',
      description: 'Customize your experience with Dark Mode, Text Sizing, Dyslexia Font, Focus Mode, and Hover Reader.',
      actionInstruction: 'Click the Accessibility icon or Next to continue.',
      placement: 'bottom',
      requiresClick: false
    },
    {
      id: 'chatbot',
      targetSelector: '[data-tour="ai-chatbot"]',
      title: 'Berong AI Assistant 🤖',
      description: 'Ask Berong AI any fire safety questions, emergency protocols, or BFP guidelines in real time 24/7.',
      placement: 'top'
    },
    {
      id: 'complete',
      targetSelector: 'body',
      title: 'Tour Complete! 🎉',
      description: 'You are all set to explore Berong SafeScape. Stay safe and enjoy your learning journey!',
      placement: 'center'
    }
  ],

  kids: [
    {
      id: 'kids-welcome',
      targetSelector: '[data-tour="kids-hero-banner"]',
      title: 'Welcome, Young Hero! 🦸‍♂️',
      description: 'This is your fun Fire Safety HQ! Learn how to stay safe, earn cool badges, and play interactive games.',
      placement: 'bottom'
    },
    {
      id: 'kids-games',
      targetSelector: '[data-tour="kids-games-section"]',
      title: 'Fire Safety Arcade & Games 🎮',
      description: 'Play Smoke Crawl, Hazard Blitz, and Memory Game to learn life-saving safety skills while having fun!',
      placement: 'top'
    },
    {
      id: 'kids-badges',
      targetSelector: '[data-tour="kids-badge-hall"]',
      title: 'Badge Hall & Achievements 🏆',
      description: 'Complete quizzes and games to unlock shiny badges and climb the leaderboards!',
      placement: 'bottom'
    },
    {
      id: 'accessibility',
      targetSelector: '[data-tour="nav-accessibility"]',
      title: 'Accessibility & Hover Reader 🔍',
      description: 'Turn on Hover Reader to magnify text on hover or switch on Dyslexia Font anytime.',
      placement: 'bottom'
    },
    {
      id: 'chatbot',
      targetSelector: '[data-tour="ai-chatbot"]',
      title: 'Talk to Berong AI 🤖',
      description: 'Need help with a question? Click Berong AI to ask anything about fire safety!',
      placement: 'top'
    }
  ],

  adult: [
    {
      id: 'adult-welcome',
      targetSelector: '[data-tour="adult-banner"]',
      title: 'Welcome, Resident & Parent! 🏠',
      description: 'Explore household fire safety guidelines, emergency protocols, and interactive floor plan evacuation tools.',
      placement: 'bottom'
    },
    {
      id: 'course-hub',
      targetSelector: '[data-tour="course-hub"]',
      title: 'Course Hub & Learning Modules 📚',
      description: 'Access comprehensive modules covering fire prevention, LPG safety, electrical safety, and emergency response.',
      placement: 'top'
    },
    {
      id: 'evacuation-tool',
      targetSelector: '[data-tour="floor-plan-builder"]',
      title: 'Household Evacuation Builder 🗺️',
      description: 'Design and simulate custom escape routes for your home or building in 2D grid visualization.',
      placement: 'bottom'
    },
    {
      id: 'accessibility',
      targetSelector: '[data-tour="nav-accessibility"]',
      title: 'Accessibility Center ⚙️',
      description: 'Tailor visual accessibility settings including dark mode, high contrast filters, and font scaling.',
      placement: 'bottom'
    },
    {
      id: 'chatbot',
      targetSelector: '[data-tour="ai-chatbot"]',
      title: '24/7 AI Safety Companion 💬',
      description: 'Instant answers for fire codes, emergency contacts, and disaster response procedures.',
      placement: 'top'
    }
  ],

  professional: [
    {
      id: 'prof-welcome',
      targetSelector: '[data-tour="prof-banner"]',
      title: 'Professional Inspection Portal 🚒',
      description: 'Welcome to the BFP & Professional Fire Safety Command Center for compliance, simulation, and training.',
      placement: 'bottom'
    },
    {
      id: 'fire-code',
      targetSelector: '[data-tour="fire-code-standards"]',
      title: 'RA 9514 Fire Code Reference 📜',
      description: 'Search official Republic Act 9514 standards, enforcement procedures, and penalty guidelines.',
      placement: 'top'
    },
    {
      id: 'simulator',
      targetSelector: '[data-tour="hazard-simulator"]',
      title: 'Advanced Fire Hazard Simulator 🕹️',
      description: 'Run numerical fire spread, smoke diffusion, and structural evacuation simulations.',
      placement: 'bottom'
    },
    {
      id: 'accessibility',
      targetSelector: '[data-tour="nav-accessibility"]',
      title: 'Accessibility Center ⚙️',
      description: 'Quick controls for performance mode, dyslexia font, color blind filters, and text scaling.',
      placement: 'bottom'
    },
    {
      id: 'chatbot',
      targetSelector: '[data-tour="ai-chatbot"]',
      title: 'Berong Safety Copilot 🤖',
      description: 'Quick lookup tool for Fire Code sections, inspection requirements, and technical formulas.',
      placement: 'top'
    }
  ],

  admin: [
    {
      id: 'admin-welcome',
      targetSelector: '[data-tour="admin-dashboard-header"]',
      title: 'System Administration Center 🛡️',
      description: 'Manage users, content, fire code records, videos, and system settings across Berong SafeScape.',
      placement: 'bottom'
    },
    {
      id: 'user-mgmt',
      targetSelector: '[data-tour="admin-users-tab"]',
      title: 'User & Permission Management 👥',
      description: 'Filter accounts by role permissions (Kids, Adult, Professional, Admin) and manage user credentials.',
      placement: 'bottom'
    },
    {
      id: 'content-mgmt',
      targetSelector: '[data-tour="admin-content-tabs"]',
      title: 'Content & Media Management 📝',
      description: 'Create and edit blog articles, educational videos, carousel banners, and assessment question banks.',
      placement: 'top'
    },
    {
      id: 'accessibility',
      targetSelector: '[data-tour="nav-accessibility"]',
      title: 'Accessibility Center ⚙️',
      description: 'Test and manage system accessibility features.',
      placement: 'bottom'
    }
  ]
};
