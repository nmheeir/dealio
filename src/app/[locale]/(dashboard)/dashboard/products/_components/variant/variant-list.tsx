import { Filter, Search, SortAsc, SortDesc, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useGetVariantsByProductId } from '@/api/product-variant/use-variant-by-productId';
import { ErrorCard } from '@/components/error-card';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VariantItem } from './variant-item';
import { VariantItemSkeleton } from './variant-item-skeleton';

type VariantListProps = {
  productId: string;
};

export function VariantList({ productId }: VariantListProps) {
  const { data, isLoading, error } = useGetVariantsByProductId({
    variables: { id: productId },
  });

  // Search và filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Lấy variants trước (dù có thể null)
  const variants = data?.data ?? [];

  // Filtered và sorted variants với useMemo để tối ưu performance
  const filteredVariants = useMemo(() => {
    if (!variants || variants.length === 0) {
      return [];
    }

    let filtered = [...variants];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((variant) => {
        const searchFields = [
          variant.variant_name?.toLowerCase(),
          variant.sku?.toLowerCase(),
          ...(variant.other_attributes
            ? Object.values(variant.other_attributes).map(v =>
                v?.toString().toLowerCase(),
              )
            : []),
        ].filter(Boolean);

        return searchFields.some(field => field?.includes(query));
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(variant => variant.product.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (aValue == null && bValue == null) {
        return 0;
      }
      if (aValue == null) {
        return 1;
      }
      if (bValue == null) {
        return -1;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      }
      if (aValue < bValue) {
        comparison = -1;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [variants, searchQuery, statusFilter, sortBy, sortOrder]);

  // Helper functions
  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all'
    || sortBy !== 'name' || sortOrder !== 'asc';

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Search skeleton */}
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-4 h-10 animate-pulse rounded-lg bg-gray-200"></div>
          <div className="flex justify-between">
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Results skeleton */}
        <div className="mx-auto grid grid-cols-1 gap-x-6 gap-y-8 p-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <VariantItemSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  // Error handling
  if (error || data?.statusCode === 404) {
    toast.error(error?.response?.data.message);
  }

  // No data state
  if (!data) {
    return (
      <ErrorCard
        className="mx-auto p-4"
        icon={Icons.box}
        title="No data"
        description="Not data"
      />
    );
  }

  // No variants case
  if (variants.length === 0) {
    return (
      <ErrorCard
        className="mx-auto p-4"
        icon={Icons.box}
        title="No variants found"
        description="This product doesn't have any variants yet."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Section */}
      <div className="m-4 space-y-4 rounded-lg border p-4">
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm variant theo tên, SKU, mã vạch, hoặc thuộc tính..."
            className="w-full pr-10 pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Toggle và Results Count */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Bộ lọc
              {hasActiveFilters && (
                <Badge variant="destructive" className="px-1 py-0 text-xs">
                  !
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="text-sm text-blue-600 transition-colors hover:text-blue-800"
              >
                Xóa tất cả bộ lọc
              </Button>
            )}
          </div>

          <div className="text-sm text-gray-600">
            Hiển thị
            {' '}
            <span className="font-semibold">{filteredVariants.length}</span>
            {' '}
            trong tổng số
            {' '}
            <span className="font-semibold">{variants.length}</span>
            {' '}
            variants
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-3">
            {/* Status Filter */}
            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Trạng thái:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Sắp xếp theo:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn tiêu chí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Tên</SelectItem>
                  <SelectItem value="sku">SKU</SelectItem>
                  <SelectItem value="price">Giá</SelectItem>
                  <SelectItem value="status">Trạng thái</SelectItem>
                  <SelectItem value="created_at">Ngày tạo</SelectItem>
                  <SelectItem value="updated_at">Ngày cập nhật</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Thứ tự:</Label>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex w-full items-center gap-2 rounded border border-gray-300 p-2 transition-colors outline-none hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                {sortOrder === 'asc'
                  ? (
                      <>
                        <SortAsc className="h-4 w-4" />
                        Tăng dần
                      </>
                    )
                  : (
                      <>
                        <SortDesc className="h-4 w-4" />
                        Giảm dần
                      </>
                    )}
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-2">
                Tìm kiếm: "
                {searchQuery}
                "
                <Button onClick={clearSearch}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="gap-2">
                Trạng thái:
                {' '}
                {statusFilter === 'active'
                  ? 'Hoạt động'
                  : statusFilter === 'inactive'
                    ? 'Không hoạt động'
                    : 'Bản nháp'}
                <Button onClick={() => setStatusFilter('all')}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {(sortBy !== 'name' || sortOrder !== 'asc') && (
              <Badge variant="secondary">
                Sắp xếp:
                {' '}
                {sortBy}
                {' '}
                (
                {sortOrder === 'asc' ? 'tăng dần' : 'giảm dần'}
                )
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="">
        {filteredVariants.length > 0
          ? (
              <div className="mx-auto grid grid-cols-1 gap-x-6 gap-y-8 p-4 sm:grid-cols-2">
                {filteredVariants.map(variant => (
                  <VariantItem key={variant.id} variant={variant} />
                ))}
              </div>
            )
          : (
              <div className="rounded-lg bg-gray-50 py-12 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Không tìm thấy variant nào
                </h3>
                <p className="mb-4 text-gray-500">
                  {searchQuery
                    ? `Không tìm thấy variant nào khớp với "${searchQuery}"`
                    : 'Thử thay đổi bộ lọc để xem thêm kết quả'}
                </p>
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-200"
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}
      </div>
    </div>
  );
}
