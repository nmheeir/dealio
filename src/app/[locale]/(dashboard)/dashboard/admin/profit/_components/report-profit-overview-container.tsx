'use client';

import { useReportProfit } from '@/api/reports/admin/use-report-profit';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportProfitOverview } from './report-profit-overview';

export function ReportProfitOverviewContainer() {
  const { data, isLoading, error } = useReportProfit({
    variables: {}, // có thể thêm filter sau (productType, orderType, ...)
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>Lỗi khi tải báo cáo lợi nhuận</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert>
        <AlertDescription>Không có dữ liệu lợi nhuận</AlertDescription>
      </Alert>
    );
  }
  const profitData = data.data;

  return <ReportProfitOverview data={profitData} />;
}
