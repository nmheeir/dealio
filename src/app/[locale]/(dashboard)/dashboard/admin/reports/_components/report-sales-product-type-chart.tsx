'use client';

import { useMemo, useState } from 'react';
import { useReportByProductType } from '@/api/reports/admin/use-report-by-product-type';
import { ReportSalesByProductTypeChartView } from '@/components/chart/report-sales-product-type-chart-view';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ReportSalesByProductTypeChart() {
  const [productType, setProductType] = useState<'CARD_DIGITAL_KEY' | 'DEVICE' | 'CARD_PHYSICAL'>('CARD_PHYSICAL');

  const { data, isLoading, error } = useReportByProductType({
    variables: { productType },
  });

  const chartData = useMemo(() => {
    if (!data?.data.data) {
      return [];
    }
    return data.data.data.map(item => ({
      name: item.variantName,
      revenue: item.totalRevenue,
      quantity: item.totalQuantitySold,
    }));
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      {/* Bộ chọn productType */}
      <div className="w-[220px]">
        <Select value={productType} onValueChange={val => setProductType(val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại sản phẩm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CARD_PHYSICAL">Hàng vật lý</SelectItem>
            <SelectItem value="DEVICE">Thiết bị</SelectItem>
            <SelectItem value="CARD_DIGITAL_KEY">Thẻ / Key số</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <ReportSalesByProductTypeChartView
        data={chartData}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
