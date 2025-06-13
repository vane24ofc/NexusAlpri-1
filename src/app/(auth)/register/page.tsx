import { RegisterForm } from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro | NexusAlpri',
  description: 'Crea tu cuenta en NexusAlpri.',
};

export default function RegisterPage() {
  return (
     <>
      <h2 className="text-2xl font-bold text-center text-foreground mb-1 font-headline">Crea tu Cuenta</h2>
      <p className="text-muted-foreground text-center mb-6">Únete a NexusAlpri para empezar a aprender o enseñar.</p>
      <RegisterForm />
    </>
  );
}
