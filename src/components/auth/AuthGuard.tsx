// src/components/auth/AuthGuard.tsx
'use client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import type { UserRole } from '@/types';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setIsVerifying(true);
      return;
    }

    if (!isAuthenticated) {
      if (pathname !== '/login' && pathname !== '/register') { // Avoid redirect loop
        router.replace('/login');
      } else {
        setIsVerifying(false);
      }
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace(`/${user.role}/dashboard`); // Or a dedicated /unauthorized page
      return;
    }
    
    setIsVerifying(false);

  }, [isAuthenticated, user, allowedRoles, router, isLoading, pathname]);

  if (isLoading || isVerifying) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
        <p className="text-xl font-semibold font-headline">Cargando {APP_NAME}...</p>
        <p className="text-muted-foreground">Verificando credenciales...</p>
      </div>
    );
  }

  return <>{children}</>;
}
