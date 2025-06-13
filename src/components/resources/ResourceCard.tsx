'use client';

import type { EnterpriseResource } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, FileText, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResourceCardProps {
  resource: EnterpriseResource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const IconComponent = resource.icon || FileText;

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
       <CardHeader className="p-0">
        <Link href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="block aspect-[16/9] relative overflow-hidden bg-muted">
          {resource.thumbnailUrl ? (
            <Image
              src={resource.thumbnailUrl}
              alt={resource.title}
              layout="fill"
              objectFit="cover"
              className="hover:scale-105 transition-transform duration-300"
              data-ai-hint={resource.dataAiHint || "resource image"}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <IconComponent className="h-16 w-16 text-primary/50" />
            </div>
          )}
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-1">
            <Badge variant="outline" className="capitalize border-primary/50 text-primary">{resource.type}</Badge>
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent">{resource.category}</Badge>
        </div>
        <CardTitle className="text-md font-headline mb-1 leading-tight mt-2">
            <Link href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{resource.title}</Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">{resource.description}</CardDescription>
        
      </CardContent>
      <CardFooter className="p-4 border-t flex gap-2">
        <Button size="sm" asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={resource.fileUrl} target="_blank" rel="noopener noreferrer" download>
            <Download className="mr-2 h-4 w-4" /> Descargar
          </Link>
        </Button>
         <Button variant="outline" size="sm" asChild className="flex-1">
          <Link href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
            <Eye className="mr-2 h-4 w-4" /> Ver
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
