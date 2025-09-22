// app/reports/page.tsx (hoặc components/reports/ReportsTabs.tsx)
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportSalesByCustomerChart } from './report-by-user-chart-view';
import { ReportSalesByProductTypeChart } from './report-sales-product-type-chart';
import { ReportSalesByTimeRange } from './report-sales-time-range';

export default function ReportsTabs() {
  return (
    <div className="p-6">
      <Tabs defaultValue="customer" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="customer">Doanh số theo khách hàng</TabsTrigger>
          <TabsTrigger value="product">Doanh số theo sản phẩm</TabsTrigger>
          <TabsTrigger value="time-range">Doanh số theo thời gian</TabsTrigger>
        </TabsList>

        <TabsContent value="customer" className="mt-6">
          <ReportSalesByCustomerChart />
        </TabsContent>

        <TabsContent value="product" className="mt-6">
          <ReportSalesByProductTypeChart />
        </TabsContent>

        <TabsContent value="time-range" className="mt-6">
          <ReportSalesByTimeRange />
        </TabsContent>
      </Tabs>
    </div>
  );
}
