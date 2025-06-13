// src/app/(app)/dashboard/page.tsx
'use client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function DashboardRedirectPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    // Determine the correct dashboard URL based on user role
    let dashboardUrl = '/login'; // Default fallback
    if (user.role === 'admin') {
      dashboardUrl = '/admin/dashboard';
    } else if (user.role === 'instructor') {
      dashboardUrl = '/instructor/dashboard';
    } else if (user.role === 'student') {
      dashboardUrl = '/student/dashboard';
    }
    
    router.replace(dashboardUrl);

  }, [user, isAuthenticated, isLoading, router]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background text-foreground"> {/* Adjust height considering header */}
      <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
      <p className="text-xl font-semibold font-headline">Cargando tu panel principal en {APP_NAME}...</p>
      <p className="text-muted-foreground">Redirigiendo...</p>
    </div>
  );
}
