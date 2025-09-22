'use client';

import type { DateRange } from 'react-day-picker';
import type { ReportByTimeRange } from '@/api/schemas/reports/report-by-time-range.schema';
import { CalendarIcon } from 'lucide-react';

import { useMemo, useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useReportByTimeRange } from '@/api/reports/admin/use-report-by-time-range';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#82ca9d', '#8884d8', '#ffc658'];

export function ReportSalesByTimeRange() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // đầu tháng
    to: new Date(), // hôm nay
  });

  const { data, isLoading, error } = useReportByTimeRange({
    variables: {
      startDate: dateRange.from ?? new Date(),
      endDate: dateRange.to ?? new Date(),
    },
  });

  const report: ReportByTimeRange | undefined = data?.data;

  const pieData = useMemo(() => {
    if (!report) {
      return [];
    }
    return [
      { name: 'Doanh thu', value: report.totalRevenue },
      { name: 'Đơn hàng', value: report.totalOrders },
      { name: 'Sản phẩm đã bán', value: report.totalProductsSold },
    ];
  }, [report]);

  return (
    <div className="flex flex-col gap-6">
      {/* Khung chọn ngày */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Báo cáo doanh số theo khoảng thời gian</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from?.toLocaleDateString('vi-VN')}
              {' '}
              -
              {' '}
              {dateRange.to?.toLocaleDateString('vi-VN')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              required
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading
              ? (
                  <Skeleton className="h-8 w-32" />
                )
              : (
                  <p className="text-2xl font-semibold tabular-nums">
                    {report?.totalRevenue.toLocaleString('vi-VN')}
                    {' '}
                    ₫
                  </p>
                )}
            <Badge variant="outline">{report?.period}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading
              ? (
                  <Skeleton className="h-8 w-16" />
                )
              : (
                  <p className="text-2xl font-semibold tabular-nums">
                    {report?.totalOrders}
                  </p>
                )}
            <p className="text-sm text-muted-foreground">
              Tổng số đơn hàng hoàn tất
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm đã bán</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading
              ? (
                  <Skeleton className="h-8 w-16" />
                )
              : (
                  <p className="text-2xl font-semibold tabular-nums">
                    {report?.totalProductsSold}
                  </p>
                )}
            <p className="text-sm text-muted-foreground">
              Tổng số lượng sản phẩm đã bán
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Phân bổ theo chỉ số</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {isLoading && <Skeleton className="h-full w-full" />}
          {error && (
            <Alert
              variant="destructive"
              className="flex h-full w-full items-center justify-center"
            >
              <AlertDescription className="text-center">
                {error.response?.data?.message
                  || 'Lỗi khi tải báo cáo theo khoảng thời gian'}
              </AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && report && (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={150}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={value => value.toLocaleString('vi-VN')} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
