'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from '@hookform/resolvers/zod';
import { Megaphone, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { UserRole } from '@/types';
import { ALL_ROLES, ROLES_TRANSLATION } from "@/lib/constants";

const announcementFormSchema = z.object({
  title: z.string().min(5, { message: "El título debe tener al menos 5 caracteres." }),
  content: z.string().min(10, { message: "El contenido debe tener al menos 10 caracteres." }),
  author: z.string().min(3, { message: "El autor debe tener al menos 3 caracteres." }),
  targetRoles: z.array(z.enum(ALL_ROLES)).min(1, "Debes seleccionar al menos un rol de destino."),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export default function AdminCreateAnnouncementPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth(); 

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: '',
      content: '',
      author: user?.name || 'Administrador', 
      targetRoles: [...ALL_ROLES], 
    },
  });

  function onSubmit(values: AnnouncementFormValues) {
    setIsSubmitting(true);
    console.log("Admin creating announcement:", values);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Anuncio Publicado",
        description: `El anuncio "${values.title}" ha sido creado.`,
      });
      setIsSubmitting(false);
      router.push('/admin/manage-announcements');
    }, 1000);
  }

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center mb-6">
          <Megaphone className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-primary font-headline">Crear Nuevo Anuncio</h1>
        </div>
        <Button variant="outline" asChild className="mb-6">
          <Link href="/admin/manage-announcements">← Volver a Gestionar Anuncios</Link>
        </Button>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Detalles del Anuncio</CardTitle>
            <CardDescription>Redacta y configura tu nuevo anuncio para la plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del Anuncio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Mantenimiento Programado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenido del Anuncio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Escribe aquí el cuerpo del anuncio..." rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetRoles"
                  render={() => (
                    <FormItem>
                      <div className="mb-2"> {/* Reduced margin for tighter spacing */}
                        <FormLabel className="text-base font-semibold">Dirigido A</FormLabel>
                        <FormDescription className="text-xs"> 
                          Selecciona los roles que verán este anuncio.
                        </FormDescription>
                      </div>
                      <div className="space-y-2"> {/* Container for checkboxes */}
                        {ALL_ROLES.map((role) => (
                          <FormField
                            key={role}
                            control={form.control}
                            name="targetRoles"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={role}
                                  className="flex flex-row items-center space-x-3 space-y-0 p-2 border rounded-md hover:bg-muted/50"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(role)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), role])
                                          : field.onChange(
                                              (field.value || []).filter(
                                                (value) => value !== role
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm cursor-pointer flex-1">
                                    {ROLES_TRANSLATION[role as UserRole]}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Publicando..." : "Publicar Anuncio"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
