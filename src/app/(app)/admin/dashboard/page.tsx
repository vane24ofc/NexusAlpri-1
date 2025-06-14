
'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_ANNOUNCEMENTS, MOCK_COURSES } from "@/lib/constants";
import { Users, BookOpen, Settings, PlusCircle, Megaphone, BarChart3 } from "lucide-react";
import Link from "next/link";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";

export default function AdminDashboardPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <h1 className="text-3xl font-bold mb-8 text-primary font-headline">Panel de Administración</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="Total Usuarios" value="125" icon={Users} description="+5 esta semana" />
          <StatCard title="Total Cursos" value={MOCK_COURSES.length} icon={BookOpen} description="+2 nuevos cursos" />
          <StatCard title="Instructores Activos" value="12" icon={Users} iconClassName="text-accent" />
          <StatCard title="Anuncios Publicados" value={MOCK_ANNOUNCEMENTS.length} icon={Megaphone} iconClassName="text-green-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-headline">Acciones Rápidas</CardTitle>
                <CardDescription>Gestiona tu plataforma eficientemente.</CardDescription>
              </div>
               <Button asChild size="sm">
                  <Link href="/admin/reports">
                    <BarChart3 className="mr-2 h-4 w-4" /> Ver Reportes
                  </Link>
                </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
              <Button variant="outline" className="w-full justify-start text-left py-8 px-6" asChild>
                <Link href="/admin/users/new" className="flex items-start">
                  <PlusCircle className="mr-3 h-6 w-6 text-primary mt-1" /> 
                  <div>
                    <p className="font-semibold text-base mb-1">Crear Usuario</p>
                    <p className="text-sm text-muted-foreground leading-snug">Añadir nuevo admin, instructor o estudiante.</p>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left py-8 px-6" asChild>
                 <Link href="/admin/manage-courses/new" className="flex items-start">
                    <PlusCircle className="mr-3 h-6 w-6 text-primary mt-1" />
                    <div>
                        <p className="font-semibold text-base mb-1">Crear Curso</p>
                        <p className="text-sm text-muted-foreground leading-snug">Diseñar y publicar nuevo contenido.</p>
                    </div>
                 </Link>
              </Button>
               <Button variant="outline" className="w-full justify-start text-left py-8 px-6" asChild>
                 <Link href="/admin/manage-announcements/new" className="flex items-start">
                    <Megaphone className="mr-3 h-6 w-6 text-primary mt-1" />
                    <div>
                        <p className="font-semibold text-base mb-1">Nuevo Anuncio</p>
                        <p className="text-sm text-muted-foreground leading-snug">Comunicar novedades importantes.</p>
                    </div>
                 </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left py-8 px-6" asChild>
                 <Link href="/admin/settings" className="flex items-start">
                    <Settings className="mr-3 h-6 w-6 text-primary mt-1" />
                     <div>
                        <p className="font-semibold text-base mb-1">Configuración</p>
                        <p className="text-sm text-muted-foreground leading-snug">Ajustar parámetros del sistema.</p>
                    </div>
                 </Link>
              </Button>
               <Button variant="outline" className="w-full justify-start text-left py-8 px-6" asChild>
                 <Link href="/admin/users" className="flex items-start">
                    <Users className="mr-3 h-6 w-6 text-primary mt-1" />
                     <div>
                        <p className="font-semibold text-base mb-1">Gestionar Usuarios</p>
                        <p className="text-sm text-muted-foreground leading-snug">Ver y editar perfiles.</p>
                    </div>
                 </Link>
              </Button>
               <Button variant="outline" className="w-full justify-start text-left py-8 px-6" asChild>
                 <Link href="/admin/manage-courses" className="flex items-start">
                    <BookOpen className="mr-3 h-6 w-6 text-primary mt-1" />
                     <div>
                        <p className="font-semibold text-base mb-1">Gestionar Cursos</p>
                        <p className="text-sm text-muted-foreground leading-snug">Editar y organizar el catálogo.</p>
                    </div>
                 </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Anuncios Recientes</CardTitle>
              <CardDescription>Últimas comunicaciones para la comunidad.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {MOCK_ANNOUNCEMENTS.slice(0, 3).map(announcement => (
                <AnnouncementCard key={announcement.id} announcement={announcement} variant="compact" />
              ))}
               <Button variant="link" asChild className="w-full mt-2">
                <Link href="/announcements">Ver todos los anuncios</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
