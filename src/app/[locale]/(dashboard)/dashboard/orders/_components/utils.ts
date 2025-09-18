export function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? Number.parseFloat(value) : value;
  return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export function formatDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const orderStatusColor: Record<string, string> = {
  PENDING_CONFIRMATION: 'bg-yellow-100 text-yellow-800',
  PENDING_PAYMENT: 'bg-orange-100 text-orange-800',
  PAID: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-teal-100 text-teal-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
  FAILED: 'bg-red-200 text-red-900',
  RETURNED: 'bg-gray-200 text-gray-800',
};

export const paymentMethodColor = {
  MOMO_WALLET: 'bg-pink-100 text-pink-800',
  COD: 'bg-teal-100 text-teal-800',
};
