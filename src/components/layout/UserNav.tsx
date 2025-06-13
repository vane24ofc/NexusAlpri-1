'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User as UserIcon, Settings, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ROLES_TRANSLATION } from "@/lib/constants";

export function UserNav() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || `https://placehold.co/100x100.png?text=${getInitials(user.name)}`} alt={user.name} data-ai-hint="user avatar" />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </Link>
          </DropdownMenuItem>
          {user.role === 'admin' && (
             <DropdownMenuItem asChild>
               <Link href="/admin/settings" className="cursor-pointer">
                 <Settings className="mr-2 h-4 w-4" />
                 <span>Configuración (Admin)</span>
               </Link>
             </DropdownMenuItem>
          )}
           <DropdownMenuItem disabled>
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Rol: {ROLES_TRANSLATION[user.role]}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
