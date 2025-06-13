import { AuthGuard } from "@/components/auth/AuthGuard";
import { CourseCard } from "@/components/courses/CourseCard";
import { MOCK_COURSES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ListFilter } from "lucide-react";

export default function CoursesPage() {
  const categories = Array.from(new Set(MOCK_COURSES.map(c => c.category)));
  // In a real app, filtering would be dynamic.

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
            <Select>
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

        {MOCK_COURSES.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_COURSES.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No hay cursos disponibles en este momento.</p>
            <p className="text-sm text-muted-foreground">Por favor, vuelve más tarde o contacta al administrador.</p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
