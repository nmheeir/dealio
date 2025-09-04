import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignUpForm from '../../_components/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign up to your account',
};

export default async function SignupPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (token) {
    redirect('/');
  }

  return (
    <SignUpForm />
  );
}
