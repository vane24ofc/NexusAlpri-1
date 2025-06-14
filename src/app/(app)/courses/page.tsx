
'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";
import { CourseCard } from "@/components/courses/CourseCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ListFilter, BookOpen as BookOpenIcon, Loader2, AlertTriangle } from "lucide-react";
import { useAtom, useSetAtom } from "jotai";
import { coursesAtom, coursesLoadingAtom, coursesErrorAtom, loadCoursesAtom } from "@/store/courses";
import { Button } from "@/components/ui/button"; // Added for retry button

export default function CoursesPage() {
  const [courses] = useAtom(coursesAtom);
  const [isLoading] = useAtom(coursesLoadingAtom);
  const [error] = useAtom(coursesErrorAtom);
  const dispatchLoadCourses = useSetAtom(loadCoursesAtom);
  
  const categories = isLoading ? [] : Array.from(new Set(courses.map(c => c.category)));

  return (
    <AuthGuard allowedRoles={['admin', 'instructor', 'student']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-primary font-headline">Catálogo de Cursos</h1>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar cursos..." className="pl-8 w-full md:w-64 bg-card" />
            </div>
            <Select disabled={isLoading || !!error}>
              <SelectTrigger className="w-[180px] bg-card">
                <ListFilter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="ml-4 text-xl text-muted-foreground">Cargando catálogo de cursos...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-center py-20 text-destructive">
            <AlertTriangle className="mx-auto h-16 w-16 mb-4" />
            <p className="text-xl font-semibold">Error al Cargar el Catálogo</p>
            <p className="text-md mb-6">{error}</p>
            <Button variant="outline" onClick={() => dispatchLoadCourses()}>Reintentar</Button>
          </div>
        )}
        {!isLoading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
        {!isLoading && !error && courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No hay cursos disponibles en este momento.</p>
            <p className="text-sm text-muted-foreground">Por favor, vuelve más tarde o contacta al administrador.</p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
