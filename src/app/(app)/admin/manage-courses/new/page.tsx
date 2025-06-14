
'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from '@hookform/resolvers/zod';
import { BookCopy, UploadCloud, Loader2, PlusCircle, Trash2, LinkIcon, FileTextIcon } from "lucide-react";
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { useSetAtom } from 'jotai';
import { addCourseAtom, updateCourseModulesAtom, courseFormValidationSchema } from '@/store/courses';
import type { Course, Module, Lesson } from "@/types";

// Re-use the validation schema from the store for consistency
type CourseFormValues = z.infer<typeof courseFormValidationSchema>;

export default function AdminCreateCoursePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmittingBasic, setIsSubmittingBasic] = useState(false);
  const [isSubmittingModules, setIsSubmittingModules] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  const createNewCourseInStore = useSetAtom(addCourseAtom);
  const updateCourseInStore = useSetAtom(updateCourseModulesAtom);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormValidationSchema),
    defaultValues: {
      courseTitle: '',
      courseDescription: '',
      courseCategory: '',
      instructorName: '',
      courseThumbnail: null,
      modules: [],
    },
  });

  const { fields: moduleFields, append: appendModule, remove: removeModule } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('courseThumbnail', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue('courseThumbnail', null);
      setThumbnailPreview(null);
    }
  };

  async function onBasicSubmit(values: Pick<CourseFormValues, 'courseTitle' | 'courseDescription' | 'courseCategory' | 'instructorName' | 'courseThumbnail'>) {
    setIsSubmittingBasic(true);
    if (!values.instructorName) { // Ensure instructorName is provided for admin creation
        toast({ title: "Error", description: "El nombre del instructor es requerido.", variant: "destructive" });
        setIsSubmittingBasic(false);
        return;
    }
    const newCourseData = {
      courseTitle: values.courseTitle,
      courseDescription: values.courseDescription,
      courseCategory: values.courseCategory,
      instructor: values.instructorName, // Map instructorName to instructor
      courseThumbnail: values.courseThumbnail || thumbnailPreview,
      dataAiHint: values.courseCategory.toLowerCase().replace(/\s+/g, '-').split('-').slice(0,2).join(' '),
    };

    try {
      const createdCourse = await createNewCourseInStore(newCourseData);
      setCurrentCourse(createdCourse);
      form.setValue('modules', createdCourse.modules || []);
      toast({
        title: "Información Básica Guardada",
        description: `El curso "${createdCourse.title}" ha sido creado. Ahora puedes añadir módulos y lecciones.`,
      });
    } catch (error) {
      console.error("Error creating course basic info:", error);
      toast({ title: "Error al Guardar", description: "Hubo un problema al guardar la información básica.", variant: "destructive" });
    } finally {
      setIsSubmittingBasic(false);
    }
  }

  async function onModulesSubmit(values: CourseFormValues) {
    if (!currentCourse) {
      toast({ title: "Error", description: "No hay un curso seleccionado para actualizar.", variant: "destructive" });
      return;
    }
    setIsSubmittingModules(true);
    try {
      updateCourseInStore({ courseId: currentCourse.id, modules: values.modules });
      toast({
        title: "Curso Actualizado",
        description: `Los módulos y lecciones del curso "${currentCourse.title}" han sido guardados.`,
      });
      router.push('/admin/manage-courses');
    } catch (error) {
      console.error("Error updating course modules:", error);
      toast({ title: "Error al Guardar Módulos", description: "Hubo un problema al guardar los módulos y lecciones.", variant: "destructive" });
    } finally {
      setIsSubmittingModules(false);
    }
  }

  const addLessonToModule = (moduleIndex: number) => {
    const newLesson: Lesson = {
      id: `lsn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: `Nueva Lección ${ (form.getValues(`modules.${moduleIndex}.lessons`)?.length || 0) + 1}`,
      contentType: 'video',
      contentUrl: '',
    };
    const currentLessons = form.getValues(`modules.${moduleIndex}.lessons`) || [];
    form.setValue(`modules.${moduleIndex}.lessons`, [...currentLessons, newLesson]);
  };

  const removeLessonFromModule = (moduleIndex: number, lessonIndex: number) => {
    const currentLessons = form.getValues(`modules.${moduleIndex}.lessons`) || [];
    const updatedLessons = currentLessons.filter((_, idx) => idx !== lessonIndex);
    form.setValue(`modules.${moduleIndex}.lessons`, updatedLessons);
  };
  
  const getYouTubeEmbedUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    try {
      const videoUrl = new URL(url);
      let videoId = videoUrl.searchParams.get('v');
      if (!videoId && videoUrl.hostname === 'youtu.be') {
        videoId = videoUrl.pathname.substring(1);
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
    } catch (e) { return undefined; }
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center mb-6">
          <BookCopy className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-primary font-headline">
            {currentCourse ? `Editando Curso: ${currentCourse.title}` : "Crear Nuevo Curso (Admin)"}
          </h1>
        </div>
        <Button variant="outline" asChild className="mb-6">
          <Link href="/admin/manage-courses">← Volver a Gestionar Cursos</Link>
        </Button>

        <Form {...form}>
          {!currentCourse ? (
            <Card className="max-w-3xl mx-auto shadow-lg">
              <CardHeader>
                <CardTitle>1. Información Básica del Curso</CardTitle>
                <CardDescription>Completa los detalles principales para el nuevo curso.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(data => onBasicSubmit(data as Pick<CourseFormValues, 'courseTitle' | 'courseDescription' | 'courseCategory' | 'instructorName' | 'courseThumbnail'>))} className="space-y-6">
                  <FormField control={form.control} name="courseTitle" render={({ field }) => (<FormItem><FormLabel>Título del Curso</FormLabel><FormControl><Input placeholder="Ej: Fundamentos de Marketing Digital" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="courseDescription" render={({ field }) => (<FormItem><FormLabel>Descripción Breve</FormLabel><FormControl><Textarea placeholder="Describe de qué trata el curso..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="courseCategory" render={({ field }) => (<FormItem><FormLabel>Categoría</FormLabel><FormControl><Input placeholder="Ej: Marketing, Tecnología" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="instructorName" render={({ field }) => (<FormItem><FormLabel>Nombre del Instructor Asignado</FormLabel><FormControl><Input placeholder="Ej: Dr. Algoritmo" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="space-y-2">
                    <Label htmlFor="courseThumbnail">Miniatura del Curso (Opcional)</Label>
                    <div className="w-full">
                      <label htmlFor="dropzone-file-admin" className={cn("flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer relative overflow-hidden", thumbnailPreview ? "border-primary bg-card" : "bg-muted/50 hover:bg-muted/70")}>
                        {thumbnailPreview ? (<Image src={thumbnailPreview} alt="Previsualización" layout="fill" objectFit="contain" className="rounded-lg" />)
                        : (<div className="flex flex-col items-center justify-center text-center p-4 h-full"><UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" /><p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Clic para subir</span> o arrastra</p><p className="text-xs text-muted-foreground">PNG, JPG (MAX. 800x400px)</p></div>)}
                        <Input id="dropzone-file-admin" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleThumbnailChange} />
                      </label>
                      {form.formState.errors.courseThumbnail && <p className="text-sm text-destructive pt-1">{form.formState.errors.courseThumbnail.message?.toString()}</p>}
                    </div>
                  </div>
                  <Button type="submit" className="w-full sm:w-auto" disabled={isSubmittingBasic}>
                    {isSubmittingBasic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar y Añadir Módulos
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-3xl mx-auto shadow-lg">
              <form onSubmit={form.handleSubmit(onModulesSubmit)}>
                <CardHeader>
                  <CardTitle>2. Módulos y Lecciones del Curso</CardTitle>
                  <CardDescription>Organiza el contenido de tu curso.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="multiple" className="w-full" defaultValue={moduleFields.map(m => m.id)}>
                    {moduleFields.map((moduleItem, moduleIndex) => (
                      <AccordionItem value={moduleItem.id} key={moduleItem.id} className="border-b border-border">
                        <AccordionTrigger className="hover:no-underline">
                           <div className="flex-1 flex items-center justify-between pr-2">
                            <FormField
                              control={form.control}
                              name={`modules.${moduleIndex}.title`}
                              render={({ field }) => ( <Input {...field} placeholder={`Título Módulo ${moduleIndex+1}`} className="text-lg font-semibold flex-grow border-0 shadow-none focus-visible:ring-0 p-0 h-auto" onClick={(e)=>e.stopPropagation()} /> )}
                            />
                            <Button variant="ghost" size="icon" onClick={(e)=>{e.stopPropagation(); removeModule(moduleIndex);}} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 ml-2"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pl-4 pr-2 pb-4 space-y-4 bg-muted/30 rounded-b-md">
                          {(form.getValues(`modules.${moduleIndex}.lessons`) || []).map((lessonItem, lessonIndex) => (
                            <Card key={lessonItem.id} className="bg-card p-4 shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <FormField
                                  control={form.control}
                                  name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
                                  render={({ field }) => ( <Input {...field} placeholder={`Título Lección ${lessonIndex+1}`} className="font-medium border-0 shadow-none focus-visible:ring-0 p-0 h-auto" /> )}
                                />
                                <Button variant="ghost" size="icon" onClick={() => removeLessonFromModule(moduleIndex, lessonIndex)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                              <FormField
                                control={form.control}
                                name={`modules.${moduleIndex}.lessons.${lessonIndex}.contentType`}
                                render={({ field }) => (
                                    <FormItem className="mb-2">
                                    <FormLabel className="text-xs">Tipo de Contenido</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona tipo" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                          <SelectItem value="video">Video (YouTube)</SelectItem>
                                          <SelectItem value="link">Enlace Externo</SelectItem>
                                          <SelectItem value="document">Documento (URL)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    </FormItem>
                                )}
                                />
                              {form.getValues(`modules.${moduleIndex}.lessons.${lessonIndex}.contentType`) === 'video' && (
                                <>
                                  <FormField
                                    control={form.control}
                                    name={`modules.${moduleIndex}.lessons.${lessonIndex}.contentUrl`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-xs">URL del Video (YouTube)</FormLabel>
                                        <FormControl><Input {...field} placeholder="https://www.youtube.com/watch?v=..." /></FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  {getYouTubeEmbedUrl(form.getValues(`modules.${moduleIndex}.lessons.${lessonIndex}.contentUrl`)) && (
                                    <div className="aspect-video mt-2 rounded-md overflow-hidden border">
                                      <iframe
                                        width="100%"
                                        height="100%"
                                        src={getYouTubeEmbedUrl(form.getValues(`modules.${moduleIndex}.lessons.${lessonIndex}.contentUrl`))}
                                        title={form.getValues(`modules.${moduleIndex}.lessons.${lessonIndex}.title`)}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      ></iframe>
                                    </div>
                                  )}
                                </>
                              )}
                               {form.getValues(`modules.${moduleIndex}.lessons.${lessonIndex}.contentType`) === 'link' && (
                                <FormField
                                  control={form.control}
                                  name={`modules.${moduleIndex}.lessons.${lessonIndex}.contentUrl`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs">Enlace Externo (URL)</FormLabel>
                                      <FormControl><Input {...field} placeholder="https://ejemplo.com/recurso" /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                              {form.getValues(`modules.${moduleIndex}.lessons.${lessonIndex}.contentType`) === 'document' && (
                                <FormField
                                  control={form.control}
                                  name={`modules.${moduleIndex}.lessons.${lessonIndex}.contentUrl`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs">URL del Documento</FormLabel>
                                      <FormControl><Input {...field} placeholder="https://ejemplo.com/documento.pdf" /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </Card>
                          ))}
                          <Button type="button" variant="outline" size="sm" onClick={() => addLessonToModule(moduleIndex)} className="mt-2">
                            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Lección
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button type="button" variant="secondary" onClick={() => appendModule({ id: `mod-${Date.now()}`, title: `Nuevo Módulo ${moduleFields.length + 1}`, lessons: [] })} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Módulo
                  </Button>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button type="submit" className="w-full sm:w-auto" disabled={isSubmittingModules}>
                    {isSubmittingModules && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Cambios del Curso
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </Form>
      </div>
    </AuthGuard>
  );
}
