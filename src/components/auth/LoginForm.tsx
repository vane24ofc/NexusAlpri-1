'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { Loader2, LogIn } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from '@/types';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria.' }),
});

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Mock login: determine role based on email for demo
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    let role: UserRole = 'student'; // Default role
    if (values.email.startsWith('admin@')) {
      role = 'admin';
    } else if (values.email.startsWith('instructor@')) {
      role = 'instructor';
    } else if (values.email.startsWith('student@')) {
      role = 'student';
    } else {
       toast({
        title: "Error de Autenticación",
        description: "Usuario no reconocido. Use admin@, instructor@, o student@ para la demostración.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      login(role); // This will also handle navigation via useAuth hook
      toast({
        title: "Inicio de Sesión Exitoso",
        description: `Bienvenido/a a NexusAlpri como ${role}.`,
      });
      // No need to setIsSubmitting(false) as navigation will occur
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}
          Iniciar Sesión
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </Form>
  );
}
