'use client';

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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type ChartItem = {
  name: string;
  revenue: number;
  quantity: number;
};

type Props = {
  data: ChartItem[];
  isLoading: boolean;
  error?: Error | null;
};

export function ReportSalesByProductTypeChartView({ data, isLoading, error }: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Báo cáo theo loại sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        {isLoading && <Skeleton className="h-full w-full" />}
        {error && (
          <Alert>
            <AlertDescription>Lỗi khi tải báo cáo theo loại sản phẩm</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && data.length === 0 && (
          <Alert>
            <AlertDescription>Không có dữ liệu</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && data.length > 0 && (
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={180} />
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
