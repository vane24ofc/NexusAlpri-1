import { AuthGuard } from "@/components/auth/AuthGuard";
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard";
import { MOCK_ANNOUNCEMENTS } from "@/lib/constants";
import { Megaphone } from "lucide-react";

export default function AnnouncementsPage() {
  return (
    <AuthGuard allowedRoles={['admin', 'instructor', 'student']}>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center mb-8">
          <Megaphone className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-primary font-headline">Anuncios</h1>
        </div>
        
        {MOCK_ANNOUNCEMENTS.length > 0 ? (
          <div className="space-y-6">
            {MOCK_ANNOUNCEMENTS.map(announcement => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Megaphone className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No hay anuncios recientes.</p>
            <p className="text-sm text-muted-foreground">Mantente atento a las novedades de la plataforma.</p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
