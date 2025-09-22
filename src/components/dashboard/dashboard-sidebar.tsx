'use client';

import {
  Building2,
} from 'lucide-react';

import Link from 'next/link';
import * as React from 'react';

import { useCheckRole } from '@/api/auth/use-check-role';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from '@/components/ui/sidebar';
import { Skeleton } from '../ui/skeleton';
import { NavMain } from './nav/nav-main';
import { NavSecondary } from './nav/nav-secondary';
import { NavUser } from './nav/nav-user';
import { getSidebarItems } from './nav/side-bar-data';

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading, error } = useCheckRole();

  if (isLoading) {
    return <SidebarSkeleton />;
  }
  if (error) {
    console.log(error.message);
    return null;
  }
  console.log('Dashboard sidebar data: ', data);

  const role = data?.role;
  console.log('Dashboard Sidebar', role);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard/profile">
                <Building2 className="!size-5" />
                <span className="text-base font-semibold">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <NavUser />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getSidebarItems(role)} />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarSkeleton(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                {' '}
                {/* icon */}
                <Skeleton className="h-4 w-32 rounded-md" />
                {' '}
                {/* text */}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Skeleton cho user info */}
          <SidebarMenuItem>
            <div className="flex items-center space-x-2 p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              {' '}
              {/* avatar */}
              <Skeleton className="h-4 w-24 rounded-md" />
              {' '}
              {/* name */}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Skeleton cho main nav */}
        <div className="flex flex-col space-y-2 p-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
        {/* Skeleton cho secondary nav */}
        <div className="mt-auto p-2">
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
