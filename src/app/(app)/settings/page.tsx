// src/app/(app)/settings/page.tsx
'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings2, Bell, Palette, Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function UserSettingsPage() {
  const { user } = useAuth();

  // Mock user preferences
  const userPreferences = {
    receiveEmailNotifications: true,
    darkMode: false, // Assuming a system/manual toggle somewhere
    language: "es",
  };

  if (!user) return null; // Handled by AuthGuard

  return (
    <AuthGuard>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center mb-8">
          <Settings2 className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-primary font-headline">Configuración de Cuenta</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold font-headline mb-2 text-foreground">Preferencias</h2>
            <p className="text-sm text-muted-foreground">Personaliza tu experiencia en la plataforma.</p>
          </div>
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> Notificaciones</CardTitle>
              <CardDescription>Elige cómo quieres recibir alertas y comunicaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                <div>
                  <Label htmlFor="emailNotifications" className="font-medium">Recibir Notificaciones por Correo</Label>
                  <p className="text-xs text-muted-foreground">Alertas sobre cursos, anuncios y actividad.</p>
                </div>
                <Switch id="emailNotifications" defaultChecked={userPreferences.receiveEmailNotifications} aria-label="Recibir notificaciones por correo" />
              </div>
               <Button>Guardar Preferencias de Notificación</Button>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold font-headline mb-2 text-foreground">Apariencia e Idioma</h2>
            <p className="text-sm text-muted-foreground">Ajusta la interfaz a tu gusto.</p>
          </div>
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Interfaz</CardTitle>
              <CardDescription>Modifica cómo se ve la plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                <div>
                  <Label htmlFor="darkMode" className="font-medium">Modo Oscuro</Label>
                  <p className="text-xs text-muted-foreground">Activa el tema oscuro para una visualización nocturna.</p>
                </div>
                <Switch id="darkMode" defaultChecked={userPreferences.darkMode} aria-label="Activar modo oscuro" 
                  onCheckedChange={(checked) => {
                    if (typeof window !== 'undefined') {
                       document.documentElement.classList.toggle('dark', checked);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center"><Languages className="mr-2 h-4 w-4 text-primary" /> Idioma de la Interfaz</Label>
                <Select defaultValue={userPreferences.language}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Selecciona idioma" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en" disabled>English (Próximamente)</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <Button>Guardar Preferencias de Interfaz</Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </AuthGuard>
  );
}
