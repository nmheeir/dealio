'use client';

import { IconCurrencyDollar, IconPackage, IconShoppingCart } from '@tabler/icons-react';

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useReportOverallSales } from '@/api/reports/admin/use-report-overall-sell';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type ReportOverviewProps = {
  totalOrders: number;
  totalRevenue: number;
  totalProductsSold: number;
  period: string;
  orderType?: string;
};

export function ReportOverallSalesSection() {
  // Gọi API với orderType mặc định (ví dụ: PHYSICAL)
  const { data: overallSalesData, isLoading, error } = useReportOverallSales({
    variables: {
      // orderType: 'PHYSICAL',
    },
  });

  if (isLoading) {
    return <Skeleton className="h-[180px] w-full" />;
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>Lỗi khi tải báo cáo doanh số tổng thể</AlertDescription>
      </Alert>
    );
  }

  if (!overallSalesData) {
    return (
      <Alert>
        <AlertDescription>Chưa có doanh số để thống kê</AlertDescription>
      </Alert>
    );
  }

  const data = overallSalesData.data;

  return (
    <ReportOverviewCards
      totalOrders={data.totalOrders}
      totalRevenue={data.totalRevenue}
      totalProductsSold={data.totalProductsSold}
      period={data.period}
      orderType={data.orderType}
    />
  );
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

function ReportOverviewCards({ totalOrders, totalRevenue, totalProductsSold, period, orderType }: ReportOverviewProps) {
  const pieData = [
    { name: 'Doanh thu', value: totalRevenue },
    { name: 'Đơn hàng', value: totalOrders },
    { name: 'Sản phẩm đã bán', value: totalProductsSold },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Tổng doanh thu */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Doanh thu</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalRevenue?.toLocaleString('vi-VN') ?? 0}
            {' '}
            ₫
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCurrencyDollar className="mr-1 size-4" />
              {period ?? '—'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start text-sm text-muted-foreground">
          Loại đơn hàng:
          {' '}
          {orderType ?? 'Tất cả'}
        </CardFooter>
      </Card>

      {/* Tổng số đơn hàng */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Đơn hàng</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOrders ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconShoppingCart className="mr-1 size-4" />
              {period ?? '—'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start text-sm text-muted-foreground">
          Tổng số đơn hàng hoàn tất
        </CardFooter>
      </Card>

      {/* Tổng sản phẩm bán ra */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Sản phẩm đã bán</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalProductsSold ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconPackage className="mr-1 size-4" />
              {period ?? '—'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start text-sm text-muted-foreground">
          Tổng số lượng sản phẩm đã bán
        </CardFooter>
      </Card>

      {/* Biểu đồ tròn */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tỷ trọng</CardDescription>
          <CardTitle className="text-2xl font-semibold">Biểu đồ tổng quan</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
