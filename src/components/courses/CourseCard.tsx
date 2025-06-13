'use client';

import type { Course, UserRole } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, UserCircle, ArrowRight, Eye, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth'; // To tailor actions based on role

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { user } = useAuth();
  const userRole = user?.role;

  const getAction = () => {
    if (userRole === 'admin' || userRole === 'instructor') {
      return (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/courses/${course.id}/preview`}> {/* Admin/Instructor might preview or manage */}
            {userRole === 'admin' ? <Edit className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {userRole === 'admin' ? 'Gestionar' : 'Ver Contenido'}
          </Link>
        </Button>
      );
    }
    // Default for student or unauthenticated (though catalog is usually for authenticated)
    return (
      <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
        <Link href={`/courses/${course.id}`}>
          {/* Check if student is enrolled, then "Continuar", else "Inscribirse" or "Ver Detalles" */}
          Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    );
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/courses/${course.id}`} className="block aspect-[16/9] relative overflow-hidden">
          <Image
            src={course.thumbnailUrl || 'https://placehold.co/350x197.png'}
            alt={course.title}
            layout="fill"
            objectFit="cover"
            className="hover:scale-105 transition-transform duration-300"
            data-ai-hint={course.dataAiHint || "course thumbnail"}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2 bg-accent/20 text-accent-foreground border-accent">{course.category}</Badge>
        <CardTitle className="text-lg font-headline mb-1 leading-tight">
            <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">{course.title}</Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-2">{course.description}</CardDescription>
        <div className="flex items-center text-xs text-muted-foreground">
          <UserCircle className="h-4 w-4 mr-1.5 text-primary" />
          <span>Impartido por: {course.instructor}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {getAction()}
      </CardFooter>
    </Card>
  );
}
