'use client';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, BookHeart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { NavItem, MAIN_NAVIGATION, ADMIN_SPECIFIC_NAV, INSTRUCTOR_SPECIFIC_NAV, STUDENT_SPECIFIC_NAV, APP_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function renderNavItems(items: NavItem[], userRole: string | undefined, currentPath: string, closeSheet: () => void) {
  return items
    .filter(item => userRole && item.roles.includes(userRole as any))
    .map((item) => (
      item.isHeader ? (
        <h4 key={item.label} className="px-4 py-2 text-sm font-semibold text-muted-foreground">{item.label}</h4>
      ) : (
      <Button
        key={item.href}
        variant={currentPath === item.href ? "secondary" : "ghost"}
        className="w-full justify-start"
        asChild
        onClick={closeSheet}
      >
        <Link href={item.href}>
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Link>
      </Button>
      )
    ));
}


export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex h-full flex-col">
          <div className="h-16 flex items-center px-6 border-b">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={closeSheet}>
              <BookHeart className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold font-headline text-primary">{APP_NAME}</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {user && renderNavItems(MAIN_NAVIGATION, user.role, pathname, closeSheet)}
            {user?.role === 'admin' && renderNavItems(ADMIN_SPECIFIC_NAV, user.role, pathname, closeSheet)}
            {user?.role === 'instructor' && renderNavItems(INSTRUCTOR_SPECIFIC_NAV, user.role, pathname, closeSheet)}
            {user?.role === 'student' && renderNavItems(STUDENT_SPECIFIC_NAV, user.role, pathname, closeSheet)}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
