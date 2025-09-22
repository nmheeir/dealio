'use client';

import type { DateRange } from 'react-day-picker';
import { startOfMonth } from 'date-fns';
import { useMemo, useState } from 'react';

import { useReportTopProduct } from '@/api/reports/use-report-top-product';
import { ReportSalesTopProductsChartView } from '@/components/chart/report-sales-product-chart-view';

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
    <ReportSalesTopProductsChartView
      dateRange={dateRange}
      onDateChangeAction={setDateRange}
      chartData={chartData}
      isLoading={isLoading}
      error={error}
    />
  );
}
