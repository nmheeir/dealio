import type { LucideIcon } from 'lucide-react';
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
      title: 'Mua sắm',
      url: '/shop',
      icon: ShoppingBag,
      items: [
        { title: 'Giỏ hàng của tôi', url: '/cart' },
      ],
    },
    {
      title: 'Đơn hàng',
      url: '/orders',
      icon: ShoppingCart,
      items: [
        { title: 'Quản lý đơn hàng', url: '/dashboard/orders' },
        { title: 'Thanh toán đơn hàng', url: '/dashboard/orders/checkout' },
        { title: 'Yêu cầu hoàn tiền', url: '/dashboard/refunds' },
      ],
    },
  ],

  manager: [
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
        { title: 'Quản lý tồn kho', url: '/products/inventory' },
        { title: 'Nhập key digital', url: '/products/digital-keys' },
      ],
    },
    {
      title: 'Quản lý đơn hàng',
      url: '/orders',
      icon: ShoppingCart,
      items: [
        { title: 'Danh sách đơn hàng', url: '/orders' },
        { title: 'Đơn chờ xác nhận', url: '/orders?status=pending_confirmation' },
        { title: 'Đơn chờ thanh toán', url: '/orders?status=pending_payment' },
        { title: 'Đơn đã hoàn thành', url: '/orders?status=completed' },
      ],
    },
    {
      title: 'Quản lý khách hàng',
      url: '/manager/customers',
      icon: Users,
      items: [
        { title: 'Danh sách khách hàng', url: '/dashboard/customers' },
        { title: 'Khách hàng hoạt động', url: '/manager/customers?status=active' },
        { title: 'Lịch sử đơn hàng', url: '/manager/customers/orders' },
      ],
    },
    {
      title: 'Báo cáo doanh số',
      url: '/manager/sales',
      icon: BarChart3,
      items: [
        { title: 'Doanh số theo ngày', url: '/manager/sales/daily' },
        { title: 'Doanh số theo tháng', url: '/manager/sales/monthly' },
        { title: 'Doanh số theo năm', url: '/manager/sales/yearly' },
        { title: 'Top sản phẩm bán chạy', url: '/manager/sales/top-products' },
      ],
    },
    {
      title: 'Quản lý hoàn tiền',
      url: '/manager/refunds',
      icon: RefreshCw,
      items: [
        { title: 'Yêu cầu hoàn tiền', url: '/manager/refunds' },
        { title: 'Chờ xử lý', url: '/manager/refunds?status=pending' },
        { title: 'Đã phê duyệt', url: '/manager/refunds?status=approved' },
        { title: 'Đã từ chối', url: '/manager/refunds?status=rejected' },
      ],
    },
  ],

  adminExtra: [
    {
      title: 'Quản lý tài khoản',
      url: '/admin/users',
      icon: Users,
      items: [
        { title: 'Danh sách tài khoản', url: '/admin/users' },
        { title: 'Nâng cấp quyền', url: '/admin/users/roles' },
        { title: 'Khóa / mở tài khoản', url: '/admin/users/status' },
      ],
    },
    {
      title: 'Báo cáo & thống kê',
      url: '/admin/reports',
      icon: BarChart3,
      items: [
        { title: 'Doanh số tổng thể', url: '/admin/reports/overview' },
        { title: 'Doanh số theo sản phẩm', url: '/admin/reports/products' },
        { title: 'Doanh số theo khách hàng', url: '/admin/reports/customers' },
        { title: 'Doanh số theo thời gian', url: '/admin/reports/time' },
        { title: 'Xem lợi nhuận', url: '/admin/reports/profit' },
        { title: 'Xuất báo cáo', url: '/admin/reports/export' },
      ],
    },
  ],
};

export function getSidebarItems(role: 'customer' | 'manager' | 'admin'): NavItem[] {
  const customer = baseMenus.customer ?? [];
  const manager = baseMenus.manager ?? [];
  const adminExtra = baseMenus.adminExtra ?? [];

  switch (role) {
    case 'customer':
      return customer;
    case 'manager':
      return [...customer, ...manager];
    case 'admin':
      return [...customer, ...manager, ...adminExtra];
    default:
      return [];
  }
}
