import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

export function OauthSigninButton() {
  const handleGoogleLogin = () => {
    const googleAuthUrl = 'http://localhost:3000/api/auth/google';

    // Mở popup mới, có thể tùy chỉnh kích thước/thuộc tính
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      googleAuthUrl,
      'google-oauth',
      `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`,
    );
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={handleGoogleLogin}
    >
      <Icons.google />
      <span className="sr-only">Login with Google</span>
    </Button>
  );
}
