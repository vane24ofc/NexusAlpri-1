// src/app/(app)/profile/page.tsx
'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ROLES_TRANSLATION } from "@/lib/constants";
import { UserCircle, Edit2, ShieldCheck, Mail, KeyRound } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return ( // Should be handled by AuthGuard, but as a fallback
      <div className="flex items-center justify-center h-full">
        <p>Cargando perfil...</p>
      </div>
    );
  }
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + (names[names.length - 1]?.[0] || '')).toUpperCase();
  };

  return (
    <AuthGuard>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center mb-8">
          <UserCircle className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-primary font-headline">Mi Perfil</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4 border-4 border-primary/50">
                  <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                  <AvatarFallback className="text-4xl font-headline">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold font-headline text-foreground">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="mt-2 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium inline-flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-1.5" />
                  {ROLES_TRANSLATION[user.role]}
                </div>
                <Button variant="outline" className="mt-6 w-full">
                  <Edit2 className="mr-2 h-4 w-4" /> Cambiar Foto de Perfil
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tus datos personales.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="fullName">Nombre Completo</Label>
                        <Input id="fullName" defaultValue={user.name} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <div className="flex items-center gap-2">
                             <Input id="email" type="email" defaultValue={user.email} disabled />
                             <Button variant="outline" size="sm" className="shrink-0">
                                <Mail className="mr-1 h-3 w-3" /> Cambiar
                            </Button>
                        </div>
                    </div>
                </div>
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>Gestiona la seguridad de tu cuenta.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-1">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <Input id="currentPassword" type="password" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="newPassword">Nueva Contraseña</Label>
                        <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label>
                        <Input id="confirmNewPassword" type="password" />
                    </div>
                </div>
                <Button variant="secondary">
                    <KeyRound className="mr-2 h-4 w-4" /> Cambiar Contraseña
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
