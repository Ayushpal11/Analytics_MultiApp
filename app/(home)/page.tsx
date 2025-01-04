"use client";

import { Dashboard } from '@/components/Dashboard';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className={clsx(theme === 'dark' ? 'bg-blue-800' : 'bg-white')}>
      <Dashboard />
    </main>
  );
}
