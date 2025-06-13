import { LoginForm } from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | NexusAlpri',
  description: 'Inicia sesión en tu cuenta NexusAlpri.',
};

export default function LoginPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-center text-foreground mb-1 font-headline">Bienvenido de Nuevo</h2>
      <p className="text-muted-foreground text-center mb-6">Ingresa tus credenciales para acceder a la plataforma.</p>
      <LoginForm />
    </>
  );
}
