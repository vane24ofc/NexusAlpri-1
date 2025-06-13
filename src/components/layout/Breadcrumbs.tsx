'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { MAIN_NAVIGATION, ADMIN_SPECIFIC_NAV, INSTRUCTOR_SPECIFIC_NAV, STUDENT_SPECIFIC_NAV, APP_NAME } from '@/lib/constants';

// Combine all nav items for easier lookup
const allNavItems = [...MAIN_NAVIGATION, ...ADMIN_SPECIFIC_NAV, ...INSTRUCTOR_SPECIFIC_NAV, ...STUDENT_SPECIFIC_NAV];

interface Breadcrumb {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  const breadcrumbs: Breadcrumb[] = [{ label: 'Inicio', href: '/dashboard' }];

  pathSegments.forEach((segment, index) => {
    const currentPath = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const navItem = allNavItems.find(item => item.href === currentPath && !item.isHeader);
    
    let label = segment.charAt(0).toUpperCase() + segment.slice(1); // Default label
    if (segment === 'admin' || segment === 'instructor' || segment === 'student') {
      label = APP_NAME; // Avoid showing role as breadcrumb segment
      return; // Skip role segments in breadcrumbs
    }

    if (navItem) {
      label = navItem.label;
    } else {
      // Try to match sub-paths, e.g. /courses/1 -> Cursos / Detalle
      if (pathSegments[index-1] === 'courses' && segment !== 'courses') label = 'Detalle del Curso';
      if (pathSegments[index-1] === 'resources' && segment !== 'resources') label = 'Detalle del Recurso';
      // Add more specific cases if needed
    }
    
    breadcrumbs.push({ label, href: currentPath });
  });

  // Remove duplicates that might arise from generic dashboard link
  const uniqueBreadcrumbs = breadcrumbs.reduce((acc, current) => {
    const x = acc.find(item => item.href === current.href);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as Breadcrumb[]);


  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center space-x-1.5 text-sm text-muted-foreground">
        {uniqueBreadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {index === uniqueBreadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-foreground hover:underline">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
