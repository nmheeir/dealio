import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NewCustomerCard from '../../_components/new-customer-card';
import { SignInForm } from '../../_components/signin-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default async function SignInPage() {
  // Server-side auth check
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (token) {
    redirect('/');
  }

  return (
    <>
      <main className="flex min-h-screen items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Left Column - Login Form */}
            <SignInForm />

            {/* Right Column - New Customer */}
            <NewCustomerCard />
          </div>
        </div>
      </main>
    </>
  );
}
