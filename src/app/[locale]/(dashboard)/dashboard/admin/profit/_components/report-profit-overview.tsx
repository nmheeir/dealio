// components/reports/ReportProfitOverview.tsx
'use client';

import type { ReportProfit } from '@/api/schemas/reports/report-profit.schema';
import {
  IconCurrencyDollar,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  data: ReportProfit;
};

export function ReportProfitOverview({ data }: Props) {
  const chartData = [
    { name: 'Doanh thu', value: data.totalRevenue },
    { name: 'Chi phí', value: data.totalCost },
    { name: 'Lợi nhuận', value: data.totalProfit },
  ];

  const COLORS = ['#8884d8', '#FF8042', '#82ca9d'];

  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-2 lg:px-6">
      {/* Cards thống kê */}
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t  *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between ">
              Doanh thu
              {data.orderType && (
                <Badge variant="outline" className="ml-2">
                  <IconCurrencyDollar className="mr-1 size-4" />
                  {data.orderType}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {data.totalRevenue.toLocaleString('vi-VN')}
            {' '}
            ₫
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chi phí</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {data.totalCost.toLocaleString('vi-VN')}
            {' '}
            ₫
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Lợi nhuận
              {data.productType && (
                <Badge variant="secondary" className="ml-2">
                  {data.productType}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-green-600 tabular-nums">
            {data.totalProfit.toLocaleString('vi-VN')}
            {' '}
            ₫
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tỷ suất lợi nhuận</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-2xl font-semibold">
            {data.profitMargin.toFixed(2)}
            {' '}
            %
            {data.profitMargin >= 0
              ? (
                  <IconTrendingUp className="size-5 text-green-600" />
                )
              : (
                  <IconTrendingDown className="size-5 text-red-600" />
                )}
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ Pie */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bổ doanh thu / chi phí / lợi nhuận</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `${value.toLocaleString('vi-VN')} ₫`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
