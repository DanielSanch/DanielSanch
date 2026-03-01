'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileNav from '@/components/ui/MobileNav';
import { useTheme } from '@/lib/ThemeContext';
import { onAuthChange, logoutBusiness, getBusinessProfile } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [businessName, setBusinessName] = useState('Mi Negocio');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      try {
        const profile = await getBusinessProfile(user.uid);
        if (profile) {
          setBusinessName(profile.name);
          setTheme(profile.theme);
        }
      } catch {
        // Profile might not exist yet
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router, setTheme]);

  const handleLogout = async () => {
    await logoutBusiness();
    router.push('/');
  };

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-berlin-dark' : 'bg-berlin-light'
      }`}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-berlin-gold/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-berlin-gold font-black text-lg">B</span>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-berlin-gray' : 'text-berlin-light-gray'}`}>
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-berlin-dark' : 'bg-berlin-light'}`}>
      <Sidebar businessName={businessName} onLogout={handleLogout} />
      <main className="md:ml-64 pb-20 md:pb-8 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
      <MobileNav
        mode="dashboard"
        activeSection={pathname}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
