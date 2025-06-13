import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { ArrowRight, BookHeart, CheckCircle, Users, Video } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <BookHeart className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline text-primary">{APP_NAME}</span>
        </Link>
        <nav className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Regístrate Gratis</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary mb-6">
          Bienvenido a {APP_NAME}
        </h1>
        <p className="text-xl md:text-2xl text-foreground mb-10 max-w-3xl mx-auto">
          Tu plataforma e-learning corporativa para potenciar el conocimiento y desarrollo de tu equipo.
        </p>
        <div className="flex justify-center space-x-4 mb-16">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/register">
              Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">Explorar Cursos</Link>
          </Button>
        </div>

        <div className="relative aspect-video max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden">
            <Image 
                src="https://placehold.co/1200x675.png" 
                alt="Plataforma NexusAlpri en uso" 
                layout="fill"
                objectFit="cover"
                data-ai-hint="e-learning platform"
                priority
            />
        </div>
      </main>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline text-center text-primary mb-12">¿Por qué elegir {APP_NAME}?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-lg shadow-lg bg-background">
              <CheckCircle className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold font-headline text-primary mb-2">Gestión Centralizada</h3>
              <p className="text-foreground">Todo tu contenido de capacitación y recursos empresariales en un solo lugar, accesible para todo tu personal.</p>
            </div>
            <div className="p-6 rounded-lg shadow-lg bg-background">
              <Users className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold font-headline text-primary mb-2">Roles Personalizados</h3>
              <p className="text-foreground">Paneles y herramientas adaptadas para Administradores, Instructores y Estudiantes, optimizando la experiencia de cada uno.</p>
            </div>
            <div className="p-6 rounded-lg shadow-lg bg-background">
              <Video className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold font-headline text-primary mb-2">Contenido Interactivo</h3>
              <p className="text-foreground">Soporte para diversos formatos de contenido, desde videos y documentos hasta quizzes, para un aprendizaje dinámico.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 bg-background border-t">
        <p className="text-muted-foreground">&copy; {new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
