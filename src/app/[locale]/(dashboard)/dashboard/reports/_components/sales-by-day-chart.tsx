// components/reports/ReportSalesByDayChart.tsx
'use client';

import type { DateRange } from 'react-day-picker';
import { format, startOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

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
import { useReportByDate } from '@/api/reports/use-report-by-date';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';

export function ReportSalesByDayChart() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const { data, isLoading, error } = useReportByDate({
    variables: {
      startDate: dateRange?.from ?? new Date(),
      endDate: dateRange?.to ?? new Date(),
      request: {
        page: 1,
        limit: 1000,
      },
    },
  });

  const chartData = useMemo(() => {
    if (!data?.data?.data) {
      return [];
    }
    return data.data.data.map(item => ({
      date: format(item.date, 'yyyy-MM-dd'),
      totalOrders: item.totalOrders,
      totalRevenue: item.totalRevenue,
      totalProductsSold: item.totalProductsSold,
    }));
  }, [data]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Báo cáo doanh thu theo ngày</CardTitle>
        {/* Bộ chọn khoảng thời gian */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                'w-[260px] justify-start text-left font-normal',
                !dateRange && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from
                ? (
                    dateRange.to
                      ? (
                          <>
                            {format(dateRange.from, 'dd/MM/yyyy', { locale: vi })}
                            {' '}
                            {' '}
                            -
                            {' '}
                            {format(dateRange.to, 'dd/MM/yyyy', { locale: vi })}
                          </>
                        )
                      : (
                          format(dateRange.from, 'dd/MM/yyyy', { locale: vi })
                        )
                  )
                : (
                    <span>Chọn khoảng thời gian</span>
                  )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
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
              Lỗi khi tải báo cáo doanh thu theo ngày
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && chartData.length === 0 && (
          <Alert>
            <AlertDescription>
              Không có dữ liệu trong khoảng thời gian này
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && chartData.length > 0 && (
          <ResponsiveContainer>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
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
                name="Số sản phẩm đã bán"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
