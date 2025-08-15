import { siteConfig } from '@/config/site';
import { CartSheet } from '../checkout/cart-sheet';
import { ProductsCombobox } from '../products-combobox';
import { MainNav } from './main-nav';
import { MobileNav } from './mobile-nav';

type SiteHeaderProps = {
  user: string | null;
};

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />
        <MobileNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ProductsCombobox />
            <CartSheet />
            <AuthDropdown user={user} />
          </nav>
        </div>
      </div>
    </header>
  );
}
