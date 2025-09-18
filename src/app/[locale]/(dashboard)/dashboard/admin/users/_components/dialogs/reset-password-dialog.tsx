'use client';

import type { User } from '@/api/schemas/user/user.schema';
import { useState } from 'react';
import { toast } from 'sonner'; // hoặc shadcn/ui toaster
import { useAdminSendNewPassword } from '@/api/users/admin/use-admin-send-new-password';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ResetPasswordDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mutateAsync: sendNewPassword } = useAdminSendNewPassword();

  const handleReset = async () => {
    try {
      setLoading(true);
      await sendNewPassword(
        {
          userId: user.id,
        },
        {
          onSuccess: () => {
            toast.success(`Đã cấp lại mật khẩu cho ${user.profile?.fullname ?? user.id}`);
            setOpen(false);
          },
          onError: (err: any) => {
            console.error('Lỗi khi cấp lại mật khẩu:', err);

            const apiMessage
        = err.response?.data?.message
          || err.message
          || 'Có lỗi xảy ra khi cấp lại mật khẩu.';

            toast.error(apiMessage);
          },
        },
      );
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Không thể cấp lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="">
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cấp lại mật khẩu</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn cấp lại mật khẩu cho tài khoản
            {' '}
            <span className="font-semibold">{user.profile?.fullname ?? user.id}</span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleReset} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
