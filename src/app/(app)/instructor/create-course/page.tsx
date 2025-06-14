
// src/app/(app)/instructor/create-course/page.tsx
'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from '@hookform/resolvers/zod';
import { BookCopy, UploadCloud, Loader2 } from "lucide-react";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useSetAtom } from 'jotai';
import { addCourseAtom } from '@/store/courses';
import { useAuth } from "@/hooks/use-auth";

const courseFormSchema = z.object({
  courseTitle: z.string().min(5, { message: "El título debe tener al menos 5 caracteres." }),
  courseDescription: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
  courseCategory: z.string().min(3, { message: "La categoría debe tener al menos 3 caracteres." }),
  courseThumbnail: z.any().optional(), 
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function InstructorCreateCoursePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addNewCourse = useSetAtom(addCourseAtom);
  const { user } = useAuth();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      courseTitle: '',
      courseDescription: '',
      courseCategory: '',
      courseThumbnail: null,
    },
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

  async function onSubmit(values: CourseFormValues) {
    setIsSubmitting(true);

    if (!user || !user.name) {
        toast({ title: "Error de Autenticación", description: "No se pudo identificar al instructor. Por favor, inicia sesión de nuevo.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }
    
    const newCourseData = {
      courseTitle: values.courseTitle,
      courseDescription: values.courseDescription,
      courseCategory: values.courseCategory,
      instructorName: user.name, // Get instructor name from authenticated user
      courseThumbnail: values.courseThumbnail || thumbnailPreview, // Pass File object or preview data URL
      dataAiHint: values.courseCategory.toLowerCase().replace(/\s+/g, '-').split('-').slice(0,2).join(' '),
    };

    try {
      await addNewCourse(newCourseData);
      toast({
        title: "Curso Creado (Borrador)",
        description: `El curso "${values.courseTitle}" ha sido guardado como borrador. Continúa para añadir módulos.`,
      });
      router.push('/instructor/my-courses');
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error al Crear Curso",
        description: "Hubo un problema al guardar el curso. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthGuard allowedRoles={['instructor']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center mb-6">
          <BookCopy className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-primary font-headline">Crear Nuevo Curso</h1>
        </div>
         <Button variant="outline" asChild className="mb-6">
          <Link href="/instructor/my-courses">← Volver a Mis Cursos</Link>
        </Button>

        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Información Básica del Curso</CardTitle>
            <CardDescription>Completa los detalles principales para tu nuevo curso.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="courseTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del Curso</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Fundamentos de Marketing Digital" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courseDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción Breve</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe de qué trata tu curso en pocas palabras..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courseCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Marketing, Tecnología, Negocios" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label htmlFor="courseThumbnail">Miniatura del Curso (Opcional)</Label>
                  <div className="w-full">
                    <label
                      htmlFor="dropzone-file-instructor" 
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer relative overflow-hidden",
                        thumbnailPreview ? "border-primary bg-card" : "bg-muted/50 hover:bg-muted/70"
                      )}
                    >
                      {thumbnailPreview ? (
                        <Image
                          src={thumbnailPreview}
                          alt="Previsualización de la miniatura"
                          layout="fill"
                          objectFit="contain"
                          className="rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-4 h-full">
                          <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF (MAX. 800x400px, 16:9)</p>
                        </div>
                      )}
                      <Input
                        id="dropzone-file-instructor" 
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                    {form.formState.errors.courseThumbnail && <p className="text-sm text-destructive pt-1">{form.formState.errors.courseThumbnail.message?.toString()}</p>}
                  </div>
                </div>
                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Guardando..." : "Guardar y Continuar a Módulos"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
