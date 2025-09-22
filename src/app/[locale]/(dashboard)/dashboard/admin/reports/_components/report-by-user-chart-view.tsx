'use client';

import { useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useReportByUser } from '@/api/reports/admin/use-report-by-user';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type ChartItem = {
  name: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
};

type Props = {
  data: ChartItem[];
  isLoading: boolean;
  error?: Error | null;
};

export function ReportSalesByCustomerChart() {
  const { data, isLoading, error } = useReportByUser({
    variables: {}, // không filter theo customerId
  });

  const chartData = useMemo(() => {
    if (!data?.data.data) {
      return [];
    }
    return data.data.data.map(item => ({
      name: item.customerName,
      revenue: item.totalRevenue,
      orders: item.totalOrders,
      avgOrderValue: item.avgOrderValue,
    }));
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <ReportSalesByCustomerChartView
        data={chartData}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

function ReportSalesByCustomerChartView({ data, isLoading, error }: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Báo cáo doanh số theo khách hàng</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoading && <Skeleton className="h-full w-full" />}
        {error && (
          <Alert>
            <AlertDescription>
              Lỗi khi tải báo cáo theo khách hàng
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && data.length === 0 && (
          <Alert>
            <AlertDescription>Không có dữ liệu</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && data.length > 0 && (
          <ResponsiveContainer>
            <ComposedChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={200} />
              <Tooltip />
              <Legend />
              {/* Bar cho Revenue */}
              <Bar dataKey="revenue" fill="#82ca9d" name="Doanh thu" barSize={20} />
              {/* Bar cho Orders */}
              <Bar dataKey="orders" fill="#8884d8" name="Số đơn hàng" barSize={20} />
              {/* Line cho Giá trị trung bình */}
              <Line
                type="monotone"
                dataKey="avgOrderValue"
                stroke="#ffc658"
                name="Giá trị TB/đơn"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
