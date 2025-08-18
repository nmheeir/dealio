import type { Icon } from 'lucide-react';

export type NavItem = {
  title: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icon;
  label?: string;
  description?: string;
};

export type NavItemWithChildren = {
  items?: NavItemWithChildren[];
} & NavItem;

export type FooterItem = {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
};

export type MainNavItem = NavItemWithChildren;

export type SidebarNavItem = NavItemWithChildren;

export type StoredFile = {
  id: string;
  name: string;
  url: string;
};

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};
