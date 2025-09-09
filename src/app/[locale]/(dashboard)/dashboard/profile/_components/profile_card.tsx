'use client';

import { Separator } from '@radix-ui/react-separator';
import { useProfile } from '@/api/profile/use-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ResetPasswordDialog } from './reset-password-dialog';

export default function ProfileCard() {
  const { data, isLoading, error } = useProfile();

  if (isLoading) {
    return <span>Loading</span>;
  }

  if (error || !data) {
    return <span>Not data</span>;
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
