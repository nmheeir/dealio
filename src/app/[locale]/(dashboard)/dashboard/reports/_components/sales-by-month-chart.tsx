// components/reports/ReportSalesByMonthChart.tsx
'use client';

import { useMemo, useState } from 'react';
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
import { useReportByMonth } from '@/api/reports/use-report-by-month';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ReportSalesByMonthChart() {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const { data, isLoading, error } = useReportByMonth({
    variables: { year: selectedYear, request: {} },
  });

  const chartData = useMemo(() => {
    if (!data?.data.data) {
      return [];
    }
    return data.data.data.map(item => ({
      month: item.month,
      totalOrders: item.totalOrders,
      totalRevenue: item.totalRevenue,
      totalProductsSold: item.totalProductsSold,
    }));
  }, [data?.data.data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Báo cáo doanh số theo tháng</CardTitle>
        <CardDescription>
          Tổng quan về đơn hàng, doanh thu và sản phẩm đã bán trong năm
          {' '}
          {selectedYear}
        </CardDescription>
        {/* Chọn năm */}
        <Select value={selectedYear.toString()} onValueChange={year => setSelectedYear(Number(year))}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chọn năm" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Đang tải dữ liệu...</p>}
        {error && <p>Lỗi khi tải báo cáo</p>}

        {!isLoading && !error && (
          <div className="mb-6 h-[400px] w-full">
            <ResponsiveContainer>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
