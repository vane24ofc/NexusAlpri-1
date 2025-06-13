import type { UserRole, Course, EnterpriseResource, Announcement } from '@/types';
import { LayoutDashboard, BookOpen, Briefcase, Megaphone, Settings, Users, Edit3, FileText, Video, BookCopy, ChevronRight } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
  subItems?: NavItem[];
  isHeader?: boolean;
}

export const APP_NAME = "NexusAlpri";
export const LOGO_TEXT = "NexusAlpri";

export const ALL_ROLES: UserRole[] = ['admin', 'instructor', 'student'];

export const MAIN_NAVIGATION: NavItem[] = [
  { href: '/dashboard', label: 'Panel Principal', icon: LayoutDashboard, roles: ALL_ROLES },
  { href: '/courses', label: 'Catálogo de Cursos', icon: BookOpen, roles: ALL_ROLES },
  { href: '/resources', label: 'Recursos Empresa', icon: Briefcase, roles: ALL_ROLES },
  { href: '/announcements', label: 'Anuncios', icon: Megaphone, roles: ALL_ROLES },
];

export const ADMIN_SPECIFIC_NAV: NavItem[] = [
  { label: 'Administración', roles: ['admin'], isHeader: true, href:'', icon: Settings },
  { href: '/admin/manage-courses', label: 'Gestionar Cursos', icon: Edit3, roles: ['admin'] },
  { href: '/admin/users', label: 'Gestionar Usuarios', icon: Users, roles: ['admin'] },
  { href: '/admin/manage-announcements', label: 'Gestionar Anuncios', icon: Megaphone, roles: ['admin'] },
  { href: '/admin/settings', label: 'Configuración', icon: Settings, roles: ['admin'] },
];

export const INSTRUCTOR_SPECIFIC_NAV: NavItem[] = [
  { label: 'Instructor', roles: ['instructor'], isHeader: true, href:'', icon: Users },
  { href: '/instructor/my-courses', label: 'Mis Cursos', icon: Edit3, roles: ['instructor'] },
  { href: '/instructor/create-course', label: 'Crear Curso', icon: BookCopy, roles: ['instructor'] },
];

export const STUDENT_SPECIFIC_NAV: NavItem[] = [
   { label: 'Estudiante', roles: ['student'], isHeader: true, href:'', icon: Users },
  { href: '/student/my-learning', label: 'Mi Aprendizaje', icon: BookCopy, roles: ['student'] },
];


export const MOCK_COURSES: Course[] = [
  { id: '1', title: 'Introducción a la Programación con Python', description: 'Aprende los fundamentos de la programación utilizando Python, uno de los lenguajes más demandados.', instructor: 'Dr. Algoritmo', category: 'Tecnología', thumbnailUrl: 'https://placehold.co/350x200.png', dataAiHint: 'python code' },
  { id: '2', title: 'Marketing Digital para Emprendedores', description: 'Descubre estrategias clave para impulsar tu negocio en el mundo digital y alcanzar a más clientes.', instructor: 'Lic. Ventas Online', category: 'Marketing', thumbnailUrl: 'https://placehold.co/350x200.png', dataAiHint: 'digital marketing' },
  { id: '3', title: 'Gestión de Proyectos Ágiles con Scrum', description: 'Domina la metodología Scrum para gestionar proyectos de forma eficiente y colaborativa.', instructor: 'Ing. Agile Master', category: 'Negocios', thumbnailUrl: 'https://placehold.co/350x200.png', dataAiHint: 'scrum board' },
  { id: '4', title: 'Comunicación Efectiva en el Trabajo', description: 'Desarrolla habilidades de comunicación para mejorar tus relaciones laborales y productividad.', instructor: 'Coach Verbal', category: 'Desarrollo Personal', thumbnailUrl: 'https://placehold.co/350x200.png', dataAiHint: 'team communication' },
];

export const MOCK_RESOURCES: EnterpriseResource[] = [
  { id: 'res1', title: 'Manual de Bienvenida para Nuevos Empleados', description: 'Guía completa con información esencial para iniciar tu camino en NexusAlpri.', category: 'Políticas Internas', type: 'manual', fileUrl: '#', icon: FileText, thumbnailUrl: 'https://placehold.co/300x180.png', dataAiHint: 'employee handbook' },
  { id: 'res2', title: 'Protocolo de Seguridad Informática', description: 'Normas y buenas prácticas para garantizar la seguridad de nuestros sistemas y datos.', category: 'Seguridad', type: 'política', fileUrl: '#', icon: FileText, thumbnailUrl: 'https://placehold.co/300x180.png', dataAiHint: 'cyber security' },
  { id: 'res3', title: 'Guía de Estilo y Comunicación de Marca', description: 'Lineamientos para mantener una comunicación visual y verbal consistente.', category: 'Marketing', type: 'guía', fileUrl: '#', icon: FileText, thumbnailUrl: 'https://placehold.co/300x180.png', dataAiHint: 'brand guidelines' },
  { id: 'res4', title: 'Plantilla de Presentaciones Corporativas', description: 'Modelo oficial para crear presentaciones alineadas con la imagen de NexusAlpri.', category: 'Documentos', type: 'documento', fileUrl: '#', icon: FileText, thumbnailUrl: 'https://placehold.co/300x180.png', dataAiHint: 'presentation template' },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'ann1', title: '¡Nueva Actualización de la Plataforma NexusAlpri!', content: 'Hemos implementado mejoras significativas en la interfaz y añadido nuevas funcionalidades para optimizar tu experiencia de aprendizaje. ¡Explóralas ahora!', author: 'Equipo NexusAlpri', date: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'ann2', title: 'Próximo Taller: "Liderazgo Efectivo en Entornos Remotos"', content: 'No te pierdas nuestro taller el próximo 15 de Julio. Aprende herramientas y estrategias para liderar equipos a distancia. Inscripciones abiertas en la sección de cursos.', author: 'Recursos Humanos', date: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'ann3', title: 'Recordatorio: Política de Vacaciones 2024', content: 'Revisa la política de vacaciones actualizada en la sección de recursos empresariales. Planifica tus descansos con anticipación.', author: 'Administración', date: new Date(Date.now() - 86400000 * 5).toISOString() },
];

export const USER_PROFILE_NAV_ITEMS = [
  { label: "Mi Perfil", href: "/profile" },
  { label: "Configuración", href: "/settings" },
];

export const ROLES_TRANSLATION: { [key in UserRole]: string } = {
  admin: "Administrador",
  instructor: "Instructor",
  student: "Estudiante",
};
