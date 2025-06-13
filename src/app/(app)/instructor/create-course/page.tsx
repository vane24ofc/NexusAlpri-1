// src/app/(app)/instructor/create-course/page.tsx
'use client';

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookCopy, UploadCloud } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function InstructorCreateCoursePage() {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  return (
    <AuthGuard allowedRoles={['instructor']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center mb-8">
          <BookCopy className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-primary font-headline">Crear Nuevo Curso</h1>
        </div>

        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Información Básica del Curso</CardTitle>
            <CardDescription>Completa los detalles principales para tu nuevo curso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="courseTitle">Título del Curso</Label>
              <Input id="courseTitle" placeholder="Ej: Fundamentos de Marketing Digital" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseDescription">Descripción Breve</Label>
              <Textarea id="courseDescription" placeholder="Describe de qué trata tu curso en pocas palabras..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseCategory">Categoría</Label>
              <Input id="courseCategory" placeholder="Ej: Marketing, Tecnología, Negocios" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseThumbnail">Miniatura del Curso (Opcional)</Label>
              <div className="w-full">
                <label
                  htmlFor="dropzone-file"
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
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF (MAX. 800x400px, 16:9 recomendado)</p>
                    </div>
                  )}
                  <Input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleThumbnailChange}
                  />
                </label>
              </div>
            </div>
            <Button className="w-full sm:w-auto">Guardar y Continuar a Módulos</Button>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
