import type { StockUpdate } from '@/api/schemas/stock/stock-update.schema';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUpdateStock } from '@/api/product-variant/use-update-stock';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { UpdateStockForm } from '../form/update-stock-form';

type VariantActionStockProps = {
  variantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStock: number;
};

export function VariantActionStock({
  variantId,
  open,
  onOpenChange,
  currentStock,
}: VariantActionStockProps) {
  const isMobile = useIsMobile();
  const { mutateAsync: updateStock } = useUpdateStock();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: StockUpdate) => {
    try {
      // Nếu thành công → đóng dialog/drawer
      await updateStock({
        id: variantId,
        quantity: data.adjustmentQuantity,
      });
      toast.success('Cập nhật tồn kho thành công');
      queryClient.invalidateQueries({ queryKey: ['product-variants/productId-with-cost-price'] });
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi cập nhật tồn kho');
    }
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Cập nhật tồn kho</DrawerTitle>
          </DrawerHeader>
          <UpdateStockForm
            currentStock={currentStock}
            onSubmitAction={(d) => {
              console.log('Handle submit*:');
              handleSubmit(d);
            }}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật tồn kho</DialogTitle>
        </DialogHeader>
        <UpdateStockForm
          currentStock={currentStock}
          onSubmitAction={(d) => {
            console.log('Handle submit*:');
            handleSubmit(d);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
