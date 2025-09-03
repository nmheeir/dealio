import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewCustomerCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold">New customer?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">Create an account with us and you'll be able to:</p>

        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-foreground"></span>
            <span className="text-muted-foreground">Check out faster</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-foreground"></span>
            <span className="text-muted-foreground">Save multiple shipping addresses</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-foreground"></span>
            <span className="text-muted-foreground">Access your order history</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-foreground"></span>
            <span className="text-muted-foreground">Track new orders</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-foreground"></span>
            <span className="text-muted-foreground">Save items to your Wishlist</span>
          </li>
        </ul>

        <Button className="mt-8 w-full rounded-full bg-black py-6 text-base font-medium text-white hover:bg-gray-800">
          Create account
        </Button>
      </CardContent>
    </Card>
  );
}
