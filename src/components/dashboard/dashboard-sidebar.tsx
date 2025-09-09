'use client';

import {
  Building2,
} from 'lucide-react';

import Link from 'next/link';
import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from '@/components/ui/sidebar';
import { NavMain } from './nav/nav-main';

import { NavSecondary } from './nav/nav-secondary';
import { getSidebarItems } from './nav/side-bar-data';

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/manager/dashboard">
                <Building2 className="!size-5" />
                <span className="text-base font-semibold">Manager Portal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* <NavUser user={data.user} /> */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getSidebarItems('customer')} />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
