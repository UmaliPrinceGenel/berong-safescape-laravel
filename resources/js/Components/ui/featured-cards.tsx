'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { PermissionGuard } from '@/components/permission-guard';
import TiltedCard from '@/components/ui/tilted-card';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Briefcase, Users, Baby } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

// Define the type for a featured card item
type FeaturedCardItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  requiredPermission: 'accessKids' | 'accessAdult' | 'accessProfessional' | 'isAdmin';
  icon: React.ReactNode;
  color: string;
  btn: string;
};

// Mock data for featured cards - this will be replaced by dynamic data fetching
const mockFeaturedCards: FeaturedCardItem[] = [
  {
    id: 1,
    title: 'Professional Learning',
    btn: 'For Professionals',
    description: 'Access comprehensive fire safety codes, standards, and professional training materials.',
    imageUrl: '/professional_card.png',
    link: '/professional',
    requiredPermission: 'accessProfessional',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 2,
    title: 'Adult Learning',
    btn: 'For Adults',
    description: 'Learn essential fire safety practices for your home, family, and workplace.',
    imageUrl: '/adult_card.png',
    link: '/adult',
    requiredPermission: 'accessAdult',
    icon: <Users className="h-6 w-6" />,
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 3,
    title: 'Kids Learning',
    btn: 'For Kids',
    description: 'Fun and interactive modules to teach children about fire safety.',
    imageUrl: '/kids_card.png',
    link: '/kids',
    requiredPermission: 'accessKids',
    icon: <Baby className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-600',
  },
];

interface ServerUser {
  id: number;
  name: string;
  age?: number;
  role: string;
}

export function FeaturedCards({ serverUser }: { serverUser?: ServerUser | null } = {}) {
  const { user: clientUser } = useAuth();

  // Use client user if available, otherwise reconstruct from serverUser
  const user = clientUser || (serverUser ? {
    ...serverUser,
    permissions: serverUser.role === 'admin'
      ? { accessKids: true, accessAdult: true, accessProfessional: true, isAdmin: true }
      : serverUser.role === 'professional'
        ? { accessKids: true, accessAdult: true, accessProfessional: true, isAdmin: false }
        : serverUser.role === 'adult'
          ? { accessKids: false, accessAdult: true, accessProfessional: false, isAdmin: false }
          : serverUser.role === 'kid'
            ? { accessKids: true, accessAdult: false, accessProfessional: false, isAdmin: false }
            : { accessKids: false, accessAdult: false, accessProfessional: false, isAdmin: false }
  } as any : null);

  const visibleCards = mockFeaturedCards.filter(card => {
    // 1. Not logged in — hide cards entirely
    if (!user) {
      return false;
    }

    // 2. Professionals and Admins see ALL cards
    if (user.role === 'admin' || user.permissions?.accessProfessional) {
      return true;
    }

    // 3. Age-based filtering for standard users
    if (user.age !== undefined && user.age !== null) {
      if (user.age < 13) {
        // Kid (< 13): Show ONLY Kids card
        return card.requiredPermission === 'accessKids';
      } else {
        // Adult (>= 13): Show ONLY Adult card
        return card.requiredPermission === 'accessAdult';
      }
    }

    // 4. Logged in but no age info: Show all
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Mobile: Horizontal compact cards */}
      <div className="md:hidden space-y-3.5">
        {visibleCards.map((card) => (
          <React.Fragment key={card.id}>
          <PermissionGuard requiredPermission={card.requiredPermission} targetPath={card.link}>
            <Link href={card.link} prefetch={false}>
              <Card className="overflow-hidden border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99]">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 p-3">
                    {/* Icon Section */}
                    <div className={`bg-gradient-to-br ${card.color} h-14 w-14 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0`}>
                      {card.icon}
                    </div>
                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-slate-900 leading-tight">{card.btn}</h3>
                      <p className="text-[13px] text-slate-600 line-clamp-2 leading-snug mt-1">{card.description}</p>
                    </div>
                    {/* Arrow */}
                    <div className="h-8 w-8 rounded-full border border-slate-200 bg-white flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </PermissionGuard>
          </React.Fragment>
        ))}
      </div>

      {/* Tablet & Desktop: Tilted cards */}
      <div
        className={`hidden md:grid gap-8 p-4 w-full ${visibleCards.length === 1
          ? 'grid-cols-1 max-w-lg mx-auto'
          : visibleCards.length === 2
            ? 'grid-cols-2 max-w-3xl mx-auto'
            : 'grid-cols-3 max-w-5xl mx-auto'
          }`}
      >
        {visibleCards.map((card) => (
          <div
            key={card.id}
            className="w-full transition-all duration-300"
          >
            <PermissionGuard requiredPermission={card.requiredPermission} targetPath={card.link}>
              <div className="w-full">
                <TiltedCard
                  imageSrc={card.imageUrl}
                  altText={card.title}
                  captionText={card.title}
                  containerHeight="320px"
                  containerWidth="100%"
                  imageHeight="280px"
                  imageWidth="100%"
                  scaleOnHover={1.08}
                  rotateAmplitude={12}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-2 drop-shadow-lg">{card.title}</h3>
                      <p className="text-sm text-gray-200 mb-3 line-clamp-2">{card.description}</p>
                      <Link href={card.link} prefetch={false}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {card.btn}
                        </Button>
                      </Link>
                    </div>
                  }
                />
              </div>
            </PermissionGuard>
          </div>
        ))}
      </div>
    </div>
  );
}
