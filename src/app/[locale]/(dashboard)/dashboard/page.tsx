import ProtectedRoute from '@/components/protected-route';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Dashboard Page</div>
    </ProtectedRoute>
  );
}
