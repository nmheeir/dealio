'use client';

import type { LucideIcon } from 'lucide-react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCategories } from '@/api/category/use-categories';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
};

type NavMainProps = {
  items: NavItem[];
};

export function NavMain({
  items,
}: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Product</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          key="Category"
          asChild
          defaultOpen={true}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Category">
                {/* {item.icon && <item.icon />} */}
                <span>Category</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CategoryCollapsible />
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
      <SidebarGroupLabel>Edit</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          key="Edit"
          asChild
          defaultOpen={true}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Edit">
                {/* {item.icon && <item.icon />} */}
                <span>Edit</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href="/dashboard/product/edit">
                      <span>Edit Product</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function CategoryCollapsible() {
  const { data, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <CollapsibleContent>
        <SidebarMenuSub>
          {Array.from({ length: 5 }).map((_, i) => (
            <SidebarMenuSubItem key={i}>
              <SidebarMenuSubButton asChild>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    );
  }

  if (error) {
    return (
      <CollapsibleContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            Không tải được danh mục. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
      </CollapsibleContent>
    );
  }

  if (!data) {
    return null;
  }

  const categories = data.data.data;

  return (
    <CollapsibleContent>
      <SidebarMenuSub>
        {categories.map(category => (
          <SidebarMenuSubItem key={category.id}>
            <SidebarMenuSubButton asChild>
              <Link href={`/dashboard/category/${category.slug}`}>
                <span>{category.name}</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </CollapsibleContent>
  );
}
