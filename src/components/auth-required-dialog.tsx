import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type AuthRequiredDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromPath?: string; // path hiện tại để redirect sau login
  title?: string;
  description?: string;
};

export function AuthRequiredDialog({
  open,
  onOpenChange,
  fromPath,
  title = 'Bạn chưa đăng nhập',
  description = 'Bạn cần đăng nhập để thực hiện hành động này. Bạn có muốn chuyển đến trang đăng nhập ngay bây giờ không?',
}: AuthRequiredDialogProps) {
  const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onOpenChange(false);
              const currentPath = fromPath || window.location.pathname + window.location.search;
              router.push(`/signin?from=${encodeURIComponent(currentPath)}`);
            }}
          >
            Đăng nhập
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
