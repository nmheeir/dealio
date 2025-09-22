import type { Order } from '@/api/schemas/order/order.schema';
import { useGhnGetTrackingUrl } from '@/api/ghn/use-ghn-tracking-url';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function OrderTrackingUrl({ item }: { item: Order }) {
  // Chỉ gọi API khi có order_code và status là SHIPPED
  const { data, isLoading, error } = useGhnGetTrackingUrl(
    {
      variables: { orderCode: item.order_code ?? '' },
      enabled: item.status === 'SHIPPED' && !!item.order_code,
    },
  );

  // Nếu không phải SHIPPED thì return null (không render gì)
  if (item.status !== 'SHIPPED') {
    return null;
  }

  return (
    <DropdownMenuItem asChild>
      {isLoading
        ? (
            <span>Đang tải...</span>
          )
        : error
          ? (
              <span className="text-red-500">Không lấy được link</span>
            )
          : data?.data
            ? (
                <a
                  href={data.data}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  Xem trạng thái vận chuyển
                </a>
              )
            : (
                <span>Không có link</span>
              )}
    </DropdownMenuItem>
  );
}
