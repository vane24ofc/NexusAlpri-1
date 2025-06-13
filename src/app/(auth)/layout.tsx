import { APP_NAME } from '@/lib/constants';
import { BookHeart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Acceso | ${APP_NAME}`,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4 sm:p-6 md:p-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <BookHeart className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-primary font-headline">{APP_NAME}</h1>
        <p className="text-muted-foreground mt-2">Tu portal de aprendizaje y desarrollo.</p>
      </div>
      <div className="w-full max-w-md rounded-xl bg-card p-6 sm:p-8 shadow-2xl">
        {children}
      </div>
       <footer className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.
        </footer>
    </div>
  );
}
