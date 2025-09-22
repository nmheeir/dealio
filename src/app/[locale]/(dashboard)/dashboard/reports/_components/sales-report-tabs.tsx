// components/reports/SalesReportTabs.tsx
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { ReportSalesByDayChart } from './sales-by-day-chart';
import { ReportSalesByMonthChart } from './sales-by-month-chart';
import { ReportSalesByYearChart } from './sales-by-year-chart';
import { ReportSalesTopProductsChart } from './sales-top-product-chart';

export function SalesReportTabs() {
  return (
    <Tabs defaultValue="month" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="day">Theo ngày</TabsTrigger>
        <TabsTrigger value="month">Theo tháng</TabsTrigger>
        <TabsTrigger value="year">Theo năm</TabsTrigger>
        <TabsTrigger value="top">Sản phẩm bán chạy</TabsTrigger>
      </TabsList>

      <TabsContent value="day">
        <ReportSalesByDayChart />
      </TabsContent>
      <TabsContent value="month">
        <ReportSalesByMonthChart />
      </TabsContent>
      <TabsContent value="year">
        <ReportSalesByYearChart />
      </TabsContent>
      <TabsContent value="top">
        <ReportSalesTopProductsChart />
      </TabsContent>
    </Tabs>
  );
}
