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

const courseFormSchema = z.object({
  courseTitle: z.string().min(5, { message: "El título debe tener al menos 5 caracteres." }),
  courseDescription: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
  courseCategory: z.string().min(3, { message: "La categoría debe tener al menos 3 caracteres." }),
  instructorName: z.string().min(3, { message: "El nombre del instructor debe tener al menos 3 caracteres." }),
  courseThumbnail: z.any().optional(), 
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function AdminCreateCoursePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      courseTitle: '',
      courseDescription: '',
      courseCategory: '',
      instructorName: '',
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

  function onSubmit(values: CourseFormValues) {
    setIsSubmitting(true);
    console.log("Admin creating course:", values);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Curso Creado",
        description: `El curso "${values.courseTitle}" ha sido creado por el administrador.`,
      });
      setIsSubmitting(false);
      router.push('/admin/manage-courses');
    }, 1000);
  }

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center mb-6">
          <BookCopy className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-primary font-headline">Crear Nuevo Curso (Admin)</h1>
        </div>
        <Button variant="outline" asChild className="mb-6">
          <Link href="/admin/manage-courses">← Volver a Gestionar Cursos</Link>
        </Button>

        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Información Básica del Curso</CardTitle>
            <CardDescription>Completa los detalles principales para el nuevo curso.</CardDescription>
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
                        <Textarea placeholder="Describe de qué trata el curso..." {...field} />
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
                        <Input placeholder="Ej: Marketing, Tecnología" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="instructorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Instructor Asignado</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Dr. Algoritmo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label htmlFor="courseThumbnail">Miniatura del Curso (Opcional)</Label>
                  <div className="w-full">
                    <label
                      htmlFor="dropzone-file-admin"
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
                        id="dropzone-file-admin" 
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
                  {isSubmitting ? "Creando..." : "Crear Curso"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
