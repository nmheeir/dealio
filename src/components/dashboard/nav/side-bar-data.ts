import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '@/api/schemas/user/role';
import { BarChart3, Package, RefreshCw, ShoppingBag, ShoppingCart, Tag, User, Users } from 'lucide-react';

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
};

const baseMenus: Record<string, NavItem[]> = {
  customer: [
    {
      title: 'Thông tin tài khoản',
      url: '/dashboard/profile',
      icon: User,
      items: [
        { title: 'Xem thông tin cá nhân', url: '/dashboard/profile' },
      ],
    },
    {
      title: 'Đơn hàng',
      url: '/shop',
      icon: ShoppingBag,
      items: [
        { title: 'Đơn hàng của tôi', url: '/dashboard/orders' },
        { title: 'Yêu cầu hoàn tiền', url: '/dashboard/orders/refund' },
      ],
    },
  ],

  managerCommon: [
    {
      title: 'Danh mục & thương hiệu',
      url: '/manager/categories-brands',
      icon: Tag,
      items: [
        { title: 'Danh mục', url: '/dashboard/categories' },
        { title: 'Thương hiệu', url: '/dashboard/brands' },
      ],
    },
    {
      title: 'Quản lý sản phẩm',
      url: '/dashboard/products',
      icon: Package,
      items: [
        { title: 'Danh sách sản phẩm', url: '/dashboard/products' },
        { title: 'Thêm sản phẩm mới', url: '/dashboard/products/create' },
      ],
    },
    {
      title: 'Quản lý đơn hàng',
      url: '/orders',
      icon: ShoppingCart,
      items: [
        { title: 'Danh sách đơn hàng', url: '/dashboard/manager/orders' },
      ],
    },
    {
      title: 'Báo cáo doanh số',
      url: '/manager/sales',
      icon: BarChart3,
      items: [
        { title: 'Báo cáo', url: '/dashboard/reports' },
      ],
    },
    {
      title: 'Quản lý hoàn tiền',
      url: '/manager/refunds',
      icon: RefreshCw,
      items: [
        { title: 'Yêu cầu hoàn tiền', url: '/dashboard/manager/refunds' },
      ],
    },
  ],

  // Menu chỉ dành cho MANAGER
  managerCustomer: [
    {
      title: 'Quản lý khách hàng',
      url: '/manager/customers',
      icon: Users,
      items: [
        { title: 'Danh sách khách hàng', url: '/dashboard/customers' },
      ],
    },
  ],

  // Menu dành riêng cho ADMIN
  adminExtra: [
    {
      title: 'Quản lý tài khoản',
      url: '/admin/users',
      icon: Users,
      items: [
        { title: 'Danh sách tài khoản', url: '/dashboard/admin/users' },
      ],
    },
    {
      title: 'Báo cáo & thống kê',
      url: '/admin/reports',
      icon: BarChart3,
      items: [
        { title: 'Báo cáo', url: '/dashboard/admin/reports' },
        { title: 'Xem lợi nhuận', url: '/dashboard/admin/profit' },
      ],
    },
  ],
};

export function getSidebarItems(role: UserRole): NavItem[] {
  const customer = baseMenus.customer ?? [];
  const managerCommon = baseMenus.managerCommon ?? [];
  const managerCustomer = baseMenus.managerCustomer ?? [];
  const adminExtra = baseMenus.adminExtra ?? [];

  switch (role) {
    case 'CUSTOMER':
      return customer;
    case 'MANAGER':
      return [...customer, ...managerCommon, ...managerCustomer];
    case 'ADMIN':
      return [...customer, ...managerCommon, ...adminExtra]; // KHÔNG có managerCustomer
    default:
      return [];
  }
}
