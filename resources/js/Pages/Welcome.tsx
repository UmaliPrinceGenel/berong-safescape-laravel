import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import RootLayout from '@/Layouts/RootLayout';
import { Navigation } from '@/components/navigation';
import { HeroCarousel } from '@/components/ui/hero-carousel';
import { FeaturedCards } from '@/components/ui/featured-cards';
import { LandingAboutSection } from '@/components/landing-about-section';
import { LandingAssessmentSection } from '@/components/landing-assessment-section';
import { Footer } from '@/components/footer';

export default function Welcome() {
  const { auth } = usePage().props as any;
  const serverUser = auth?.user;
  
  const mappedUser = serverUser ? {
    id: serverUser.id,
    name: serverUser.name || 'User',
    age: serverUser.age ?? undefined,
    role: serverUser.role || 'guest',
  } : null;

  return (
    <>
      <Head title="Berong E-Learning for BFP Sta Cruz" />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <section className="mb-12">
            <HeroCarousel />
          </section>

          <section className="mb-12">
            <FeaturedCards serverUser={mappedUser} />
          </section>

          <LandingAboutSection />

          <LandingAssessmentSection serverUser={mappedUser} />
        </main>

        <Footer />
      </div>
    </>
  );
}

// Attach persistent layout
Welcome.layout = (page: React.ReactNode) => <RootLayout>{page}</RootLayout>;
