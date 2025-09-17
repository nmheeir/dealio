'use client';

import { Separator } from '@radix-ui/react-separator';
import { User } from 'lucide-react';
import { useProfile } from '@/api/profile/use-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar_url ? user.avatar_url : ''} alt={user.fullname} />
          <AvatarFallback>{user.fullname.charAt(0)}</AvatarFallback>
        </Avatar>
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
        <Button>Cập nhật thông tin</Button>
      </CardFooter>
    </Card>
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
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <User className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold text-foreground">Không có thông tin hồ sơ</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Hiện tại không có dữ liệu hồ sơ để hiển thị.
      </p>
    </div>
  );
}
