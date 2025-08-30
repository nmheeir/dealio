import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SiteFooter } from '@/components/layouts/site-footer';
import { SiteHeader } from '@/components/layouts/site-header';
import { getCachedUser } from '@/libs/queries/user';

type LobbyLayoutProps = {} & React.PropsWithChildren<{
  modal: React.ReactNode;
}>;

export default async function LobbyLayout({ children, modal }: LobbyLayoutProps) {
  const user = await getCachedUser();

  return (
    <NuqsAdapter>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader user={user} />
        <main className="flex-1">
          {children}
          {modal}
        </main>
        <SiteFooter />
      </div>
    </NuqsAdapter>
  );
}
