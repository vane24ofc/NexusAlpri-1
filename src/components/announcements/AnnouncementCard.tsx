'use client';

import type { Announcement } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, UserCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AnnouncementCardProps {
  announcement: Announcement;
  variant?: 'default' | 'compact';
}

export function AnnouncementCard({ announcement, variant = 'default' }: AnnouncementCardProps) {
  const formattedDate = format(parseISO(announcement.date), "PPP", { locale: es });

  if (variant === 'compact') {
    return (
        <div className="p-3 border rounded-lg hover:bg-muted/30 transition-colors">
            <h3 className="text-sm font-semibold text-primary mb-0.5 line-clamp-1">{announcement.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{announcement.content}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground/80">
                <span>Por: {announcement.author}</span>
                <span>{formattedDate}</span>
            </div>
        </div>
    )
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary">{announcement.title}</CardTitle>
        <CardDescription className="flex items-center text-xs text-muted-foreground space-x-4">
          <span className="flex items-center">
            <UserCircle className="h-4 w-4 mr-1" /> {announcement.author}
          </span>
          <span className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" /> {formattedDate}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
      </CardContent>
      {announcement.targetRoles && (
        <CardFooter>
            <p className="text-xs text-muted-foreground">Dirigido a: {announcement.targetRoles.join(', ')}</p>
        </CardFooter>
      )}
    </Card>
  );
}
