import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { MOCK_COURSES } from "@/lib/constants";
import { Edit3, PlusCircle, Search, MoreHorizontal, Trash2, Eye, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function InstructorMyCoursesPage() {
  // For demo, assume all MOCK_COURSES belong to this instructor
  const instructorCourses = MOCK_COURSES; 

  return (
    <AuthGuard allowedRoles={['instructor']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center">
            <Edit3 className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-primary font-headline">Mis Cursos</h1>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar en mis cursos..." className="pl-8 w-full md:w-64 bg-card" />
            </div>
            <Button asChild>
              <Link href="/instructor/create-course">
                <PlusCircle className="mr-2 h-4 w-4" /> Crear Nuevo Curso
              </Link>
            </Button>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Listado de Mis Cursos</CardTitle>
            <CardDescription>Gestiona el contenido, estudiantes y configuración de tus cursos.</CardDescription>
          </CardHeader>
          <CardContent>
            {instructorCourses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título del Curso</TableHead>
                    <TableHead className="hidden md:table-cell">Categoría</TableHead>
                    <TableHead className="hidden sm:table-cell">Estudiantes</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instructorCourses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image src={course.thumbnailUrl || "https://placehold.co/60x34.png"} alt={course.title} width={60} height={34} className="rounded-sm object-cover" data-ai-hint={course.dataAiHint || "course image"} />
                          <span className="font-medium">{course.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{course.category}</TableCell>
                      <TableCell className="hidden sm:table-cell">{Math.floor(Math.random() * 100)}</TableCell> {/* Mock student count */}
                      <TableCell>
                        <Badge variant={Math.random() > 0.3 ? "default" : "outline"} className={Math.random() > 0.3 ? "bg-green-500 hover:bg-green-600 text-white" : ""}>
                          {Math.random() > 0.3 ? "Publicado" : "Borrador"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Más acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem asChild><Link href={`/courses/${course.id}/preview`} className="cursor-pointer"><Eye className="mr-2 h-4 w-4" /> Ver Contenido</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/instructor/my-courses/${course.id}/edit`} className="cursor-pointer"><Edit3 className="mr-2 h-4 w-4" /> Editar Curso</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/instructor/my-courses/${course.id}/students`} className="cursor-pointer"><Users className="mr-2 h-4 w-4" /> Ver Estudiantes</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/instructor/my-courses/${course.id}/progress`} className="cursor-pointer"><BarChart2 className="mr-2 h-4 w-4" /> Ver Progreso</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive cursor-pointer"><Trash2 className="mr-2 h-4 w-4" /> Eliminar Curso</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <Edit3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">Aún no has creado ningún curso.</p>
                <Button asChild className="mt-4">
                  <Link href="/instructor/create-course">
                    <PlusCircle className="mr-2 h-4 w-4" /> ¡Crea tu Primer Curso!
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
