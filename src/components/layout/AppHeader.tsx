'use client';

import { MobileSidebar } from "./MobileSidebar";
import { UserNav } from "./UserNav";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <MobileSidebar />
      <div className="hidden md:block">
        <Breadcrumbs />
      </div>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cursos, recursos..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-card"
            />
          </div>
        </form>
        <UserNav />
      </div>
    </header>
  );
}
