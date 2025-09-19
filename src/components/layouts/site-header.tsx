import { siteConfig } from '@/config/site';
import { CartSheet } from '../checkout/cart-sheet';
import { ProductsCombobox } from '../products-combobox';
import { AuthDropdown } from './auth-dropdown';
import { MobileNav } from './mobile-nav/mobile-nav';
import { MainNav } from './nav/main-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ProductsCombobox />
            <CartSheet />
            <AuthDropdown />
          </nav>
        </div>
      </div>
    </header>
  );
}
