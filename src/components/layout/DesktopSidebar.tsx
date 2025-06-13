'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavItem, MAIN_NAVIGATION, ADMIN_SPECIFIC_NAV, INSTRUCTOR_SPECIFIC_NAV, STUDENT_SPECIFIC_NAV, APP_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { BookHeart } from "lucide-react";

function renderNavItems(items: NavItem[], userRole: string | undefined, currentPath: string) {
 return items
    .filter(item => userRole && item.roles.includes(userRole as any))
    .map((item) => (
       item.isHeader ? (
        <h4 key={item.label} className="px-4 py-2 mt-2 text-sm font-semibold text-muted-foreground first:mt-0">{item.label}</h4>
      ) : (
      <Button
        key={item.href}
        variant={currentPath === item.href ? "secondary" : "ghost"}
        className={cn("w-full justify-start", currentPath === item.href && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary")}
        asChild
      >
        <Link href={item.href}>
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Link>
      </Button>
      )
    ));
}


export function DesktopSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-card fixed h-full">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookHeart className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline text-primary">{APP_NAME}</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-4">
          {user && renderNavItems(MAIN_NAVIGATION, user.role, pathname)}
          {user?.role === 'admin' && (
            <>
              <div className="my-2 border-t border-border" />
              {renderNavItems(ADMIN_SPECIFIC_NAV, user.role, pathname)}
            </>
          )}
          {user?.role === 'instructor' && (
            <>
              <div className="my-2 border-t border-border" />
              {renderNavItems(INSTRUCTOR_SPECIFIC_NAV, user.role, pathname)}
            </>
          )}
           {user?.role === 'student' && (
            <>
              <div className="my-2 border-t border-border" />
              {renderNavItems(STUDENT_SPECIFIC_NAV, user.role, pathname)}
            </>
          )}
        </nav>
      </ScrollArea>
    </aside>
  );
}
