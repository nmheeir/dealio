'use client';
import type { Brand } from '@/api/schemas/brand/brand.schema';
import { CalendarDays, Eye, FileText, Globe, Hash } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/libs/utils';

export function BrandViewerRow({ item }: { item: Brand }) {
  const isMobile = useIsMobile();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <span className="cursor-pointer text-sm font-medium text-primary transition-colors hover:underline">
          {item.name}
        </span>
      </DrawerTrigger>
      <DrawerContent className={cn(
        'sm:max-w-lg',
        isMobile && 'flex h-[80vh] flex-col',
      )}
      >
        <DrawerHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DrawerTitle className="text-xl font-bold">{item.name}</DrawerTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Hash className="mr-1 h-3 w-3" />
                  {item.slug}
                </Badge>
              </div>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {/* Description Section */}
            {item.description && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* SEO Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="h-4 w-4" />
                  SEO Information
                </CardTitle>
                <CardDescription>
                  Search engine optimization details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">SEO Title</span>
                  </div>
                  <p className="pl-6 text-sm text-muted-foreground">
                    {item.seo_title || 'No SEO title set'}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">SEO Description</span>
                  </div>
                  <p className="pl-6 text-sm text-muted-foreground">
                    {item.seo_description || 'No SEO description set'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarDays className="h-4 w-4" />
                  Metadata
                </CardTitle>
                <CardDescription>
                  Creation and modification details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Created At
                    </span>
                    <p className="font-mono text-sm">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Last Updated
                    </span>
                    <p className="font-mono text-sm">
                      {formatDate(item.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
