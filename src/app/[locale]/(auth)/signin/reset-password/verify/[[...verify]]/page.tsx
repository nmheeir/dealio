import type { Metadata } from 'next';
import ResetPasswordConfirmForm from '@/app/[locale]/(auth)/_components/reset-password-confirm-form';

export const metadata: Metadata = {
  title: 'Enter your new password',
};

export default function ResetPasswordVerifyPage() {
  return (
    <div className="max-w-lg">
      <ResetPasswordConfirmForm />
    </div>
  );
}
