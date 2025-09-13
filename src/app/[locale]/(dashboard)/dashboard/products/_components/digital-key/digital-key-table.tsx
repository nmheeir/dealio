import { useGetAllDigitalKey } from '@/api/digital-key/use-all-digital-key';
import { DataTable } from '@/components/dashboard/data-table/data-table';
import { digitalKeyColumns } from './digital-key-columns';

export function DigitalKeyTable({ variantId }: { variantId: string }) {
  const { data, isLoading, error } = useGetAllDigitalKey({ variables: { variantId } });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return (
      <span>
        Error
        {error.message}
      </span>
    );
  }

  if (!data) {
    return <span>Not data...</span>;
  }

  const digitalKeys = data.data.data;

  return (
    <div className="">
      <DataTable
        data={digitalKeys}
        columns={digitalKeyColumns}
      />
    </div>
  );
}
