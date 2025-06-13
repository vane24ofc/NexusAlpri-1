import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Palette, BellDot, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  // Mock settings state
  const settings = {
    platformName: "NexusAlpri",
    allowPublicRegistration: true,
    maintenanceMode: false,
    primaryColor: "#4285F4",
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center mb-8">
           <Settings className="h-8 w-8 text-primary mr-3" />
           <h1 className="text-3xl font-bold text-primary font-headline">Configuración del Sistema</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold font-headline mb-2 text-foreground">General</h2>
            <p className="text-sm text-muted-foreground">Ajustes básicos de la plataforma.</p>
          </div>
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Apariencia y Marca</CardTitle>
              <CardDescription>Personaliza el nombre y los colores de la plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platformName">Nombre de la Plataforma</Label>
                <Input id="platformName" defaultValue={settings.platformName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Color Principal</Label>
                <div className="flex items-center gap-2">
                  <Input id="primaryColor" type="color" defaultValue={settings.primaryColor} className="w-16 h-10 p-1" />
                  <span>{settings.primaryColor}</span>
                </div>
                <p className="text-xs text-muted-foreground">Este cambio requiere actualizar el tema global (CSS).</p>
              </div>
               <Button>Guardar Cambios de Apariencia</Button>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold font-headline mb-2 text-foreground">Funcionalidades</h2>
            <p className="text-sm text-muted-foreground">Habilita o deshabilita características clave.</p>
          </div>
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><BellDot className="mr-2 h-5 w-5 text-primary" /> Registros y Notificaciones</CardTitle>
              <CardDescription>Controla cómo los usuarios se unen y reciben alertas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                <div>
                  <Label htmlFor="publicRegistration" className="font-medium">Permitir Registro Público</Label>
                  <p className="text-xs text-muted-foreground">Si está desactivado, solo los admins pueden crear usuarios.</p>
                </div>
                <Switch id="publicRegistration" defaultChecked={settings.allowPublicRegistration} aria-label="Permitir registro público" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="notificationEmail">Email para Notificaciones del Sistema</Label>
                <Input id="notificationEmail" type="email" placeholder="noreply@nexusalpri.com" />
              </div>
               <Button>Guardar Cambios de Funcionalidades</Button>
            </CardContent>
          </Card>
        </div>
        
        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold font-headline mb-2 text-foreground">Mantenimiento</h2>
            <p className="text-sm text-muted-foreground">Controla el acceso durante actualizaciones.</p>
          </div>
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Lock className="mr-2 h-5 w-5 text-primary" /> Modo Mantenimiento</CardTitle>
              <CardDescription>Restringe el acceso a la plataforma temporalmente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 p-3 border rounded-md bg-destructive/10 border-destructive">
                <div>
                  <Label htmlFor="maintenanceMode" className="font-medium text-destructive">Activar Modo Mantenimiento</Label>
                  <p className="text-xs text-destructive/80">Los usuarios (excepto admins) no podrán acceder.</p>
                </div>
                <Switch id="maintenanceMode" defaultChecked={settings.maintenanceMode} aria-label="Activar modo mantenimiento" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage">Mensaje de Mantenimiento (opcional)</Label>
                  <Input id="maintenanceMessage" placeholder="Volvemos pronto..." />
              </div>
               <Button variant="destructive">Guardar Cambios de Mantenimiento</Button>
            </CardContent>
          </Card>
        </div>


      </div>
    </AuthGuard>
  );
}
