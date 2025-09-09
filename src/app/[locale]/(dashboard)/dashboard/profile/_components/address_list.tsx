'use client';
import type { Address } from '@/api/schemas/profile/adddress.schema';
import { MoreVerticalIcon } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AddAddressDialog } from './add_address_dialog';

export default function AddressList({ data }: { data: Address[] }) {
  const [addresses, setAddress] = React.useState(() => data);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setAddress(data);
  }, [data]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {addresses.map(addr => (
          <Card key={addr.id}>
            <CardContent className="flex items-start justify-between p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{addr.to_name}</span>
                  {addr.is_default && (
                    <Badge variant="secondary">Mặc định</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{addr.to_phone}</p>
                <p className="text-sm">
                  {addr.to_address}
                  ,
                  {addr.to_province_name}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!addr.is_default && (
                    <DropdownMenuItem>Đặt làm mặc định</DropdownMenuItem>
                  )}
                  <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <AddAddressDialog />
      </div>
    </>
  );
}
