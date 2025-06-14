// src/app/(app)/layout.tsx
'use client'; // Must be a client component to use hooks

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { loadCoursesAtom } from '@/store/courses'; // Import the atom
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { AppHeader } from '@/components/layout/AppHeader';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatchLoadCourses = useSetAtom(loadCoursesAtom); // Get the dispatcher

  useEffect(() => {
    dispatchLoadCourses(); // Load courses when the app layout mounts
  }, [dispatchLoadCourses]);

  return (
    <AuthGuard> {/* Basic auth check for all app routes */}
      <div className="flex min-h-screen w-full bg-muted/40">
        <DesktopSidebar />
        <div className="flex flex-col flex-1 md:ml-64"> {/* Adjusted for fixed sidebar */}
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 md:p-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
