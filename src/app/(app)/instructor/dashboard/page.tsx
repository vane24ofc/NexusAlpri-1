
'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Edit3, PlusCircle, BarChart2, MessageSquare, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAtom, useSetAtom } from "jotai";
import { coursesAtom, coursesLoadingAtom, coursesErrorAtom, loadCoursesAtom } from "@/store/courses";
import { useAuth } from "@/hooks/use-auth";
import type { Course } from "@/types";
import { useEffect, useState } from "react";

export default function InstructorDashboardPage() {
  const [allCourses] = useAtom(coursesAtom);
  const [isLoadingCourses] = useAtom(coursesLoadingAtom);
  const [coursesError] = useAtom(coursesErrorAtom);
  const dispatchLoadCourses = useSetAtom(loadCoursesAtom);
  const { user } = useAuth();
  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    if (user && allCourses) {
      const filtered = allCourses.filter(course => course.instructor === user.name);
      setInstructorCourses(filtered);
    } else {
      setInstructorCourses([]);
    }
  }, [allCourses, user]);

  const displayCourses = instructorCourses.slice(0, 2);
  const totalStudentsInCourses = 78; // Mock data

  return (
    <AuthGuard allowedRoles={['instructor']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <h1 className="text-3xl font-bold mb-8 text-primary font-headline">Panel de Instructor</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatCard title="Mis Cursos Activos" value={isLoadingCourses ? "..." : instructorCourses.length} icon={BookOpen} />
          <StatCard title="Estudiantes Inscritos" value={totalStudentsInCourses} icon={Users} description="En todos mis cursos" />
          <StatCard title="Nuevos Comentarios" value="12" icon={MessageSquare} iconClassName="text-accent" description="Pendientes de revisión"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-headline">Mis Cursos</CardTitle>
              <Button asChild size="sm">
                <Link href="/instructor/my-courses">
                  <Edit3 className="mr-2 h-4 w-4" /> Gestionar Mis Cursos
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingCourses && (
                <div className="flex items-center justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-primary mr-2" /> Cargando cursos...</div>
              )}
              {coursesError && !isLoadingCourses && (
                <div className="text-destructive p-4 flex flex-col items-center">
                  <AlertTriangle className="h-6 w-6 mb-2" /> Error al cargar cursos. <Button variant="link" onClick={() => dispatchLoadCourses()}>Reintentar</Button>
                </div>
              )}
              {!isLoadingCourses && !coursesError && displayCourses.length > 0 && (
                <div className="space-y-4">
                  {displayCourses.map(course => (
                    <div key={course.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Image src={course.thumbnailUrl || "https://placehold.co/100x60.png"} alt={course.title} width={100} height={60} className="rounded-md object-cover" data-ai-hint={course.dataAiHint || "course image"}/>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.category} - Impartido por: {course.instructor}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/instructor/my-courses/${course.id}/edit`}>Editar</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {!isLoadingCourses && !coursesError && displayCourses.length === 0 && (
                <p className="text-muted-foreground">Aún no has creado ningún curso.</p>
              )}
              <Button variant="default" className="mt-6 w-full sm:w-auto" asChild>
                <Link href="/instructor/create-course">
                  <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Curso
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Atajos</CardTitle>
              <CardDescription>Acciones frecuentes para instructores.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/announcements/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> Publicar Anuncio de Curso
                    </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/instructor/student-progress">
                        <BarChart2 className="mr-2 h-4 w-4" /> Ver Progreso de Estudiantes
                    </Link>
                </Button>
                 <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/resources">
                        <BookOpen className="mr-2 h-4 w-4" /> Explorar Recursos Empresa
                    </Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
