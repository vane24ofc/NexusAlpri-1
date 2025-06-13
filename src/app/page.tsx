'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
      <p className="text-xl font-semibold font-headline">Redirigiendo a {APP_NAME}...</p>
    </div>
  );
}
