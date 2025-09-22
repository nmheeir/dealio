// components/reports/ReportSalesByYearChart.tsx
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
import { useReportByYear } from '@/api/reports/use-report-by-year';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Skeleton } from '@/components/ui/skeleton';

export function ReportSalesByYearChart() {
  const { data, isLoading, error } = useReportByYear();

  const chartData = useMemo(() => {
    if (!data?.data) {
      return [];
    }
    return data.data.map(item => ({
      year: item.year,
      totalOrders: item.totalOrders,
      totalRevenue: item.totalRevenue,
      totalProductsSold: item.totalProductsSold,
    }));
  }, [data]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Báo cáo doanh số theo năm</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoading && <Skeleton className="h-full w-full" />}
        {error && (
          <Alert>
            <AlertDescription>
              Lỗi khi tải báo cáo doanh số theo năm
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && chartData.length === 0 && (
          <Alert>
            <AlertDescription>Không có dữ liệu</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && chartData.length > 0 && (
          <ResponsiveContainer>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="totalRevenue"
                barSize={40}
                fill="#82ca9d"
                name="Tổng doanh thu"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalOrders"
                stroke="#8884d8"
                name="Tổng đơn hàng"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalProductsSold"
                stroke="#ffc658"
                name="Sản phẩm đã bán"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
