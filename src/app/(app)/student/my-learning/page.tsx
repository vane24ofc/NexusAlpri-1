
'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { BookCopy, PlayCircle, CheckCircle, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { coursesAtom } from "@/store/courses";

export default function StudentMyLearningPage() {
  const [allCourses] = useAtom(coursesAtom);

  // Mock data for student's learning progress - this would be more complex in a real app
  const inProgressCourses = allCourses.slice(0, Math.min(2, allCourses.length)).map((course, index) => ({
    ...course,
    progress: index === 0 ? 75 : 30,
  }));
  
  const completedCourses = allCourses.length > 2 ? 
    allCourses.slice(2, Math.min(3, allCourses.length)).map(course => ({ ...course, progress: 100 }))
    : [];

  return (
    <AuthGuard allowedRoles={['student']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center">
            <BookCopy className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-primary font-headline">Mi Aprendizaje</h1>
          </div>
           <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar en mis cursos..." className="pl-8 w-full md:w-64 bg-card" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6">
            <TabsTrigger value="in-progress">En Progreso ({inProgressCourses.length})</TabsTrigger>
            <TabsTrigger value="completed">Completados ({completedCourses.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="in-progress">
            {inProgressCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map(course => (
                  <Card key={course.id} className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                     <Link href={`/courses/${course.id}`} className="block aspect-[16/9] relative overflow-hidden">
                        <Image
                            src={course.thumbnailUrl || 'https://placehold.co/350x197.png'}
                            alt={course.title}
                            layout="fill"
                            objectFit="cover"
                            className="hover:scale-105 transition-transform duration-300"
                            data-ai-hint={course.dataAiHint || "course image"}
                        />
                     </Link>
                    <CardHeader>
                      <CardTitle className="text-lg font-headline mb-1"><Link href={`/courses/${course.id}`} className="hover:text-primary">{course.title}</Link></CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">Impartido por: {course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <Progress value={course.progress} className="h-2 mb-1" />
                      <p className="text-xs text-muted-foreground">{course.progress}% completado</p>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                        <Link href={`/courses/${course.id}`}>
                          <PlayCircle className="mr-2 h-4 w-4" /> Continuar Aprendizaje
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border rounded-lg bg-card">
                <BookCopy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No tienes cursos en progreso.</p>
                <Button asChild className="mt-4">
                  <Link href="/courses">Explorar Cursos</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="completed">
             {completedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map(course => (
                   <Card key={course.id} className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                     <Link href={`/courses/${course.id}`} className="block aspect-[16/9] relative overflow-hidden">
                        <Image
                            src={course.thumbnailUrl || 'https://placehold.co/350x197.png'}
                            alt={course.title}
                            layout="fill"
                            objectFit="cover"
                            className="hover:scale-105 transition-transform duration-300 filter grayscale"
                            data-ai-hint={course.dataAiHint || "course image"}
                        />
                         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <CheckCircle className="h-12 w-12 text-white/80" />
                        </div>
                     </Link>
                    <CardHeader>
                      <CardTitle className="text-lg font-headline mb-1"><Link href={`/courses/${course.id}`} className="hover:text-primary">{course.title}</Link></CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">Impartido por: {course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-green-600 font-semibold">¡Completado!</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/courses/${course.id}/review`}>
                          Ver Certificado / Repasar
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border rounded-lg bg-card">
                <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">Aún no has completado ningún curso.</p>
                 <Button asChild className="mt-4">
                  <Link href="/courses">¡Empieza un Curso Hoy!</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}
