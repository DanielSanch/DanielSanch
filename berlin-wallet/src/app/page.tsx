'use client';

import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Industries from '@/components/landing/Industries';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import MobileNav from '@/components/ui/MobileNav';

export default function Home() {
  const [activeSection, setActiveSection] = useState('#hero');

  const handleNavigate = (href: string) => {
    setActiveSection(href);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
  };

  return (
    <main className="min-h-screen pb-16 md:pb-0">
      <Navbar />
      <Hero />
      <Features />
      <Industries />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
      <MobileNav mode="landing" activeSection={activeSection} onNavigate={handleNavigate} />
    </main>
  );
}
