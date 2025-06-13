import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ROLES_TRANSLATION } from "@/lib/constants";
import type { User } from "@/types";
import { Users, PlusCircle, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock users data
const mockUsers: User[] = [
  { id: '1', name: 'Admin Nexus', email: 'admin@nexusalpri.com', role: 'admin', avatar: 'https://placehold.co/40x40.png?text=AN' },
  { id: '2', name: 'Instructor Profe', email: 'instructor@nexusalpri.com', role: 'instructor', avatar: 'https://placehold.co/40x40.png?text=IP' },
  { id: '3', name: 'Estudiante Aplicado', email: 'student@nexusalpri.com', role: 'student', avatar: 'https://placehold.co/40x40.png?text=EA' },
  { id: '4', name: 'Laura Gómez', email: 'laura.gomez@example.com', role: 'student', avatar: 'https://placehold.co/40x40.png?text=LG' },
  { id: '5', name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', role: 'instructor' },
];

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + (names[names.length - 1]?.[0] || '')).toUpperCase();
};


export default function AdminUsersPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-3xl font-bold text-primary font-headline">Gestionar Usuarios</h1>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar usuarios..." className="pl-8 w-full md:w-64 bg-card" />
                </div>
                <Button asChild>
                    <Link href="/admin/users/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Usuario
                    </Link>
                </Button>
            </div>
        </div>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Listado de Usuarios</CardTitle>
                <CardDescription>Visualiza, edita o elimina usuarios de la plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead className="hidden sm:table-cell">Fecha de Registro</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockUsers.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{user.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'default' : (user.role === 'instructor' ? 'secondary' : 'outline')}
                                           className={user.role === 'admin' ? 'bg-primary text-primary-foreground' : (user.role === 'instructor' ? 'bg-accent text-accent-foreground' : '')}
                                    >
                                        {ROLES_TRANSLATION[user.role]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">15 Mayo, 2024</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Más acciones</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuItem asChild><Link href={`/admin/users/${user.id}/edit`} className="cursor-pointer"><Edit className="mr-2 h-4 w-4" /> Editar</Link></DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive cursor-pointer"><Trash2 className="mr-2 h-4 w-4" /> Eliminar</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Ver Actividad</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
