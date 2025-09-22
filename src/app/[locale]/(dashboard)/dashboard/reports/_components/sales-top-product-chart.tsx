// components/reports/ReportSalesTopProductsChart.tsx
'use client';

import type { DateRange } from 'react-day-picker';
import { format, startOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useReportTopProduct } from '@/api/reports/use-report-top-product';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';

export function ReportSalesTopProductsChart() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const { data, isLoading, error } = useReportTopProduct({
    variables: {
      startDate: dateRange?.from ?? new Date(),
      endDate: dateRange?.to ?? new Date(),
      request: { page: 1, limit: 1000 },
    },
  });

  const chartData = useMemo(() => {
    if (!data?.data?.data) {
      return [];
    }
    return data.data.data.map(item => ({
      name: item.productName,
      revenue: item.totalRevenue,
      quantity: item.totalQuantitySold,
    }));
  }, [data]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4">
        <CardTitle>Top sản phẩm bán chạy</CardTitle>

        {/* Bộ chọn ngày */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[280px] justify-start text-left font-normal"
            >
              {dateRange?.from && dateRange?.to
                ? (
                    <>
                      {format(dateRange.from, 'dd/MM/yyyy', { locale: vi })}
                      {' '}
                      -
                      {' '}
                      {format(dateRange.to, 'dd/MM/yyyy', { locale: vi })}
                    </>
                  )
                : (
                    <span>Chọn khoảng ngày</span>
                  )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>

      <CardContent className="h-[400px]">
        {isLoading && <Skeleton className="h-full w-full" />}
        {error && (
          <Alert>
            <AlertDescription>
              Lỗi khi tải báo cáo sản phẩm bán chạy
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
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#82ca9d" name="Doanh thu" />
              <Bar dataKey="quantity" fill="#8884d8" name="Số lượng bán" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
