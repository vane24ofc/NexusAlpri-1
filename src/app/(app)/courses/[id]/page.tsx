
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { coursesAtom } from '@/store/courses';
import type { Course, Module, Lesson as LessonType } from '@/types';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ChevronLeft, PlayCircle, Link as LinkIcon, FileText, BookOpen, AlertTriangle } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

// Helper function (can be moved to utils later)
const getYouTubeEmbedUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  try {
    const videoUrl = new URL(url);
    let videoId = videoUrl.searchParams.get('v');
    if (!videoId && videoUrl.hostname === 'youtu.be') {
      videoId = videoUrl.pathname.substring(1);
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
  } catch (e) {
    return undefined;
  }
};

export default function CourseDisplayPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [courses] = useAtom(coursesAtom);
  const [course, setCourse] = useState<Course | null | undefined>(undefined); // undefined for loading, null for not found
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === courseId);
    setCourse(foundCourse || null);

    if (foundCourse && foundCourse.modules && foundCourse.modules.length > 0) {
      const firstModuleWithLessons = foundCourse.modules.find(m => m.lessons && m.lessons.length > 0);
      if (firstModuleWithLessons) {
        setActiveModuleId(firstModuleWithLessons.id);
        setSelectedLesson(firstModuleWithLessons.lessons[0]);
      }
    }
  }, [courseId, courses]);

  useEffect(() => {
    if (course?.title) {
      document.title = `${course.title} | ${APP_NAME}`;
    }
  }, [course]);


  if (course === undefined) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center h-screen">
          <BookOpen className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AuthGuard>
    );
  }

  if (course === null) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-8 px-4 md:px-0 text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Curso No Encontrado</h1>
          <p className="text-muted-foreground mb-6">Lo sentimos, el curso que estás buscando no existe o no está disponible.</p>
          <Button onClick={() => router.push('/courses')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Volver al Catálogo
          </Button>
        </div>
      </AuthGuard>
    );
  }

  const handleLessonClick = (lesson: LessonType, moduleId: string) => {
    setSelectedLesson(lesson);
    // Ensure the accordion for this module is open, if not already controlled by defaultOpen
  };

  return (
    <AuthGuard>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Volver
        </Button>

        <Card className="mb-8 shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-1">
               <AspectRatio ratio={16 / 9}>
                <Image
                  src={course.thumbnailUrl || `https://placehold.co/600x338.png?text=${encodeURIComponent(course.title)}`}
                  alt={course.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={course.dataAiHint || "course image"}
                />
              </AspectRatio>
            </div>
            <div className="md:col-span-2 p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-primary font-headline mb-3">{course.title}</h1>
              <p className="text-sm text-muted-foreground mb-1">Impartido por: {course.instructor}</p>
              <p className="text-sm text-muted-foreground mb-4">Categoría: {course.category}</p>
              <p className="text-foreground leading-relaxed">{course.description}</p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <h2 className="text-2xl font-semibold font-headline mb-4 text-foreground">Contenido del Curso</h2>
            {course.modules && course.modules.length > 0 ? (
              <Accordion type="single" collapsible defaultValue={activeModuleId || (course.modules[0]?.id)} className="w-full">
                {course.modules.map((module, moduleIndex) => (
                  <AccordionItem value={module.id} key={module.id}>
                    <AccordionTrigger className="hover:no-underline text-base font-medium">
                      Módulo {moduleIndex + 1}: {module.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1 pl-2">
                        {module.lessons && module.lessons.length > 0 ? module.lessons.map((lesson, lessonIndex) => (
                          <li key={lesson.id}>
                            <Button
                              variant={selectedLesson?.id === lesson.id ? "secondary" : "ghost"}
                              className={`w-full justify-start text-left h-auto py-2 px-2 ${selectedLesson?.id === lesson.id ? 'bg-primary/10 text-primary' : ''}`}
                              onClick={() => handleLessonClick(lesson, module.id)}
                            >
                              {lesson.contentType === 'video' && <PlayCircle className="mr-2 h-4 w-4 flex-shrink-0" />}
                              {lesson.contentType === 'link' && <LinkIcon className="mr-2 h-4 w-4 flex-shrink-0" />}
                              {lesson.contentType === 'document' && <FileText className="mr-2 h-4 w-4 flex-shrink-0" />}
                              <span className="truncate">{lessonIndex + 1}. {lesson.title}</span>
                            </Button>
                          </li>
                        )) : (
                           <p className="px-2 py-2 text-sm text-muted-foreground">No hay lecciones en este módulo.</p>
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">Este curso aún no tiene módulos definidos.</p>
            )}
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4">
            {selectedLesson ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline text-primary">{selectedLesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedLesson.contentType === 'video' && getYouTubeEmbedUrl(selectedLesson.contentUrl) && (
                    <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden border">
                      <iframe
                        src={getYouTubeEmbedUrl(selectedLesson.contentUrl)}
                        title={selectedLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </AspectRatio>
                  )}
                  {selectedLesson.contentType === 'video' && !getYouTubeEmbedUrl(selectedLesson.contentUrl) && selectedLesson.contentUrl && (
                    <div className="p-4 border rounded-md bg-muted text-muted-foreground">
                        <p>La URL del video no es un enlace de YouTube válido o no se pudo procesar: <Link href={selectedLesson.contentUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{selectedLesson.contentUrl}</Link></p>
                    </div>
                  )}
                  {selectedLesson.contentType === 'link' && selectedLesson.contentUrl && (
                    <div className="p-4 border rounded-md bg-muted">
                      <p className="mb-2 text-foreground">Este contenido es un enlace externo:</p>
                      <Button asChild>
                        <Link href={selectedLesson.contentUrl} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="mr-2 h-4 w-4" /> Abrir Enlace
                        </Link>
                      </Button>
                    </div>
                  )}
                  {selectedLesson.contentType === 'document' && selectedLesson.contentUrl && (
                     <div className="p-4 border rounded-md bg-muted">
                      <p className="mb-2 text-foreground">Este contenido es un documento:</p>
                      <Button asChild>
                        <Link href={selectedLesson.contentUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="mr-2 h-4 w-4" /> Ver Documento
                        </Link>
                      </Button>
                    </div>
                  )}
                  {(!selectedLesson.contentUrl || 
                    (selectedLesson.contentType === 'video' && !getYouTubeEmbedUrl(selectedLesson.contentUrl) && !selectedLesson.contentUrl )
                  ) && (
                     <p className="text-muted-foreground">No hay contenido disponible para esta lección o la URL no es válida.</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg h-full flex flex-col items-center justify-center text-center p-8">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold text-muted-foreground">Selecciona una lección</h2>
                <p className="text-muted-foreground">Elige una lección del menú de la izquierda para comenzar.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
