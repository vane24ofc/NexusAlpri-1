
'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { MOCK_ANNOUNCEMENTS } from "@/lib/constants";
import { BookOpen, PlayCircle, CheckCircle, ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { useAtom } from "jotai";
import { coursesAtom } from "@/store/courses";

export default function StudentDashboardPage() {
  const [allCourses] = useAtom(coursesAtom);
  
  // Mock data for student's enrollment & progress
  // In a real app, this would come from a backend or more complex state
  const enrolledCourses = allCourses.slice(0, 2).map((course, index) => ({
    ...course,
    progress: index === 0 ? 75 : 30, // Mock progress
    nextLesson: index === 0 ? "Lección 5: Bucles For" : "Lección 2: Variables y Tipos",
  }));
  const completedCoursesCount = allCourses.length > 2 ? 1 : 0; // Mock one completed if enough courses exist

  return (
    <AuthGuard allowedRoles={['student']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <h1 className="text-3xl font-bold mb-8 text-primary font-headline">Mi Panel de Estudiante</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="bg-primary text-primary-foreground shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Continuar Aprendiendo</CardTitle>
              {enrolledCourses.length > 0 && <CardDescription className="text-primary-foreground/80">{enrolledCourses[0].title}</CardDescription>}
            </CardHeader>
            <CardContent>
              {enrolledCourses.length > 0 ? (
                <>
                  <p className="text-sm mb-2">Siguiente: {enrolledCourses[0].nextLesson}</p>
                  <Progress value={enrolledCourses[0].progress} className="mb-4 h-3 [&>*]:bg-accent" />
                  <Button variant="secondary" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                    <Link href={`/courses/${enrolledCourses[0].id}`}>
                      <PlayCircle className="mr-2 h-4 w-4" /> Ir al Curso
                    </Link>
                  </Button>
                </>
              ) : (
                 <p className="text-primary-foreground/80">No tienes cursos en progreso. ¡Explora el catálogo!</p>
              )}
            </CardContent>
          </Card>
          <StatCard title="Cursos Inscritos" value={enrolledCourses.length} icon={BookOpen} />
          <StatCard title="Cursos Completados" value={completedCoursesCount} icon={CheckCircle} iconClassName="text-green-500" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-headline">Mis Cursos Actuales</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/student/my-learning">Ver todo mi aprendizaje</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                {enrolledCourses.length > 0 ? (
                    <div className="space-y-4">
                    {enrolledCourses.map(course => (
                        <Link href={`/courses/${course.id}`} key={course.id} className="block p-4 border rounded-lg hover:shadow-md transition-shadow duration-200 hover:border-primary">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <Image 
                                    src={course.thumbnailUrl || "https://placehold.co/120x70.png"} 
                                    alt={course.title} 
                                    width={120} 
                                    height={70} 
                                    className="rounded-md object-cover" 
                                    data-ai-hint={course.dataAiHint || "course image"} 
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-primary">{course.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-1">Impartido por: {course.instructor}</p>
                                    <Progress value={course.progress} className="h-2" />
                                    <p className="text-xs text-muted-foreground mt-1">{course.progress}% completado</p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-primary self-center sm:self-auto">
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </Link>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">Aún no te has inscrito a ningún curso.</p>
                        <Button asChild>
                            <Link href="/courses">Explorar Catálogo de Cursos</Link>
                        </Button>
                    </div>
                )}
                </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-lg">
                  <CardHeader>
                  <CardTitle className="text-xl font-headline">Anuncios Importantes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                    {MOCK_ANNOUNCEMENTS.slice(0,2).map(announcement => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} variant="compact" />
                    ))}
                    <Button variant="link" asChild className="w-full">
                        <Link href="/announcements">Ver todos los anuncios</Link>
                    </Button>
                  </CardContent>
              </Card>
              <Card className="shadow-lg bg-accent/20 border-accent">
                  <CardHeader>
                    <CardTitle className="text-xl font-headline text-accent-foreground">Recursos Útiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground mb-4">Accede a manuales, guías y políticas de la empresa.</p>
                      <Button variant="default" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                          <Link href="/resources">
                            <Briefcase className="mr-2 h-4 w-4" /> Explorar Recursos
                          </Link>
                      </Button>
                  </CardContent>
              </Card>
            </div>
        </div>

      </div>
    </AuthGuard>
  );
}
