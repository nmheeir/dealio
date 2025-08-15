import type { Metadata } from 'next';
import ResetPasswordConfirmForm from '@/app/[locale]/(auth)/_components/reset-password-confirm-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shell } from '@/components/shell';

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Enter your email to reset your password',
};

export default function ResetPasswordConfirmPage() {
  return (
    <Shell className="max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            Enter your email address and we will send you a verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordConfirmForm />
        </CardContent>
      </Card>
    </Shell>
  );
}
