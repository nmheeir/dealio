import type { ProductVariant } from '@/api/schemas/product/product-variant.schema';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { useUpdateImage } from '@/api/product-variant/use-update-image';
import { Icons } from '@/components/icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { VariantImageForm } from '../form/variant-image-form';

type VariantActionImageProps = {
  variant: ProductVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function VariantActionImage({
  variant,
  open,
  onOpenChange,
}: VariantActionImageProps) {
  const isMobile = useIsMobile();
  const { mutateAsync: updateImage } = useUpdateImage();
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (files: File[]) => {
    try {
      setLoading(true);
      await updateImage({
        id: variant.id,
        files,
        listKeepUrlImages: variant.images.map(img => img.product_url),
      });
      queryClient.invalidateQueries({ queryKey: ['product-variants/productId-with-cost-price'] });
      setLoading(false);
      toast.success('Add image successfully');
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi cập nhật hình ảnh');
      setLoading(false);
    }
  };

  const FormWithOverlay = (
    <div className="relative">
      <VariantImageForm onSubmitAction={handleSubmit} />
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-muted-foreground/40 backdrop-blur-sm">
          <Icons.loaderCircle className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="lg:min-w-3xl">
          <DrawerHeader>
            <DrawerTitle>Update Image</DrawerTitle>
          </DrawerHeader>
          {FormWithOverlay}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md lg:min-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Image</DialogTitle>
        </DialogHeader>
        {FormWithOverlay}
      </DialogContent>
    </Dialog>
  );
}
