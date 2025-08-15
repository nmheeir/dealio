import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shell } from '@/components/shell';
import { ResetPasswordForm } from '../../../_components/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Enter your email to reset your password',
};

export default function ResetPasswordPage() {
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
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </Shell>
  );
}
