'use client';

import type { User } from '@/api/auth/type';
import { Separator } from '@radix-ui/react-separator';
import { useQueryClient } from '@tanstack/react-query';
import { UserIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useProfile } from '@/api/profile/use-profile';
import { useProfileCreate } from '@/api/profile/use-profile-create';
import { useProfileUpdate } from '@/api/profile/use-profile-update';

import { useUpdateProfileImage } from '@/api/profile/use-profile-upload-image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

import { ResetPasswordDialog } from './reset-password-dialog';

export default function ProfileCard() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  if (error || !data) {
    return <ProfileNoData />;
  }

  const user = data.data;

  return (
    <Card>
      <CardHeader className="flex w-full flex-col items-center space-y-3">
        <AvatarUploader user={user} />
        <CardTitle>{user.fullname}</CardTitle>
        <CardDescription>
          User ID:
          {user.user_id}
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Ngày tạo</span>
          <Badge variant="secondary">
            {new Date(user.createdAt ? user.createdAt : '').toLocaleDateString('vi-VN')}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Cập nhật gần nhất</span>
          <Badge variant="outline">
            {new Date(user.updatedAt ? user.updatedAt : '').toLocaleDateString('vi-VN')}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <ResetPasswordDialog />
        <UpdateProfileDialog user={user} />
      </CardFooter>
    </Card>
  );
}

function AvatarUploader({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const updateProfileImage = useUpdateProfileImage();
  const queryClient = useQueryClient();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      await updateProfileImage.mutateAsync({ file: selectedFile });
      toast.success('Profile image updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.log(error);
      toast.error('Failed to update profile image.');
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Avatar className="h-24 w-24 cursor-pointer">
          <AvatarImage src={user.avatar_url ? user.avatar_url : ''} alt={user.fullname} />
          <AvatarFallback>{user.fullname.charAt(0)}</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {previewUrl && (
            <div className="relative mx-auto h-48 w-48">
              <Image
                src={previewUrl}
                alt="Preview"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedFile || updateProfileImage.isLoading}
            >
              {updateProfileImage.isLoading ? 'Uploading...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function UpdateProfileDialog({ user }: { user: User }) {
  const { mutateAsync, isPending } = useProfileUpdate();
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);
  const [fullname, setFullname] = React.useState('');

  // khi dialog mở thì set fullname mặc định
  React.useEffect(() => {
    if (open && user?.fullname) {
      setFullname(user.fullname);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync(
        { fullname },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profiles'] });
            toast.success('Cập nhật hồ sơ thành công', {
              description: 'Thông tin hồ sơ đã được lưu.',
            });
          },
        },
      );
      setOpen(false);
    } catch (err: any) {
      toast.error('Cập nhật thất bại', {
        description: err?.response?.data?.message ?? 'Vui lòng thử lại sau.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Cập nhật thông tin</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật hồ sơ</DialogTitle>
          <DialogDescription>
            Nhập họ tên mới của bạn và lưu lại thay đổi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fullname">Họ tên</Label>
            <Input
              id="fullname"
              value={fullname}
              onChange={e => setFullname(e.target.value)}
              placeholder="Nhập họ tên"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProfileCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex w-full flex-col items-center space-y-3">
        <Avatar className="h-24 w-24">
          <Skeleton className="h-24 w-24 rounded-full" />
        </Avatar>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription className="flex items-center space-x-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            <Skeleton className="h-4 w-16" />
          </span>
          <Badge variant="secondary">
            <Skeleton className="h-6 w-24" />
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            <Skeleton className="h-4 w-28" />
          </span>
          <Badge variant="outline">
            <Skeleton className="h-6 w-24" />
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-28" />
      </CardFooter>
    </Card>
  );
}

function ProfileNoData() {
  const [fullname, setFullname] = useState('');
  const { mutateAsync, isPending } = useProfileCreate();

  async function handleCreateProfile() {
    try {
      await mutateAsync({ fullname });
      toast.success('Tạo hồ sơ mới thành công');
      setFullname('');
    } catch (err: any) {
      toast.error('Không thể tạo hồ sơ mới', {
        description: err?.response?.data?.message ?? 'Vui lòng thử lại sau',
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
      <UserIcon className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold text-foreground">
        Không có thông tin hồ sơ
      </h3>
      <p className="text-sm text-muted-foreground">
        Hiện tại không có dữ liệu hồ sơ để hiển thị.
      </p>

      {/* Input fullname */}
      <div className="w-full max-w-sm space-y-2">
        <Input
          placeholder="Nhập họ tên của bạn"
          value={fullname}
          onChange={e => setFullname(e.target.value)}
        />
        <Button
          className="w-full"
          onClick={handleCreateProfile}
          disabled={isPending || !fullname.trim()}
        >
          {isPending ? 'Đang tạo...' : 'Tạo hồ sơ mới'}
        </Button>
      </div>
    </div>
  );
}
