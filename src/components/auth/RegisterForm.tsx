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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from '@/types';


const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  confirmPassword: z.string(),
  role: z.enum(['student', 'instructor'], {errorMap: () => ({ message: "Debes seleccionar un rol." })}),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'],
});

export function RegisterForm() {
  const { login, isLoading } = useAuth(); // Use login for now to simulate registration & login
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call for registration
    setTimeout(() => {
      // In a real app, you'd register the user and then log them in.
      // For this demo, we'll use the login function with the selected role.
      // Make sure email format matches mock users if you want auto-role detection for login.
      // Or, better, pass the role directly.
      login(values.role as UserRole); // Cast role as UserRole
      toast({
        title: "Registro Exitoso",
        description: `¡Bienvenido/a, ${values.name}! Tu cuenta como ${values.role} ha sido creada.`,
      });
      // No need to setIsSubmitting(false) as navigation will occur
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Tu Nombre Completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quiero registrarme como</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="student">Estudiante</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
             <UserPlus className="mr-2 h-4 w-4" />
          )}
          Crear Cuenta
        </Button>
         <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </form>
    </Form>
  );
}
