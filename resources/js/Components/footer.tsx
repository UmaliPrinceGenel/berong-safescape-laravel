"use client";

import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { FooterDialogContent } from '@/components/ui/footer-dialog';
import { useState } from 'react';

// Define types for footer links
type FooterLink = {
  name: string;
  url: string;
  dialogType?: 'contact' | 'about' | 'faq' | 'report' | 'privacy' | 'terms';
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

// Mock data for footer columns - this will be replaced by dynamic data or defined constants
const footerColumns: FooterColumn[] = [
  {
    title: 'Customer Support',
    links: [
      { name: 'Contact Us', url: '#', dialogType: 'contact' },
      { name: 'FAQs', url: '#', dialogType: 'faq' },
      { name: 'Report an Issue', url: '#', dialogType: 'report' },
    ],
  },
  {
    title: 'Products & Solutions',
    links: [
      { name: 'For Professionals', url: '/professional' },
      { name: 'For Adults', url: '/adult' },
      { name: 'For Kids', url: '/kids' },
    ],
  },
  {
    title: 'Quick Links',
    links: [
      { name: 'Home', url: '/' },
      { name: 'About Us', url: '/about' },
      { name: 'Privacy Policy', url: '#', dialogType: 'privacy' },
      { name: 'Terms of Service', url: '#', dialogType: 'terms' },
    ],
  },
];

// Social media links
const socialMediaLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/bfpsantacruzfslaguna' },
];

export function Footer() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'contact' | 'about' | 'faq' | 'report' | 'privacy' | 'terms' | null>(null);

  const handleLinkClick = (link: FooterLink) => {
    if (link.dialogType) {
      setDialogType(link.dialogType);
      setDialogOpen(true);
    } else if (link.url && link.url.startsWith('/')) {
      // For navigation links, use next/link behavior
      window.location.href = link.url;
    } else if (link.url && link.url.startsWith('http')) {
      // For external links, open in new tab
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className="bg-[#111827] text-white py-12 sm:py-16 border-t-[8px] border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* BFP Logo and Description Column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <img
                src="/berong-official-logo.jpg"
                alt="BFP Berong Logo"
                width={64}
                height={64}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-full"
              />
              <div className="ml-3 sm:ml-4">
                <h3 className="text-base sm:text-lg font-bold">BFP Berong</h3>
                <p className="text-xs sm:text-sm text-slate-400">Fire Safety Education Platform</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400 font-medium leading-relaxed">
              Empowering communities with knowledge and skills for fire safety.
            </p>
            <div className="mt-6">
              {socialMediaLinks.map((social, index) => (
                <Link key={index} href={social.url} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-white hover:bg-slate-200 text-black font-bold h-10 px-6 rounded-lg text-sm shadow-sm transition-colors">
                    {social.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Link Columns */}
          {footerColumns.map((column, index) => (
            <div key={index} className="col-span-1">
              <h4 className="text-base font-bold mb-4 sm:mb-6">{column.title}</h4>
              <ul className="space-y-3 sm:space-y-4">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-slate-400 hover:text-white font-medium transition-colors block text-left w-full text-sm py-1"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-center items-center">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} BFP Sta.Cruz Laguna. All rights reserved.
          </p>
        </div>
      </div>
      {dialogOpen && (
        <FooterDialogContent
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          contentType={dialogType}
        />
      )}
    </footer>
  );
}
